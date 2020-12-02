import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../loginTela/user.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { bcryptjs } from 'bcryptjs';
import { AuthData } from './authData.model';


@Injectable({ providedIn: "root"})
export class UserService {
  private user : User[] = [];
  private listaUserAtualizada = new Subject<User[]>();
  private authStatusSubject = new Subject<boolean>();


  private idUsuario: string;


constructor(private httpClient: HttpClient, private router: Router){
}

public getStatusSubject (){
  return this.authStatusSubject.asObservable();
}

  getUser(): void{
    this.httpClient.get<{mensagem: string, users: any}>('http://localhost:3030/auth/authenticate')
    .pipe(map((dados) => {
      return dados.users.map(user =>{
        return{
          login: user.login,
          senha: user.senha
        }
      })
    }))
    .subscribe((dados)=>{
      this.user = dados.users;
      this.listaUserAtualizada.next([...this.user]);
      return(dados)
    })
  }

  adicionarUser(email: string, login: String, senha: string){
    const user: User ={
      id: null,
      email: email,
      login: login,
      senha: senha
    };
    this.httpClient.post<{mensagem: string, id: string}>('http://localhost:3030/auth/register', user)
  .subscribe((dados) =>{
    console.log(dados.mensagem);
    user.id = dados.id,
    this.user.push(user);
    this.listaUserAtualizada.next([...this.user]);
    this.router.navigate(["/login"]);
  });
    }


    getUsuario(login: string, senha: string , email: string,id: string ){
      return this.httpClient.get<{_id: string, login: String, email: String, senha: String}>
      (`http://localhost:3030/auth/authenticate/`).subscribe(verificar=>{
        let user;
        if(verificar){
          console.log(user)
        }
      })
    }

  verificarUser(login: string, senha: string, id: string){
    const authData: AuthData = {login: login, senha: senha, idUsuario: id}
      this.httpClient.post<{login: string, senha: string, id: string}>
      (`http://localhost:3030/auth/authenticate`, authData).subscribe(resposta =>{
        // this.idUsuario = resposta.id;
        this.authStatusSubject.next(true);
        console.log(resposta)
        this.router.navigate(['/principal']);


      })


    }





}
