import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { Lembrete } from './lembrete.model';
import { User } from '../loginTela/user.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../loginTela/user.service';


@Injectable({ providedIn: 'root' })
export class LembreteService {
  public user: UserService;
  private lembretes: Lembrete [] = [];
  private listaLembretesAtualizado = new Subject<{lembretes: Lembrete[], maxLembretes: number}>();


  constructor(private httpClient: HttpClient, private router: Router, public userService: UserService){};

getLem(idUsuario: string):void{
  let userData: User = {
    id: idUsuario,
    login: null,
    email: null,
    senha: null
  }
  this.httpClient.patch(`http://localhost:3030/api/principal/${idUsuario}`, userData)
}
getLembretes(pagesize: number, page: number,): void {
  const parametros = `?pagesize=${pagesize}&page=${page}`;
    this.httpClient.get <{mensagem: string, lembrete:any, maxLembretes: number}>(
      `http://localhost:3030/api/principal${parametros}`
    )
    .pipe(map((dados) => {
      return {
        lembretes: dados.lembrete.map(lembrete => {
        return {
          id:lembrete._id,
          dataHoje: lembrete.dataHoje,
          dataPrev: lembrete.dataPrev,
          nome: lembrete.nome,
          conteudoLembrete: lembrete.conteudoLembrete,
          imagemURL: lembrete.imagemURL,
          criador: lembrete.criador
        }
      }),
      maxLembretes: dados.maxLembretes
    }
    }))
    .subscribe((dados) =>{
      console.log(dados)
      this.lembretes = dados.lembretes,
      this.listaLembretesAtualizado.next({lembretes: [...this.lembretes], maxLembretes: dados.maxLembretes});
    });
  }



  removerLembrete (id: string){
   return this.httpClient.delete(`http://localhost:3030/api/principal/${id}`)
  };


  getListaLembretesAtualizadoObservable(){
    return this.listaLembretesAtualizado.asObservable();
  }

  getLembrete (idLembrete: string){
    return this.httpClient.get<{ _id: string, dataHoje: String, dataPrev: String, nome: string, conteudoLembrete: string, imagemURL: string, criador: string}>
    (`http://localhost:3030/api/principal/${idLembrete}`);
  }

  atualizarLembrete(id:string, dataHoje: string, dataPrev: string, nome: string, conteudoLembrete: string, imagem: File | string){
    let lembreteData: Lembrete | FormData;
    if(typeof(imagem) === 'object'){
      lembreteData = new FormData();
      lembreteData.append("id", id);
      lembreteData.append("dataHoje", dataHoje);
      lembreteData.append("dataPrev", dataPrev);
      lembreteData.append("nome", nome);
      lembreteData.append("conteudoLembrete", conteudoLembrete)
      lembreteData.append("imagem", imagem)
    }else{
      lembreteData = {
        id: id,
        dataHoje: dataHoje,
        dataPrev: dataPrev,
        nome: nome,
        conteudoLembrete: conteudoLembrete,
        imagemURL: imagem,
        criador: null
      }
    }
    // const lembrete: Lembrete = {id, dataHoje, dataPrev, nome, conteudoLembrete, imagemURL};
    this.httpClient.put(`http://localhost:3030/api/principal/${id}`, lembreteData)
    .subscribe((res => {
      this.router.navigate(['/principal']);
    }));
  }

adicionarLembrete(dataHoje: string, dataPrev: string, nome:string, conteudoLembrete: string, imagem: File){
    //   const lem: Lembrete = {
    //   id: null,
    //   dataHoje: dataHoje,
    //   dataPrev: dataPrev,
    //   nome: nome,
    //   conteudoLembrete: conteudoLembrete
    // };
    const dadosLem = new FormData();
      dadosLem.append("dataHoje", dataHoje);
      dadosLem.append('dataPrev', dataPrev);
      dadosLem.append('nome', nome);
      dadosLem.append('conteudoLembrete', conteudoLembrete);
      dadosLem.append('imagem', imagem);

    this.httpClient.post<{mensagem: string, lembrete: Lembrete}>('http://localhost:3030/api/principal', dadosLem).subscribe((dados) => {
      this.router.navigate(['/principal']);
      })




}}
