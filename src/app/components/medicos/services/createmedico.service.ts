import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../../environments/environment";
import { Medico } from "../medico.model";

@Injectable()
export class CreateService {

    constructor(private http:HttpClient){}

    

    cadastro(name: string, crm: string, uf: string, especialidade: string): Observable<Medico> {
        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
        return this.http.post<Medico>(
            `${environment.apiUrl}/v1/Medicos`,
            { 
                nome: name, 
                crm: crm, 
                ufCrm: uf, 
                especialidade: especialidade 
            },
            { headers }
        );
    }

}