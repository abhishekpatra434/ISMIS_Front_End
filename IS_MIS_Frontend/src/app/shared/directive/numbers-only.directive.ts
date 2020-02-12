import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberDirective {

  // constructor(private _el: ElementRef) { }

  // @HostListener('input', ['$event']) onInputChange(event) {
  //   const initalValue = this._el.nativeElement.value;
  //   this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
  //   if ( initalValue !== this._el.nativeElement.value) {
  //     event.stopPropagation();
  //   }
  // }

  private regex: RegExp = new RegExp(/^\d+$/);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete', 'ArrowLeft', 'ArrowRight'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const initalValue = this.el.nativeElement.value;
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

}