import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private _registerUrl = `${environment.apiUrl}/register`;
  private _loginUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(user: any) {
    return this.http.post<any>(this._registerUrl, user);
  }

  loginUser(user: any) {
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logOutUser() {
    localStorage.removeItem('token');
    // this.router.navigate(['events']);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
