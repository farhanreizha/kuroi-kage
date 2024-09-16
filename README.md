# Kuroi Kage

Kuroi Kage is a Discord bot developed using TypeScript, Discord.js, and Bun. It provides various customizable features for managing and enhancing Discord server interactions.

<!-- , such as setting up welcome messages, role management, and music streaming from platforms like YouTube. -->

## Features

- **Customizable Welcome Messages**: Configure personalized welcome messages for new members joining the server.
- **Role Management**: Easy handling of user roles with interaction-based commands.
- **Command and Event Handling**: Built with a modular approach for defining commands and events using a custom event context handler.
- **Database Integration**: Persistent data storage using Prisma and SQLite to manage bot settings and configurations.
<!-- - **Music Playback**: Stream music from YouTube or other platforms directly in your Discord server. -->

## Technologies Used

- **TypeScript**: Strongly typed language for better maintainability.
- **Discord.js**: A powerful library for interacting with the Discord API.
- **Bun**: A fast, modern JavaScript runtime used for package management and development.
- **Prisma**: ORM for managing database interactions.
- **SQLite**: A lightweight, serverless database for storing configuration data.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/farhanreizha/kuroi-kage.git
   ```
2. Install dependencies using Bun:
   ```bash
   bun install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory with your Discord bot token and other necessary configurations.

4. migrate the database:

   ```bash
    bun migrate
   ```

5. Run the bot:
   ```bash
   bun dev
   ```

## Commands

- `/setupwelcome [channel] [message] [role]`: Sets the welcome message for new members spesifically in the channel and optional for give the role to the user who join the server this for moderator or admin only.
- `/help`: Displays a list of available commands.
- `/ping`: Checks the bot's latency.
- `/afk`: Sets the user as AFK.
  <!-- - `/play [song name]`: Plays music in the voice channel. -->
  <!-- - `/roles [add/remove]`: Manages user roles. -->

## Contributing

Feel free to open issues and submit pull requests. Contributions are always welcome!

<!-- ## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information. -->
