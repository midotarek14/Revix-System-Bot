const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot) return;

        // Split by spaces to get command name and arguments
        const args = message.content.trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Get command from collection
        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            if (command.executeMessage) {
                await command.executeMessage(message, args, client);
            }
        } catch (error) {
            console.error(`Error executing text command ${commandName}`);
            console.error(error);
            message.reply('There was an error trying to execute that command!').catch(() => {});
        }
    },
};
