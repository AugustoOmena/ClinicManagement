import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../../environments/environment";
import { Medico } from "../medico.model";

@Injectable()
export class EditService {

    constructor(private http:HttpClient){}

    

    edit(id: string, name: string, crm: string, uf: string, especialidade: string): Observable<Medico> {
        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
        return this.http.put<Medico>(
            `${environment.apiUrl}/v1/Medicos/${id}`,
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