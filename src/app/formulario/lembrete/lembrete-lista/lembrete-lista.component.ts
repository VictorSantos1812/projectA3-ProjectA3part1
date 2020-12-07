import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Lembrete } from '../lembrete.model';
import { LembreteService } from '../lembrete.service';
import { UserService } from '../../loginTela/user.service';
import { User } from "../../loginTela/user.model"
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-lembrete-lista',
  templateUrl: './lembrete-lista.component.html',
  styleUrls: ['./lembrete-lista.component.css']
})
export class LembreteListaComponent implements OnInit, OnDestroy {

  lembretes: Lembrete[] = [];
  private idUsuario: string
  private lembreteSubscription: Subscription;
  public estaCarregando = false;
  public userService = UserService;

  constructor(public lembreteService: LembreteService, public route: ActivatedRoute){}

  ngOnDestroy(): void{
    this.lembreteSubscription.unsubscribe();
  }

  onDelete (id: string): void{
    this.lembreteService.removerLembrete(id);
    }

  ngOnInit(): void {
    this.lembreteService.getLembretes();
    this.lembreteSubscription = this.lembreteService
    .getListaLembretesAtualizadoObservable()
    .subscribe((lembretes: Lembrete[]) =>{
      this.estaCarregando = false;
      this.lembretes = lembretes;
    });

    // this.route.paramMap.subscribe((paramMap: ParamMap)=>{
    //   if(paramMap.has("idUsuario")){
    //     this.idUsuario = paramMap.get("idUsuario");
    //     this.userService.getUsuario(this.idUsuario).subscribe(dadosUser =>{
    //       this.user={
    //         id: dadosUser.id,
    //         email: dadosUser.email,
    //         login: dadosUser.login,
    //         senha: dadosUser.senha
    //       }
    //     })
    //   }});

  }




}
