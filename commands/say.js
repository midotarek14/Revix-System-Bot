const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to say')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async executeInteraction(interaction) {
        const msg = interaction.options.getString('message');
        try {
            await interaction.channel.send(msg);
            await interaction.reply({ content: 'Message sent!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'I cannot send the message here.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply("You don't have permission to use this command.");
        }

        const msg = args.join(' ');
        if (!msg) {
            return message.reply('Please provide a message to send.');
        }

        try {
            message.delete().catch(() => {}); // Optional: delete the command message
            await message.channel.send(msg);
        } catch (error) {
            console.error(error);
            await message.reply('I cannot send the message here.');
        }
    }
};
