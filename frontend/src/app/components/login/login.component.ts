import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserLoginResponse } from '../../services/auth.service';
import { ValidationError } from '../../interfaces/register-user';
import { Status } from '../../enums/status';
import { ErrorResponse, FailResponse } from '../../interfaces/validation-get-all-products';
import { LoginUserResponse } from '../../interfaces/login-user';
import { DecodeTokenService } from '../../services/decode-token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink , ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private _AuthService:AuthService , private _Router : Router , private _DecodeTokenService : DecodeTokenService){}
  apiErrors : ValidationError[] = [];
  emailConfirmationMessage : string = '';
  showPassword : boolean = false;
  loginForm : FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8), 
      Validators.pattern(/^(?=(?:.*[a-z]){2,})(?=(?:.*[A-Z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z0-9]){1,}).+$/)
    ]),
  });

  submitLoginForm(form : FormGroup){
    this.apiErrors = [];

    this._AuthService.loginUser(form.value).subscribe({
      next: (res: UserLoginResponse) => {
        res = res as LoginUserResponse;
        if (this.isSuccess(res)) {
          this._DecodeTokenService.setToken(res.data.token); 
          this._Router.navigate(['homepage']); 
        }
      },
      
      error: (err : any) => {
        if("status" in err){
          const errors = err.error;
          console.log("status: " , err.error.data.message);
          
          if(err.error.data.message === "Invalid Credentials"){
            this.apiErrors.push({field:'credentials' , msg: err.error.data.message });
          } else if (err.error.data.message === "Please Verify Your Email Before Logging In"){
            this.apiErrors.push({field:'confirm' , msg: err.error.data.message });
          }
          else {
            this.apiErrors.push({field:'unexpected' , msg: 'unexpected server error , please try again latter'});
          }
        }
      }
    });
  }

  ngOnInit(): void {
    const registeredId = localStorage.getItem('id');
    if (registeredId) {
      this.emailConfirmationMessage = 'Please confirm your email before logging in.';
      localStorage.removeItem('id'); 
    }
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

  isSuccess(res: any): res is { status: Status.SUCCESS; data: LoginUserResponse } {
    return res.status === Status.SUCCESS;
  }

  isFail(res: any): res is FailResponse {
    return res.status === Status.FAIL;
  }

  isError(res: any): res is ErrorResponse {
    return res.status === Status.ERROR;
  }
}
