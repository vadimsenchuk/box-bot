const TelegramBot = require('node-telegram-bot-api');
const needle = require('needle');
const cheerio = require('cheerio');
const url = 'http://rost-d.com/box/?post_type=product';

// replace the value below with the Telegram token you receive from @BotFather
const token = '953066804:AAFHETQf21MeeD4p2kbhI4kTUPkaKLzRXIg';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
// bot.setWebHook(`http://rost-d.com/box/bot${token}`);

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = `👋 Вас приветсвует магазинчик *COSA NOSTRA*\nCпасибо, что заглянули к нам ❗\n➖➖➖➖➖➖➖➖➖\n✔️ Здесь Вы сможете найти и проверить АКТУАЛЬНЫЕ контакты магазина (сайт, боты, операторы) ❗\nПоказать контакты: ➡️/contacts\n➖➖➖➖➖➖➖➖➖\n✔️ Ознакомиться с наличием товара и сеткой цен ❗\nПоказать прайс: ➡️/price\n➖➖➖➖➖➖➖➖➖\n✔️ Быть в курсе всех новостей, акций и скидок магазина ❗`;

  bot.sendMessage(chatId, resp, {
    parse_mode: 'Markdown'
  });
});

bot.onText(/\/contacts/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = `Наши контакты:\n📞 +38 (000) 111-11-11\n📞 +38 (111) 222-22-22\n➖➖➖➖➖➖➖➖➖\nНаш сайт:\n🌐 http::/rost-d.com/box/`;

  bot.sendMessage(chatId, resp, {
    parse_mode: 'Markdown'
  });
});

bot.onText(/\/price/, (msg, match) => {
  const chatId = msg.chat.id;
  let msg = '';
  needle.get(url, function(err, res) {
    if (err) throw err;

    const $ = cheerio.load(res.body);
    const titles = $('.product-outer h2');
    const prices = $('.product-outer .woocommerce-Price-amount');
    const links = $('.product-image-wrapper > a');

    for (let i = 0; i < titles.length; i++) {
      msg += `👉 <a href="${$(links[i]).attr('href')}">${$(
        titles[i]
      ).text()} - ${$(prices[0]).text()}</a>\n`;
    }
    bot.sendMessage(id, msg, {
      parse_mode: 'HTML'
    });
  });
});
