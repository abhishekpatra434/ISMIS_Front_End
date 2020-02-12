
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BroadcastService } from '../../core/services/broadcast.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  constructor(private broadcastService: BroadcastService) {

  }//end of constructor

  ngOnInit() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.user = user;
    this.broadcastService.getUserData().subscribe(user => {
      this.user = user;
    });
  }//end of oninit

}//end of class
