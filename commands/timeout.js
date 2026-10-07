const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const parseTime = require('../utils/timeParser');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user for a specific duration')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('Duration (e.g., 10m, 1h, 1d)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the timeout'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async executeInteraction(interaction) {
        const target = interaction.options.getMember('target');
        const durationStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.reply({ content: '<a:nooo:1471487750753485036> Target user not found.', ephemeral: true });

        const durationMs = parseTime(durationStr);
        if (!durationMs) return interaction.reply({ content: '<a:nooo:1471487750753485036> Invalid duration format. Use s, m, h, or d (e.g., 10m).', ephemeral: true });

        try {
            await target.timeout(durationMs, reason);
            await interaction.reply({ content: `<a:yesss:1471486674990010513> Timed out ${target} for ${durationStr}. Reason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot timeout this user!', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const targetUser = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!targetUser) return message.reply('<a:nooo:1471487750753485036> Please mention a user.');

        const target = message.guild.members.cache.get(targetUser.id);
        if (!target) return message.reply('<a:nooo:1471487750753485036> Target user not found.');

        const durationStr = args[1];
        if (!durationStr) return message.reply('<a:nooo:1471487750753485036> Please provide a duration (e.g., 10m).');

        const durationMs = parseTime(durationStr);
        if (!durationMs) return message.reply('<a:nooo:1471487750753485036> Invalid duration format. Use s, m, h, or d (e.g., 10m).');

        const reason = args.slice(2).join(' ') || 'No reason provided';

        try {
            await target.timeout(durationMs, reason);
            await message.reply(`<a:yesss:1471486674990010513> Timed out ${target} for ${durationStr}. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot timeout this user!');
        }
    }
};
