import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCardComponent } from './service-card.component';
import {CleanCurrencyPipe} from "../../pipes/clean-currency.pipe";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('ServiceCardComponent', () => {
  let component: ServiceCardComponent;
  let fixture: ComponentFixture<ServiceCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ServiceCardComponent,
        CleanCurrencyPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: []
    });
    fixture = TestBed.createComponent(ServiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
