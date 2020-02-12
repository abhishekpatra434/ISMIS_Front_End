import { Directive, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[focusInvalidInput]'
})
export class FormFocusDirective implements AfterViewInit  {

  constructor(private el: ElementRef) { }
  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
//   @HostListener('click')
//   onFormSubmit() {
//     const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');

//     if (invalidControl) {
//       invalidControl.focus();  
//     }
//   }
}