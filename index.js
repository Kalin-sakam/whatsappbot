const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const { execSync } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.static('public'));

function getChromiumPath() {
    if (process.env.CHROMIUM_PATH) {
        const envPath = process.env.CHROMIUM_PATH;
        if (fs.existsSync(envPath)) {
            try {
                fs.accessSync(envPath, fs.constants.X_OK);
                console.log(`🔍 Chromium trouvé via CHROMIUM_PATH: ${envPath}`);
                return envPath;
            } catch (error) {
                console.warn(`⚠️ CHROMIUM_PATH existe mais n'est pas exécutable: ${envPath}`);
            }
        } else {
            console.warn(`⚠️ CHROMIUM_PATH n'existe pas: ${envPath}`);
        }
    }
    
    try {
        const chromiumPath = execSync('which chromium-browser || which chromium', { 
            encoding: 'utf8' 
        }).trim();
        
        if (chromiumPath && fs.existsSync(chromiumPath)) {
            console.log(`🔍 Chromium trouvé via which: ${chromiumPath}`);
            return chromiumPath;
        }
    } catch (error) {
    }
    
    console.log('ℹ️ Utilisation du Chromium par défaut de Puppeteer');
    return null;
}

const chromiumExecutable = getChromiumPath();

const baseArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
];

const puppeteerConfig = {
    headless: true,
    args: chromiumExecutable ? [...baseArgs, '--single-process'] : baseArgs
};

if (chromiumExecutable) {
    puppeteerConfig.executablePath = chromiumExecutable;
}

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '.wwebjs_auth'
    }),
    puppeteer: puppeteerConfig
});

let isClientReady = false;

client.on('qr', (qr) => {
    console.log('\n========================================');
    console.log('🔐 QR CODE WHATSAPP - Scannez avec votre téléphone :');
    console.log('========================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\n========================================');
    console.log('📱 Ouvrez WhatsApp > Menu > Appareils connectés > Connecter un appareil');
    console.log('========================================\n');
});

client.on('authenticated', () => {
    console.log('✅ WhatsApp authentifié avec succès !');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Échec de l\'authentification WhatsApp:', msg);
});

client.on('ready', () => {
    console.log('\n🎉 WhatsApp Client prêt !\n');
    isClientReady = true;
});

client.on('disconnected', (reason) => {
    console.log('⚠️ WhatsApp déconnecté:', reason);
    isClientReady = false;
});

client.initialize();

app.post('/send-whatsapp', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({
            success: false,
            error: 'Les champs "phone" et "message" sont requis'
        });
    }

    if (!isClientReady) {
        return res.status(503).json({
            success: false,
            error: 'WhatsApp client n\'est pas encore prêt. Scannez le QR code d\'abord.'
        });
    }

    try {
        const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;
        
        await client.sendMessage(chatId, message);
        
        console.log(`✉️ Message envoyé à ${phone}: "${message}"`);
        
        return res.json({
            success: true,
            message: 'Message envoyé avec succès',
            to: phone,
            text: message
        });
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi du message:', error);
        
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'envoi du message',
            details: error.message
        });
    }
});

app.get('/status', (req, res) => {
    res.json({
        whatsappReady: isClientReady,
        status: isClientReady ? 'connecté' : 'en attente de connexion'
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Serveur Express démarré sur http://0.0.0.0:${PORT}`);
    console.log('📡 Endpoint disponible: POST /send-whatsapp');
    console.log('📊 Status endpoint: GET /status\n');
});
