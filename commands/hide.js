const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hide')
        .setDescription('Hide the current channel from everyone')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async executeInteraction(interaction) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
                ViewChannel: false
            });
            await interaction.reply('<a:yesss:1471486674990010513> This channel is now hidden.');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot hide this channel! Please check my permissions.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.id, {
                ViewChannel: false
            });
            await message.reply('<a:yesss:1471486674990010513> This channel is now hidden.');
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot hide this channel! Please check my permissions.');
        }
    }
};
