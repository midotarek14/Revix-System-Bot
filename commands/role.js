const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Give or remove a role from a user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to manage')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to give or remove')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async executeInteraction(interaction) {
        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        if (!target) return interaction.reply({ content: '<a:nooo:1471487750753485036> Target user not found in the server.', ephemeral: true });

        try {
            if (target.roles.cache.has(role.id)) {
                await target.roles.remove(role);
                await interaction.reply({ content: `<a:yesss:1471486674990010513> Removed ${role} from ${target}.` });
            } else {
                await target.roles.add(role);
                await interaction.reply({ content: `<a:yesss:1471486674990010513> Added ${role} to ${target}.` });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> I cannot manage that role! Please check my permissions and role hierarchy.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const targetUser = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!targetUser) return message.reply('<a:nooo:1471487750753485036> Please mention a user.');

        const target = message.guild.members.cache.get(targetUser.id);
        if (!target) return message.reply('<a:nooo:1471487750753485036> Target user not found in the server.');

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!role) return message.reply('<a:nooo:1471487750753485036> Please mention a role.');

        try {
            if (target.roles.cache.has(role.id)) {
                await target.roles.remove(role);
                await message.reply(`<a:yesss:1471486674990010513> Removed ${role} from ${target}.`);
            } else {
                await target.roles.add(role);
                await message.reply(`<a:yesss:1471486674990010513> Added ${role} to ${target}.`);
            }
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> I cannot manage that role! Please check my permissions and role hierarchy.');
        }
    }
};
