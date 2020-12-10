const express = require('express');
const router = express.Router();
const multer = require ("multer");
const checkAuth = require('../middleware/check-auth');
const Lembrete = require('../models/lembrete');


const MIME_TYPE_EXTENSAO_MAPA = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
}

const armazenamento = multer.diskStorage({
  destination: (req, file, callback) => {
    let e = MIME_TYPE_EXTENSAO_MAPA[file.mimetype] ? null : new Error ('Mime Type Invalido');
    callback (e, "backend/imagens")
  },
  filename: (req, file, callback) => {
    const nome = file.originalname.toLowerCase().split(" ").join('-');
    const extensao = MIME_TYPE_EXTENSAO_MAPA[file.mimetype];
    callback (null, `${nome}-${Date.now()}.${extensao}`);
  }
})


//inserir
router.post('', checkAuth, multer({storage: armazenamento}).single('imagem'), (req, res, next)=>{
  const imagemURL = `${req.protocol}://${req.get('host')}`
  const lembrete = new Lembrete({
    dataPrev: req.body.dataPrev,
    nome: req.body.nome,
    conteudoLembrete: req.body.conteudoLembrete,
    imagemURL:`${imagemURL}/imagens/${req.file.filename}`,
    criador: req.dadosUsuario.id
  })
  lembrete.save()
  .then(lembreteInserido =>{
    res.status(201).json({
      mensagem: 'Lembrete inserido',
      lembrete: {
        id: lembreteInserido._id,
        dataPrev: lembreteInserido.dataPrev,
        nome: lembreteInserido.nome,
        conteudoLembrete: lembreteInserido.conteudoLembrete,
        imagemURL: lembreteInserido.imagemURL
      }
    })
  })
});

//Procurar
router.get('', (req, res, next) => {
  Lembrete.find().then(documents => {
    console.log (documents)
    res.status(200).json({
    mensagem: "Tudo OK",
    lembrete: documents
    });
  })
});

// Deletar
router.delete ('/:id', checkAuth, (req, res, next) => {
  Lembrete.deleteOne({_id:req.params.id, criador: req.dadosUsuario.id})
  .then((resultado)=>{
    if (resultado.n > 0){
      res.status(200).json({ mensagem: "Lembrete removido" })
    }
    else{
      res.status(401).json({mensagem: "Remoção não autorizada"})
    }
  }) .catch(erro => {
    res.status(500).json({
      mensagem: "Remoção falhou. Tente novamente mais tarde."
    })
  })
  });


//Atualização
router.put('/:id', checkAuth, multer({ storage: armazenamento }).single('imagem') , (req, res, next) => {
  let imagemURL = req.body.imagemURL;
  if (req.file){
    const url = req.protocol + "://" + req.get('host');
    imagemURL = url + "/imagens/" + req.file.filename;
  }
  const lembrete = new Lembrete({
    _id: req.params.id,
    dataPrev: req.body.dataPrev,
    nome: req.body.nome,
    conteudoLembrete: req.body.conteudoLembrete,
    imagemURL: imagemURL,
    criador: req.dadosUsuario.id
  });
Lembrete.updateOne({_id:req.params.id, criador: req.dadosUsuario.id}, lembrete)
.then((resultado) =>{
  console.log(resultado);
  if (resultado.nModified > 0){
    res.status(200).json({ mensagem: "Atualização realizada com sucesso" });
  }
  else{
    res.status(401).json({mensagem: "Atualização não permitida"})
  }
}).catch(erro => {
  res.status(500).json({
    mensagem: "Atualização falhou. Tente novamente mais tarde."
  })
})
});

//Procurar Lembrete
router.get('/:id', (req, res, next) =>{
  Lembrete.findById(req.params.id)
  .then(lem =>{
    if(lem)
      res.status(200).json(lem);
    else
      res.status(404).json({mensagem:"Lembrete não encontrado"})
  }) .catch(erro => {
    res.status(500).json({
      mensagem: "Busca por lembrete falhou. Tente novamente mais tarde."
    })
  })
})

router.get("", checkAuth, (req, res, next) =>{
  Lembrete.find({criador: req.dadosUsuario.id}).then((lembretes)=>{
    res.status(200).json(lembretes)
  }).catch((err)=>{
    console.error('Erro de consulta: ', err)
    res.status(500).json({mensagem: " Lembretes não encontrados "})
  })
})






module.exports = router;
