import { Command } from "@shared/schema";

export const timeCommand: Command = {
  name: "time",
  description: "Show current time",
  handler: async (userId) => {
    const now = new Date();
    return {
      content: `Current time: ${now.toLocaleTimeString()}`
    };
  }
};
