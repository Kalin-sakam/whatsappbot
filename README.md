# 📱 Bot WhatsApp Automatisé

Un bot WhatsApp puissant et facile à utiliser pour envoyer des messages automatiquement via une API REST.

## 🚀 Démarrage rapide

### 1️⃣ Première connexion
Au démarrage du projet, un **QR code** s'affichera dans la console :

1. Ouvrez WhatsApp sur votre téléphone
2. Menu > **Appareils connectés** > **Connecter un appareil**
3. Scannez le QR code affiché dans la console Replit
4. ✅ Votre bot est maintenant connecté !

### 2️⃣ Envoi de messages

#### Via l'interface web
1. Ouvrez l'interface (port 5000)
2. Entrez le numéro au format international **sans le +**
   - Exemple Cameroun: `237620704040`
   - Exemple France: `33612345678`
3. Tapez votre message
4. Cliquez sur **Envoyer le message**

#### Via l'API
```javascript
fetch('/send-whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        phone: '237620704040',
        message: 'Bonjour depuis le bot!'
    })
});
```

## 📡 API Endpoints

### `POST /send-whatsapp`
Envoie un message WhatsApp

**Body:**
```json
{
  "phone": "237620704040",
  "message": "Votre message ici"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Message envoyé avec succès",
  "to": "237620704040"
}
```

### `GET /status`
Vérifie si WhatsApp est connecté
```json
{
  "whatsappReady": true,
  "status": "connecté"
}
```

## 🔧 Technologies utilisées
- **whatsapp-web.js** - Interaction avec WhatsApp Web
- **Express.js** - Serveur HTTP
- **qrcode-terminal** - Affichage QR code dans la console
- **LocalAuth** - Persistance de session

## 📝 Notes importantes
- La session est **sauvegardée automatiquement** - pas besoin de rescanner le QR code à chaque démarrage
- Pour reconnecter un autre compte, supprimez le dossier `.wwebjs_auth/`
- Le bot fonctionne sur **Replit** et autres environnements Node.js

## 📖 Documentation complète
Consultez `replit.md` pour la documentation technique détaillée.

---
Créé avec ❤️ pour automatiser vos messages WhatsApp
