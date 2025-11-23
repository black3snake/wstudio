import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserInfoService} from "../services/user-info.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {UserInfoType} from "../../../types/user-info.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private userInfoService = inject(UserInfoService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private subscriptions: Subscription = new Subscription();
  isLogged: boolean = false;
  userInfo: UserInfoType | null = null;

  ngOnInit(): void {
    this.subscriptions.add(this.authService.isLogged$.subscribe((isLogged: boolean) => {
        this.isLogged = isLogged;
        // console.log(this.isLogged)
        if (isLogged) {
          this.loadUserInfo();
        } else {
          this.userInfo = null;
        }
      })
    );
  }

  private loadUserInfo() {
    this.subscriptions.add(this.userInfoService.getUserInfo()
      .subscribe({
        next: (data: UserInfoType | DefaultResponseType) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }
          const userInfo: UserInfoType = data as UserInfoType;
          if (!userInfo.id || !userInfo.name || !userInfo.email) {
            error = 'Ошибка, нет необходимых полей в объекте userInfo';
          }
          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }
          this.userInfo = userInfo;
          // console.log(this.userInfo)
        },
        error: (err: HttpErrorResponse) => {
          if (err.error && err.error.message) {
            this._snackBar.open(err.error.message);
            console.log(err.error.message);
          } else {
            this._snackBar.open('Ошибка в получении объекта');
            console.log('Ошибка в получении объекта');
          }
        }
      })
    );
  }


  logout(): void {
    this.subscriptions.add(this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();

        },
        error: () => {
          this.doLogout();
        }
      })
    );
  }

  doLogout(): void {
    this.authService.removeTokens();
    this._snackBar.open('Вы успешно вышли из системы');
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}
