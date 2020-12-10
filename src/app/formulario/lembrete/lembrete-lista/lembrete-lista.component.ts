import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lembrete } from '../lembrete.model';
import { LembreteService } from '../lembrete.service';
import { UserService } from '../../loginTela/user.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-lembrete-lista',
  templateUrl: './lembrete-lista.component.html',
  styleUrls: ['./lembrete-lista.component.css']
})
export class LembreteListaComponent implements OnInit, OnDestroy {
constructor(private lembreteService: LembreteService,
   private userService: UserService
   ){ }

  lembretes: Lembrete[] = [];
  public idUsuario: string;
  public totalDeLembretes: number = 0;
  public totalDeLembretesPorPagina: number = 5;
  public paginaAtual: number = 1;
  public opcoesTotalDeLembretesPorPagina: number[] = [5, 10];
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
      this.lembreteService.getLembretes(this.totalDeLembretesPorPagina, this.paginaAtual);
    });
  }

  ngOnInit(): void {
    this.estaCarregando = true;
    this.lembreteService.getLembretes(this.totalDeLembretesPorPagina, this.paginaAtual);
    this.idUsuario = this.userService.getIdUser();
    this.lembreteSubscription = this.lembreteService
    .getListaLembretesAtualizadoObservable()
    .subscribe((dados: { lembretes: [], maxLembretes: number}) =>{
      this.estaCarregando = false;
      this.lembretes = dados.lembretes;
      this.totalDeLembretes = dados.maxLembretes
    })
    this.autenticado = this.userService.isAutenticado();
    this.authObserver = this.userService.getStatusSubject().subscribe(autenticado => {
      this.autenticado = autenticado
    })
  }

  onPaginaAlterada(dadosPagina: PageEvent) {
    //console.log(dadosPagina);
    this.estaCarregando = true;
    this.paginaAtual = dadosPagina.pageIndex + 1;
    this.totalDeLembretesPorPagina = dadosPagina.pageSize;
    this.lembreteService.getLembretes(this.totalDeLembretesPorPagina, this.paginaAtual);
  }




}
