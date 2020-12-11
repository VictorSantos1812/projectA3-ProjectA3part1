import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LembreteListaComponent } from './formulario/lembrete/lembrete-lista/lembrete-lista.component';
import { LembreteInserirComponent } from './formulario/lembrete/lembrete-inserir/lembrete-inserir.component';



import { LoginComponent } from './formulario/loginTela/login/login.component';
import { CadastroComponent} from './formulario/loginTela/cadastro/cadastro.component';

import { AuthGuard } from './formulario/loginTela/auth.guard';



const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: CadastroComponent},
  {path: 'principal', component: LembreteListaComponent, canActivate: [AuthGuard] },
  //{path: "/:idUsuario", component: LembreteListaComponent, canActivate: [AuthGuard] },
  {path: 'criar', component: LembreteInserirComponent,  canActivate: [AuthGuard]},
  {path: 'editar/:idLembrete', component: LembreteInserirComponent,  canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
  export class AppRoutingModule{
  }
