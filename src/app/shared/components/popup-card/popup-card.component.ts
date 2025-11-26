import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestsModalService} from "../../services/requests-modal.service";
import {ServiceParamsType} from "../../../../types/service-params.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-popup-card',
  templateUrl: './popup-card.component.html',
  styleUrls: ['./popup-card.component.scss']
})
export class PopupCardComponent implements OnInit {

  public dialogRef = inject(MatDialogRef<PopupCardComponent>)
  private fb = inject(FormBuilder);
  private requestsModalService = inject(RequestsModalService);
  private _snackBar = inject(MatSnackBar);
  isLeavedRequested = false;

  popupMainForm = this.fb.group({
    serviceName: [{value: '', disabled: true}, Validators.required],
    name: ['', [Validators.required, Validators.pattern(/^[а-яёА-ЯЁa-zA-Z0-9\s]+$/), Validators.maxLength(40)]],
    phone: ['', Validators.required],
  });

  get serviceName() {
    return this.popupMainForm.get('serviceName');
  }

  get name() {
    return this.popupMainForm.get('name');
  }

  get phone() {
    return this.popupMainForm.get('phone');
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data && this.data.title) {
      this.popupMainForm.patchValue({
        serviceName: this.data.title
      });
    } else if (this.data && this.data.service) {
      this.popupMainForm.patchValue({
        serviceName: this.data.service,
      });
    }

  }


  closePopup(): void {
    this.dialogRef.close();
  }

  leaveRequest() {
    if (this.popupMainForm.valid && this.popupMainForm.value.name && this.popupMainForm.value.phone &&
      this.serviceName?.value) {

      const objectService: ServiceParamsType = {
        name: this.popupMainForm.value.name,
        phone: '7' + this.popupMainForm.value.phone,
        service: this.serviceName.value,
        type: 'order'
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
