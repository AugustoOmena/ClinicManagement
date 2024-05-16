import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { FormatValidator } from '../../shared/formatcorrect/format';
import { Usuario } from '../Models/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent {
  usuarios: Usuario[] = [];
  actionSelected: string = '';
  messageCreate: string = '';
  usuario!: Usuario

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private correctFormat: FormatValidator) {}

  AcaoUsuarioForm!: FormGroup

  fetchUsuarios(): void {
    this.usuarioService.fetchUsuarios()?.subscribe(value => {
      this.usuarios = value;
    })
  }

  ngOnInit(): void {
    this.registerUsuarioReset()
  }

  registerUsuarioReset() {
    this.AcaoUsuarioForm = this.fb.group({
      nome: this.fb.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      email: this.fb.control('', [Validators.required, Validators.maxLength(255), this.correctFormat.isValidEmail.bind(this)]),
      perfil: this.fb.control('', [Validators.required,  this.correctFormat.validatePerfil.bind(this)]),
    });
  }

  create() {
    if (this.AcaoUsuarioForm.invalid) {
      return;
    }
    this.usuario = this.AcaoUsuarioForm.value;
    this.usuarioService.cadastro(this.usuario).pipe(
      catchError(error => {
        this.messageCreate = error;
        this.clearInputs()
        return '';
      })
    ).subscribe(
      () => {
        this.messageCreate = 'Paciente cadastrado com sucesso';
      }
    );
  }

  clearInputs(): void {
    //reiniciando o formulário para usar novamente
    this.registerUsuarioReset();
    setTimeout(() => this.messageCreate = '', 5000);
  }
}
