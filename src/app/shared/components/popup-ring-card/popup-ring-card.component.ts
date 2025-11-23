import {Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceParamsType} from "../../../../types/service-params.type";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestsModalService} from "../../services/requests-modal.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-popup-ring-card',
  templateUrl: './popup-ring-card.component.html',
  styleUrls: ['./popup-ring-card.component.scss']
})
export class PopupRingCardComponent {
  public dialogRef = inject(MatDialogRef<PopupRingCardComponent>)
  private fb = inject(FormBuilder);
  private requestsModalService = inject(RequestsModalService);
  private _snackBar = inject(MatSnackBar);
  isLeavedRequested = false;

  popupMainForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[а-яёА-ЯЁa-zA-Z0-9\s]+$/), Validators.maxLength(40)]],
    phone: ['', Validators.required],
  });

  get name() {
    return this.popupMainForm.get('name');
  }
  get phone() {
    return this.popupMainForm.get('phone');
  }

  ngOnInit() {
  }

  closePopup(): void {
    this.dialogRef.close();
  }

  leaveRequest() {
    if (this.popupMainForm.valid && this.popupMainForm.value.name && this.popupMainForm.value.phone) {

      const objectService: ServiceParamsType = {
        name: this.popupMainForm.value.name,
        phone: '7' + this.popupMainForm.value.phone,
        type: 'consultation'
      }

      this.requestsModalService.updateRequestForServiceOrRing(objectService)
        .subscribe({
          next: (data) => {
            if (data.error) {
              throw new Error(data.message)
            }
            this._snackBar.open(data.message);
            this.isLeavedRequested = !this.isLeavedRequested;
          },
          error: (err: HttpErrorResponse) => {
            this._snackBar.open(err.error.message);
          }
        })
    }
  }
}
