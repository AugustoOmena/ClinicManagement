import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isMenuOpen = false;
  componenteAtivo: string = 'medicos';

  constructor() { }

  ngOnInit(): void {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  mostrarComponente(componente: string) {
    this.componenteAtivo = componente;
  }
}
