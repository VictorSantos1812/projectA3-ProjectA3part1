const moongose = require ('mongoose');

const lembreteSchema = moongose.Schema({
  dataHoje: {type: Date, default:Date.now},
  dataPrev: {type: String, require:true},
  nome: {type: String, require:true},
  conteudoLembrete: {type: String, require:false},
  imagemURL: {type: String, require: false},
  criador: { type: moongose.Schema.Types.ObjectId, ref: 'User', require: true }
})

module.exports = moongose.model('Lembrete', lembreteSchema);
