const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays information about the server.'),

    async executeInteraction(interaction) {
        const { guild } = interaction;

        await guild.members.fetch();
        const botCount = guild.members.cache.filter(m => m.user.bot).size;
        const channelsCount = guild.channels.cache.filter(c => c.type !== ChannelType.GuildCategory).size;
        const boostsCount = guild.premiumSubscriptionCount || 0;
        const boostLevel = guild.premiumTier || 0;

        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} - Server Information`)
            .setColor('#285fce')
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: '<:7212roleadmin:1496600993909964930> Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '<:logo1:1496597037951746168> Server ID', value: `\`${guild.id}\``, inline: true },
                { name: '<:usershape:1496600148946452531> Members', value: `${guild.memberCount}`, inline: true },
                { name: '<:githubcharacter:1496183224253026478> Bots', value: `${botCount}`, inline: true },
                { name: '<:code:1496183221807747133> Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: '<:IconTextChannel:1496182212373119117> Channels', value: `${channelsCount}`, inline: true },
                { name: '<a:NL_boost:1496182498567262290> Boosts', value: `${boostsCount}`, inline: true },
                { name: '<a:NL_boost:1496182498567262290> Boost Level', value: `Level ${boostLevel}`, inline: true },
                { name: '<:shuttle:1496600155871252661> Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: false }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },

    async executeMessage(message, args) {
        const { guild } = message;

        await guild.members.fetch();
        const botCount = guild.members.cache.filter(m => m.user.bot).size;
        const channelsCount = guild.channels.cache.filter(c => c.type !== ChannelType.GuildCategory).size;
        const boostsCount = guild.premiumSubscriptionCount || 0;
        const boostLevel = guild.premiumTier || 0;

        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} - Server Information`)
            .setColor('#3166d1')
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: '<:7212roleadmin:1496600993909964930> Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '<:logo1:1496597037951746168> Server ID', value: `\`${guild.id}\``, inline: true },
                { name: '<:usershape:1496600148946452531> Members', value: `${guild.memberCount}`, inline: true },
                { name: '<:githubcharacter:1496183224253026478> Bots', value: `${botCount}`, inline: true },
                { name: '<:code:1496183221807747133> Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: '<:IconTextChannel:1496182212373119117> Channels', value: `${channelsCount}`, inline: true },
                { name: '<a:NL_boost:1496182498567262290> Boosts', value: `${boostsCount}`, inline: true },
                { name: '<a:NL_boost:1496182498567262290> Boost Level', value: `Level ${boostLevel}`, inline: true },
                { name: '<:shuttle:1496600155871252661> Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: false }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        try {
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply('I cannot send the embed here.');
        }
    }
};
