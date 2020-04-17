import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  authenticate = (username: string, password: string): Observable<any> => {
    const body = {
      username: username,
      password: password
    };
    return this.http.post<any>(`${environment.userManagerUrl}/1.0/auth/login`, body, environment.header).pipe(map(
      jwt => {
        if (jwt && jwt.token) {
          localStorage.setItem('token', JSON.stringify(jwt));
          return jwt;
        } else {
          throw new Error(jwt);
        }
      }
    ));
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  getToken() {
    return this.jwtHelper.tokenGetter();
  }

  logout() {
    localStorage.removeItem('compania');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }
}
