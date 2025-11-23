import { TestBed } from '@angular/core/testing';

import { RequestsModalService } from './requests-modal.service';

describe('RequestsModalService', () => {
  let service: RequestsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
