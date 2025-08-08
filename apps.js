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
