import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CreateService } from './services/createmedico.service';
import { EditService } from './services/editmedico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrl: './medico.component.css'
})
export class MedicosComponent implements OnInit {

  title = 'Estudos.Augusto.Front';
  httpClient = inject(HttpClient);
  medicos:any[] = [];
  selectedMedicoId: any;
  messageEdit: string = '';
  nomeFilter: string = '';
  ufFilter: string = '';
  messageCreate: string = '';
  actionSelected: string = '';
  selectToDeleteId: string = '';

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private createService: CreateService,
              private editService: EditService) {}

  AcaoMedicoForm!: FormGroup
  
  ngOnInit(): void {
    this.registerMedicoReset();
  }

  registerMedicoReset() {
    this.AcaoMedicoForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      crm: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      uf: this.fb.control('', [Validators.required, Validators.maxLength(2), this.ufValidator]),
      especialidade: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    });
  }

  ufValidator(control: AbstractControl): ValidationErrors | null {
  const validUFs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  const value = control.value.toUpperCase();

  if (validUFs.indexOf(value) === -1) {
      return { invalidUF: true };
  }
      return null;
  }

  create() {
    if (this.AcaoMedicoForm.invalid) {
      return;
    }
  
    const { name, crm, uf, especialidade } = this.AcaoMedicoForm.value;
      
    this.createService.cadastro(name, crm, uf, especialidade).subscribe(
      () => {
        this.messageCreate = 'Médico cadastrado com sucesso';
        this.clearInputs();
      },
      (error) => {
        this.messageCreate = 'Erro ao cadastrar médico';
      }
    );
  }
    
  
  fetchMedicos(nome?: string, uf?: string): void {
    let url = 'https://localhost:7021/v1/Medicos';
  
    // Busca por filtro
    if (nome || uf) {
      url += '?';
      if (nome) {
        url += `nome=${nome}`;
      }
      if (uf) {
        url += `&crmUf=${uf}`;
      }
    }
  
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
        this.medicos = response;
      },
      (error) => {
        console.error('Erro ao buscar médicos:', error);
      }
    );
  }
  
  selectToDelete(id: string) {
    this.selectToDeleteId = id;
  }
  

  deleteMedico() {
    const token = localStorage.getItem('accessToken')!;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`https://localhost:7021/v1/Medicos/${this.selectToDeleteId}`, { headers }).subscribe(
      (response) => {
        this.fetchMedicos();
      },
      (error) => {
      }
    );
  }


updateMedico(): void {
  if (this.AcaoMedicoForm.invalid) {
    return;
  }

  const { name, crm, uf, especialidade } = this.AcaoMedicoForm.value;
  
  this.editService.edit(this.selectedMedicoId, name, crm, uf, especialidade).subscribe(
    () => {
      this.messageEdit = 'Médico cadastrado com sucesso';
      this.clearInputs();
    },
    (error) => {
      this.messageEdit = 'Erro ao cadastrar médico';
    }
  );
}

selectToEditMedico(medicoId: string, medicoCrm: string, medicoNome: string, medicoUfCrm: string, medicoEspecialidade: string) {
  this.selectedMedicoId = medicoId;
  this.actionSelected = 'edit';
  
  //atualizando os imput com as informações do medico selecionado.
  this.AcaoMedicoForm = this.fb.group({
    name: this.fb.control(`${medicoNome}`, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    crm: this.fb.control(`${medicoCrm}`, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    uf: this.fb.control(`${medicoUfCrm}`, [Validators.required, Validators.maxLength(2), this.ufValidator]),
    especialidade: this.fb.control(`${medicoEspecialidade}`, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
  });
}

clearInputs(): void {
  //reiniciando o formulário para usar novamente
  this.registerMedicoReset();
  setTimeout(() => this.messageCreate = '', 5000);
  setTimeout(() => this.messageEdit = '', 5000);
}

activeCreate() {
  this.actionSelected = 'create';
}
}