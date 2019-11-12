const TelegramBot = require("node-telegram-bot-api");
const needle = require("needle");
const cheerio = require("cheerio");
const url = "http://www.mafia-odessa.fun/?post_type=product";

// replace the value below with the Telegram token you receive from @BotFather
const token = "953066804:AAFHETQf21MeeD4p2kbhI4kTUPkaKLzRXIg";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = `👋 Вас приветсвует магазинчик\n          *COSA NOSTRA*\nCпасибо, что заглянули к нам ❗\n➖➖➖➖➖➖➖➖➖➖➖\n✔️ Здесь Вы сможете найти и\nпроверить АКТУАЛЬНЫЕ контакты\nмагазина (сайт, боты, операторы) ❗\nПоказать контакты: ➡️/contacts\n➖➖➖➖➖➖➖➖➖➖➖\n✔️ Ознакомиться с наличием\nтовара и сеткой цен ❗\nПоказать прайс: ➡️/price\n➖➖➖➖➖➖➖➖➖➖➖\n✔️ Быть в курсе всех новостей,\nакций и скидок магазина ❗`;

  bot.sendMessage(chatId, resp, {
    parse_mode: "Markdown"
  });
});

bot.onText(/\/contacts/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = `Наши контакты:\n📞 +38 (091) 609-65-00\n➖➖➖➖➖➖➖➖➖➖➖\nНаш сайт:\n🌐 http://www.mafia-odessa.fun`;

  bot.sendMessage(chatId, resp, {
    parse_mode: "Markdown"
  });
});

bot.onText(/\/price/, (msg, match) => {
  const chatId = msg.chat.id;
  let resp = "";
  needle.get(url, function(err, res) {
    if (err) throw err;

    const $ = cheerio.load(res.body);
    const titles = $(".product-outer h2");
    const prices = $(".product-outer .price > .woocommerce-Price-amount");
    const links = $(".product-image-wrapper > a");

    for (let i = 0; i < titles.length; i++) {
      resp += `👉 <a href="${$(links[i]).attr("href")}">${$(
        titles[i]
      ).text()} - ${$(prices[i]).text()}</a>\n\n`;
    }
    bot.sendMessage(chatId, resp, {
      parse_mode: "HTML"
    });
  });
});
