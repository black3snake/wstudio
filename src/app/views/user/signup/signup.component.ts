import {Component, inject} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {HexRtfParserService} from "../../../shared/services/hex-rtf-parser.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private enhancedRtfService = inject(HexRtfParserService);
  agreementFilePath = 'assets/documents/agreement.rtf';

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s[А-ЯЁ][а-яё]*)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],

  })

  get name() {
    return this.signupForm.get('name');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get agree() {
    return this.signupForm.get('agree');
  }

  signup() {
    if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password
      && this.signupForm.value.name && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
            next: (data: LoginResponseType | DefaultResponseType) => {
              let error = null;
              if ((data as DefaultResponseType) !== undefined ) {
                error = (data as DefaultResponseType).message;
              }

              const loginResponse = data as LoginResponseType;
              if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId ) {
                error = 'Ошибка регистрации';
              }
              if (error) {
                this._snackBar.open(error);
                throw new Error(error);
              }

              this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
              this.authService.userId = loginResponse.userId;
              this._snackBar.open('Вы успешно зарегистрировались');
              this.router.navigate(['/']);

            },
            error: (err: HttpErrorResponse) => {
              if(err.error && err.error.message) {
                this._snackBar.open(err.error.message);
                console.log(err.error.message);
              } else  {
                this._snackBar.open('Ошибка регистрации');
                console.log('Ошибка регистрации');
              }
            }
          }
        )
    }
  }

  // openSection(section: string, event: Event): void {
  //   event.preventDefault();
  //   // this.enhancedRtfService.convertRtfWithAnchors(this.agreementFilePath, section);
  // }


}
