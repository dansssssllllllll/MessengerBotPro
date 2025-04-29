type CommandResponse = {
  title?: string;
  content: string;
};

export type Message = {
  id: number;
  userId: number;
  content: string;
  isBot: boolean;
  createdAt: Date;
};

// Helper to parse bot messages that are stored as JSON strings
export function parseBotMessage(message: Message): { title?: string; content: string } {
  if (message.isBot) {
    try {
      return JSON.parse(message.content);
    } catch (e) {
      console.error("Failed to parse bot message:", e);
      return { content: message.content };
    }
  }
  return { content: message.content };
}

// Helper to format a command response for display
export function formatCommandResponse(response: CommandResponse): string {
  if (response.title) {
    return `${response.title}\n${response.content}`;
  }
  return response.content;
}

// Get the command name from a message (e.g. "/help" -> "help")
export function getCommandName(message: string): string | null {
  if (message.startsWith('/')) {
    return message.substring(1).split(' ')[0];
  }
  return null;
}

// List of available commands for autocomplete
export const availableCommands = [
  { name: "help", description: "Display available commands" },
  { name: "weather", description: "Get current weather" },
  { name: "news", description: "Get latest news" },
  { name: "time", description: "Show current time" },
  { name: "profile", description: "View your profile" }
];
