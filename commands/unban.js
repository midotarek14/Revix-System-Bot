const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addStringOption(option =>
            option.setName('target_id')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async executeInteraction(interaction) {
        const targetId = interaction.options.getString('target_id');

        try {
            await interaction.guild.members.unban(targetId);
            await interaction.reply(`<a:yesss:1471486674990010513> Successfully unbanned user with ID: ${targetId}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot unban this user! Maybe they are not banned or the ID is invalid.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const targetId = args[0];
        if (!targetId) {
            return message.reply('<a:nooo:1471487750753485036> Please provide the ID of the user to unban.');
        }

        try {
            await message.guild.members.unban(targetId);
            await message.reply(`<a:yesss:1471486674990010513> Successfully unbanned user with ID: ${targetId}`);
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot unban this user! Maybe they are not banned or the ID is invalid.');
        }
    }
};
