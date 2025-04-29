import { Command } from "@shared/schema";
import { getAllCommands } from "./index";
import { storage } from "../storage";

export const helpCommand: Command = {
  name: "help",
  description: "Display available commands",
  handler: async (userId) => {
    // Get the user to check if they're an operator
    const user = await storage.getUser(userId);
    const isOperator = user?.username === 'Danieldev12';
    
    // Get all available commands
    const allCommands = getAllCommands();
    
    // Filter commands based on user role
    const availableCommands = allCommands.filter(cmd => 
      !cmd.operatorOnly || (cmd.operatorOnly && isOperator)
    );

    // Format the command list
    const commandList = availableCommands
      .map(cmd => {
        const operatorBadge = cmd.operatorOnly ? " [OPERATOR ONLY]" : "";
        return `• /${cmd.name} - ${cmd.description}${operatorBadge}`;
      })
      .join('\n');

    return {
      title: "Available Commands:",
      content: commandList
    };
  }
};

