import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strLimiter'
})
export class StrLimiterPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value) return '';
    const maxLength = 10;
    if (value.length <= maxLength) return value.toString();

    const regex = new RegExp(`^.{0,${maxLength}}\\b`,'u');
    const match = value.match(regex);

    if (match && match[0].length > 0) {
      return match[0] + '..';
    }
    return value.substring(0, maxLength);
  }
}
