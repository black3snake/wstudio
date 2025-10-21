import {inject, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Pipe({
  name: 'saveHtml'
})
export class SaveHtmlPipe implements PipeTransform {
  // private sanitizer = inject(DomSanitizer);
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Преобразуем строку в безопасный HTML
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
