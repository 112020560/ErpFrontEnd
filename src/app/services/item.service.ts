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

  advanzedfind = (body: any) => {
    console.log(body);
    return this.http.post<Array<any>>(`${environment.backendUrl}/articulo`, body, environment.header);
  }

  getForSale() {
    return this.http.get<any>(`${environment.baseUrl}/1.0/products/listsale`, environment.header);
  }
}
