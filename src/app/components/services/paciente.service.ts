import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Paciente } from "../Models/paciente.model";

@Injectable()
export class PacienteService {

    constructor(private http:HttpClient){}
    
    edit(paciente: Paciente): Observable<Paciente> {

        const token = localStorage.getItem('accessToken')!;

        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });

        paciente.cpf = paciente.cpf.replace(/\D/g, '');
        console.log(paciente)

        return this.http.put<Paciente>(
            `${environment.apiUrl}/api/Pacientes/${paciente.id}`, paciente,{ headers }
        );
    }

    fetchPacientes(): Observable<Paciente[]>  {
        const token = localStorage.getItem('accessToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<[]>(`${environment.apiUrl}/api/Pacientes`, { headers }).pipe(
            tap(pacientes => console.log('Pacientes fetched successfully:', pacientes)),
            catchError(error => {
                console.error('Error fetching pacientes:', error);
                return of([]);
            })
        );
    }

    cadastro(paciente: Paciente): Observable<Paciente> {

        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        paciente.cpf = paciente.cpf.replace(/\D/g, '')

        return this.http.post<Paciente>(
            `${environment.apiUrl}/api/Pacientes`,
            paciente, { headers }
        ).pipe(
            catchError(error => {
                return throwError(() => new Error(error.error));
            })
        );
    }

    deletePaciente(selectToDeleteId: string): Observable<string> {
        const token = localStorage.getItem('accessToken')!;
    
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    
        return this.http.delete(`${environment.apiUrl}/api/Pacientes/${selectToDeleteId}`, { headers })
        .pipe(
            map(() => 'Sucesso na deleção'),
            catchError(error => {
                console.error('Erro na deleção:', error);
                return throwError(() => 'Erro na deleção');
            })
        );
    }
}