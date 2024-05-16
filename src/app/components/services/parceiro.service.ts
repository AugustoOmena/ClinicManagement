import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Parceiro } from "../Models/parceiro.model";

@Injectable()
export class ParceiroService {

    constructor(private http:HttpClient){}
    
    edit(parceiro: Parceiro): Observable<Parceiro> {

        const token = localStorage.getItem('accessToken')!;

        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });

        console.log(parceiro)

        return this.http.put<Parceiro>(
            `${environment.apiUrl}/v1/Parceiros/${parceiro.id}`, parceiro,{ headers }
        );
    }

    fetchParceiros(parceiro: Parceiro): Observable<Parceiro>  {
        const token = localStorage.getItem('accessToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });
    
        return this.http.patch<Parceiro>(`${environment.apiUrl}/v1/Parceiros/${parceiro.id}`, null, { headers })
    }

    cadastro(parceiro: Parceiro): Observable<Parceiro> {

        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.post<Parceiro>(
            `${environment.apiUrl}/v1/Parceiros`,
            parceiro, { headers }
        ).pipe(
            catchError(error => {
                return throwError(() => new Error(error.error));
            })
        );
    }

    deleteParceiro(selectToDeleteId: string): Observable<string> {
        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete(`${environment.apiUrl}/v1/Parceiros/${selectToDeleteId}`, { headers })
        .pipe(
            map(() => 'Sucesso na deleção'),
            catchError(error => {
                console.error('Erro na deleção:', error);
                return throwError(() => 'Erro na deleção');
            })
        );
    }
}