import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import './home.component.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  token!: string;
  private isLoggedIn: boolean = false;
  isMenuOpen = false;
  errorVisible: boolean = false;
  medico: boolean = true;
  paciente: boolean = false;
  componenteAtivo: string = 'medicos';

  constructor(
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.loadScript('myscript.js');
    if (typeof localStorage !== 'undefined' && localStorage.getItem('access_token')) {
      this.token = localStorage.getItem('access_token')!;
      this.verifyToken();
    }
    this.verifyToken();
  }

  private loadScript(scriptUrl: string) {
    const scriptElement = document.createElement('script');
    scriptElement.src = scriptUrl;
    scriptElement.type = 'text/javascript';
    document.body.appendChild(scriptElement);
  }

  verifyToken() {
    if (this.token) {
      const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));

      const expiresIn = tokenPayload.exp * 1000 - Date.now();
      if (expiresIn > 0) {
        //const expiresInSec = Math.round(expiresIn / 1000);
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
        this.errorVisible = true;
      }
    } else {
      this.isLoggedIn = false;
      this.errorVisible = true;
    }
  }

  IsLoggedIn() {
    return this.isLoggedIn;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  pacientesOn(): void {
    this.paciente = true;
    this.medico = false;
  }

  medicosOn(): void {
    this.medico = true;
    this.paciente = false;
  }

  mostrarComponente(componente: string) {
    this.componenteAtivo = componente;
  }
}
