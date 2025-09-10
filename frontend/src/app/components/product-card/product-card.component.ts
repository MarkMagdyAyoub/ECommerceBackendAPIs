import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DecodeTokenService } from '../../services/decode-token.service';
import { DecodedToken } from '../../interfaces/decode-token';

declare var bootstrap : any;

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})

export class ProductCardComponent implements OnInit {
  @Input() product! : Product; 
  loginModalInstances: { [key: string]: any } = {};  
  token: DecodedToken | null = null;
  
  constructor(protected _Router:Router , protected _DecodeTokenService: DecodeTokenService){}

  ngOnInit(): void {
    this._DecodeTokenService.token.subscribe((tokenStr : string | null) => {
      if (tokenStr) {
        this.token = this._DecodeTokenService.decodeToken(tokenStr);
      } else {
        this.token = null;
      }
    });
  }


  showLoginModal(productId: string | number) {
    const modalEl = document.getElementById('loginModal' + productId);
    if (!this.loginModalInstances[productId]) {
      this.loginModalInstances[productId] = new bootstrap.Modal(modalEl);
    }
    this.loginModalInstances[productId].show();
  }


  goToLogin(productId: string | number) {
    if (this.loginModalInstances[productId]) {
      this.loginModalInstances[productId].hide();
    }
    setTimeout(() => {
      this._Router.navigate(['/login']);
    }, 200);
  }
}
