import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";

@Injectable()
export class FormatValidator {

    constructor(private http:HttpClient){}

    isValidCPF = (control: AbstractControl): ValidationErrors | null => {
        const cpf = control.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    
        // Verifica se o CPF tem 11 dígitos
        if (cpf.length !== 11) {
            return { cpfInvalido: true, mensagem: 'O CPF deve conter 11 dígitos' };
        }
    
        // Verifica se todos os dígitos são iguais, o que é inválido
        if (/^(\d)\1+$/.test(cpf)) {
            return { cpfInvalido: true, mensagem: 'CPF inválido' };
        }
    
        // Calcula os dígitos verificadores
        let sum = 0;
        let rest;
        for (let i = 1; i <= 9; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        rest = (sum * 10) % 11;
    
        if ((rest === 10) || (rest === 11)) {
            rest = 0;
        }
    
        if (rest !== parseInt(cpf.substring(9, 10))) {
            return { cpfInvalido: true, mensagem: 'CPF inválido' };
        }
    
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        rest = (sum * 10) % 11;
    
        if ((rest === 10) || (rest === 11)) {
            rest = 0;
        }
    
        if (rest !== parseInt(cpf.substring(10, 11))) {
            return { cpfInvalido: true, mensagem: 'CPF inválido' };
        }
    
        return null;
    }
    
    validateTelefone(control: AbstractControl): ValidationErrors | null {
        const telefone = control.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        // Verifica se todos os dígitos do telefone são iguais
        if (/^(\d)\1+$/.test(telefone)) {
            return { telefoneInvalido: true, mensagem: 'Número de telefone inválido' };
        }
        return null;
    }

    ufValidator(control: AbstractControl): ValidationErrors | null {
        const validUFs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

        const value = control.value;

        if (validUFs.indexOf(value) === -1) {
            return { invalidUF: true };
        }
        return null;
    }

    isValidEmail(control: AbstractControl): ValidationErrors | null {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(control.value)) {
            return { emailInvalido: true, mensagem: 'E-mail inválido' };
        }

        return null;
    }

    validatePerfil(control: AbstractControl): ValidationErrors | null {
        const allowedPerfis = ['Admin', 'Atendente'];
        const perfil = control.value;
        if (!allowedPerfis.includes(perfil)) {
            return { perfilInvalido: true, mensagem: 'O perfil deve ser Admin ou Atendente' };
        }

        return null;
    }
}