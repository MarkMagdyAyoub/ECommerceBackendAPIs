import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderRequest } from '../interfaces/order-request';
import { Observable } from 'rxjs';
import { OrderResponse } from '../interfaces/order-response';
import { Status } from '../enums/status';
import { PaymentStatus } from '../enums/paymentStatus';
import { OrdersResponse } from '../interfaces/orders-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private createOrderUrl = 'http://localhost:5000/order'; 
  private getOrdersByUserIdUrl = 'http://localhost:5000/order/user/me'; 

  constructor(private _HttpClient:HttpClient) {}

  createOrder(order: OrderRequest, token: string): Observable<OrderResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._HttpClient.post<OrderResponse>(
      this.createOrderUrl,
      order,
      { headers }
    );
  }
  
  getMyAccount(token: string): Observable<OrdersResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._HttpClient.get<OrdersResponse>(this.getOrdersByUserIdUrl, { headers });
  }
}
