import type { Event } from "@/util/type";
import { Events } from "discord.js";

export const event: Event = {
  name: Events.InteractionCreate,
  execute: async (_, c) => {},
};
