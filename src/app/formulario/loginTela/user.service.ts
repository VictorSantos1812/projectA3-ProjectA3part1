import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../loginTela/user.model';
import { Router } from '@angular/router';
import { map } from "rxjs/operators";



@Injectable({ providedIn: "root"})
export class UserService {
  private token: string;
  private autenticado: boolean = false;
  private authStatusSubject = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private idUser: string;
  private user : User[] = [];
  private listaUserAtualizada = new Subject<User[]>();

constructor(private httpClient: HttpClient, private router: Router){
}

public getStatusSubject (){
  return this.authStatusSubject.asObservable();
}

public isAutenticado (): boolean{
  return this.autenticado;
}

public getToken(): string {
  return this.token;
}

public getIdUser (): string{
  return this.idUser;
}

  getUsers(): void{
    this.httpClient.get<{mensagem: string, users: any}>('http://localhost:3030/auth/authenticate')
    .pipe(map((dados) => {
      return dados.users.map(user =>{
        return{
          id: user.id,
          login: user.login,
          senha: user.senha,
        }
      })
    }))
    .subscribe((users)=>{
      this.user = users,
      this.listaUserAtualizada.next([...this.user]);
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


  getUsuario(idUser: string){
    return this.httpClient.get<{id: string, login: string, email: string, senha: string}> (`http://localhost:3030/auth/authenticate/${idUser}`)
  }


  verificarUser(login: string, senha: string, email: null, idUser: string){
    const user: User = {
      login,
      senha,
      email,
      id: idUser
    }
      this.httpClient.post<{ token: string, expiresIn: number, idUser: string }>
      (`http://localhost:3030/auth/authenticate/`, user).subscribe(resposta =>{
        this.token = resposta.token
        if (this.token){
          const tempoValidadeToken = resposta.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout()
          }, tempoValidadeToken * 1000);
          this.autenticado = true;
          this.idUser = resposta.idUser;
          this.authStatusSubject.next(true);
          this.salvarDadosAutenticacao(
                      this.token,
                      new Date( new Date().getTime() + tempoValidadeToken * 1000),
                      this.idUser
          );
        console.log(resposta);
        this.router.navigate(['/principal']);
      }
    })
  }

      logout(){
        this.token = null;
        this.autenticado = false;
        this.authStatusSubject.next(false)
        clearTimeout(this.tokenTimer);
        this.idUser = null;
        this.removerDadosDeAutenticacao();
        this.router.navigate(['/'])
      }

      private salvarDadosAutenticacao (token: string, validade: Date, idUser: string){
        localStorage.setItem ('token', token);
        localStorage.setItem('validade', validade.toISOString());
        localStorage.setItem('idUser', idUser);
      }

      private removerDadosDeAutenticacao (){
        localStorage.removeItem('token');
        localStorage.removeItem('validade');
        localStorage.removeItem('idUser');
      }

      private obterDadosDeAutenticacao (){
        const token = localStorage.getItem('token');
        const validade = localStorage.getItem('validade');
        const idUser = localStorage.getItem('idUser');
        return (token && validade) ? {token: token, validade: new Date(validade), idUser: idUser}: null;
      }

      autenticarAutomaticamente (){
        const dadosAutenticacao = this.obterDadosDeAutenticacao();
        if (dadosAutenticacao){
          const agora = new Date();
          const diferenca = dadosAutenticacao.validade.getTime() - agora.getTime();
          if (diferenca > 0){
            this.token = dadosAutenticacao.token;
            this.autenticado = true;
            this.idUser = dadosAutenticacao.idUser;
            this.authStatusSubject.next(true);
            this.tokenTimer = setTimeout(() => {
              this.logout()
            }, diferenca);


          }
        }


    }





}
