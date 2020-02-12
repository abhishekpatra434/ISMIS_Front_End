
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IntakeFormComponent } from './intake-form/intake-form.component';
import { MseComponent } from './mse/mse.component';
import { SearchClientIntakeComponent } from './search-client-intake/search-client-intake.component';
import { SearchClientMseComponent } from './search-client-mse/search-client-mse.component';
import { ClientComponent } from './client.component';

const routes: Routes = [{
    path: '',
    component: ClientComponent,
    children: [
        {
            path: 'intake-form',
            component: IntakeFormComponent,
        },
        {
            path: 'intake_form',
            component: IntakeFormComponent,
        },
        {
            path: 'edit-intake-form',
            component: IntakeFormComponent,
        },
        {
            path: 'mse',
            component: MseComponent,
        },
        {
            path: 'clientmse',
            component: MseComponent,
        },
        {
            path: 'search-client',
            component: SearchClientIntakeComponent,
        },
        {
            path: 'search-mse',
            component: SearchClientMseComponent,
        },
    ]
}];

@NgModule({
    imports: [CommonModule,RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
