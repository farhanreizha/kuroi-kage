import type { EventContext } from "../util/type"

export default function createEventContext(...args: any[]): EventContext {
  return {
    message: args[0],
    interaction: args[0],
    member: args[0],
  }
}
