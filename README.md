# P6 OpenClassrooms - API Backend Hot Takes pour la marque Piiquante

Contruction d'une API sécurisée pour une application d'avis gastronomiques

## Pour tester l'application

1. Clôner le frontend de l'application disponible ici : https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6
2. Ouvrez un terminal et executez __npm install__ et __npm start__ à partir du répertoire du projet 
3. Clôner le backend disponible sur le repository actuel 📍
4. Lancer le backend en exécutant __npm intall__ et __node server__

## Mesures de sécurité mises en place sur l'API 

* Hashage du mot de passe utilisateur avec bcrypt
* Manipulation sécurisée de la base de donnée Mongoose
* Vérification que l’email utilisateur est unique dans la base de donnée avec mongoose-unique-validator
* Utilisation des variables d’environnement pour les données sensibles avec dotenv
* Authentification de l’utilisateur par Token avec jsonwebtoken
* Protection contre les attaques par brute-force avec express-rate-limit
* Protection des headers avec helmet (problème photo) 🆘
* Token d’authentification stocké dans un cookie côté client avec express-session 🆘