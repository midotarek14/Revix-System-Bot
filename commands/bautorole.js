const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bautorole')
        .setDescription('Set the auto-role for new bot members')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to assign automatically to bots')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async executeInteraction(interaction) {
        const role = interaction.options.getRole('role');
        const bautoroles = db.get('bautoroles') || {};
        bautoroles[interaction.guild.id] = role.id;
        db.set('bautoroles', bautoroles);

        await interaction.reply({ content: `<a:yesss:1471486674990010513> Auto-role for bots has been set to ${role}.` });
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.reply('<a:nooo:1471487750753485036> Please mention a role.');

        const bautoroles = db.get('bautoroles') || {};
        bautoroles[message.guild.id] = role.id;
        db.set('bautoroles', bautoroles);

        await message.reply(`<a:yesss:1471486674990010513> Auto-role for bots has been set to ${role}.`);
    }
};
