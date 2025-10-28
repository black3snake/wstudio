import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const _snackBar = inject(MatSnackBar);

  if (authService.getIsLoggedIn()) {
    return true;
  }
  _snackBar.open('Вам надо авторизоваться');
  return false;
};
