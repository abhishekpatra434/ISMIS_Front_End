import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  constructor(
    private confirmationService: ConfirmationService) {
     }
     confirmation() {
        this.confirmationService.confirm({
          message: 'Are you sure?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          key: 'confirmSave',
          accept: () => {
            
          },
          reject: () => {
            
          }
        });
      }
}