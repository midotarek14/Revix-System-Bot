const { Events } = require('discord.js');
const db = require('../utils/db');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.user.bot) {
            // Assign bot auto-role
            const bautoroles = db.get('bautoroles') || {};
            const roleId = bautoroles[member.guild.id];
            if (roleId) {
                const role = member.guild.roles.cache.get(roleId);
                if (role) {
                    member.roles.add(role).catch(err => console.error('Failed to add bot autorole:', err));
                }
            }
        } else {
            // Assign human auto-role
            const autoroles = db.get('autoroles') || {};
            const roleId = autoroles[member.guild.id];
            if (roleId) {
                const role = member.guild.roles.cache.get(roleId);
                if (role) {
                    member.roles.add(role).catch(err => console.error('Failed to add human autorole:', err));
                }
            }
        }
    },
};
