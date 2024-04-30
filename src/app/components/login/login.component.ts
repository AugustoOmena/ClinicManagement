import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  campoEmail = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]);
  email: string = "";
  senha: string = "";
  usuarioAutenticado: boolean = false;
  errorMessage = '';
  errorMessagepass = '';
  loginError = '';
  hide = true;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  confirmarLogin(): void {
    const usuario = {
      email: this.email,
      senha: this.senha
    };

    if (this.errorMessage == '' && usuario.senha.length > 0 && usuario.senha.length < 255){
      this.fazerLogin()
    } 
  }

  fazerLogin(): void {
    const usuario = {
      email: this.email,
      senha: this.senha
    };

    this.http.post<any>('https://localhost:7021/v1/connect/token', usuario).subscribe(
      (response) => {
        const token = response.accessToken;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        if (token) {
          this.http.get('https://localhost:7021/v1/Medicos', { headers }).subscribe(
            () => {
              this.usuarioAutenticado = true;
              localStorage.setItem('access_token', token);
              this.router.navigate(['./home']);
            },
            (error) => {
              this.usuarioAutenticado = false;
              this.loginError = 'Erro de conexão';
            }
          );
        } else {
          this.usuarioAutenticado = false;
          this.loginError = 'Email ou senha inválidos';
        }
      },
      (error) => {
        this.loginError = 'Erro de conexão';
        this.usuarioAutenticado = false;
      }
    );
  }

  UsuarioAutenticado(): boolean {
    return this.usuarioAutenticado;
  }

  updateErrorMessage() {
    if (this.campoEmail.hasError('required')) {
      this.errorMessage = 'Campo email é obrigatório';
    } else if (this.email.length > 255){
      this.errorMessage = 'O email não pode ter mais de 255 caracteres'
    }else if (this.campoEmail.hasError('email')) {
      this.errorMessage = 'Email Inválido';
    } else {
      this.errorMessage = '';
    }
  }

  updateErrorMessagepass() {
    if (this.senha == '') {
      this.errorMessagepass = 'Campo senha é obrigatório';
    } else if (this.senha.length > 255) {
      this.errorMessagepass = 'A senha não deve ter mais que 255 caracteres';
    } else {
      this.errorMessagepass = '';
    }
  }
}
