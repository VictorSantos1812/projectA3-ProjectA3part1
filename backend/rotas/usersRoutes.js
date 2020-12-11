const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken");
const User = require('../models/user');
const authConfig = require('../auth');
const router = express.Router();

router.post('/authenticate', (req, res, next)=>{
  let user;
  User.findOne({login: req.body.login}).then(u =>{
  if(!u){
    return res.status(401).json({
      mensagem:"Login Inválido"
    })
  }
user = u;
return bcrypt.compare(req.body.senha, u.senha);
})
.then(result => {
  if(!result){
    return res.status(401).json({
    mensagem: "Senha inválida"
    })
  }
  const token = jwt.sign(
    { id: user._id },
    authConfig.secret,
    {expiresIn: '24h'}
  )
  res.status(200).json({token: token, expiresIn: 86400, idUsuario: user._id});
})
.catch (err => {
  return res.status(401).json({
    mensagem: "Erro no login. Tente novamente mais tarde."
  })
})
});

// router.post('/register', (req, res, next) =>{
//     const user = new User({
//       email: req.body.email,
//       login: req.body.login,
//       senha: req.body.senha
//     })
//     user.save()
//     .then(()=>{
//       res.status(200).json({ mensagem: "Tudo ok", hash: hash });
//     })
//     .catch((err)=>{
//       res.status(500).json({mensagem: "Erro com as credenciais.", erro: JSON.stringify(err)})
//     })

// })

// function generateToken(params = {}){
//  return jwt.sign( params , authConfig.secret, {
//     expiresIn: 3600,
//   });
// }


router.post('/register', async (req, res, next) =>{
  const {login} = req.body;
  try{

    if(await User.findOne({login}))
    return res.status(400).send({error: 'User already exists'});

    const user = await User.create(req.body);

    res.send({
      user,
      // token: generateToken({ id: user.id })
    });
  }catch{
    return res.status(400).send({ error: 'Registration Falied'});
  }
});

// router.get("/authenticate/:id", (req,res,next)=>{
//   User.findOne({criador: req.body.id}).then((prof)=>{
//     if(prof){
//       res.status(200).json({
//         user: prof
//       })
//     }else{
//       res.status(404).json({ message: "Profile not found!" });
//     }
//   })
// })




  // router.post('/authenticate', async (req ,res, next) =>{
  //   const {login, senha} = req.body;

  //   console.log (login);
  //   const user = await User.findOne({login}).select("+senha")
  //   console.log (user);

  //   if(!user)
  //     return res.status(400).send({error: 'User not found'});

  //   if(!await bcrypt.compare(senha, user.senha))
  //     return res.status(400).send({error: 'Invalid Password'});

  //   if(user)
  //   user.senha = undefined;

  //   res.send({
  //     user,
  //     token: generateToken({ id: user.id })
  //   });
  // });




// router.delete("/authenticate/:id",(req, res, next) =>{
//   console.log(req.params);
//   res.status(200).end();
// })


module.exports = router

