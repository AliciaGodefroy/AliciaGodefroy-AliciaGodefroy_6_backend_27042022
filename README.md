# P6 OpenClassrooms - API Backend Hot Takes pour la marque Piiquante

Contruction d'une API sécurisée pour une application d'avis gastronomiques

## Pour tester l'application

1. Clôner le frontend de l'application disponible ici : https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6
2. Ouvrez un terminal et executez __npm install__ et __npm start__ à partir du répertoire du projet 
3. Clôner le backend disponible sur le repository actuel 📍
4. Lancer le backend en exécutant __npm intall__ et __node server__

## Mesures de sécurité mises en place sur l'API 

* Hashage du mot de passe utilisateur avec __bcrypt__
* Chiffrage des emails utilisateurs dans la base de données avec __crypto-js__
* Manipulation sécurisée de la base de donnée __Mongoose__
* Vérification que l’email utilisateur est unique dans la base de donnée avec __mongoose-unique-validator__
* Utilisation des variables d’environnement pour les données sensibles avec __dotenv__
* Authentification de l’utilisateur par Token avec __jsonwebtoken__
* Protection contre les attaques par brute-force avec __express-rate-limit__
* Protection des headers avec __helmet__ (problème photo) 🆘
* Token d’authentification stocké dans un cookie côté client avec __express-session__ 🆘