import { Command } from "@shared/schema";
import { storage } from "../storage";

export const profileCommand: Command = {
  name: "profile",
  description: "View your profile",
  handler: async (userId) => {
    const user = await storage.getUser(userId);
    
    if (!user) {
      return {
        content: "User profile not found."
      };
    }
    
    return {
      title: "User Profile:",
      content: `
        Name: ${user.fullname}
        Email: ${user.email}
        Username: ${user.username}
        Account Status: Active
      `
    };
  }
};
