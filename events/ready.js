const { Events, REST, Routes } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        const rest = new REST({ version: '10' }).setToken(config.token);

        try {
            console.log(`Started refreshing ${client.slashCommandData.length} application (/) commands.`);

            // Deploy commands globally or to a specific guild if guildId is provided
            if (config.clientId) {
                if (config.guildId && config.guildId !== "YOUR_GUILD_ID_HERE") {
                    await rest.put(
                        Routes.applicationGuildCommands(config.clientId, config.guildId),
                        { body: client.slashCommandData },
                    );
                    console.log('Successfully reloaded local guild (/) commands.');
                } else {
                    await rest.put(
                        Routes.applicationCommands(config.clientId),
                        { body: client.slashCommandData },
                    );
                    console.log('Successfully reloaded global (/) commands.');
                }
            } else {
                console.log('[WARNING] clientId is missing in config.json. Slash commands were not deployed.');
            }
        } catch (error) {
            console.error('Error deploying slash commands', error);
        }
    },
};
