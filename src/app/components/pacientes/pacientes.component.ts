import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { FormatValidator } from '../../shared/formatcorrect/format';
import { Paciente } from '../Models/paciente.model';
import { PacienteService } from '../services/paciente.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
})
export class PacientesComponent implements OnInit {
  title = 'Estudos.Augusto.Front';
  pacientes: Paciente[] = [];
  paciente!: Paciente;
  selectedPacienteId:any;

  messageCreate: string = '';
  messageEdit: string = '';
  messageDelete: string = '';
  actionSelected: string = '';

  constructor(private fb: FormBuilder,
              private pacienteService: PacienteService,
              private correctFormat: FormatValidator) {}

  AcaoPacienteForm!: FormGroup

  selectToDeleteId: string = '';

  ngOnInit(): void {
    this.registerPacienteReset()
  }

  registerPacienteReset() {
    this.AcaoPacienteForm = this.fb.group({
      nome: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      cpf: this.fb.control('', [Validators.required, Validators.maxLength(14), this.correctFormat.isValidCPF.bind(this)]),
      telefone: this.fb.control('', [Validators.required, Validators.minLength(14), Validators.maxLength(20), this.correctFormat.validateTelefone.bind(this)]),
      medicoId: this.fb.control('', [Validators.required, Validators.pattern('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}')]),
    });
  }


  formatTelefone(event: any) {
    let telefone = event.target.value.replace(/\D/g, '');
    if (telefone.length > 0) {
        telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
        telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    event.target.value = telefone;
  }

  formatCPF(event: any) {
    let cpf = event.target.value.replace(/\D/g, '');
    if (cpf.length > 0) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    event.target.value = cpf;
  }

  selectCreate() {
    this.actionSelected = 'create';
  }

  fetchPacientes(): void {
    this.pacienteService.fetchPacientes()?.subscribe(value => {this.pacientes = value;})
  }

  selectToDelete(id: string) {
    this.selectToDeleteId = id;
  }

  deletePaciente(): void {
    this.pacienteService.deletePaciente(this.selectToDeleteId).subscribe({
      next: (message: string) => {
        this.messageDelete = message;
        this.clearInputs()
      },
      error: (error: any) => {
        this.messageDelete = error;
        this.clearInputs()
      }
    });
  }

  selectToEditPaciente(paciente : Paciente) {
  this.selectedPacienteId = paciente.id;
  this.actionSelected = 'edit';

  this.AcaoPacienteForm = this.fb.group({
    nome: this.fb.control(`${paciente.nome}`, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    cpf: this.fb.control(`${paciente.cpf}`, [Validators.required, Validators.maxLength(14), this.correctFormat.isValidCPF.bind(this)]),
    telefone: this.fb.control(`${paciente.telefone}`, [Validators.required, Validators.minLength(14), Validators.maxLength(20)]),
    medicoId: this.fb.control('', [Validators.required, Validators.pattern('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}')]),
  });
  }

  create() {
    if (this.AcaoPacienteForm.invalid) {return}
    
    this.paciente = this.AcaoPacienteForm.value;

    this.pacienteService.cadastro(this.paciente).pipe(
      catchError(error => {
        return throwError(() => this.messageCreate = `${error}`);
      })
    ).subscribe(
      () => {
        this.messageCreate = 'Cadastrado com sucesso';
        this.clearInputs();
      }
    );
  }
  

  editPaciente(): void {
    if (this.AcaoPacienteForm.invalid) {return}

    this.paciente = this.AcaoPacienteForm.value;

    this.paciente.id = this.selectedPacienteId;

    this.pacienteService.edit(this.paciente).pipe(
      catchError(errorResponse => {

        if (errorResponse.status === 404) { this.messageEdit = 'Médico não encontrado.'; return ''}
        this.messageEdit = 'Erro ao editar paciente';
        return '';
      })
    ).subscribe(
      () => {
        this.messageEdit = 'Paciente editado com sucesso';
        this.clearInputs();
      }
    );
  }

  clearInputs(): void {
    //reiniciando o formulário para usar novamente
    this.registerPacienteReset();
    setTimeout(() => this.messageCreate = '', 5000);
    setTimeout(() => this.messageEdit = '', 5000);
    setTimeout(() => this.messageDelete = '', 5000);
  }
}