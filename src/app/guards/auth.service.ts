import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  getAuthState(): Observable<any> {
    return authState(this.auth);
  }
}
