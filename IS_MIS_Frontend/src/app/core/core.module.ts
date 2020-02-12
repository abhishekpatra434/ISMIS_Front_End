import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BroadcastService } from './services/broadcast.service';
import { AuthGuardService } from './guards/auth-guard.service';
import { GoBackGuardService } from './guards/go-back-guard.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { SharedModule } from '../shared/shared.module';
import { CommonService } from './services/common.service';
import { ToastService } from './services/toast.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule, 
    SharedModule
  ],
  exports: [HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    AuthInterceptorService,
    BroadcastService,
    AuthGuardService,
    GoBackGuardService,
    CommonService,
    ToastService
  ]
})
export class CoreModule { }
