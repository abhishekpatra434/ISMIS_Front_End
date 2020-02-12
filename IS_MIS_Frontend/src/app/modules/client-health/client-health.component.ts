
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BroadcastService } from '../../core/services/broadcast.service';


@Component({
  selector: 'app-client-health',
  templateUrl: './client-health.component.html',
  styleUrls: ['./client-health.component.css']
})
export class ClientHealthComponent implements OnInit {
  
  constructor(private broadcastService: BroadcastService) {

  }

  ngOnInit() {

  }

}
