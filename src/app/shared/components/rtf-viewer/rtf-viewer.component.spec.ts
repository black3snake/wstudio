import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtfViewerComponent } from './rtf-viewer.component';

describe('RtfViewerComponent', () => {
  let component: RtfViewerComponent;
  let fixture: ComponentFixture<RtfViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RtfViewerComponent]
    });
    fixture = TestBed.createComponent(RtfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
