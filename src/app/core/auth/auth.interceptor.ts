import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError} from 'rxjs';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {SpinnerService} from "../../shared/services/spinner.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService,
              private router: Router,
              private loaderSpinner: SpinnerService,
              ) {
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // this.loaderSpinner.show();  // Активировать при выгрузке на сервер, локально не использовать.

    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken),
      })
      // console.log(req);
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
          // finalize(() => this.loaderSpinner.hide())

        )
    }
    return next.handle(req)
      .pipe(
        // finalize(() => this.loaderSpinner.hide())
      );
  }

  handle401Error(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Проверяем, не выполняется ли уже запрос на обновление
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          const authReq = req.clone({
            headers: req.headers.set('x-auth', token!),
          });
          return next.handle(authReq);
        })
      );
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refresh().pipe(
        switchMap((result: LoginResponseType | DefaultResponseType) => {
          this.isRefreshing = false;

          // Проверяем на ошибку
          if ((result as DefaultResponseType).error !== undefined) {
            const errorMessage = (result as DefaultResponseType).message || 'Ошибка авторизации';
            this.refreshTokenSubject.next(null);
            this.authService.removeTokens();
            this.router.navigate(['/login']);
            console.log('Delete from DefaultResponseType True')
            return throwError(() => new Error(errorMessage));
          }

          const refreshResult = result as LoginResponseType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            this.refreshTokenSubject.next(null);
            this.authService.removeTokens();
            this.router.navigate(['/login']);
            console.log('Delete from LoginResponseType')
            return throwError(() => new Error('Ошибка авторизации'));
          }

          // Сохраняем новые токены
          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
          this.refreshTokenSubject.next(refreshResult.accessToken);

          // Повторяем оригинальный запрос с новым токеном
          const authReq = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken),
          });
          return next.handle(authReq);
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          this.authService.removeTokens();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    }
  }
}
