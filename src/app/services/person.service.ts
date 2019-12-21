import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  get = (id: any) => {
    return this.http.get<any>(`${environment.backendUrl}/persona/${id}`, environment.header);
  }
}
