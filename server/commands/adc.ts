import { Command } from "../../shared/schema";
import * as fs from "fs";
import * as path from "path";

export const adcCommand: Command = {
  name: "adc",
  description: "Show available command codes and command examples",
  operatorOnly: true, // Only operators can use this command
  handler: async (userId: number) => {
    // Get all command files in the commands directory
    const commandsDir = path.join(__dirname);
    
    try {
      // Read command files
      const files = fs.readdirSync(commandsDir)
        .filter(file => file.endsWith('.ts') && file !== 'index.ts');
      
      // Generate content showing command codes
      let content = "### Available Command Codes\n\n";
      content += "| Command | Code | Example Usage |\n";
      content += "|---------|------|---------------|\n";
      
      files.forEach(file => {
        const commandName = file.replace('.ts', '');
        // Generate a mock command code for demo purposes
        const commandCode = generateMockCode(commandName);
        const exampleUsage = `/install ${commandCode}`;
        
        content += `| ${commandName} | ${commandCode} | ${exampleUsage} |\n`;
      });
      
      content += "\n### How to install commands\n";
      content += "Use `/install <command-code>` to install a new command.\n";
      content += "\n### How to use commands\n";
      content += "After installation, use `/<command-name>` to execute the command.";
      
      return {
        title: "Available Command Codes",
        content: content
      };
      
    } catch (error) {
      console.error('Error reading command files:', error);
      return {
        title: "Error",
        content: "Unable to retrieve command codes at this time."
      };
    }
  },
};

// Helper function to generate a mock code based on command name
function generateMockCode(commandName: string): string {
  // Create a deterministic but realistic looking code based on the command name
  const base = commandName.padEnd(4, 'x').substring(0, 4);
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${base}-${randomPart}`;
}
