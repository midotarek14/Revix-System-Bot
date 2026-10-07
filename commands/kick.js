const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async executeInteraction(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        try {
            await member.kick(reason);
            await interaction.reply(`<a:yesss:1471486674990010513> ${target.tag} has been kicked. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot kick this user!', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const target = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!target) {
            return message.reply('<a:nooo:1471487750753485036> Please mention a user to kick.');
        }

        const member = message.guild.members.cache.get(target.id);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await member.kick(reason);
            await message.reply(`<a:yesss:1471486674990010513> ${target.tag} has been kicked. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot kick this user!');
        }
    }
};
