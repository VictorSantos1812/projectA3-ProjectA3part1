import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lembrete } from '../lembrete.model';
import { LembreteService } from '../lembrete.service';
import { UserService } from '../../loginTela/user.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { User } from '../../loginTela/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lembrete-lista',
  templateUrl: './lembrete-lista.component.html',
  styleUrls: ['./lembrete-lista.component.css']
})
export class LembreteListaComponent implements OnInit, OnDestroy {
constructor(private lembreteService: LembreteService,
   private userService: UserService, public router: Router
   ){ }

  lembretes: Lembrete[] = [];
  public idUsuario: string;
  lemUser: User [] = [];
  public totalDeLembretes: number = 0;
  public totalDeLembretesPorPagina: number = 3;
  public paginaAtual: number = 1;
  public opcoesTotalDeLembretesPorPagina: number[] = [3, 5, 10];
  private lembreteSubscription: Subscription;
  public estaCarregando = false;
  public autenticado: boolean = false;
  private authObserver: Subscription;



  ngOnDestroy(): void{
    this.lembreteSubscription.unsubscribe();
    this.authObserver.unsubscribe();
  }

  onDelete(id: string){
    this.estaCarregando = true;
    this.lembreteService.removerLembrete(id).subscribe(() => {
      this.lembreteService.getLembretes(this.totalDeLembretesPorPagina, this.paginaAtual, this.idUsuario);
    });
  }

  ngOnInit(): void {
    this.estaCarregando = true;
    // this.lembreteService.getLem(this.idUsuario);
    this.lembreteService.getLembretes(this.totalDeLembretesPorPagina, this.paginaAtual, this.idUsuario);
    this.idUsuario = this.userService.getIdUser();
    this.lembreteSubscription = this.lembreteService
    .getListaLembretesAtualizadoObservable()
    .subscribe((dados: { lembretes: [], maxLembretes: number}) =>{
      this.getLembretesCriadorId(dados.lembretes);
      this.estaCarregando = false;
      this.lembretes = dados.lembretes;
      this.totalDeLembretes = dados.maxLembretes
    })
    this.autenticado = this.userService.isAutenticado();
    this.authObserver = this.userService.getStatusSubject().subscribe(autenticado => {
      this.autenticado = autenticado
    })

  }

  getLembretesCriadorId(lembrete: Lembrete[]){
    let idUsuario = []
    for (let i in lembrete){
      idUsuario.push(lembrete[i].criador)
    }

    let unique = [... new Set(idUsuario)];
    for (let i in unique){
      this.userService.getLemIdUsuario(unique[i]).subscribe(user =>{
        this.lemUser.push(user.user)
      })
    }
  }

  onPaginaAlterada(dadosPagina: PageEvent) {
    //console.log(dadosPagina);
    this.estaCarregando = true;
    this.paginaAtual = dadosPagina.pageIndex + 1;
    this.totalDeLembretesPorPagina = dadosPagina.pageSize;
    this.lembreteService.getLembretes(this.totalDeLembretesPorPagina, this.paginaAtual, this.idUsuario);
  }

  // getLem(){
  //   this.lembreteService.getLembretes(this.totalDeLembretesPorPagina, this.paginaAtual, this.idUsuario);
  // }






}
