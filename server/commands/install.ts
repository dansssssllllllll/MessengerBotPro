import { Command } from "../../shared/schema";
import fs from "fs";
import path from "path";
import { storage } from "../storage";

export const installCommand: Command = {
  name: "install",
  description: "Install a command using a command code",
  operatorOnly: true, // Only operators can use this command
  handler: async (userId: number) => {
    // This command would typically fetch the latest messages to find a command code
    const messages = await storage.getMessagesByUserId(userId, 10);
    
    // Find the most recent message that might contain a command code
    // Assuming format like /install <code>
    const lastMessage = messages
      .reverse()
      .find(msg => !msg.isBot && msg.content.startsWith("/install"));
    
    if (!lastMessage) {
      return {
        title: "Installation Error",
        content: "Please provide a command code in the format: `/install <command-code>`"
      };
    }
    
    // Extract the command code (everything after /install )
    const parts = lastMessage.content.split(" ");
    if (parts.length < 2) {
      return {
        title: "Installation Error",
        content: "Please provide a command code in the format: `/install <command-code>`"
      };
    }
    
    const commandCode = parts.slice(1).join(" ").trim();
    
    // For security reasons, we should validate the command code format
    // In a real system, this would validate against a database of known commands
    // Here we'll simulate by checking if the code has a valid format
    if (!isValidCommandCode(commandCode)) {
      return {
        title: "Installation Error",
        content: "Invalid command code format. Please check the code and try again."
      };
    }
    
    // Here you would actually install the command
    // For this demo, we'll return a success message
    return {
      title: "Command Installed",
      content: `The command has been successfully installed! Use /help to see available commands.`
    };
  },
};

// Helper function to validate command codes
// In a real system, this would verify against a database or API
function isValidCommandCode(code: string): boolean {
  // Simple validation for demonstration purposes
  // A real system would have more sophisticated validation
  return /^[A-Za-z0-9-]{8,}$/.test(code);
}
