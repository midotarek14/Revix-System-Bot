const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole')
        .setDescription('Set the auto-role for new human members')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to assign automatically')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async executeInteraction(interaction) {
        const role = interaction.options.getRole('role');
        const autoroles = db.get('autoroles') || {};
        autoroles[interaction.guild.id] = role.id;
        db.set('autoroles', autoroles);

        await interaction.reply({ content: `<a:yesss:1471486674990010513> Auto-role for members has been set to ${role}.` });
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.reply('<a:nooo:1471487750753485036> Please mention a role.');

        const autoroles = db.get('autoroles') || {};
        autoroles[message.guild.id] = role.id;
        db.set('autoroles', autoroles);

        await message.reply(`<a:yesss:1471486674990010513> Auto-role for members has been set to ${role}.`);
    }
};
