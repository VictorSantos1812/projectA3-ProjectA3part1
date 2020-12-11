const authConfig = require("../auth.json");
const jwt = require ('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    const tokenDecodificado = jwt.verify( token, authConfig.secret );
    req.dadosUsuario = {
      login: tokenDecodificado.login,
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
