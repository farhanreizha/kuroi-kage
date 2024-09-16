import {
  AutocompleteInteraction,
  Client,
  Collection,
  CommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder,
  type Interaction,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

// Configuration interface
export interface Config {
  roles: {
    verificationId: string;
  };
  // Add other configuration properties as needed
}

// Custom client extending the base Client class
export interface CustomClient extends Client {
  commands: Collection<string, CustomCommand>;
  config: Config;
}

// Custom command interaction interface
export interface CustomCommand extends CommandInteraction {
  folder: string;
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: CommandInteraction, client: CustomClient) => void | Promise<void>;
  autocomplete?: (interaction: CommandInteraction, client: CustomClient) => void | Promise<void>;
}

// Command interface with slash command data
export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: CommandInteraction, client: CustomClient) => void | Promise<void>;
  autocomplete?: (interaction: CommandInteraction, client: CustomClient) => void | Promise<void>;
}

// Context for event handling
export interface EventContext {
  message?: Message;
  interaction?: CommandInteraction | AutocompleteInteraction | Interaction;
  member?: GuildMember;
  // Add more properties as needed
}

// Event interface
export interface Event {
  name: string;
  once?: boolean;
  rest?: boolean;
  execute: (client: CustomClient, context: EventContext) => void | Promise<void>;
}
