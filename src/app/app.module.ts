import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MedicosComponent } from './components/medicos/medicos.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { ParceirosComponent } from './components/parceiros/parceiros.component';
import { MedicoService } from './components/services/medico.service';
import { PacienteService } from './components/services/paciente.service';
import { ParceiroService } from './components/services/parceiro.service';
import { UsuarioService } from './components/services/usuario.service';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LoginComponent } from './security/login/login.component';
import { LoginService } from './security/login/login.service';
import { FormatValidator } from './shared/formatcorrect/format';
import { InputComponent } from './shared/input/input.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MedicosComponent,
    PacientesComponent,
    InputComponent,
    SidebarComponent,
    UsuariosComponent,
    ParceirosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
  ],
  providers: [
    LoginService,
    MedicoService,
    PacienteService,
    UsuarioService,
    FormatValidator,
    ParceiroService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
