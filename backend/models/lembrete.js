const moongose = require ('mongoose');


const lembreteSchema = moongose.Schema({
  dataHoje: {type: Date, default:Date.now},
  dataPrev: {type: String, required:true},
  nome: {type: String, required:true},
  conteudoLembrete: {type: String, required:false},
  imagemURL: {type: String, required: false},
  idUsuario: { type: moongose.Schema.Types.ObjectId, ref: 'User', require: true }
})

module.exports = moongose.model('Lembrete', lembreteSchema);
