import { registerEvent } from "@/lib/registerEvent"
import logger from "@/util/logger"
import type { CustomClient, Event } from "@/util/type"
import { readdirSync } from "fs"
import { join } from "path"
import { getBorderCharacters, table } from "table"

const eventsTable: string[][] = [["Events", "Status"]]
const tableConfig: any = {
  border: getBorderCharacters("ramac"),
}

export default function handleEvents(client: CustomClient): void {
  const eventsPath = join(__dirname, "..", "events")
  const eventFolders = readdirSync(eventsPath)

  eventFolders.forEach(folder => {
    const folderPath = join(eventsPath, folder)
    const eventFiles = readdirSync(folderPath).filter(file => file.endsWith(".ts"))

    eventFiles.forEach(file => {
      try {
        const event: Event = require(join(folderPath, file)).event
        registerEvent(client, event, file, eventsTable)
      } catch (error) {
        logger.error(`Failed to load event from file ${file}:`, error)
        eventsTable.push([file, "❌"])
      }
    })
  })

  logger.info(`\n${table(eventsTable, tableConfig)}`)
}
