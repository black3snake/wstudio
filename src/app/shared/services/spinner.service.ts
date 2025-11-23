import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  // isShowed$ = new BehaviorSubject<boolean>(false);
  isShowed$ = new Subject<boolean>();

  show() {
    this.isShowed$.next(true);
    // console.log('Spinner start:');
  }
  hide() {
    this.isShowed$.next(false);
    // console.log('Spinner stop:');
  }
}
