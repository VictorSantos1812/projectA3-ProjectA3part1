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
  public user: User;
  login: string;
  senha: string;
  form: FormGroup;

  ngOnInit(){
    this.form = new FormGroup({
      login: new FormControl (null, {
        validators: [Validators.required]
      }),
      senha: new FormControl(null,{
        validators: [Validators.required]
      })
    })

    // this.route.paramMap.subscribe((paramMap: ParamMap)=>{
    //   if(paramMap.has("loginUser")){
    //     this.modo = "login";
    //     this.loginUser = paramMap.get("loginUser");
    //     this.userService.getUsuario(this.loginUser).subscribe(dadosUser =>{
    //       this.user={
    //         id: dadosUser.id,
    //         email: dadosUser.email,
    //         login: dadosUser.login,
    //         senha: dadosUser.senha
    //       }
    //     })
    //   }
    }




constructor(public userService: UserService, public route: ActivatedRoute){}

  onFazerLogin(){
    this.userService.verificarUser(
      this.form.value.login,
      this.form.value.senha,
      this.form.value.id
   );


   }

//  onVerificar(){
//      this.userService.getUsuario(
//       this.form.value.login,
//       this.form.value.senha,
//       this.form.value.email,
//       this.form.value.id
//      )
// }


}
