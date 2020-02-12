import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { GoBackGuardService } from './core/guards/go-back-guard.service';


const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'prefix' },
  {
      path: 'auth',
      loadChildren: 'src/app/auth/auth.module#AuthModule'
  },
  {
    path: 'dashboard',
    canLoad: [AuthGuardService, GoBackGuardService],
    canDeactivate: [GoBackGuardService],
    canActivate: [AuthGuardService],
    loadChildren: 'src/app/modules/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'client',
    canLoad: [AuthGuardService, GoBackGuardService],
    canDeactivate: [GoBackGuardService],
    canActivate: [AuthGuardService],
    loadChildren: 'src/app/modules/client/client.module#ClientModule'
  },
  {
    path: 'health',
    canLoad: [AuthGuardService, GoBackGuardService],
    canDeactivate: [GoBackGuardService],
    canActivate: [AuthGuardService],
    loadChildren: 'src/app/modules/client-health/client-health.module#ClientHealthModule'
  },

]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
