import {Component, inject, Input} from '@angular/core';
import {ServiceCardType} from "../../../../types/service-card.type";
import {PopupCardComponent} from "../popup-card/popup-card.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {take} from "rxjs";

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() serviceM!: ServiceCardType;
  dialogRef: MatDialogRef<any> | null = null;

  private dialog = inject(MatDialog);
  private router = inject(Router);

  startPopup() {
    this.dialogRef = this.dialog.open(PopupCardComponent, {
      data: {
        title: this.serviceM.title,
      },
    });

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
