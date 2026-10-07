const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gend')
        .setDescription('End a giveaway immediately')
        .addStringOption(option => 
            option.setName('message_id')
                .setDescription('The ID of the giveaway message')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

    async executeInteraction(interaction, client) {
        const messageId = interaction.options.getString('message_id');
        const giveaways = db.get('giveaways') || [];
        const gwIndex = giveaways.findIndex(g => g.messageId === messageId && !g.ended);

        if (gwIndex === -1) return interaction.reply({ content: '<a:nooo:1471487750753485036> Active giveaway not found with that message ID.', ephemeral: true });

        const gw = giveaways[gwIndex];
        gw.ended = true;
        db.updateGiveaways(giveaways);

        await interaction.reply({ content: '<a:yesss:1471486674990010513> Giveaway ended immediately.', ephemeral: true });

        if (client.giveawayManager) {
            await client.giveawayManager.endGiveaway(gw);
        }
    },

    async executeMessage(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const messageId = args[0];
        if (!messageId) return message.reply('<a:nooo:1471487750753485036> Please provide the message ID of the giveaway.');

        const giveaways = db.get('giveaways') || [];
        const gwIndex = giveaways.findIndex(g => g.messageId === messageId && !g.ended);

        if (gwIndex === -1) return message.reply('<a:nooo:1471487750753485036> Active giveaway not found with that message ID.');

        const gw = giveaways[gwIndex];
        gw.ended = true;
        db.updateGiveaways(giveaways);

        await message.reply('<a:yesss:1471486674990010513> Giveaway ended immediately.');

        if (client.giveawayManager) {
            await client.giveawayManager.endGiveaway(gw);
        }
    }
};
