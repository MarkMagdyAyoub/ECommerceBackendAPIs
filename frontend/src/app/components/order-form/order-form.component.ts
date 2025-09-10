import { CommonModule, CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component , OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product';
import { Address } from '../../interfaces/register-user';
import { DecodedToken } from '../../interfaces/decode-token';
import { DecodeTokenService } from '../../services/decode-token.service';
import { OrderRequest } from '../../interfaces/order-request';
import { OrderService } from '../../services/order.service';
import { OrderFailResponse, OrderResponse, OrderSuccessResponse } from '../../interfaces/order-response';
import {PaymentStatus} from '../../enums/paymentStatus';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgClass , CurrencyPipe , CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})

export class OrderFormComponent implements OnInit {
  product!: Product;   
  address! : Address;
  token! : DecodedToken | null;
  street: string = '';
  quantity: number = 1;
  apiError : OrderFailResponse | null = null;

  statusMessage: string = '';
  statusType: 'success' | 'error' | '' = '';
  showStatus: boolean = false;

  constructor(private _DecodeTokenService : DecodeTokenService , private _OrderService : OrderService , private _Router : Router){}

  get totalPrice(): number {
    return this.quantity * this.product.price;
  }

  onQuantityChange(): void {
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }

  ngOnInit(): void {
    this.product = history.state.product; 
    console.log('Received product:', this.product);
    this._DecodeTokenService.token.subscribe((tokenStr : string | null) => {
      if (tokenStr) {
        this.token = this._DecodeTokenService.decodeToken(tokenStr);
        this.address = {street:this.token?.city ?? '' , city:this.token?.street ?? ''};
      } else {
        this.token = null;
      }
    });
  }


  createOrder(): void {
    if (!this.address.city.trim() || !this.address.street.trim()) {
      this.displayStatus('Please fill in all address fields', 'error');
      return;
    }

    const orderData: OrderRequest = {
      user_id: this.token!.id,
      items: [
        {
          product_id: this.product._id,
          quantity: this.quantity,
          price_at_purchase: this.product.price
        }
      ],
      shipping_address: {
        city: this.address.city,
        street: this.address.street
      },
      payment_status: PaymentStatus.PENDING,
      total_price: this.product.price * this.quantity
    };

    this._DecodeTokenService.token.pipe(take(1)).subscribe((tokenStr: string | null) => {
      if (tokenStr) {
        this._OrderService.createOrder(orderData, tokenStr).subscribe({
          next: (res: OrderResponse) => {
            console.log("order sent successfully");
            res = res as OrderSuccessResponse;
            this.displayStatus('Order created successfully! Check console for order data.', 'success');
            this._Router.navigate(['/account']);
          },
          error: (err: OrderResponse) => {
            console.log(err);
            err = err as OrderFailResponse;
            this.apiError = err;
          }
        });
      } else {
        this.token = null;
      }
    });
    
    this.resetForm();
  }
  
  // Display status message
  private displayStatus(message: string, type: 'success' | 'error'): void {
    this.statusMessage = message;
    this.statusType = type;
    this.showStatus = true;
    
    // Hide after 5 seconds
    setTimeout(() => {
      this.showStatus = false;
    }, 1000);
  }
  
  // Reset form
  private resetForm(): void {
    this.address.city = '';
    this.address.street = '';
    this.quantity = 1;
  }
}
