import { Command } from "@shared/schema";

export const helpCommand: Command = {
  name: "help",
  description: "Display available commands",
  handler: async (userId) => {
    return {
      title: "Available Commands:",
      content: `
        • /help - Display this help message
        • /weather - Get current weather
        • /news - Get latest news
        • /time - Show current time
        • /profile - View your profile information
      `
    };
  }
};
