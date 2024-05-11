import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MedicosComponent } from './components/medicos/medicos.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { IsLoggedInGuard } from './security/loggedin.guard';
import { LoginComponent } from './security/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [IsLoggedInGuard]},
  { path: 'pacientes', component: PacientesComponent, canActivate: [IsLoggedInGuard]},
  { path: 'medicos', component: MedicosComponent, canActivate: [IsLoggedInGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
