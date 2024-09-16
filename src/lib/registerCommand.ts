import type { CustomClient } from "@/util/type"

export default async function registerCommands(
  commands: any[],
  client: CustomClient,
  commandsTable: string[][]
): Promise<void> {
  for (const command of commands) {
    client.commands.set(command.data.name, command)
    commandsTable.push([command.data.name, "✅"])
  }
}
