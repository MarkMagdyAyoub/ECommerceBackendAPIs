import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponse } from '../interfaces/product-response';

@Injectable()
export class ProductResponseService {

  private apiUrl = 'http://localhost:5000/product';

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1, limit: number = 10, search: string = ''): Observable<ProductResponse> {
    let params = new HttpParams();

    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    if (search) params = params.set('search', search);

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }
}
