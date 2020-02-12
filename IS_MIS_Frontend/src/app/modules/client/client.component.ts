
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BroadcastService } from '../../core/services/broadcast.service';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  user: any;
  txt: any;
  constructor(private broadcastService: BroadcastService) {

  }//end of constructor

  ngOnInit() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.user = user;
    this.broadcastService.getTxt().subscribe(data =>{

    })
  }//end of oninit

}//end of class
