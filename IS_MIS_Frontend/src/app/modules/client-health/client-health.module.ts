import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientHealthRoutingModule } from './client-health-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ClientHealthComponent } from './client-health.component';
import { ClientBmiComponent } from './client-bmi/client-bmi.component';
import { ClientMedicationComponent } from './client-medication/client-medication.component';
import { ClientPsychometryComponent } from './client-psychometry/client-psychometry.component';
import { ClientPathologyComponent } from './client-pathology/client-pathology.component';


@NgModule({
  declarations: [ClientHealthComponent, ClientBmiComponent, ClientMedicationComponent, ClientPsychometryComponent, ClientPathologyComponent],
  imports: [
    CommonModule,
    ClientHealthRoutingModule,
    SharedModule
  ]
})
export class ClientHealthModule { }
