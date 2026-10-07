const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove timeout from a user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to untimeout')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for removing the timeout'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async executeInteraction(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.reply({ content: '<a:nooo:1471487750753485036> Target user not found.', ephemeral: true });

        try {
            await target.timeout(null, reason);
            await interaction.reply({ content: `<a:yesss:1471486674990010513> Removed timeout from ${target}. Reason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot remove timeout from this user!', ephemeral: true });
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

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await target.timeout(null, reason);
            await message.reply(`<a:yesss:1471486674990010513> Removed timeout from ${target}. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot remove timeout from this user!');
        }
    }
};
