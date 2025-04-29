import { 
  users, 
  messages, 
  type User, 
  type InsertUser, 
  type Message, 
  type InsertMessage 
} from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUserPassword(username: string, password: string): Promise<User | null>;
  
  // Message methods
  getMessagesByUserId(userId: number, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private userIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.userIdCounter = 1;
    this.messageIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      password: hashedPassword 
    };
    this.users.set(id, user);
    return user;
  }

  async validateUserPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    
    return user;
  }

  async getMessagesByUserId(userId: number, limit = 50): Promise<Message[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return 0;
      });
    
    return limit ? userMessages.slice(-limit) : userMessages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
