const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

// LOGIQUE METIER

const Sauce = require ('../models/sauce');
const fs = require('fs');

//Pour créer un objet
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//Pour modifier un objet
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((data)=> {
    if (data.userId == req.body.userId) {
      // console.log("meme user it's good")
      const sauceObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
    }
    else {
      res.status(401).json({ message: "Vous n'avez pas la permission !"})
    }
  })
  

  
};

//Pour supprimer un objet
exports.deleteSauce = (req, res, next) => {
  // console.log('req.header', req.headers.authorization)
  // recuperer le token dans la chaine de string (enlever le mot bearer et l'espace)
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const decodedUserId = decodedToken.userId;
  Sauce.findOne({ _id: req.params.id }).then((data)=>{
    if (data.userId == decodedUserId) {
      // console.log('data.userId', data.userId)
      // console.log('decodedUserId', decodedUserId)
      Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
    } 
    else {
      res.status(401).json({ message: "Vous n'avez pas la permission !"})
    }
  })
};

//Pour récupérer un seul objet
exports.getOneSauce = (req, res, next) => { //.get et non .use pour indiquer que ce sont uniquement les requêtes GET que nous allons intercepter à ce moment là avec ce middleware
    Sauce.findOne({ //Pour trouver un seul objet - On veut que l'id soit le même que le paramêtre de requête
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
}

//Pour récupérer tous les objets 
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces); //On récupère le tableau de tous les things retournés par la base
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
}

// Pour ajouter/retirer un like ou un dislike
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like // On récupère le nombre de likes
  let userId = req.body.userId // On récupère l'userId
  let sauceId = req.params.id // On récupère l'id de la sauce

  // Utilisation de la structure conditionnelle Switch/Case 
  //(qui permet de sélectionner un ensemble d’instructions à exécuter 
  //en fonction de la valeur d’une variable)
  
  switch (like) {
    case 1 : // Pour ajouter un like 
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }}) // On utilise la fonction updateOne() pour mettre à jour le like de l'userId sur la sauceId
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;

    case 0 : // Pour retirer un like ou un dislike
        Sauce.findOne({ _id: sauceId })
           .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 : // Pour ajouter un dislike
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }}) // On utilise la fonction updateOne() pour mettre à jour le dislike de l'userId sur la sauceId
          .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
}