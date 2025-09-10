  import { Component, OnInit } from '@angular/core';
  import { User, UserAccountResponse } from '../../interfaces/user-account';
  import { DecodedToken } from '../../interfaces/decode-token';
  import {DecodeTokenService} from '../../services/decode-token.service';
  import { UserAccountService } from '../../services/user-account.service';
  import { OrderService } from '../../services/order.service';
  import { OrderResponses, OrdersResponse } from '../../interfaces/orders-response';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
  @Component({
    selector: 'app-account',
    standalone: true,
    imports: [DatePipe, RouterLink],
    templateUrl: './account.component.html',
    styleUrl: './account.component.css'
  })


  export class AccountComponent implements OnInit {
    userAccount !: User;
    token : DecodedToken | null = null;
    orders : OrderResponses[] = [];

    constructor(private _DecodeTokenService : DecodeTokenService , private _UserAccountService : UserAccountService , private _OrderService : OrderService){}

    ngOnInit(): void {
      this._DecodeTokenService.token.subscribe((tokenStr : string | null) => {
        if (tokenStr) {
          this.token = this._DecodeTokenService.decodeToken(tokenStr);
          
          this._OrderService.getMyAccount(tokenStr).subscribe({
            next: (res : OrdersResponse) => {
                this.orders = res.data;
            },
            error: (err) => {
              console.error("Get user's orders Fail : " , err)
            },
          });

          this._UserAccountService.getUserAccountById(this.token!.id , tokenStr).subscribe({
            next:(res : UserAccountResponse)=>{
              this.userAccount = res.data.user;
            },
            error: (err) => {
              console.error("Get user Account Fail : " , err)
            },
          });
        } else {
          this.token = null;
        }
      });
    }
  }