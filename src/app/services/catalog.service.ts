import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private http: HttpClient) { }

  saleType = (body: any) => {
    return this.http.post<Array<any>>(`${environment.backendUrl}/catalog`, body, environment.header);
  }
}
