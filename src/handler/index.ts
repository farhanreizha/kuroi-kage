import type { CustomClient } from "@/util/type"
import handleCommands from "./handleCommands"
import handleEvents from "./handleEvents"

export default class Handlers {
  private client: CustomClient

  constructor(client: CustomClient) {
    this.client = client
  }

  public async init(): Promise<void> {
    handleEvents(this.client)
    await handleCommands(this.client)
  }
}
