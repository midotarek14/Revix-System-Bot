const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../utils/db');
const parseTime = require('../utils/timeParser');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Start a giveaway')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration (e.g., 10m, 1h, 1d)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('winners')
                .setDescription('Number of winners')
                .setRequired(true)
                .setMinValue(1))
        .addStringOption(option =>
            option.setName('prize')
                .setDescription('The prize to win')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

    async executeInteraction(interaction) {
        const durationStr = interaction.options.getString('duration');
        const winners = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');

        const durationMs = parseTime(durationStr);
        if (!durationMs) return interaction.reply({ content: '<a:nooo:1471487750753485036> Invalid duration format. Use s, m, h, or d (e.g., 10m).', ephemeral: true });

        const endTime = Date.now() + durationMs;

        const embed = new EmbedBuilder()
            .setTitle('<:lightningboltshadow:1496183228879470646> GIVEAWAY <:lightningboltshadow:1496183228879470646>')
            .setDescription(`Prize: **${prize}**\nWinners: **${winners}**\nReact with <:logo1:1496597037951746168> to enter!\nEnds: <t:${Math.floor(endTime / 1000)}:R>`)
            .setColor('#285fce')
            .setFooter({ text: `Hosted by ${interaction.user.tag}` })
            .setTimestamp(endTime);

        const message = await interaction.channel.send({ embeds: [embed] });
        await message.react('1496597037951746168');

        const giveaways = db.get('giveaways') || [];
        giveaways.push({
            messageId: message.id,
            channelId: interaction.channel.id,
            endTime,
            prize,
            winnerCount: winners,
            ended: false
        });
        db.updateGiveaways(giveaways);

        await interaction.reply({ content: '<a:yesss:1471486674990010513> Giveaway started!', ephemeral: true });
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
            return message.reply("<a:nooo:1471487750753485036> You don't have permission to use this command.");
        }

        const durationStr = args[0];
        const winnersStr = args[1];
        const prize = args.slice(2).join(' ');

        if (!durationStr || !winnersStr || !prize) return message.reply('<a:nooo:1471487750753485036> Usage: gstart <duration> <winners> <prize>');

        const durationMs = parseTime(durationStr);
        if (!durationMs) return message.reply('<a:nooo:1471487750753485036> Invalid duration format. Use s, m, h, or d (e.g., 10m).');

        const winners = parseInt(winnersStr);
        if (isNaN(winners) || winners < 1) return message.reply('<a:nooo:1471487750753485036> Invalid winners count.');

        const endTime = Date.now() + durationMs;

        const embed = new EmbedBuilder()
            .setTitle('<:lightningboltshadow:1496183228879470646> GIVEAWAY <:lightningboltshadow:1496183228879470646>')
            .setDescription(`Prize: **${prize}**\nWinners: **${winners}**\nReact with <:logo1:1496597037951746168> to enter!\nEnds: <t:${Math.floor(endTime / 1000)}:R>`)
            .setColor('#3166d1')
            .setFooter({ text: `Hosted by ${message.author.tag}` })
            .setTimestamp(endTime);

        try {
            message.delete().catch(() => { });
            const gwMessage = await message.channel.send({ embeds: [embed] });
            await gwMessage.react('1496597037951746168');

            const giveaways = db.get('giveaways') || [];
            giveaways.push({
                messageId: gwMessage.id,
                channelId: message.channel.id,
                endTime,
                prize,
                winnerCount: winners,
                ended: false
            });
            db.updateGiveaways(giveaways);
        } catch (error) {
            console.error(error);
            await message.channel.send('<a:nooo:1471487750753485036> I cannot start the giveaway here.');
        }
    }
};
