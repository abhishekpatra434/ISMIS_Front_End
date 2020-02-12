import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route, Router } from '@angular/router';
import { BroadcastService } from './../../core/services/broadcast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, map } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  overlayCount = 0;
  excludeUrls=[
    'client/getClientUidList',
    'client/getClientNameList',
    'client/getCohortYrList',
    'client/mse/getClientUidList',
    'client/mse/getClientNameList',
    'getNotifications',
    'client/getUploadedFile'
  ];

  excludeToastUrls=[
  ]

  constructor(private spinner: NgxSpinnerService,
    private router: Router,
    private broadcastService: BroadcastService,
    private toastService: ToastService
    ) { }

  private startOverlay(): void {
    this.overlayCount = this.overlayCount + 1;
   document.getElementById("overlay").style.display = "block";
   this.spinner.show();
  }
  private stopOverlay(): void {
    this.overlayCount = this.overlayCount - 1;
    if (this.overlayCount <= 0) {
      this.overlayCount = 0;
      document.getElementById("overlay").style.display = "none";
      this.spinner.hide();
    }
  }

  logOut() {
    sessionStorage.removeItem("user");
    this.broadcastService.setAuth(false);
    this.router.navigate(['/auth/login']);
  }

  private checkExcluseURL(pr_url){
    for(let lv_url of this.excludeUrls){
      if(pr_url.includes(lv_url)){
        return true;
      }
    }

    return false;
  }

  private checkExcluseToastURL(pr_url){
    for(let lv_url of this.excludeToastUrls){
      if(pr_url.includes(lv_url)){
        return true;
      }
    }

    return false;
  }


  private handleError(er){
    if (er instanceof HttpErrorResponse && er.status==401) {
      let url=window.location.toString();
      if(url.indexOf('/auth/') == -1 && !this.checkExcluseToastURL(er.url)){
        this.toastService.showI18nToastFadeOut("Session Expired","error");
        //this.toastService.showI18nToast('LOGIN.SESSION_EXPIRED','error');
      }
      this.logOut();
    }
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    try {
     
      if(!this.checkExcluseURL(req.url)){
        this.spinner.show();
      }
      let token = "";
      let user = JSON.parse(sessionStorage.getItem('user'));
      if(!req.url.includes('/gen/')){//checking the url includes gen or not[if not then token has been added]-- issue number-- https://gitlab.com/sbis-poc/app/issues/709
        if (user && user.token != null) {
          token =user.token;
          req = req.clone({ headers: req.headers.set('token', token) });
        } 
      }

     

      if (!req.headers.has('Content-Type')) {
        //req = req.clone({ headers: req.headers.append('Content-Type', 'application/json') });
      }
      // setting the accept header
     // req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

      let sessionToken = sessionStorage.getItem('token');
      //req = req.clone({ headers: req.headers.append('Set-Cookie', 'jsessionid=' + sessionToken) });
      //req = req.clone({ headers: req.headers.append('Authorization', 'Auth_Token') });
      if(sessionToken!=null){
        req = req.clone({ headers: req.headers.append('usessionId', sessionToken) });
      }
      
      //req = req.clone({ headers: req.headers.append('usessionId', sessionToken) });

      return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
       //  this.stopOverlay();
        this.spinner.hide();
        }
      }, (err: any) => {
        //this.stopOverlay();
        this.handleError(err);
       this.spinner.hide();
      }));

    } catch (e) {
      this.handleError(e);
      //this.stopOverlay();
    }
  }
  

}
