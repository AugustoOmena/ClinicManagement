import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Usuario } from "../Models/usuario.model";

@Injectable()
export class UsuarioService {

    constructor(private http:HttpClient){}

    fetchUsuarios(): Observable<Usuario[]>  {
        const token = localStorage.getItem('accessToken');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<[]>(`${environment.apiUrl}/v1/Usuarios`, { headers })
    }

    cadastro(usuario: Usuario): Observable<Usuario> {

        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        console.log(usuario)

        const options = { headers: headers };

        return this.http.post<Usuario>(
            `${environment.apiUrl}/v1/Usuarios`,
            usuario,
            options
        ).pipe(
            catchError(error => {
                return throwError(() => new Error(error.error.Email[0]));
            })
        );
    }
}