const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('senddm')
        .setDescription('Send a direct message to a user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to DM')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async executeInteraction(interaction) {
        const target = interaction.options.getUser('target');
        const messageStr = interaction.options.getString('message');

        try {
            await target.send(messageStr);
            await interaction.reply({ content: `<a:yesss:1471486674990010513> Message sent to ${target} in DM successfully!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot send a DM to this user. Their DMs might be closed.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const targetUser = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!targetUser) return message.reply('<a:nooo:1471487750753485036> Please mention a user to DM.');

        const messageStr = args.slice(1).join(' ');
        if (!messageStr) return message.reply('<a:nooo:1471487750753485036> Please provide a message to send.');

        try {
            await targetUser.send(messageStr);
            message.delete().catch(() => {});
            const reply = await message.channel.send(`<a:yesss:1471486674990010513> Message sent to ${targetUser} in DM successfully!`);
            setTimeout(() => reply.delete().catch(() => {}), 5000);
        } catch (error) {
            console.error(error);
            const reply = await message.channel.send('<a:nooo:1471487750753485036> I cannot send a DM to this user. Their DMs might be closed.');
            setTimeout(() => reply.delete().catch(() => {}), 5000);
        }
    }
};
