import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientHealthComponent } from './client-health.component';
import { ClientBmiComponent } from './client-bmi/client-bmi.component';
import { ClientMedicationComponent } from './client-medication/client-medication.component';
import { ClientPsychometryComponent } from './client-psychometry/client-psychometry.component';
import { ClientPathologyComponent } from './client-pathology/client-pathology.component';


const routes: Routes = [{
  path: '',
  component: ClientHealthComponent,
  children: [
    {
      path: 'bmi',
      component: ClientBmiComponent,
    },
    {
      path: 'medication',
      component: ClientMedicationComponent,
    },
    {
      path: 'psychometry',
      component: ClientPsychometryComponent,
    },
    {
      path: 'pathology',
      component: ClientPathologyComponent,
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientHealthRoutingModule { }
