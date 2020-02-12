
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[numbersExZeroOnly]'
})
export class NumberExcludeZeroDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    if(initalValue.startsWith("0")){
      this._el.nativeElement.value = initalValue.replace(/[^1-9]*/g, '');
    }
    else{
      this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    }
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
    
  }

}