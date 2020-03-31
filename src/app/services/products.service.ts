import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getForSale() {
    return this.http.get<any>(`${environment.baseUrl}/1.0/products/listsale`, environment.header);
  }
}
