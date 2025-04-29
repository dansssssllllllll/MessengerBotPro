import { Command } from "@shared/schema";
import { helpCommand } from "./help";
import { weatherCommand } from "./weather";
import { newsCommand } from "./news";
import { timeCommand } from "./time";
import { profileCommand } from "./profile";
import { installCommand } from "./install";
import { adcCommand } from "./adc";

export const commands: Record<string, Command> = {
  help: helpCommand,
  weather: weatherCommand,
  news: newsCommand,
  time: timeCommand,
  profile: profileCommand,
  install: installCommand,
  adc: adcCommand,
};

export function getCommand(commandName: string): Command | undefined {
  return commands[commandName];
}

export function getAllCommands(): Command[] {
  return Object.values(commands);
}
