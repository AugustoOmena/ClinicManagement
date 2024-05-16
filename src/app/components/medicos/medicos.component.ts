import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { FormatValidator } from '../../shared/formatcorrect/format';
import { Medico } from '../Models/medico.model';
import { MedicoService } from '../services/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
})
export class MedicosComponent implements OnInit {

  title = 'Estudos.Augusto.Front';
  httpClient = inject(HttpClient);
  medicos:any[] = [];
  medico!: Medico;
  selectedMedicoId: any;
  messageEdit: string = '';
  nomeFilter: string = '';
  ufFilter: string = '';
  messageCreate: string = '';
  actionSelected: string = '';
  selectToDeleteId: string = '';
  messageDelete: string = '';

  constructor(private fb: FormBuilder,
              private medicoService: MedicoService,
              private correctFormat: FormatValidator) {}

  AcaoMedicoForm!: FormGroup
  
  ngOnInit(): void {
    this.registerMedicoReset();
  }

  registerMedicoReset() {
    this.AcaoMedicoForm = this.fb.group({
      nome: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      crm: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      ufCrm: this.fb.control('', [Validators.required, Validators.maxLength(2), this.correctFormat.ufValidator]),
      especialidade: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    });
  }

  create() {
    if (this.AcaoMedicoForm.invalid) {return}
  
    this.medico = this.AcaoMedicoForm.value;
      
    this.medicoService.cadastro(this.medico).pipe(
      catchError(error => {
        if (error.error.Crm[0]) {this.messageCreate = error.error.Crm[0]; return ''}
        this.messageCreate = 'Erro ao cadastrar médico';
        return '';
      })
    ).subscribe(
      () => {
        this.messageCreate = 'Médico cadastrado com sucesso';
        this.clearInputs();
      }
    );
  }
    
  fetchMedicos(nome?: string, ufCrm?: string): void {
    this.medicoService.fetchMedicos(nome, ufCrm)?.subscribe(value => {
    this.medicos = value;
  })
  }
  
  selectToDelete(id: string) {
    this.selectToDeleteId = id;
  }

  deleteMedico(): void {
    this.medicoService.deleteMedico(this.selectToDeleteId).subscribe({
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

  editMedico(): void {
    if (this.AcaoMedicoForm.invalid) {
      return;
    }

    this.medico = this.AcaoMedicoForm.value;
    this.medico.id = this.selectedMedicoId;
    
    this.medicoService.edit(this.medico).pipe(
      catchError(error => {
        if (error.error.Crm[0]) {this.messageEdit = error.error.Crm[0]; return ''}
        this.messageEdit = 'Erro ao editar médico';
        return '';
      })
    ).subscribe(
      () => {
        this.messageEdit = 'Médico editado com sucesso';
        this.clearInputs();
      }
    );
  }

  selectToEditMedico(medico: Medico) {
    this.selectedMedicoId = medico.id;
    this.actionSelected = 'edit';
    
    this.AcaoMedicoForm = this.fb.group({
      nome: this.fb.control(`${medico.nome}`, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      crm: this.fb.control(`${medico.crm}`, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      ufCrm: this.fb.control(`${medico.ufCrm}`, [Validators.required, Validators.maxLength(2), this.correctFormat.ufValidator]),
      especialidade: this.fb.control(`${medico.especialidade}`, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    });
  }

  clearInputs(): void {
    this.registerMedicoReset();
    setTimeout(() => this.messageCreate = '', 5000);
    setTimeout(() => this.messageEdit = '', 5000);
    setTimeout(() => this.messageDelete = '', 5000);
  }

  activeCreate() {
    this.actionSelected = 'create';
  }
}