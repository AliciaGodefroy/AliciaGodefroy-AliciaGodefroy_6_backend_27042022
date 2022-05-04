// Importation de bcrypt pour hasher le mot de passe
const bcrypt = require ('bcrypt');
// Importation de crypto-js pour chiffrer l'email
const cryptojs = require('crypto-js');
// Importation de jsonwebtoken pour les tokens d'authentification
const jwt = require('jsonwebtoken');
// Importation des variables d'environnement
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

// Pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  // On chiffre l'email avant de l'envoyer dans la base de données
  const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY).toString();
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: emailCryptoJs,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// Pour la connexion
exports.login = (req, res, next) => {
  const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY).toString();
  User.findOne({ email: emailCryptoJs })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};