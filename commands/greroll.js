const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greroll')
        .setDescription('Reroll a winner for an ended giveaway')
        .addStringOption(option => 
            option.setName('message_id')
                .setDescription('The ID of the giveaway message')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

    async executeInteraction(interaction, client) {
        const messageId = interaction.options.getString('message_id');
        await this.handleReroll(interaction, messageId, client);
    },

    async executeMessage(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const messageId = args[0];
        if (!messageId) return message.reply('<a:nooo:1471487750753485036> Please provide the message ID of the giveaway.');

        await this.handleReroll({ channel: message.channel, reply: (opt) => message.reply(opt) }, messageId, client);
    },

    async handleReroll(context, messageId, client) {
        const giveaways = db.get('giveaways') || [];
        const gw = giveaways.find(g => g.messageId === messageId && g.ended);

        if (!gw) return context.reply({ content: '<a:nooo:1471487750753485036> Ended giveaway not found with that message ID.', ephemeral: true });

        if (!client.giveawayManager) return context.reply({ content: '<a:nooo:1471487750753485036> Giveaway manager is not initialized.', ephemeral: true });

        try {
            const channel = await client.channels.fetch(gw.channelId);
            const message = await channel.messages.fetch(gw.messageId);

            const winners = await client.giveawayManager.pickWinners(message, 1); // Reroll 1 winner
            if (winners.length > 0) {
                await channel.send(`🎉 New winner is ${winners[0]}! Congratulations, you won the **${gw.prize}**!`);
                await context.reply({ content: '<a:yesss:1471486674990010513> Winner rerolled successfully!', ephemeral: true });
            } else {
                await context.reply({ content: '<a:nooo:1471487750753485036> No valid entrants to pick a new winner.', ephemeral: true });
            }
        } catch (e) {
            console.error(e);
            await context.reply({ content: '<a:nooo:1471487750753485036> Failed to reroll the giveaway.', ephemeral: true });
        }
    }
};
