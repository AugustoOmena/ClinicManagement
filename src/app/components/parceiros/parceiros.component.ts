import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { Parceiro } from '../Models/parceiro.model';
import { ParceiroService } from '../services/parceiro.service';

@Component({
  selector: 'app-parceiros',
  templateUrl: './parceiros.component.html',
  styleUrl: './parceiros.component.css'
})
export class ParceirosComponent {

  title = 'Estudos.Augusto.Front';
  parceiroFound!: Parceiro;
  parceiro!: Parceiro;
  selectedParceiroId:any;

  messageCreate: string = '';
  messageEdit: string ='';
  actionSelected: string = '';
  messageSearch: string = '';
  messageDelete: string = '';

  constructor(private fb: FormBuilder,
              private parceiroService: ParceiroService) {}

  AcaoParceiroForm!: FormGroup
  SearchParceiroForm!: FormGroup

  selectToDeleteId: string = '';

  ngOnInit(): void {
    this.registerParceiroReset()
    this.searchParceiroReset()
  }

  registerParceiroReset() {
    this.AcaoParceiroForm = this.fb.group({
      nome: this.fb.control('', [Validators.required, Validators.maxLength(255)]),
    });
  }

  searchParceiroReset() {
    this.SearchParceiroForm = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.pattern('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}')]),
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

  fetchParceiro(): void {
    if (this.SearchParceiroForm.invalid) {return}
    this.parceiro = this.SearchParceiroForm.value;
    this.parceiroService.fetchParceiros(this.parceiro).pipe(
      catchError(() => {
        this.clearInputs();
        this.parceiroFound = undefined!;
        return throwError(() => this.messageSearch = `Parceiro não encontrado`);
      })
    )?.subscribe(
        value => {
            this.parceiroFound = value;
            this.clearInputs()
        }
    );
}

  selectToDelete(id: string) {
    this.selectToDeleteId = id;
  }

  deleteParceiro(): void {
    this.parceiroService.deleteParceiro(this.selectToDeleteId).subscribe({
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

  selectToEditParceiro(parceiro : Parceiro) {
    this.selectedParceiroId = parceiro.id;
    this.actionSelected = 'edit';

    this.AcaoParceiroForm = this.fb.group({
      nome: this.fb.control('', [Validators.required, Validators.maxLength(255)]),
    });
  }

  create() {
    if (this.AcaoParceiroForm.invalid) {return}
    
    this.parceiro = this.AcaoParceiroForm.value;

    this.parceiroService.cadastro(this.parceiro).pipe(
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
  
  editParceiro(): void {
    if (this.AcaoParceiroForm.invalid) {return}

    this.parceiro = this.AcaoParceiroForm.value;

    this.parceiro.id = this.selectedParceiroId;

    this.parceiroService.edit(this.parceiro).pipe(
      catchError(errorResponse => {

        if (errorResponse.status === 404) { this.messageEdit = 'Parceiro não encontrado.'; return ''}
        this.messageEdit = 'Erro ao editar parceiro';
        return '';
      })
    ).subscribe(
      () => {
        this.messageEdit = 'Parceiro editado com sucesso';
        this.clearInputs();
      }
    );
  }

  clearInputs(): void {
    //reiniciando o formulário para usar novamente
    this.registerParceiroReset();
    this.searchParceiroReset();

    setTimeout(() => this.messageCreate = '', 5000);
    setTimeout(() => this.messageEdit = '', 5000);
    setTimeout(() => this.messageSearch = '', 5000);
    setTimeout(() => this.messageDelete = '', 5000);
  }
}
