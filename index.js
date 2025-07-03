// === Imports ===
const {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

// === Configuration ===
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not set.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const PERSONA_PROMPT = `
You are Nyasha Munyanyiwa, a 16-year-old boy in Magwegwe North, Zimbabwe.
Reply casually like a teen: "k", "lol", "idk", etc.
Avoid full sentences. Keep it chill. Don't say you're a bot.
`.trim();

// === WhatsApp Connection ===
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('baileysauthinfo');
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`✅ Baileys v${version}${isLatest ? ' (latest)' : ''}`);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['NyashaBot', 'Chrome', '1.0.0']
  });

  // === Events ===
  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr, code }) => {
    if (qr) {
      console.log      qrcode.generate(qr, { small: true });
    }
    if (code) {
      console.log(`🔗 Pairing Code:\n${code}`);
    }
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️ Disconnected: ${lastDisconnect?.error}`);
      if (shouldReconnect) setTimeout(connectToWhatsApp, 5000);
    } else if (connection === 'open') {
      console.log('🟢 Connected! Nyasha is online.');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages?.[0];
    if (!msg || msg.key.fromMe || m.type !== 'append') return;

    const sender = msg.key.remoteJid;
    const text =
      msg.message?.extendedTextMessage?.text ||
      msg.message?.conversation ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      '';

    if (!text) {
      console.log(`⛔ Ignoring empty message from ${sender}`);
      return;
    }

    console.log(`📩 From ${sender}: ${text}`);

    const prompt = `${PERSONA_PROMPT}\n\nUser: ${text}\nNyasha:`;

    try {
      const result = await model.generateContent(prompt);
      const reply = result?.response?.text?.().replace(/^Nyasha:\s*/i, '').trim();

      if (reply) {
        console.log(`💬 To ${sender}: ${reply}`);
        await sock.sendPresenceUpdate('composing', sender);
        await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
        await sock.sendMessage(sender, { text: reply });
        await sock.sendPresenceUpdate('paused', sender);
      } else {
        console.log(`🤷 No reply generated for ${sender}`);
        await sock.sendPresenceUpdate('paused', sender);
      }
    } catch (err) {
      console.error('🔥 Error sending message:', err);
      await sock.sendPresenceUpdate('paused', sender);
    }
  });

  return sock;
}

// === Start the Bot ===
console.log('🚀 Starting Nyasha Bot...');
connectToWhatsApp().catch(err =>
  console.error('❌ Fatal error:', err)
);