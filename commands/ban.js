const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async executeInteraction(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        try {
            await interaction.guild.members.ban(target, { reason });
            await interaction.reply(`<a:yesss:1471486674990010513> ${target.tag} has been banned. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot ban this user!', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const target = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!target) {
            return message.reply('<a:nooo:1471487750753485036> Please mention a user to ban.');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await message.guild.members.ban(target, { reason });
            await message.reply(`<a:yesss:1471486674990010513> ${target.tag} has been banned. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot ban this user!');
        }
    }
};
