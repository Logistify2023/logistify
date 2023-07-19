import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceText'
})

export class ReplaceTextPipe implements PipeTransform {
  
  transform(value: string, strToReplace: string, replacementStr: string): string {
    if (!value || !strToReplace || !replacementStr) {
      return value;
    }
    return value.replace(new RegExp(this.escapeStr(strToReplace), 'g'), replacementStr);
  }

  escapeStr(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}