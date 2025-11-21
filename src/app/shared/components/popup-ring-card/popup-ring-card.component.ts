import {Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-popup-ring-card',
  templateUrl: './popup-ring-card.component.html',
  styleUrls: ['./popup-ring-card.component.scss']
})
export class PopupRingCardComponent {
  public dialogRef = inject(MatDialogRef<PopupRingCardComponent>)
  private fb = inject(FormBuilder);
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
    this.isLeavedRequested = !this.isLeavedRequested;
  }
}
