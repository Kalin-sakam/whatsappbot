# Bot WhatsApp Automatisé

## Vue d'ensemble
Projet Node.js avec un bot WhatsApp automatisé utilisant whatsapp-web.js. Permet d'envoyer des messages WhatsApp via une API REST.

## Date de création
4 novembre 2025

## Fonctionnalités
- 🔐 Authentification WhatsApp via QR code dans la console
- 💾 Sauvegarde de session avec LocalAuth (pas besoin de rescanner le QR à chaque redémarrage)
- 🚀 API REST Express avec endpoint POST `/send-whatsapp`
- 📱 Interface HTML de test pour envoyer des messages
- 📊 Endpoint `/status` pour vérifier l'état de connexion WhatsApp

## Architecture
```
/
├── index.js              # Serveur principal avec bot WhatsApp et Express
├── public/
│   └── index.html        # Interface web de test
├── .wwebjs_auth/         # Dossier de session WhatsApp (auto-généré, ignoré par git)
├── package.json          # Dépendances npm
└── .gitignore           # Fichiers à exclure de git
```

## Dépendances
- **whatsapp-web.js**: Librairie pour interagir avec WhatsApp Web
- **qrcode-terminal**: Affichage du QR code dans le terminal
- **express**: Serveur web
- **body-parser**: Parser JSON pour les requêtes

## Utilisation

### 1. Première connexion
Au démarrage, un QR code s'affichera dans la console. Scannez-le avec WhatsApp :
1. Ouvrez WhatsApp sur votre téléphone
2. Allez dans Menu > Appareils connectés
3. Cliquez sur "Connecter un appareil"
4. Scannez le QR code affiché dans la console

### 2. Envoyer un message via l'interface web
- Ouvrez l'interface web (port 5000)
- Entrez le numéro de téléphone au format international sans le + (ex: 237620704040)
- Tapez votre message
- Cliquez sur "Envoyer le message"

### 3. Envoyer un message via API
```javascript
fetch('/send-whatsapp', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        phone: '237620704040',
        message: 'Bonjour depuis le bot WhatsApp!'
    })
});
```

### 4. Vérifier le statut
```javascript
fetch('/status')
    .then(res => res.json())
    .then(data => console.log(data));
```

## Format du numéro de téléphone
- Format international sans le symbole +
- Exemple Cameroun: 237620704040
- Exemple France: 33612345678

## Endpoints API

### POST /send-whatsapp
Envoie un message WhatsApp
```json
{
  "phone": "237620704040",
  "message": "Votre message ici"
}
```

Réponse succès:
```json
{
  "success": true,
  "message": "Message envoyé avec succès",
  "to": "237620704040",
  "text": "Votre message ici"
}
```

### GET /status
Vérifie si WhatsApp est connecté
```json
{
  "whatsappReady": true,
  "status": "connecté"
}
```

## Logs console
- `🔐 QR CODE WHATSAPP`: QR code à scanner
- `✅ WhatsApp authentifié avec succès !`: Authentification réussie
- `🎉 WhatsApp Client prêt !`: Bot prêt à envoyer des messages
- `✉️ Message envoyé à...`: Confirmation d'envoi de message

## Notes importantes
- La session WhatsApp est sauvegardée dans `.wwebjs_auth/`
- Après la première authentification, le QR code ne s'affichera plus
- Si vous voulez reconnecter un autre compte, supprimez le dossier `.wwebjs_auth/`
- Le serveur écoute sur le port 5000 et accepte toutes les adresses (0.0.0.0)

## Configuration Chromium
Le bot utilise un système de détection automatique de Chromium pour maximiser la portabilité :
1. **Variable d'environnement** : Vérifie d'abord `CHROMIUM_PATH` et valide qu'il existe et est exécutable
2. **Détection système** : Utilise `which chromium-browser || which chromium` pour trouver Chromium dans le PATH
3. **Fallback Puppeteer** : Si aucun Chromium n'est trouvé, utilise le Chromium par défaut de Puppeteer

Les arguments Puppeteer sont ajustés automatiquement :
- Avec Chromium système : inclut `--single-process` pour l'environnement Replit
- Avec Chromium par défaut : utilise uniquement les arguments de base pour compatibilité

## Préférences utilisateur
- Langue: Français
- Format de numéro: International sans +

## Changements récents
- **4 novembre 2025** : Implémentation initiale avec Express, whatsapp-web.js, LocalAuth
- **4 novembre 2025** : Ajout système de détection dynamique de Chromium pour portabilité
- **4 novembre 2025** : Validation des chemins exécutables avec `fs.existsSync()` et `fs.accessSync()`
