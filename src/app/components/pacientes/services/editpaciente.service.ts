import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../../environments/environment";
import { Paciente } from "../paciente.model";

@Injectable()
export class EditPacienteService {

    constructor(private http:HttpClient){}
    
    edit(id: string, name: string, cpf: string, telefone: string, medicoId: string): Observable<Paciente> {
        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
        return this.http.put<Paciente>(
            `${environment.apiUrl}/api/Pacientes/${id}`,
            { 
                nome: name,
                cpf: cpf.replace(/\D/g, ''),
                telefone: telefone,
                medicoId: medicoId
            },
            { headers }
        );
    }
}