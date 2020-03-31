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

  bodegas() {
    console.log('ejecutando => ', `${environment.baseUrl}/1.0/catalog/bodegas`);
    return this.http.get<Array<any>>(`${environment.baseUrl}/1.0/catalog/bodegas`);
  }

  tipoDocumento() {
    return this.http.get<Array<any>>(`${environment.baseUrl}/1.0/catalog/tipodocumento`);
  }
}
