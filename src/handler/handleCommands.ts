import { readdirSync } from "fs";
import path from "path";
import type { CustomClient } from "@/util/type";
import registerCommands from "@/lib/registerCommand";
import uploadCommands from "@/lib/uploadCommands";
import { getBorderCharacters, table } from "table";
import logger from "@/util/logger";

const commandsTable: string[][] = [["Commands", "Status"]];
const tableConfig: any = {
  border: getBorderCharacters("ramac"),
};

export default async function handleCommands(client: CustomClient): Promise<void> {
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFile = readdirSync(commandsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((folder) =>
      readdirSync(path.join(commandsPath, folder.name))
        .filter((file) => file.endsWith(".ts"))
        .map((file) => path.join(commandsPath, folder.name, file))
    );
  const commands = commandFile.map((filePath) => {
    const command = require(filePath).command;
    return {
      ...command,
    };
  });

  const slashCommands = commands.map((command) => command.data.toJSON());

  await registerCommands(commands, client, commandsTable);
  await uploadCommands(slashCommands, commandsTable);

  logger.info(`\n${table(commandsTable, tableConfig)}`);
}
