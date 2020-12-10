import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../loginTela/user.service';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit, OnDestroy {

  private authObserver: Subscription;
  public autenticado: boolean = false;
  constructor(
    private userService: UserService
  ) { }

  ngOnDestroy(){
    this.authObserver.unsubscribe();
  }

  ngOnInit(): void {
    this.autenticado = this.userService.isAutenticado();
    this.authObserver = this.userService.getStatusSubject().subscribe(autenticado=>{
      this.autenticado = autenticado;
    })

  }

  onLogout(){
    this.userService.logout();
  }

}
