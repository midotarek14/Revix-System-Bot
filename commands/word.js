const { SlashCommandBuilder } = require('discord.js');

function toMathBold(text) {
    return text.split('').map(char => {
        const cp = char.codePointAt(0);
        if (cp >= 0x0041 && cp <= 0x005A) { // A-Z
            return String.fromCodePoint(cp - 0x0041 + 0x1D400);
        } else if (cp >= 0x0061 && cp <= 0x007A) { // a-z
            return String.fromCodePoint(cp - 0x0061 + 0x1D41A);
        }
        return char; // leave other characters (spaces, numbers, arabic) unchanged
    }).join('');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word')
        .setDescription('Convert text to bold mathematical font (e.g., 𝐑𝐞𝐯𝐢𝐱)')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to convert')
                .setRequired(true)),

    async executeInteraction(interaction) {
        const text = interaction.options.getString('text');
        const boldText = toMathBold(text);

        try {
            await interaction.reply({ content: boldText });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '<a:nooo:1471487750753485036> Error sending message.', ephemeral: true });
        }
    },

    async executeMessage(message, args) {
        const text = args.join(' ');
        if (!text) return message.reply('<a:nooo:1471487750753485036> Please provide text to convert.');

        const boldText = toMathBold(text);

        try {
            message.delete().catch(() => {});
            await message.channel.send(boldText);
        } catch (error) {
            console.error(error);
            await message.reply('<a:nooo:1471487750753485036> Error sending message.');
        }
    }
};
