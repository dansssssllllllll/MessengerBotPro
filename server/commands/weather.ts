import { Command } from "@shared/schema";

export const weatherCommand: Command = {
  name: "weather",
  description: "Get current weather",
  handler: async (userId) => {
    // In a real application, this would call a weather API
    return {
      content: "Current weather: 72°F, Sunny"
    };
  }
};
