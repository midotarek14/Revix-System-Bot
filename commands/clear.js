const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a specific amount of messages in the channel')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async executeInteraction(interaction) {
        const amount = interaction.options.getInteger('amount');

        try {
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);
            const reply = await interaction.reply({ content: `<a:yesss:1471486674990010513> ${deletedMessages.size} messages were successfully deleted!`, fetchReply: true });
            setTimeout(() => reply.delete().catch(() => { }), 5000);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot clear these messages! (They may be older than 14 days).', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('<a:nooo:1471487750753485036> Please enter a valid number between 1 and 100.');
        }

        try {
            await message.delete().catch(() => { });
            const deletedMessages = await message.channel.bulkDelete(amount, true);
            const reply = await message.channel.send(`<a:yesss:1471486674990010513> ${deletedMessages.size} messages were successfully deleted!`);
            setTimeout(() => reply.delete().catch(() => { }), 5000);
        } catch (error) {
            console.error(error);
            const reply = await message.channel.send('<a:nooo:1471487750753485036> I cannot clear these messages! (They may be older than 14 days).');
            setTimeout(() => reply.delete().catch(() => { }), 5000);
        }
    }
};
