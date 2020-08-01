import { Client, TextChannel, Message } from "discord.js";
import Suggestion from "./commands/Suggestion";

export default class Commands {

    prefix = "!";
    bot: Client;
    channel: TextChannel;

    suggestion: Suggestion;

    async setBot(bot: Client) {
        this.bot = bot;
        bot.on('message', (msg) => this.handleMessage(msg));

        this.suggestion = new Suggestion(bot);
    }

    handleMessage(msg: Message) {
        if (!msg.content.startsWith(this.prefix) || msg.author.id === this.bot.user.id) {
            return;
        }

        // Extract command
        let params = msg.content.substr(1).split(" ");
        let command = params.shift();

        // Handle the command
        if (command === "suggest") {
            this.suggestion.handleMessage(msg, params);
        }

    }

}