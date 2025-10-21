import { TestBed } from '@angular/core/testing';

import { ArticleService } from './article.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ArticleService', () => {
  let service: ArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService],
    });
    service = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
