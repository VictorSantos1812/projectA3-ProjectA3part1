import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Lembrete } from '../lembrete.model';

import { LembreteService } from '../lembrete.service';
import { mimeTypeValidator } from './mime-type.validator';

@Component({
  selector: 'app-lembrete-inserir',
  templateUrl: './lembrete-inserir.component.html',
  styleUrls: ['./lembrete-inserir.component.css']
})
export class LembreteInserirComponent implements OnInit{

  private modo: string = "criar";
  private idLembrete: string;
  public lembrete: Lembrete;
  public estaCarregando: boolean = false;
  form: FormGroup;
  previewImagem: string;


  ngOnInit(){
    this.form = new FormGroup({
      dataHoje: new FormControl(null, {
        validators: [Validators.required]
      }),
      dataPrev: new FormControl (null, {
        validators: [Validators.required]
      }),
      nome: new FormControl(null,{
        validators: [Validators.required, Validators.minLength(3)]
      }),
      conteudoLembrete: new FormControl (null,{
        validators: []
      }),
      imagem: new FormControl(null, {
        validators: [],
        asyncValidators: [mimeTypeValidator]
      }),
    })

    this.route.paramMap.subscribe((paramMap: ParamMap)=> {
      if (paramMap.has("idLembrete")){
        this.modo = "editar";
        this.idLembrete = paramMap.get("idLembrete");
        this.estaCarregando = true;
        this.lembreteService.getLembrete(this.idLembrete).subscribe(dadosLem =>{
          this.estaCarregando = false;
          this.lembrete={
            id: dadosLem._id,
            dataHoje: dadosLem.dataHoje,
            dataPrev: dadosLem.dataPrev,
            nome: dadosLem.nome,
            conteudoLembrete: dadosLem.conteudoLembrete,
            imagemURL: dadosLem.imagemURL,
            criador: dadosLem.criador
          },
          this.form.setValue({
          dataHoje: this.lembrete.dataHoje,
          dataPrev: this.lembrete.dataPrev,
          nome: this.lembrete.nome,
          conteudoLembrete: this.lembrete.conteudoLembrete,
          imagem: this.lembrete.imagemURL
        });

        })
      }
      else{
        this.modo = "criar";
        this.idLembrete = null;
      }
    });
  }

  constructor(public lembreteService: LembreteService, public route: ActivatedRoute){}


  onSalvarLembrete(){
    if(this.form.invalid){
      return;
    }
    this.estaCarregando = true;
    if(this.modo === "criar"){
      this.lembreteService.adicionarLembrete(
        this.form.value.dataHoje,
        this.form.value.dataPrev,
        this.form.value.nome,
        this.form.value.conteudoLembrete,
        this.form.value.imagem
      );
    }
    else{
      this.lembreteService.atualizarLembrete(
        this.idLembrete,
        this.form.value.dataHoje,
        this.form.value.dataPrev,
        this.form.value.nome,
        this.form.value.conteudoLembrete,
        this.form.value.imagem,
      )
    }
    this.form.reset();
  }

  onImagemSelecionada(event: Event){
    const arquivo = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'imagem': arquivo});
    this.form.get('imagem').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
    this.previewImagem = reader.result as string;
    }
    reader.readAsDataURL(arquivo);
  }
}
