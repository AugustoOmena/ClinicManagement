import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { User } from './user.model';

@Injectable()
export class LoginService {

  user!: User;

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return this.user !== undefined
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('https://localhost:7021/v1/connect/token',
      { email: email, senha: password })
      .pipe(
        tap(user => this.user = user)
      );
  }
}