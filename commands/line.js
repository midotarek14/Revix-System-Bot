const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('line')
        .setDescription('Send the Revix line image'),

    async executeInteraction(interaction) {
        const imagePath = path.join(__dirname, '../assets/Revix line.png');
        const attachment = new AttachmentBuilder(imagePath);

        try {
            await interaction.reply({ files: [attachment] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Could not find the line image or failed to send it.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        const imagePath = path.join(__dirname, '../assets/Revix line.png');
        const attachment = new AttachmentBuilder(imagePath);

        try {
            message.delete().catch(() => {});
            await message.channel.send({ files: [attachment] });
        } catch (error) {
            console.error(error);
            await message.reply('Could not find the line image or failed to send it.');
        }
    }
};
