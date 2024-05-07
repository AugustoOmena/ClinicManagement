import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.css'
})
export class MedicosComponent implements OnInit {

  title = 'Estudos.Augusto.Front';
  httpClient = inject(HttpClient);
  medicos:any[] = [];
  selectedMedico: any;
  messageEdit: string = '';
  messageCreate: string = '';
  nomeFilter: string = '';
  ufFilter: string = '';

  constructor(private http: HttpClient) {}

  
  ngOnInit(): void {
  }
  
  fetchMedicos(nome?: string, uf?: string): void {
    let url = 'https://localhost:7021/v1/Medicos';
  
    // Adiciona os parâmetros opcionais à URL, se forem fornecidos
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
  
  

  deleteMedico(idMedico: string): void {
    const token = localStorage.getItem('accessToken')!;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`https://localhost:7021/v1/Medicos/${idMedico}`, { headers }).subscribe(
      (response) => {
        this.fetchMedicos();
      },
      (error) => {
        //console.error('Erro ao deletar médico:', error);
      }
    );
  }

  updateMedico(): void {
    const nome = (document.getElementById('editNome') as HTMLInputElement).value;
    const crm = (document.getElementById('editCrm') as HTMLInputElement).value;
    const ufCrm = (document.getElementById('editUfCrm') as HTMLInputElement).value;
    const especialidade = (document.getElementById('editEspecialidade') as HTMLInputElement).value;
  
    if (!this.selectedMedico) {
      this.messageEdit = 'Nenhum médico selecionado para edição';
      return;
    }

    if (!nome || !crm || !ufCrm || !especialidade) {
      this.messageEdit = 'Todos os campos devem ser preenchidos';
      return;
    }
  
    if (crm.length > 50) {
      this.messageEdit = 'CRM deve ter no máximo 50 caracteres';
      return;
    }
  
    if (nome.length > 255 || especialidade.length > 255) {
      this.messageEdit = 'Nome e especialidade devem ter no máximo 255 caracteres';
      return;
    }
  
    const regexUF = /^[A-Za-z]{2}$/;
    if (!regexUF.test(ufCrm)) {
      this.messageEdit = 'UF invlálido';
      return;
    }

      const payload = {
      nome: nome,
      crm: crm,
      ufCrm: ufCrm,
      especialidade: especialidade
    };
  
    const token = localStorage.getItem('accessToken')!;
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    // Envia a requisição PUT
    this.http.put(`https://localhost:7021/v1/Medicos/${this.selectedMedico}`, payload, { headers }).subscribe(
      (response) => {
        this.messageEdit = 'Médico atualizado com sucesso';
        this.fetchMedicos();
      },
      (error) => {
        this.messageEdit = 'Erro ao atualizar médico';
      }
    );
  }

selectToEditMedico(medicoId: string, medicoCrm: string, medicoNome: string, medicoUfCrm: string, medicoEspecialidade: string) {
this.selectedMedico = medicoId;

  (document.getElementById('editNome') as HTMLInputElement).value = medicoNome;
  (document.getElementById('editCrm') as HTMLInputElement).value = medicoCrm;
  (document.getElementById('editUfCrm') as HTMLInputElement).value = medicoUfCrm;
  (document.getElementById('editEspecialidade') as HTMLInputElement).value = medicoEspecialidade;
}

cadastrarMedico(): void {
  const nome = (document.getElementById('nomeInput') as HTMLInputElement).value.trim();
  const crm = (document.getElementById('crmInput') as HTMLInputElement).value.trim();
  const ufCrm = (document.getElementById('ufCrmInput') as HTMLInputElement).value.trim();
  const especialidade = (document.getElementById('especialidadeInput') as HTMLInputElement).value.trim();

  if (!nome || !crm || !ufCrm || !especialidade) {
    this.messageCreate = 'Todos os campos devem ser preenchidos';
    return;
  }

  if (crm.length > 50) {
    this.messageCreate = 'CRM deve ter no máximo 50 caracteres';
    return;
  }

  if (nome.length > 255 || especialidade.length > 255) {
    this.messageCreate = 'Nome e especialidade devem ter no máximo 255 caracteres';
    return;
  }

  const regexUF = /^[A-Za-z]{2}$/;
  if (!regexUF.test(ufCrm)) {
    this.messageCreate = 'UF invlálido';
    return;
  }

  const token = localStorage.getItem('accessToken')!;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const payload = {
    nome: nome,
    crm: crm,
    ufCrm: ufCrm,
    especialidade: especialidade
  };

  this.http.post('https://localhost:7021/v1/Medicos', payload, { headers }).subscribe(
    (response) => {
      this.messageCreate = 'Médico cadastrado com sucesso';
      this.clearInputs();
      this.fetchMedicos();
    },
    (error) => {
      this.messageCreate = 'Erro ao cadastrar médico';
    }
  );
}


clearInputs(): void {
  (document.getElementById('nomeInput') as HTMLInputElement).value = '';
  (document.getElementById('crmInput') as HTMLInputElement).value = '';
  (document.getElementById('ufCrmInput') as HTMLInputElement).value = '';
  (document.getElementById('especialidadeInput') as HTMLInputElement).value = '';
}
}