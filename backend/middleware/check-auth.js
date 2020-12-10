// const jwt = require("jsonwebtoken");

const authConfig = require("../auth.json");

// module.exports = (req, res, next) =>{
//   const authHeader = req.headers.authorization;

//   if(!authHeader){
//     return res.status(401).send({ error: "no Token provided" });
//   }

//   const parts = authHeader.split( ' ' );
//   if(!parts.length == 2){
//     return res.status(401).send({ error: "Token error" })
//   }

//   const [ scheme, token] = parts;

//   if(!/^Bearer$/i.test(scheme)){
//     return res.status(401).send({ error: "Token malformatted" });
//   }

//   jwt.verify(token, authConfig.secret, (err, decoded) =>{
//     if(err)
//     return res.status(401).send({ error: "Token Invalid" });

//     req.userId = decoded.id;
//     next();
//   })

// }

const jwt = require ('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    //req.headers.authorizations = Bearer fkjelwjaçlkfjewaçfewlj
    const token = req.headers.authorization.split(" ")[1];
    const tokenDecodificado = jwt.verify( token, authConfig.secret );
    req.dadosUsuario = {
      id: tokenDecodificado.id
    }
    next()
  }
  catch (err){
    res.status(401).json({
      mensagem: "Autenticação não autorizada."
    })
  }
}
