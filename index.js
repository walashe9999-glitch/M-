const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const prefix = "!";

/* ================== لعبة الكراسي ================== */
let chairsGame = {
  started: false,
  players: [],
  max: 40,
  message: null,
  timer: null,
  timeLeft: 50
};

/* ================== لعبة أسرع ================== */
const fasterWords = [
  { word: "زومبي", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455520229387010149/-removebg-preview.png" },
  { word: "قسطنطينة", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455520229940793364/-removebg-preview.png" },
  { word: "حبيبي والله", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455520228950933514/-removebg-preview.png" },
  { word: "افيرو عمي", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455520232046198836/-removebg-preview.png" },
  { word: "مشروع", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455521755308494898/-removebg-preview.png" },
  { word: "مثلث", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455521755006242897/-removebg-preview.png" },
  { word: "الشعر", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455520231169589343/-removebg-preview.png" },
  { word: "خنق", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455520230808883221/-removebg-preview.png" },
  { word: "لقب", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455520231656259605/-removebg-preview.png" }
];

/* ================== لعبة فكك ================== */
const fkWords = [
  { word: "شمس", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555451537330267/-removebg-preview.png" },
  { word: "كتاب", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555451189071944/-removebg-preview.png" },
  { word: "غرفة", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555448278351955/-removebg-preview.png" },
  { word: "كهرومغناطيسية", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555448680747009/-removebg-preview.png" },
  { word: "باب", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555448982863943/-removebg-preview.png" },
  { word: "حديقة", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555449297440831/-removebg-preview.png" },
  { word: "ساعة", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555449741906133/-removebg-preview.png" },
  { word: "طريق", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555450031440029/-removebg-preview.png" },
  { word: "مفتاح", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555450358599893/-removebg-preview.png" },
  { word: "بحر", img: "https://cdn.discordapp.com/attachments/1454852015678034042/1455555450656264364/-removebg-preview.png" }
];

/* ================== لعبة أعلام ================== */
const flags = [
  { name: "الجزائر", img: "https://i.pinimg.com/736x/10/88/b7/1088b7fb338a814e9d1c086ff6992699.jpg" },
  { name: "السعودية", img: "https://i.pinimg.com/736x/04/89/c6/0489c67505148bd14a17672a6fc8b0c6.jpg" },
  { name: "مصر", img: "https://i.pinimg.com/736x/5e/b9/b4/5eb9b43485ae2f13e1775dee0dc052bf.jpg" },
  { name: "المغرب", img: "https://i.pinimg.com/736x/48/4d/ae/484daebcf8cb32603d105ed4be27dd21.jpg" },
  { name: "تونس", img: "https://i.pinimg.com/1200x/c7/1c/fc/c71cfc9b2ef656f07781af7c45b668f6.jpg" },
  { name: "عمان", img: "https://i.pinimg.com/736x/40/68/66/406866cc03fd51d984804a17850490a2.jpg" },
  { name: "اليمن", img: "https://i.pinimg.com/1200x/ad/ec/97/adec97e231463064d580a153663b80d3.jpg" },
  { name: "ليبيا", img: "https://i.pinimg.com/736x/39/f0/3d/39f03dc5fb78432ee5d0613686ced72a.jpg" },
  { name: "العراق", img: "https://i.pinimg.com/736x/5b/0d/9f/5b0d9f324878380911b9b46b1ed1bc8a.jpg" }
];

/* ================== جاهزية البوت ================== */
client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} جاهز!`);
});

/* ================== الرسائل ================== */
client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const command = message.content.slice(prefix.length).trim();

  /* ================== كراسي ================== */
  if (command === "كراسي") {
    if (chairsGame.started) return message.channel.send("❌ فيه لعبة شغالة بالفعل");

    chairsGame = { started: true, players: [], max: 40, message: null, timer: null, timeLeft: 50 };

    const joinButton = new ButtonBuilder()
      .setCustomId("join_game")
      .setLabel("دخول إلى اللعبة")
      .setStyle(ButtonStyle.Success);

    const leaveButton = new ButtonBuilder()
      .setCustomId("leave_game")
      .setLabel("اخرج من اللعبة")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(joinButton, leaveButton);

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("🪑 كراسي")
      .setDescription(getChairsDescription())
      .setFooter({ text: "ابدأ التسجيل الآن" });

    const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
    chairsGame.message = sentMessage;

    chairsGame.timer = setInterval(async () => {
      if (chairsGame.timeLeft <= 0) {
        clearInterval(chairsGame.timer);
        await endChairsRegistration();
        return;
      }
      await updateChairsEmbed();
      chairsGame.timeLeft--;
    }, 1000);
  }

  /* ================== أسرع ================== */
  if (command === "اسرع") {
    const selected = fasterWords[Math.floor(Math.random() * fasterWords.length)];
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("لعبة اسرع")
      .setDescription("🕒 اكتب الكلمة الصحيحة")
      .setThumbnail(selected.img)
      .setFooter({ text: "لديك 15 ثانية" })
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });

    const filter = m => m.content === selected.word;
    message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })
      .then(c => message.channel.send({ embeds: [new EmbedBuilder().setColor("Green").setDescription(`✅ | <@${c.first().author.id}> فاز!`)] }))
      .catch(() => message.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("⏰ | انتهى الوقت")] }));
  }

  /* ================== فكك ================== */
  if (command === "فكك") {
    const selected = fkWords[Math.floor(Math.random() * fkWords.length)];
    const splitWord = selected.word.split("");
    const displayWord = splitWord.join(" ");

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("لعبة فكك")
      .setDescription(`🔤 فك الكلمة:\n**${displayWord}**`)
      .setThumbnail(selected.img)
      .setFooter({ text: "لديك 15 ثانية" })
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });

    const filter = m => m.content.replace(/\s+/g, "") === selected.word.replace(/\s+/g, "");
    message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })
      .then(c => message.channel.send({ embeds: [new EmbedBuilder().setColor("Green").setDescription(`✅ | <@${c.first().author.id}> إجابة صحيحة`)] }))
      .catch(() => message.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("⏰ | انتهى الوقت")]}));
  }

  /* ================== أعلام ================== */
  if (command === "اعلام") {
    const selected = flags[Math.floor(Math.random() * flags.length)];
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("لعبة أعلام")
      .setDescription("🏳️ اكتب اسم الدولة")
      .setThumbnail(selected.img)
      .setFooter({ text: "لديك 15 ثانية" })
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });

    const filter = m => m.content === selected.name;
    message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })
      .then(c => message.channel.send({ embeds: [new EmbedBuilder().setColor("Green").setDescription(`✅ | <@${c.first().author.id}> إجابة صحيحة`)] }))
      .catch(() => message.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription(`⏰ | انتهى الوقت\n✅ الإجابة: **${selected.name}**`)] }));
  }
});

/* ================== التفاعل مع أزرار الكراسي ================== */
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (!chairsGame.started) return interaction.reply({ content: "❌ ما فيه لعبة شغالة حاليا", ephemeral: true });

  if (interaction.customId === "join_game") {
    if (chairsGame.players.includes(interaction.user.id)) return interaction.reply({ content: "✅ انت مشارك بالفعل", ephemeral: true });
    if (chairsGame.players.length >= chairsGame.max) return interaction.reply({ content: "❌ وصلنا الحد الأقصى 40 لاعب", ephemeral: true });

    chairsGame.players.push(interaction.user.id);
    await updateChairsEmbed();
    return interaction.reply({ content: "✅ تم تسجيلك في اللعبة", ephemeral: true });
  }

  if (interaction.customId === "leave_game") {
    if (!chairsGame.players.includes(interaction.user.id)) return interaction.reply({ content: "❌ انت غير مسجل", ephemeral: true });

    chairsGame.players = chairsGame.players.filter(id => id !== interaction.user.id);
    await updateChairsEmbed();
    return interaction.reply({ content: "✅ خرجت من اللعبة", ephemeral: true });
  }
});

/* ================== تحديث Embed الكراسي ================== */
async function updateChairsEmbed() {
  if (!chairsGame.message) return;
  const embed = EmbedBuilder.from(chairsGame.message.embeds[0]);
  embed.setDescription(getChairsDescription());
  await chairsGame.message.edit({ embeds: [embed] });
}

function getChairsDescription() {
  return `طريقة اللعب:
1- شارك في اللعبة بالضغط على الزر أدناه
2- ستبدأ اللعبة بعد انتهاء الوقت
3- آخر شخص يبقى في اللعبة هو الفائز

⏱️ الوقت المتبقي: ${chairsGame.timeLeft} ثانية
اللاعبين المشاركين: (${chairsGame.players.length}/${chairsGame.max})
${chairsGame.players.map(p => `• <@${p}>`).join("\n")}`;
}

/* ================== إنهاء التسجيل وبدء اللعبة ================== */
async function endChairsRegistration() {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("join_game").setLabel("دخول إلى اللعبة").setStyle(ButtonStyle.Success).setDisabled(true),
    new ButtonBuilder().setCustomId("leave_game").setLabel("اخرج من اللعبة").setStyle(ButtonStyle.Danger).setDisabled(true)
  );
  await chairsGame.message.edit({ components: [row] });

  if (chairsGame.players.length < 5) {
    await chairsGame.message.channel.send("❌ عدد اللاعبين غير كافي لبدء اللعبة.");
    chairsGame.started = false;
    return;
  }

  await chairsGame.message.channel.send("🚦 انتهى وقت التسجيل، تبدأ لعبة الكراسي الآن!");
  startChairsGame();
}

async function startChairsGame() {
  let remainingPlayers = [...chairsGame.players];
  while (remainingPlayers.length > 1) {
    const eliminatedIndex = Math.floor(Math.random() * remainingPlayers.length);
    const eliminated = remainingPlayers.splice(eliminatedIndex, 1)[0];

    await chairsGame.message.channel.send(`❌ <@${eliminated}> خرج من اللعبة!`);
    await new Promise(r => setTimeout(r, 3000));
  }

  await chairsGame.message.channel.send(`🏆 <@${remainingPlayers[0]}> فاز بلعبة الكراسي!`);
  chairsGame.started = false;
}

client.login(process.env.token);
