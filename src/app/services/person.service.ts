import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  find = (id: any) => {
    return this.http.get<any>(`${environment.baseUrl}/1.0/person/${id}`, environment.header);
  }

  get = () => {
    return this.http.get<any>(`${environment.baseUrl}/1.0/person`, environment.header);
  }
}
