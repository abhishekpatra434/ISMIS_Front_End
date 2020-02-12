import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationCancel } from '@angular/router';
import { BroadcastService } from '../../services/broadcast.service';
import { CommonService } from '../../services/common.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ConfirmationService]
})
export class HeaderComponent implements OnInit {
  user: any;
  userName: any;
  constructor( private router: Router,
    private broadcastService: BroadcastService, private commonService: CommonService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.userName = this.user.userName;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        let user = JSON.parse(sessionStorage.getItem('user'));
        this.userName = user.userName;
      }
    })
    this.broadcastService.getUserData().subscribe(user => {
      this.userName = user.userName;
    });
  }

  logOut() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        let payload = {
          userId: this.user.userId,
          homeId: this.user.homeId,
        }
        this.commonService.logout(payload).subscribe((res)=>{
          console.log(res)
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        this.broadcastService.setAuth(false);
        this.router.navigate(['/auth/login']);
        
        localStorage.removeItem('activeMenu');
        localStorage.removeItem("activeSubMenu");
        localStorage.removeItem("activeChildSubMenu");
        localStorage.clear();
        });
      },
      reject: () => {
      
      }
    });
  }

  backToDashboard(){
    this.router.navigate(['/dashboard']);
    localStorage.clear();
  }
}
