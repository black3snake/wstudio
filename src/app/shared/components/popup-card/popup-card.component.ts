import {Component, Inject, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-popup-card',
  templateUrl: './popup-card.component.html',
  styleUrls: ['./popup-card.component.scss']
})
export class PopupCardComponent implements OnInit {

  public dialogRef = inject(MatDialogRef<PopupCardComponent>)
  private fb = inject(FormBuilder);
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data && this.data.title) {
      this.popupMainForm.patchValue({
        serviceName: this.data.title
      });
    }

  }


  closePopup(): void {
    this.dialogRef.close();
  }

  leaveRequest() {
    this.isLeavedRequested = !this.isLeavedRequested;
  }

}
