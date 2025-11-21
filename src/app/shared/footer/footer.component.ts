import {Component, inject} from '@angular/core';
import {PopupCardComponent} from "../components/popup-card/popup-card.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {PopupRingCardComponent} from "../components/popup-ring-card/popup-ring-card.component";
import {take, takeUntil} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  dialogRef: MatDialogRef<any> | null = null;

  private dialog = inject(MatDialog);
  private router = inject(Router);

  ringMe() {
    this.dialogRef = this.dialog.open(PopupRingCardComponent);

    this.dialogRef.afterOpened()
      .pipe(take(1))
      .subscribe(() => {
      // Убираем aria-hidden с app-root после открытия диалога
      const appRoot = document.querySelector('app-root');
      if (appRoot) {
        appRoot.removeAttribute('aria-hidden');
      }
    });

    this.dialogRef.backdropClick()
      .subscribe(() => {
        this.dialogRef?.close();
        this.router.navigate(['/']);
      });
  }
}
