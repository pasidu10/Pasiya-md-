const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

let qrCodeData = '';
let isReady = false;

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session'
    }),
    puppeteer: { headless: true }
});

client.on('qr', async (qr) => {
    qrCodeData = await qrcode.toDataURL(qr);
    isReady = false;
    console.log('QR Code Generated');
});

client.on('ready', () => {
    isReady = true;
    console.log('Client is ready!');
});

client.initialize();

app.use(express.static('public'));

app.get('/getQR', (req, res) => {
    if (isReady) {
        res.json({ status: 'READY', session: 'Session initialized successfully!' });
    } else {
        res.json({ status: 'NOT_READY', qr: qrCodeData });
    }
});

app.listen(port, () => {
    console.log(`🟢 PASIYA-MD BOT SERVER: http://localhost:${port}`);
});  
const express = require('express');
const { makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const fs = require('fs');

const { state, saveState } = useSingleFileAuthState('./auth_info.json');
const app = express();
const port = 3000;

let pairCode = null;

async function startSocket() {
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, fs.existsSync),
        },
        printQRInTerminal: false,
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, isNewLogin } = update;
        if (connection === 'close') {
            console.log('Connection closed. Restarting...');
            startSocket();
        }
    });

    pairCode = await sock.requestPairingCode("PASIYA-MD-BOT");
    console.log("✅ Pair Code:", pairCode);
}

startSocket();

app.use(express.static('public'));

app.get('/getPairCode', (req, res) => {
    if (pairCode) {
        res.json({ code: pairCode });
    } else {
        res.json({ code: 'Generating...' });
    }
});

app.listen(port, () => {
    console.log(`🟢 PASIYA-MD Pair Code Server running: http://localhost:${port}`);
});
