import { Component, HostListener } from '@angular/core';
import { BroadcastService } from './core/services/broadcast.service';
import { PlatformLocation } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, NavigationCancel } from '@angular/router';
import { ToastService } from './core/services/toast.service';
import { timer } from 'rxjs';
import { CommonService } from './core/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ToastService]
})
export class AppComponent {
  title = 'ISMISFrontend';
  isAuthenticated = false;
  subscription: Subscription;
  key: any;
  isVisibleSidebar: boolean = true; //bitan 30102019
  autoTimerSubscription: any;

  constructor(private broadcastService: BroadcastService, private router: Router,
    private location: PlatformLocation,  private commonService: CommonService) {
    this.subscription = this.broadcastService.getAuth().subscribe(isAuthenticated => {
      var _self = this;
      _self.isAuthenticated = isAuthenticated;
    });
    // this.location.onHashChange((e: any) => {
    //   console.log("Test");
    //   sessionStorage.removeItem("user");
    //   this.broadcastService.setAuth(false);
    //   this.router.navigate(['/auth/login']);
    // });




    location.onPopState((event) => {
      console.log("pressed back in add!!!!!")
      history.forward();
    });
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  //bitan 30102019
  ngOnInit() {
    
    const source = timer(15000, 15000);
      
      this.autoTimerSubscription = source.subscribe(val => {
        if(this.isAuthenticated){
          //console.log("Timer counter(no of call) " + val);
          this.commonService.getNotifications().subscribe((res)=>{

          });
        }
        
      });
     
   
    this.broadcastService.getSideVisiblity().subscribe(returnedValue => {
    this.isVisibleSidebar = returnedValue;
   });

   this.router.events.subscribe((event: any) => {
    if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
      //this.checkAuth();
      let snackbarDoc = document.getElementById("snackbar");
      if(snackbarDoc) snackbarDoc.innerHTML = ""
    }
  });

 }//end of oninit

//  @HostListener('window:beforeunload', ['$event'])
//  doSomething($event) {
//    
//  }


}
