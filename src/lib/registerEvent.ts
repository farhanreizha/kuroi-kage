import createEventContext from "@/lib/createEventContext"
import type { CustomClient, Event } from "@/util/type"

export function registerEvent(client: CustomClient, event: Event, fileName: string, eventsTable: string[][]): void {
  const executeEvent = (...args: any[]) => {
    const context = createEventContext(...args)
    event.execute(client, context)
  }

  if (event.rest) {
    event.once ? client.once(event.name, executeEvent) : client.on(event.name, executeEvent)
  } else {
    event.once ? client.once(event.name, executeEvent) : client.on(event.name, executeEvent)
  }

  eventsTable.push([fileName, "✅"])
}
