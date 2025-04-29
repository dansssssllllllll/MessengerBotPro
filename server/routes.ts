import express, { type Express, Request, Response } from "express";
import session from "express-session";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  loginUserSchema, 
  insertMessageSchema 
} from "@shared/schema";
import { commands, getCommand } from "./commands";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  const SessionStore = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || "messenger-bot-secret",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  const authenticateUser = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // User authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginUserSchema.parse(req.body);
      
      const user = await storage.validateUserPassword(
        loginData.username,
        loginData.password
      );
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authenticateUser, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Message routes
  app.get("/api/messages", authenticateUser, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const messages = await storage.getMessagesByUserId(userId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/messages", authenticateUser, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        userId,
        isBot: false
      });
      
      const message = await storage.createMessage(messageData);
      
      // Process commands
      if (message.content.startsWith('/')) {
        // Extract command name (remove slash and get first word)
        const commandName = message.content.substring(1).split(' ')[0];
        const command = getCommand(commandName);
        
        if (command) {
          try {
            const response = await command.handler(userId);
            
            // Create bot response message
            const botMessage = await storage.createMessage({
              userId,
              content: JSON.stringify(response),
              isBot: true
            });
            
            return res.json({
              userMessage: message,
              botMessage
            });
          } catch (error) {
            console.error(`Command ${commandName} error:`, error);
            
            // Create error bot response
            const botMessage = await storage.createMessage({
              userId,
              content: JSON.stringify({ content: `Error executing command: ${commandName}` }),
              isBot: true
            });
            
            return res.json({
              userMessage: message,
              botMessage
            });
          }
        } else {
          // Unknown command
          const botMessage = await storage.createMessage({
            userId,
            content: JSON.stringify({ content: "Command not recognized. Type /help for available commands." }),
            isBot: true
          });
          
          return res.json({
            userMessage: message,
            botMessage
          });
        }
      }
      
      // Regular message (not a command)
      res.json({ userMessage: message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Create message error:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.get("/api/commands", authenticateUser, async (req, res) => {
    try {
      const commandsList = Object.values(commands).map(cmd => ({
        name: cmd.name,
        description: cmd.description
      }));
      
      res.json(commandsList);
    } catch (error) {
      console.error("Get commands error:", error);
      res.status(500).json({ message: "Failed to get commands" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
