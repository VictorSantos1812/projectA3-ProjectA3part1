import { Component,  OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit,  OnDestroy{
 tipoUsuario: string;
 private authObserver: Subscription;


  constructor(private userService: UserService){}

  ngOnInit(): void{
    this.authObserver = this.userService.getStatusSubject().subscribe( (authStatus) => {
    })
  }

  ngOnDestroy(): void{
    this.authObserver.unsubscribe();
  }

  onAdicionarUser(form: NgForm){
    if(form.invalid){
      return;
  }
    this.userService.adicionarUser(
    form.value.email,
    form.value.login,
    form.value.senha
  )
    form.reset();
  }
}


