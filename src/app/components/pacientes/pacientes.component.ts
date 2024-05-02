import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  title = 'Estudos.Augusto.Front';
  pacientes: any[] = [];
  selectedPaciente:any;

  messageCreate: string = '';
  nomeInput: string = '';
  cpfInput: string = '';
  telefoneInput: string = '';
  medicoIdInput: string = '';

  messageEdit: string ='';
  nomeEdit: string = '';
  cpfEdit: string = '';
  telefoneEdit: string = '';
  medicoIdEdit: string = '';

  messageUpdate = '';
  nomeUpdate: string = '';
  cpfUpdate: string = '';
  telefoneUpdate: string = '';
  medicoUpdate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  registerPaciente() {
      const pacienteData = {
          nome: this.nomeInput,
          cpf: this.cpfInput.replace(/\D/g, ''),
          telefone: this.telefoneInput.replace(/\D/g, ''),
          medicoId: this.medicoIdInput
      };

      if (!pacienteData.nome || !pacienteData.cpf || !pacienteData.telefone || !pacienteData.medicoId) {
        this.messageCreate = 'Todos os campos devem ser preenchidos';
        return;
      }
    
      if (pacienteData.nome.length > 255) {
        this.messageCreate = 'Nome deve ter no máximo 255 caracteres';
        return;
      }
    
      if (pacienteData.telefone.length > 11) {
        this.messageCreate = 'Telefone deve ter no máximo 11 dígitos numéricos';
        return;
      }
    
      if (pacienteData.cpf.length !== 11) {
        this.messageCreate = 'CPF deve ter exatamente 11 dígitos numéricos';
        return;
      }
      if (!validarCPF(pacienteData.cpf)) {
        this.messageEdit = 'CPF inválido';
        return;
      }

      const token = localStorage.getItem('access_token');
      if (!token) {
          console.error('Token de acesso não encontrado');
          return;
      }

      const headers = {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      };

      this.http.post<any>('https://localhost:7021/api/Pacientes', pacienteData, headers)
          .subscribe(
              (response) => {
                  console.log('Solicitação POST bem-sucedida:', response);
                  this.messageCreate = 'Paciente cadastrado com sucesso.';
                  this.nomeInput = '';
                  this.cpfInput = '';
                  this.telefoneInput = '';
                  this.medicoIdInput = '';
              },
              (error) => {
                if (error.status === 401) {
                  window.location.href = '/home';
                } else if (error.error.Telefone) {
                  this.messageCreate = error.error.Telefone;
                } else if (error.error && error.error === 'Médico não encontrado.') {
                  this.messageCreate = 'Médico não encontrado';
                } else if (error.error && error.error === 'Já existe um paciente cadastrado com este CPF.') {
                  this.messageCreate = 'Já existe um paciente cadastrado com este CPF.';
                } else {
                  this.messageCreate = 'Erro ao cadastrar paciente.';
                }
              }
          );
  }

  fetchPacientes(): void {
    let url = 'https://localhost:7021/api/Pacientes';
    const token = localStorage.getItem('access_token');
  
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

  deletePaciente(idPaciente: string): void {
    const token = localStorage.getItem('access_token')!;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`https://localhost:7021/api/Pacientes/${idPaciente}`, { headers }).subscribe(
      (response) => {
        this.fetchPacientes();
      },
      (error) => {
        //console.error('Erro ao deletar médico:', error);
      }
    );
  }

  selectToEditPaciente(pacienteId: string, pacienteNome: string, pacienteCpf: string, pacienteTelefone: string) {
  this.selectedPaciente = pacienteId;

  this.nomeEdit = pacienteNome;
  this.cpfEdit = pacienteCpf;
  this.telefoneEdit = pacienteTelefone;

  }

  updatePaciente(): void {
    this.nomeUpdate = this.nomeEdit;
    this.cpfUpdate = this.cpfEdit.replace(/\D/g, ''),
    this.telefoneUpdate = this.telefoneEdit.replace(/\D/g, ''),
    this.medicoIdEdit = (document.getElementById('editMedicoDoPaciente') as HTMLInputElement).value;

    if (!this.selectedPaciente) {
      this.messageEdit = 'Nenhum paciente selecionado para edição';
      return;
    }

    if (!this.nomeUpdate || !this.cpfUpdate || !this.telefoneUpdate || !this.medicoIdEdit){
      this.messageEdit = 'Todos os campos devem ser preenchidos';
      return;
    }

    const guidRegex: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (!guidRegex.test(this.medicoIdEdit)) {
        this.messageEdit = "Esse Id não é válido";
        return;
    }

    if (this.nomeEdit.length > 255) {
      this.medicoIdEdit = 'Nome não deve ser maior que 255 caracteres';
      return;
    }

    if (this.telefoneUpdate.length > 11 || this.telefoneUpdate.length < 10) {
      this.messageEdit = 'o telefone deve ter 10 a 11 digitos';
      return;
    }

    if (!validarCPF(this.cpfUpdate)) {
      this.messageEdit = 'CPF inválido';
      return;
    }

    const token = localStorage.getItem('access_token')!;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const payload = {
      nome: this.nomeUpdate,
      cpf: this.cpfUpdate,
      telefone: this.telefoneUpdate,
      medicoId: this.medicoIdEdit
    };

    this.http.put(`https://localhost:7021/api/Pacientes/${this.selectedPaciente}`, payload, { headers }).subscribe(
      (response) => {
        this.messageEdit = 'Paciente atualizado com sucesso';
        this.nomeEdit = '';
        this.cpfEdit = '';
        this.telefoneEdit = '';
        this.medicoIdEdit = '';
        this.fetchPacientes();
      },
      (error) => {
        if (error.status === 401) {
          window.location.href = '/home';
        } else if (error.error.Telefone) {
          this.messageEdit = error.error.Telefone;
        } else if (error.error && error.error === 'Médico não encontrado.') {
          this.messageEdit = 'Médico não encontrado';
        } else {
          this.messageEdit = 'Erro ao cadastrar paciente.';
        }
        console.log(error);
      }
    );
  
  }

  

  formatarCPF(cpf: string): string {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.slice(0, 11);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.slice(0, 11);
    if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
  }

  onChangeCPF() {
    this.cpfInput = this.formatarCPF(this.cpfInput);
    this.cpfEdit = this.formatarCPF(this.cpfEdit);
  }
  onChangeTelefone() {
    this.telefoneInput = this.formatarTelefone(this.telefoneInput);
    this.telefoneEdit = this.formatarTelefone(this.telefoneEdit);
  }
}

function validarCPF(cpf: string): boolean {
  const cpfArray = cpf.split('').map(Number);

  // Verificar se todos os dígitos são iguais
  if (new Set(cpfArray).size === 1) return false;

  // Calcular primeiro dígito verificador
  let soma = cpfArray.slice(0, 9).reduce((acc, curr, index) => acc + curr * (10 - index), 0);
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10) digito1 = 0;
  if (digito1 !== cpfArray[9]) return false;
  soma = cpfArray.slice(0, 10).reduce((acc, curr, index) => acc + curr * (11 - index), 0);
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10) digito2 = 0;
  if (digito2 !== cpfArray[10]) return false;

  return true;
}
