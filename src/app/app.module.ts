import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// import { ErroInterceptor } from './erro-interceptor';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'


import { AuthInterceptor } from './formulario/loginTela/auth-interceptor';
import { AppComponent } from './app.component';
import { CabecalhoComponent } from './formulario/cabecalho/cabecalho.component';
import { LembreteListaComponent } from './formulario/lembrete/lembrete-lista/lembrete-lista.component';
import { LembreteInserirComponent } from './formulario/lembrete/lembrete-inserir/lembrete-inserir.component';
import { LoginComponent } from './formulario/loginTela/login/login.component';
import { CadastroComponent } from './formulario/loginTela/cadastro/cadastro.component';
import { MatPaginatorModule } from '@angular/material/paginator';

import { LembreteService } from './formulario/lembrete/lembrete.service';
import { AppRoutingModule } from './app-routing.module';
import { CabecalhoLoginComponent } from './formulario/loginTela/cabecalho-login/cabecalho-login.component';
import { UserService } from './formulario/loginTela/user.service';
import { ErroComponent } from './erro/erro/erro.component';


@NgModule({
  declarations: [
    AppComponent,
    CabecalhoComponent,
    LembreteListaComponent,
    LembreteInserirComponent,
    LoginComponent,
    CadastroComponent,
    CabecalhoLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS, useClass: ErroInterceptor, multi: true}
],
  bootstrap: [AppComponent],
  entryComponents: [ErroComponent]
})
export class AppModule { }
