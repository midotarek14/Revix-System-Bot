const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all available commands.'),

    async executeInteraction(interaction, client) {
        const logoPath = path.join(__dirname, '../assets/Revix logo.png');
        const file = new AttachmentBuilder(logoPath, { name: 'logo.png' });

        const embed = new EmbedBuilder()
            .setTitle('<:IconSettings:1496182222431064104> Revix Service Bot - Commands List')
            .setColor('#285fce')
            .setThumbnail('attachment://logo.png')
            .setDescription('Here is a list of all available commands, they can be used via (/) or directly by typing their name:')
            .addFields(
                { name: '<:IconSettings:1496182222431064104> Moderation', value: '`ban`, `unban`, `kick`, `clear`, `timeout`, `untimeout`' },
                { name: '<:IconTextChannel:1496182212373119117> Channel Management', value: '`lock`, `unlock`, `hide`, `show`' },
                { name: '<:lightningboltshadow:1496183228879470646> Giveaways', value: '`gstart`, `gend`, `greroll`' },
                { name: '<:usershape:1496600148946452531> Roles Management', value: '`role`, `autorole`, `bautorole`' },
                { name: '<:lightningboltshadow:1496183228879470646> Utility', value: '`say`, `come`, `line`, `server`, `user`, `senddm`, `word`, `help`' }
            )
            .setFooter({ text: 'Revix Service' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], files: [file] });
    },

    async executeMessage(message, args, client) {
        const logoPath = path.join(__dirname, '../assets/Revix logo.png');
        const file = new AttachmentBuilder(logoPath, { name: 'logo.png' });

        const embed = new EmbedBuilder()
            .setTitle('<:IconSettings:1496182222431064104> Revix Service Bot - Commands List')
            .setColor('#3166d1')
            .setThumbnail('attachment://logo.png')
            .setDescription('Here is a list of all available commands, they can be used via (/) or directly by typing their name:')
            .addFields(
                { name: '<:IconSettings:1496182222431064104> Moderation', value: '`ban`, `unban`, `kick`, `clear`, `timeout`, `untimeout`' },
                { name: '<:IconTextChannel:1496182212373119117> Channel Management', value: '`lock`, `unlock`, `hide`, `show`' },
                { name: '<:lightningboltshadow:1496183228879470646> Giveaways', value: '`gstart`, `gend`, `greroll`' },
                { name: '<:usershape:1496600148946452531> Roles Management', value: '`role`, `autorole`, `bautorole`' },
                { name: '<:lightningboltshadow:1496183228879470646> Utility', value: '`say`, `come`, `line`, `server`, `user`, `senddm`, `word`, `help`' }
            )
            .setFooter({ text: 'Revix Service' })
            .setTimestamp();

        try {
            await message.channel.send({ embeds: [embed], files: [file] });
        } catch (error) {
            console.error(error);
            await message.reply('I cannot send the embed here.');
        }
    }
};
