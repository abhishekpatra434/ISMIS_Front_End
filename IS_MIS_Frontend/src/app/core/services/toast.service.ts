import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    private toastr: ToastrService) {
     }

  public showToast(msgType: any, message: string) {

    let snackbarDoc = document.getElementById("snackbar");
    snackbarDoc.className = snackbarDoc.className.replace("show", "");
    snackbarDoc.innerHTML = ""
    let color = {
      fontColor: "",
      bgColor: "",
      preFix: "",
      logo: ""
    }
    if (msgType == 2000) {
      color.fontColor = "#4F8A10";
      color.bgColor = "#DFF2BF";
      color.preFix = "Success!";
      color.logo = "<i style='padding-left: 43px;' class='fas fa-check'></i>";
    } else {
      color.fontColor = "#D8000C";
      color.bgColor = "#FFBABA";
      color.preFix = "Error!";
      color.logo = "<i style='padding-left: 43px;' class='far fa-times-circle'></i>"
    }

    if (message != "Unknown Error") {
      snackbarDoc.style.backgroundColor = color.bgColor;
      snackbarDoc.innerHTML = "<div style='padding-top: 13px;' class='row'>"+color.logo+"<p style='padding-left: 10px;padding-right:20px;color:" + color.fontColor + "'>" + message + "</p><span style='padding-right: 36px;' class='cursor' id='close-toast' style='color:red;'>X</span></div>";
      snackbarDoc.className = "show";
    }
    // setTimeout(function () {
    //   //snackbarDoc.className = snackbarDoc.className.replace("show", "");
    //   //snackbarDoc.innerHTML = "";
    // }, 2000);

    let elToast = document.getElementById("close-toast");
    if (elToast) {
      elToast.addEventListener("click", function () {
        snackbarDoc.className = snackbarDoc.className.replace("show", "");
        snackbarDoc.innerHTML = "";
      });
    }
  }

 

  public showI18nToast(msg: any, msgType: any) {
      if (msgType == 'warning'){
         this.toastr.warning(msg);
      } 
      else if (msgType == 'error'){
        this.toastr.error(msg);
      }
      else if (msgType == 'success') {
        this.toastr.success(msg);
      }
      else if (msgType == 'info') {
        this.toastr.info(msg);
      }
  }

  // New method - app#894
  public showI18nToastFadeOut(msg: any, msgType: any) {
      if (msgType == 'warning'){
         this.toastr.warning(msg, '', {disableTimeOut: false, timeOut: parseInt(environment.TOAST_FADE_AWAY_TIME)});
      } 
      else if (msgType == 'error'){
        this.toastr.error(msg, '', {disableTimeOut: false, timeOut: parseInt(environment.TOAST_FADE_AWAY_TIME)});
      }
      else if (msgType == 'success') {
        this.toastr.success(msg, '', {disableTimeOut: false, timeOut: parseInt(environment.TOAST_FADE_AWAY_TIME)});
      }
      else if (msgType == 'info') {
        this.toastr.info(msg, '', {disableTimeOut: false, timeOut: parseInt(environment.TOAST_FADE_AWAY_TIME)});
      }
  }
}
