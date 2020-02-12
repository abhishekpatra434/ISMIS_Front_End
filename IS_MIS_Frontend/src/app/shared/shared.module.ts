import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ModalModule, BsModalService, BsModalRef, PopoverModule, BsDatepickerModule, BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatExcludeZeroDirective } from './directive/float-numbers-exclude-zero.directive';
import { NumberExcludeZeroDirective } from './directive/numbers-only-exclude-zero.directive.';
import { TwoDigitDecimaNumberDirective } from './directive/two-digit-decimal-directive';
import { NumberDirective } from './directive/numbers-only.directive';
import { ToastrModule } from 'ngx-toastr';
import {ConfirmDialogModule} from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { FormFocusDirective } from './directive/form-focus.directive';
import {InputMaskModule} from 'primeng/inputmask';
import {DialogModule} from 'primeng/dialog';
import {DataViewModule} from 'primeng/dataview';
import {PaginatorModule} from 'primeng/paginator';

@NgModule({
  declarations: [
    FloatExcludeZeroDirective,
    NumberExcludeZeroDirective,
    NumberDirective,
    TwoDigitDecimaNumberDirective,
    FormFocusDirective
  ],
  imports: [
    CommonModule,
    AccordionModule,
    BsDatepickerModule.forRoot(),
    AutoCompleteModule,
    SidebarModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    ToastrModule.forRoot({
      disableTimeOut: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
      maxOpened: 1,
      autoDismiss: true,
    }),
    TooltipModule.forRoot(),
    ConfirmDialogModule,
    // ConfirmationService,
    InputMaskModule,
    DialogModule,
    DataViewModule,
    PaginatorModule
  ],
  exports: [
    AccordionModule,
    BsDatepickerModule,
    AutoCompleteModule,
    SidebarModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    FloatExcludeZeroDirective,
    NumberExcludeZeroDirective,
    NumberDirective,
    TwoDigitDecimaNumberDirective,
    ToastrModule,
    TooltipModule,
    ConfirmDialogModule,
    FormFocusDirective,
    // ConfirmationService,
    InputMaskModule,
    DialogModule,
    DataViewModule,
    PaginatorModule
  ]
})
export class SharedModule { }
