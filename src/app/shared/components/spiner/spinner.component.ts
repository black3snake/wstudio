import {Component, inject, OnInit} from '@angular/core';
import {SpinnerService} from "../../services/spinner.service";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit{
  isShowed = false;
  private loaderSpinner = inject(SpinnerService);

  ngOnInit(): void {
    this.loaderSpinner.isShowed$
      .subscribe((isShowed: boolean) => {
        this.isShowed = isShowed;
      })
  }

}
