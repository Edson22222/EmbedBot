const { Client } = require('discord.js');
const { config } = require('dotenv');

const bot = new Client({intents:3276767});
config();

bot.on('ready', () => {
    bot.user.setPresence({ activities: [{ name: 'Bom dia!' }], status: 'idle' });
    console.log(`Conectado como ${bot.user.username}.`);
});

let channelcfg = false;

function isNumeric(str) {
    return /^\d+$/.test(str) || /^\d+\.\d+$/.test(str) || /^-\d+$/.test(str) || /^-\d+\.\d+$/.test(str);
}

function NumberOrganize(num, min, max) {
    return num >= min && num <= max;
}

bot.on('messageCreate', (message) => {
    if(message.content.toLocaleLowerCase() == '!feedcfg' || message.content.toLocaleLowerCase() == '.feedcfg') {
        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply('Você não tem permissão para executar esse comando!');
        }
        message.reply('Marque o canal que irá ser enviado os feeds!');
        let colector = message.channel.createMessageCollector({ filter: (m) => m.author.id == message.author.id, max: 1});   
        colector.on('collect', (message) => {
            if(!message.mentions.channels.first()) {
                message.reply("Esse canal não é valido!");
                return;
            }
            if(message.mentions.channels.first().type != "GUILD_TEXT") {
                message.reply("O canal deve ser de texto!");
                return;
            }

            channelid = message.mentions.channels.first().id;
           
            channelcfg = true;
            message.reply('Configurado com sucesso!')
        })
    }

    if(message.content.toLocaleLowerCase() == '!feed' || message.content.toLocaleLowerCase() == '.feed') {
        message.reply('Digite sua nota: ');
        let colector = message.channel.createMessageCollector({ filter: (m) => m.author.id == message.author.id, max: 1});
        colector.on('collect', (message) => {
            if(!isNumeric(message.content)) {
                message.reply("A sua nota deve ser um inteiro!");
                return;
            }

            if(!NumberOrganize(message.content, 1, 10)) {
                message.reply("Sua nota deve ser 1 a 10!");
                return;
            }
            nota = message.content;
            message.reply('Digite uma messagem: ');
            let colecto = message.channel.createMessageCollector({ filter: (m) => m.author.id == message.author.id, max: 1});
            colecto.on('collect', (message) => {
                if(channelcfg == false) {
                    return message.reply('O canal não foi definido!');
                }
                let embed = {
                    color: 0x0099FF,
                    title: "FeedBack",
                    fields: [
                        {
                            name: "Nota",
                            value: nota,
                            inline: false
                        },
                        {
                            name: "Mensagem",
                            value: message.content,
                            inline: false
                        }
                    ]
                }
                    
                
                bot.channels.cache.get(channelid).send( { embeds: [embed] } );
                message.reply("Seu feedback foi enviado com sucesso!");
            });
        })
    }
});
bot.login(process.env.TOKEN);
