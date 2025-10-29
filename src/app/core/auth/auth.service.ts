import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    !!localStorage.getItem('accessToken')
  );
  private isLogged: boolean = false;

  private http = inject(HttpClient);

  constructor() {
    // При инициализации сервиса проверяем авторизацию
    this.checkAuth().subscribe();
  }

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.apiUrl + 'login', {
      email, password, rememberMe
    });
  }

  signup(name: string, email: string, password: string): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.apiUrl + 'signup', {
      name, email, password
    });
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.apiUrl + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => 'Can not find token');
  }

  public getIsLoggedIn(): boolean {
    return this.isLogged$.value;
  }


  public setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged$.next(true);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  public removeTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userIdKey);
    this.isLogged$.next(false);
  }

  set userId(id: null | string) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  // public refresh(): Observable<LoginResponseType | DefaultResponseType> {
  //   const tokens = this.getTokens();
  //   if (tokens && tokens.refreshToken) {
  //     return this.http.post<LoginResponseType | DefaultResponseType>(environment.apiUrl + 'refresh', {
  //       refreshToken: tokens.refreshToken
  //     }).pipe(
  //       tap((response) => {
  //         if (!this.isDefaultResponseType(response)) {
  //           this.setTokens(response.accessToken, response.refreshToken);
  //         }
  //       })
  //     );
  //
  //   }
  //   throw throwError(() => 'Can not use token');
  // }
  public refresh(): Observable<LoginResponseType | DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<LoginResponseType | DefaultResponseType>(environment.apiUrl + 'refresh', {
        refreshToken: tokens.refreshToken
      })
    }
    throw throwError(() => 'Can not use token');
  }



  private checkAuth(): Observable<boolean> {
    const tokens = this.getTokens();
    const isAuthenticated = !!(tokens.accessToken && tokens.refreshToken);

    if (!isAuthenticated) {
      this.isLogged$.next(false);
    }

    return of(isAuthenticated);
  }

  private isDefaultResponseType(response: any): response is DefaultResponseType {
    return (response as DefaultResponseType).error !== undefined;
  };
}
