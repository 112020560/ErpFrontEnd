import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  find = (id: any) => {
    return this.http.get<any>(`${environment.backendUrl}/articulo/${id}`, environment.header);
  }
}
