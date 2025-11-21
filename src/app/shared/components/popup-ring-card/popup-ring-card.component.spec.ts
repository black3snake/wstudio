import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupRingCardComponent } from './popup-ring-card.component';

describe('PopupRingCardComponent', () => {
  let component: PopupRingCardComponent;
  let fixture: ComponentFixture<PopupRingCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupRingCardComponent]
    });
    fixture = TestBed.createComponent(PopupRingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
