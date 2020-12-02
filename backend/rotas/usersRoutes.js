const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();



router.post('/register', async (req, res, next) =>{
  const {login} = req.body;
  try{
    if(await User.findOne({login}))
    return res.status(400).send({error: 'User already exists'});

  const user = User({
    email: req.body.email,
    login: req.body.login,
    senha: req.body.senha
  })
  user.save()
  .then(userInserido => {
    res.status(201).json({
      user: user,
      mensagem: "Usuário inserido",
    });
  });
  router.use('', (req, res, next)=>{
  res.status(200).json({user: user});
  });
  }catch{
    return res.status(400).send({ error: 'Registration Falied'});
  }
});
  // router.post('/authenticate ', async (req, res, next)=>{
  //   User.findOne({login: req.body.login, senha: req.body.senha}, function(err, user) {
  //     if(err){
  //       res.json({
  //         type: false,
  //         data: "Error occured: " + err
  //       });
  //     }else{
  //       if(user){
  //         res.json({
  //           type: true,
  //           data: user,
  //           token: user.token
  //         });
  //       }else{
  //         res.json({
  //           type: false,
  //           data: "Incorrect email/password"
  //         })
  //       }
  //     }
  //   });
  // })

  router.post('/authenticate', async (req ,res, next) =>{
    // const {login, senha} = req.body;
    let user ;
    User.findOne({login: req.body.login}).then(u =>{
      if(!u){
        return res.status(400).send({error: 'User not found'});
      }
    user = u;
    return(req.body.senha, u.senha);
    }).then( result =>{
      if(!result){
         return res.status(400).send({error: 'Invalid Password'});
      }
    });
    res.send(user);
  });

router.get('/register', async (req, res, next) =>{
  User.find().then(documents =>{
    res.status(200).json({
      mensagem:"Tudo OK",
      user: documents
    });
  });
});

router.get("/:id", (req, res, next) =>{
  User.findOne(req.params.login && req.params.senha).then(user =>{
    if(user)
    res.status(200).json(user);
    else
    res.status(404).json({mensagem:"User not found"});
  });
});


// router.post('/register', async (req, res, next) =>{
//   try{
//     const user = await User.create(req.body);

//     return res.send({user})

//   }catch (err){

//     return res.status(400).send({ error: 'Registration Falied'});
//   }
// });

module.exports = app => app.use("/auth",router);

