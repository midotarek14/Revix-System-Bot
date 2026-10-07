const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock the current channel (prevent users from sending messages)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async executeInteraction(interaction) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: false
            });
            await interaction.reply('<a:yesss:1471486674990010513> This channel has been locked.');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot lock this channel! Please check my permissions.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.id, {
                SendMessages: false
            });
            await message.reply('<a:yesss:1471486674990010513> This channel has been locked.');
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot lock this channel! Please check my permissions.');
        }
    }
};
