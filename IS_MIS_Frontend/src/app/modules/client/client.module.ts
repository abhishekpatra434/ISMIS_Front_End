import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntakeFormComponent } from './intake-form/intake-form.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { SharedModule } from '../../shared/shared.module';
import { MseComponent } from './mse/mse.component';
import { SearchClientIntakeComponent } from './search-client-intake/search-client-intake.component';
import { SearchClientMseComponent } from './search-client-mse/search-client-mse.component';
import { ClientBmiDataComponent } from './client-bmi-data/client-bmi-data.component';



@NgModule({
  declarations: [ClientComponent,IntakeFormComponent, MseComponent, SearchClientIntakeComponent, SearchClientMseComponent, ClientBmiDataComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule { }
