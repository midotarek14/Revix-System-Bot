const db = require('./db');
const { EmbedBuilder } = require('discord.js');

class GiveawayManager {
    constructor(client) {
        this.client = client;
        this.checkInterval = 10 * 1000; // Check every 10 seconds

        setInterval(() => this.checkGiveaways(), this.checkInterval);
    }

    async checkGiveaways() {
        const giveaways = db.get('giveaways') || [];
        const now = Date.now();

        let updated = false;

        for (const gw of giveaways) {
            if (!gw.ended && now >= gw.endTime) {
                gw.ended = true;
                updated = true;
                await this.endGiveaway(gw);
            }
        }

        if (updated) {
            db.updateGiveaways(giveaways);
        }
    }

    async endGiveaway(gw) {
        try {
            const channel = await this.client.channels.fetch(gw.channelId);
            if (!channel) return;
            const message = await channel.messages.fetch(gw.messageId);
            if (!message) return;

            const winners = await this.pickWinners(message, gw.winnerCount);

            const embed = EmbedBuilder.from(message.embeds[0])
                .setColor('#2b2d31')
                .setDescription(`Giveaway Ended!\nPrize: **${gw.prize}**\nWinners: ${winners.length > 0 ? winners.join(', ') : 'No valid entrants.'}`);

            await message.edit({ embeds: [embed], components: [] });

            if (winners.length > 0) {
                await channel.send(` <:logo1:1496597037951746168> Congratulations ${winners.join(', ')}! You won the **${gw.prize}**!`);
            } else {
                await channel.send(`No one won the **${gw.prize}** because there were not enough valid entrants.`);
            }
        } catch (e) {
            console.error('Error ending giveaway:', e);
        }
    }

    async pickWinners(message, count) {
        const reaction = message.reactions.cache.get('1496597037951746168');
        if (!reaction) return [];

        const users = await reaction.users.fetch();
        const validUsers = users.filter(u => !u.bot).map(u => `<@${u.id}>`);

        if (validUsers.length === 0) return [];
        if (validUsers.length <= count) return validUsers;

        const winners = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * validUsers.length);
            winners.push(validUsers.splice(randomIndex, 1)[0]);
        }
        return winners;
    }
}

module.exports = GiveawayManager;
