import { Client, TextChannel, Message, User, MessageReaction, Role } from "discord.js";

export default class Team {

    bot: Client;
    channel: TextChannel;
    msg: Message;
    roles: { [key: string]: Role } = {};

    async setBot(bot: Client) {
        this.bot = bot;

        // Get the channel
        this.channel = (await bot.channels.fetch(process.env.TEAM_SELECT_CHANNEL)) as TextChannel;

        // Find the previous message I sent
        this.msg = (await this.channel.messages.fetch()).find(msg => msg.author === bot.user)

        let emojis = this.channel.guild.emojis.cache;

        // No previous message - I need to create a new message
        if (!this.msg) {
            this.msg = await this.channel.send([
                [`Please select your team. Choose wisely, as you will not be given a chance to switch teams unless in special circumstances!`],
                [`${emojis.array().filter(e => e.name === "Emerald")} - Emerald (green)`],
                [`${emojis.array().filter(e => e.name === "Citrine")} - Citrine (orange)`],
                [`${emojis.array().filter(e => e.name === "Amethyst")} - Amethyst (purple)`],
                [`${emojis.array().filter(e => e.name === "Ruby")} - Ruby (red)`]]
            );
            this.msg.react(emojis.array().find(e => e.name === "Emerald"));
            this.msg.react(emojis.array().find(e => e.name === "Citrine"));
            this.msg.react(emojis.array().find(e => e.name === "Amethyst"));
            this.msg.react(emojis.array().find(e => e.name === "Ruby"));
        }

        // Get the roles
        this.roles = {
            "Emerald": await this.channel.guild.roles.fetch("666230340838227998"),
            "Ruby": await this.channel.guild.roles.fetch("666230198882140166"),
            "Amethyst": await this.channel.guild.roles.fetch("666230117458247710"),
            "Citrine": await this.channel.guild.roles.fetch("722068580761600021"),
        }

        // Process outstanding reactions
        for (let reaction of this.msg.reactions.cache.array()) {
            (await reaction.users.fetch()).filter(u => u.id !== bot.user.id).forEach(u => this.handleEmote(reaction, u));
        }

        // Hook that message
        this.msg.awaitReactions(this.handleEmote.bind(this));
    }

    // Handle a new emote on the message
    handleEmote(reaction: MessageReaction, user: User) {
        if (user.id === this.bot.user.id) {
            return false;
        }

        // Remove the reaction
        reaction.users.remove(user);

        // Process the member and role
        let member = this.channel.members.find(m => m.id === user.id);
        let role = this.roles[reaction.emoji.name];

        // Check this is a valid role
        if (!role) {
            console.log(`Unknown team ${reaction.emoji.name}`);
            return false;
        }

        // Make sure the user doesn't already have a team
        if (member.roles.cache.filter(r => Object.keys(this.roles).includes(r.name)).size) {
            console.log(`User ${member.displayName} already has a team`);
            return false;
        }

        // Add the team to the user
        console.log(`Adding ${member.displayName} to team ${role.name}`);
        member.roles.add(role);

        return true;
    }
}
