import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  save = (body: any) => {
    return this.http.post<Array<any>>(`${environment.baseUrl}/1.0/documents`, body, environment.header);
  }

  list = () => {
    return this.http.get<Array<any>>(`${environment.baseUrl}/1.0/documents`);
  }

  findById = (id) => {
    return this.http.get<any>(`${environment.baseUrl}/1.0/documents/${id}`);
  }
}
