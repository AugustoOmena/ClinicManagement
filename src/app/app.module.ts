import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MedicosComponent } from './components/medicos/medicos.component';
import { CreateService } from './components/medicos/services/createmedico.service';
import { EditService } from './components/medicos/services/editmedico.service';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { LoginComponent } from './security/login/login.component';
import { LoginService } from './security/login/login.service';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
  ],
  providers: [
    LoginService,
    CreateService,
    EditService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
