const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Displays information about a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get info about (optional)')),

    async executeInteraction(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(targetUser.id);
        
        const joinedDiscord = `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`;
        const joinedServer = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Not in server';

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .addFields(
                { name: 'Joined Discord :', value: joinedDiscord, inline: true },
                { name: 'Joined Server :', value: joinedServer, inline: true }
            )
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: targetUser.username, iconURL: targetUser.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [embed] });
    },

    async executeMessage(message, args) {
        const targetUser = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
        const member = message.guild.members.cache.get(targetUser.id);

        const joinedDiscord = `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`;
        const joinedServer = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Not in server';

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .addFields(
                { name: 'Joined Discord :', value: joinedDiscord, inline: true },
                { name: 'Joined Server :', value: joinedServer, inline: true }
            )
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: targetUser.username, iconURL: targetUser.displayAvatarURL({ dynamic: true }) });

        try {
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply('I cannot send the embed here.');
        }
    }
};
