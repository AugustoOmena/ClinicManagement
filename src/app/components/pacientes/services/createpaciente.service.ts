// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs/internal/Observable";
// import { environment } from "../../../../environments/environment";
// import { Paciente } from "../paciente.model";

// @Injectable()
// export class CreatePacienteService {

//     constructor(private http:HttpClient){}

//     cadastro(name: string, cpf: string, telefone: string, medicoId: string): Observable<Paciente> {
//         console.log("passeiPorAqui")
//         const token = localStorage.getItem('accessToken')!;
//         const headers = {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         };

//     console.log(medicoId)

//     const pacienteData = {
//         nome: name,
//         cpf: cpf.replace(/\D/g, ''),
//         telefone: telefone,
//         medicoId: medicoId
//     };

//         return this.http.post<Paciente>(
//             `${environment.apiUrl}/api/Pacientes`, pacienteData, headers
//         )
//     }
// }

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../../environments/environment";
import { Paciente } from "../paciente.model";

@Injectable()
export class CreatePacienteService {

    constructor(private http: HttpClient){}

    cadastro(name: string, cpf: string, telefone: string, medicoId: string): Observable<Paciente> {
        const token = localStorage.getItem('accessToken')!;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        const pacienteData = {
            nome: name,
            cpf: cpf.replace(/\D/g, ''),
            telefone: telefone,
            medicoId: medicoId
        };

        const options = { headers: headers }; // Envolver os cabeçalhos em um objeto de opções

        return this.http.post<Paciente>(
            `${environment.apiUrl}/api/Pacientes`,
            pacienteData, 
            options // Passar opções para a requisição
        );
    }
}
