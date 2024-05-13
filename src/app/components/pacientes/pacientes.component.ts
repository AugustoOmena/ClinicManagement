import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CreatePacienteService } from './services/createpaciente.service';
import { EditPacienteService } from './services/editpaciente.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  title = 'Estudos.Augusto.Front';
  pacientes: any[] = [];
  selectedPacienteId:any;

  messageCreate: string = '';
  messageEdit: string ='';
  actionSelected: string = '';

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private createPacienteService: CreatePacienteService,
              private editPacienteService: EditPacienteService) {}

  AcaoPacienteForm!: FormGroup

  selectToDeleteId: string = '';

  ngOnInit(): void {
    this.registerPacienteReset()
  }

  registerPacienteReset() {
    this.AcaoPacienteForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      cpf: this.fb.control('', [Validators.required, Validators.maxLength(14), this.isValidCPF.bind(this)]),
      telefone: this.fb.control('', [Validators.required, Validators.minLength(14), Validators.maxLength(20)]),
      medicoid: this.fb.control('', [Validators.required, Validators.pattern('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}')]),
    });
}

isValidCPF = (control: AbstractControl): ValidationErrors | null => {
  const cpf = control.value.replace(/\D/g, '');
  if (cpf.length !== 11) {
      return { cpfInvalido: true, mensagem: 'O CPF deve conter 11 dígitos' };
  }

  const cpfArray = cpf.split('').map(Number);
  const dv1 = cpfArray[9];
  const dv2 = cpfArray[10];

  // Calcula os dígitos verificadores
  const soma1 = cpfArray.slice(0, 9).reduce((acc: number, curr: number, index: number) => acc + curr * (10 - index), 0);
  const resto1 = (soma1 * 10) % 11;
  const digito1 = (resto1 === 10 || resto1 === 11) ? 0 : resto1;

  const soma2 = cpfArray.slice(0, 10).reduce((acc: number, curr: number, index: number) => acc + curr * (11 - index), 0);
  const resto2 = (soma2 * 10) % 11;
  const digito2 = (resto2 === 10 || resto2 === 11) ? 0 : resto2;

  if (digito1 !== dv1 || digito2 !== dv2) {
      return { cpfInvalido: true, mensagem: 'CPF inválido aqui' };
  }

  return null;
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
    let url = 'https://localhost:7021/api/Pacientes';
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
      console.error('Token de acesso não encontrado');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(url, { headers }).subscribe(
      (response: any) => {
        this.pacientes = response;
      },
      (error) => {
        console.error('Erro ao buscar pacientes:', error);
      }
    );
  }

  selectToDelete(id: string) {
    this.selectToDeleteId = id;
  }

  deletePaciente(): void {
    const token = localStorage.getItem('accessToken')!;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`https://localhost:7021/api/Pacientes/${this.selectToDeleteId}`, { headers }).subscribe(
      (response) => {
        this.fetchPacientes();
      },
      (error) => {
        //console.error('Erro ao deletar médico:', error);
      }
    );
  }

  selectToEditPaciente(pacienteId: string, pacienteNome: string, pacienteCpf: string, pacienteTelefone: string, idDoMedicoDoPaciente: string) {
  this.selectedPacienteId = pacienteId;
  this.actionSelected = 'edit';

  this.AcaoPacienteForm = this.fb.group({
    name: this.fb.control(`${pacienteNome}`, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    cpf: this.fb.control(`${pacienteCpf}`, [Validators.required, Validators.maxLength(14)]),
    telefone: this.fb.control(`${pacienteTelefone}`, [Validators.required, Validators.minLength(14), Validators.maxLength(20)]),
    medicoid: this.fb.control(`${idDoMedicoDoPaciente}`, [Validators.required]),
  });
  }

  create() {
    if (this.AcaoPacienteForm.invalid) {
      return;
    }

    const { name, cpf, telefone, medicoid } = this.AcaoPacienteForm.value;
  
    this.createPacienteService.cadastro(name, cpf, telefone, medicoid).subscribe(
      (response) => {
        this.messageCreate = 'Paciente cadastrado com sucesso';
        this.clearInputs();
      },
      (error) => {
        if (error.error) {
          this.messageCreate = error.error;
        } else {
          this.messageCreate = `Erro ao cadastrar paciente: ${error.message}`;
        }
      }
    );
  }
  

  updatePaciente(): void {
    if (this.AcaoPacienteForm.invalid) {
      return;
    }
  
    const { name, cpf, telefone, medicoid } = this.AcaoPacienteForm.value;
      
    this.editPacienteService.edit(this.selectedPacienteId, name, cpf, telefone, medicoid).subscribe(
      () => {
        this.messageEdit = 'Paciente editado com sucesso';
        this.clearInputs();
      },
      (error) => {
        if (error.error) {
          this.messageEdit = error.error;
        } else {
          this.messageEdit = 'Erro ao editar paciente';
        }
      }
    );
  }

  clearInputs(): void {
    this.registerPacienteReset();
    setTimeout(() => this.messageCreate = '', 5000);
    setTimeout(() => this.messageEdit = '', 5000);
  }
}