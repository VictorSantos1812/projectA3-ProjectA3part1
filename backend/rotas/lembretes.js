const express = require('express');
const router = express.Router();
const multer = require ("multer");


const Lembrete = require('../models/lembrete');


const MIME_TYPE_EXTENSAO_MAPA = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
}

const armazenamento = multer.diskStorage({
  //requisição, arquivo extraido e uma função a ser
  //executada, capaz de indicar um erro ou devolver
  //o diretório em que as fotos ficarão
  destination: (req, file, callback) => {
  callback(null, "backend/imagens")
  },
  filename: (req, file, callback) =>{
    const nome = file.originalname.toLowerCase().split("").join("-");
    const extensao = MIME_TYPE_EXTENSAO_MAPA[file.mimetype];
    callback(null,`${nome}-${Date.now()}.${extensao}`);
  },
  destination:(req, file, callback) =>{
    let e = MIME_TYPE_EXTENSAO_MAPA[file.mimetype] ? null: new Error('Mime Type Invalido');
    callback(e, "backend/imagens")
  },
 })


//inserir
router.post('', multer({storage: armazenamento}).single('imagem'), (req, res, next)=>{
  const imagemURL = `${req.protocol}://${req.get('host')}`
  const lembrete = new Lembrete({
    //dataHoje: req.body.dataHoje,
    dataPrev: req.body.dataPrev,
    nome: req.body.nome,
    conteudoLembrete: req.body.conteudoLembrete,
    imagemURL:`${imagemURL}/imagens/${req.file.filename}`
  })
  lembrete.save()
  .then(lembreteInserido =>{
    res.status(201).json({
      mensagem: 'Lembrete inserido',
      //id: lembreteInserido._id
      lembrete: {
        id: lembreteInserido._id,
        //dataHoje: lembreteInserido.dataHoje,
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
router.delete ('/:id', (req, res, next) => {
  console.log("id: ", req.params.id);
  Lembrete.deleteOne({_id:req.params.id}).then((resultado)=>{
    console.log(resultado);
    res.status(200).json({mensagem:"Lembrete Removido"})
  });
});

//Atualização
router.put("/:id", (req, res, next) => {
  const lembrete = new Lembrete({
    _id: req.params.id,
   // dataHoje: req.body.dataHoje,
    dataPrev: req.body.dataPrev,
    nome: req.body.nome,
    conteudoLembrete: req.body.conteudoLembrete,
  });
Lembrete.updateOne({_id:req.params.id}, lembrete)
.then((resultado) =>{
  console.log(resultado);
});
res.status(200).json({mensagem: 'Atualização realizada com sucesso'})
});

//Procurar Lembrete
router.get('/:id', (req, res, next) =>{
  Lembrete.findById(req.params.id).then(lem =>{
    if(lem)
      res.status(200).json(lem);
    else
      res.status(404).json({mensagem:"Lembrete não encontrado"})
  })
})







module.exports = router;
