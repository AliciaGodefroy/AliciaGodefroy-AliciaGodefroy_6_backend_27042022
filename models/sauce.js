const mongoose = require('mongoose');

//Création d'un schéma de données avec les informations d'on chaque objet aura besoin
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: true },
  usersDisliked:{ type: [String], required: true },
});

//Export du modèle afin de pouvoir l'utiliser pour intéragir avec notre base de données MongoDB
module.exports = mongoose.model('Sauce', sauceSchema);