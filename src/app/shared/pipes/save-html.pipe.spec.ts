import { SaveHtmlPipe } from './save-html.pipe';
import {DomSanitizer} from "@angular/platform-browser";
import {TestBed} from "@angular/core/testing";

describe('SaveHtmlPipe', () => {
  let pipe: SaveHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value
          }
        }
      ]
    });

    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SaveHtmlPipe(sanitizer);
  });


  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform HTML', () => {
    const html = '<script>alert("xss")</script>';
    const result = pipe.transform(html);
    expect(result).toBe(html);
  });
});
