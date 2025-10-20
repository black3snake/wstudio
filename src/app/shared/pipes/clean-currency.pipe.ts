import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cleanCurrency'
})
export class CleanCurrencyPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';
    const str = value.toString();
    return str.replace(/\s+(₽|руб|$)/, '$1');
  }

}
