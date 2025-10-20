import { TestBed } from '@angular/core/testing';

import { ServiceDbService } from './service-db.service';

describe('ServiceDbService', () => {
  let service: ServiceDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
