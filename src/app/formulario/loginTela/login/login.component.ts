import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { User } from "../user.model";

import { UserService } from '../user.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private modo: string = "login";
  public users: User;
  login: string;
  senha: string;
  form: FormGroup;

 private idUser: string;

  ngOnInit(){
    this.form = new FormGroup({
      login: new FormControl (null, {
        validators: [Validators.required]
      }),
      senha: new FormControl(null,{
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("idUser")){
        this.idUser = paramMap.get("idUser");
        this.userService.getUsuario(this.idUser).subscribe(dadosUser =>{
          this.users ={
            id: dadosUser.id,
            login: dadosUser.login,
            email:dadosUser.email,
            senha: dadosUser.senha
          }
        })
      }
    })
  }



constructor(public userService: UserService, public route: ActivatedRoute){}

  onFazerLogin(){
    this.userService.verificarUser(
      this.form.value.login,
      this.form.value.senha,
      this.form.value.email,
      this.form.value.id
   );


   }
}
