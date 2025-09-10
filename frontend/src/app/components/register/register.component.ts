import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRegisterResponse } from '../../services/auth.service';
import { RegisterUser, UserRegisterErrorResponse, UserRegisterFailResponse, ValidationError } from '../../interfaces/register-user';
import { Status } from '../../enums/status';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _AuthService: AuthService , private _Router:Router) {}

  showPassword: boolean = false;
  apiErrors: ValidationError[] = [];  
  successMessage: string = '';

  registerForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=(?:.*[a-z]){2,})(?=(?:.*[A-Z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z0-9]){1,}).+$/)
    ]),
    address: new FormGroup({
      city: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      street: new FormControl(null, [Validators.required, Validators.minLength(2)])
    }),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^\+20(11|12|15)[0-9]{8}$/)])
  });

  ngOnInit(): void {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  getFieldError(field: string): string | undefined {
    return this.apiErrors.find(e => e.field === field)?.msg;
  }

  submitRegisterForm(form: FormGroup) {
    this.apiErrors = [];
    this.successMessage = '';

    if (!form.valid) {
      form.markAllAsTouched();
      return;
    }

    this._AuthService.registerUser(form.value).subscribe({
      next: (res: UserRegisterResponse) => {
        if (this.isSuccess(res)) {
          this.successMessage = 'Registration successful! Please check your email to confirm your account.';
          console.log("user registered successfully");
          localStorage.setItem("id", res.data.id);
          this._Router.navigate(['login']);
          form.reset();
        }
      },
      error: (err) => {
        const backendRes = err.error as UserRegisterResponse; 
        if (backendRes && 'status' in backendRes) {
          if (this.isFail(backendRes)) {
            this.apiErrors = [...backendRes.data];
          } else if (this.isError(backendRes)) {
            this.apiErrors = [{ field: '', msg: backendRes.message }];
          } else {
            this.apiErrors = [{ field: '', msg: 'Unexpected response from server.' }];
          }
        } else {
          this.apiErrors = [{ field: '', msg: 'Server error, please try again later.' }];
        }
      }
    });
  }

  isSuccess(res: any): res is { status: Status.SUCCESS; data: RegisterUser } {
    return res.status === Status.SUCCESS;
  }

  isFail(res: any): res is UserRegisterFailResponse {
    return res.status === Status.FAIL;
  }

  isError(res: any): res is UserRegisterErrorResponse {
    return res.status === Status.ERROR;
  }
}
