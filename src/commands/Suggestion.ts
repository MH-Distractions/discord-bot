import { Client, TextChannel, Message } from "discord.js";

export default class Suggestion {

    prefix = "!";
    bot: Client;
    channel: TextChannel;

    constructor(bot: Client) {
        this.bot = bot;
        bot.channels.fetch("725313857794473984").then(c => this.channel = c as TextChannel);
    }

    handleMessage(msg: Message, params: string[]) {
        if (params.length) {
            this.channel.send(`${msg.author.username} suggested the following: ${params.join(' ')}`);
            msg.reply("Thank you for your suggestion. We will be in contact if we require more information.");
        } else {
            msg.reply("To send us a suggestion, please add the suggestion text after !suggest. For example `!suggest My suggestion`");
        }

    }

}