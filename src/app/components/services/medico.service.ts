import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../environments/environment";
import { Medico } from "../Models/medico.model";

@Injectable()
export class MedicoService {
    filtro: string = '';

    constructor(private http:HttpClient){}

    cadastro(medico: Medico): Observable<Medico> {
        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
        return this.http.post<Medico>(
            `${environment.apiUrl}/v1/Medicos`, medico,
            { headers }
        );
    }

    fetchMedicos(nome?: string, uf?: string): Observable<Medico[]> {
        this.filtro = '';

        // Busca por filtro
        if (nome || uf) {
            this.filtro += '?';
            if (nome) {
            this.filtro += `nome=${nome}`;
        }
        if (uf) {
            this.filtro += `&crmUf=${uf}`;
        }
        }

        const token = localStorage.getItem('accessToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<[]>(`${environment.apiUrl}/v1/Medicos${this.filtro}`, { headers });
    }

    edit(medico: Medico): Observable<Medico> {
        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
        return this.http.put<Medico>(
            `${environment.apiUrl}/v1/Medicos/${medico.id}`,
            {
                nome: medico.nome,
                crm: medico.crm,
                ufCrm: medico.ufCrm,
                especialidade: medico.especialidade
            },
            { headers }
        );
    }
    
    deleteMedico(selectToDeleteId: string): Observable<string> {
        const token = localStorage.getItem('accessToken')!;
    
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    
        return this.http.delete(`${environment.apiUrl}/v1/Medicos/${selectToDeleteId}`, { headers }).pipe(
            map(() => 'Sucesso na deleção'),
            catchError(error => {
                console.error('Erro na deleção:', error);
                return throwError(() => 'Erro na deleção');
            })
        );
    }
}