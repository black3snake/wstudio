import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, finalize, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              // private loaderService: LoaderService,
              ) {
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // this.loaderService.show();

    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken),
      })
      console.log(req);
      return next.handle(authReq)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401 &&
              !authReq.url.includes('/login') &&
              !authReq.url.includes('/refresh')) {
              // Важно: handle401Error тоже должен возвращать Observable<HttpEvent<unknown>>
              return this.handle401Error(authReq, next);
            }
            return throwError(() => error);
          }),
          // finalize(() => this.loaderService.hide())

        )
    }
    return next.handle(req)
      // .pipe(
      //   finalize(() => this.loaderService.hide())
      // );
  }

  handle401Error(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //логика обновления токена
    return this.authService.refresh()
      .pipe(
        switchMap((result: LoginResponseType | DefaultResponseType) => {
          let error = '';
          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }

          const refreshResult = result as LoginResponseType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            return throwError(() => new Error(error));
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

          const authReq = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken),
          })
          return next.handle(authReq);
        }),
        catchError(error => {
          this.authService.removeTokens();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      )
  }
}
