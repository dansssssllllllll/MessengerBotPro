import { Command } from "@shared/schema";

export const newsCommand: Command = {
  name: "news",
  description: "Get latest news",
  handler: async (userId) => {
    // In a real application, this would call a news API
    return {
      title: "Today's Headlines:",
      content: `
        • New Technology Breakthrough Announced
        • Global Markets See Record Gains
        • Scientists Make Major Discovery
      `
    };
  }
};
