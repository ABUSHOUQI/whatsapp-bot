const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// 🎯 القروب المحدد
const TARGET_GROUP = "120363411068702486@g.us";

// 🔢 تخزين الغيابات
const absences = {};

client.on('qr', qr => {
    console.log("📱 امسح الكود:");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🔥 البوت اشتغل!');
});

client.on('message', async msg => {

    // ✅ بس هذا القروب
    if (msg.from !== TARGET_GROUP) return;

    // ❌ بس رسائل نص
    if (msg.type !== 'chat') return;

    // ❌ تجاهل الفاضي
    if (!msg.body) return;

    console.log("📩:", msg.body);

    const match = msg.body.match(/\d+/);
    if (!match) return;

    const number = match[0];

    // 🔢 عدّ الغياب
    if (!absences[number]) {
        absences[number] = 1;
    } else {
        absences[number]++;
    }

    const count = absences[number];

    try {
        if (count === 1) {
            await msg.reply(`✅ رقم ${number} (أول غياب)`);
        } else if (count === 2) {
            await msg.reply(`⚠️ رقم ${number} (ثاني غياب)`);
        } else if (count === 3) {
            await msg.reply(`🚨 رقم ${number} (ثالث غياب)`);
        } else {
            await msg.reply(`❗ رقم ${number} غاب ${count} مرات`);
        }
    } catch (err) {
        console.log("❌ خطأ:", err);
    }
});

client.initialize();
