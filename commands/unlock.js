const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock the current channel (allow users to send messages)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async executeInteraction(interaction) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: null
            });
            await interaction.reply('<a:yesss:1471486674990010513> This channel has been unlocked.');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot unlock this channel! Please check my permissions.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.id, {
                SendMessages: null
            });
            await message.reply('<a:yesss:1471486674990010513> This channel has been unlocked.');
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot unlock this channel! Please check my permissions.');
        }
    }
};
