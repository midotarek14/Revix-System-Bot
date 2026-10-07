const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('come')
        .setDescription('Tell a user to come to the current channel')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to call')
                .setRequired(true)),

    async executeInteraction(interaction) {
        const target = interaction.options.getUser('target');

        const dmEmbed = new EmbedBuilder()
            .setColor('#285fce')
            .setDescription(`تم استدعائك بواسطة: ${interaction.user}\nفي روم: ${interaction.channel}`);

        const button = new ButtonBuilder()
            .setLabel('وديني هناك')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`);

        const row = new ActionRowBuilder().addComponents(button);

        try {
            await target.send({ embeds: [dmEmbed], components: [row] });
            await interaction.channel.send(`Please come here ${target}, you have been requested!`);
        } catch (error) {
            console.error(error);
            await interaction.channel.send(`Please come here ${target}, you have been requested!`);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> لا يمكنني إرسال رسالة في الخاص لهذا الشخص، تم استدعاؤه في الروم فقط.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        const target = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!target) {
            return message.reply('Please mention a user to call.');
        }

        const dmEmbed = new EmbedBuilder()
            .setColor('#285fce')
            .setDescription(`تم استدعائك بواسطة: ${message.author}\nفي روم: ${message.channel}`);

        const button = new ButtonBuilder()
            .setLabel('وديني هناك')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}`);

        const row = new ActionRowBuilder().addComponents(button);

        try {
            message.delete().catch(() => { });
            await target.send({ embeds: [dmEmbed], components: [row] });
            await message.channel.send(`Please come here ${target}, you have been requested by ${message.author}!`);
        } catch (error) {
            console.error(error);
            await message.channel.send(`Please come here ${target}, you have been requested by ${message.author}!`);
        }
    }
};
