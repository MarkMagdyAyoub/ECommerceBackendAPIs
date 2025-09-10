import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { DecodeTokenService } from '../../services/decode-token.service';
import { DecodedToken } from '../../interfaces/decode-token';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  token: DecodedToken | null = null;
  
  constructor(private _DecodeTokenService: DecodeTokenService) {}

  ngOnInit(): void {
    this._DecodeTokenService.token.subscribe((tokenStr : string | null) => {
      if (tokenStr) {
        this.token = this._DecodeTokenService.decodeToken(tokenStr);
      } else {
        this.token = null;
      }
    });
  }

  deleteToken(): void {
    this._DecodeTokenService.deleteToken(); 
  }
}
