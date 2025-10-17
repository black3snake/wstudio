import { TestBed } from '@angular/core/testing';

import { SliderMainDbService } from './slider-main-db.service';

describe('SliderMainDbService', () => {
  let service: SliderMainDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SliderMainDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
