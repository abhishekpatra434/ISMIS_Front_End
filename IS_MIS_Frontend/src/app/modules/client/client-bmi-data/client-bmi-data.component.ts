import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-bmi-data',
  templateUrl: './client-bmi-data.component.html',
  styleUrls: ['./client-bmi-data.component.css']
})
export class ClientBmiDataComponent implements OnInit {

  clientBmiList: any = [];
  showSidebar: boolean = false;
  constructor() { }

  ngOnInit() {
    this.clientBmiList = [{name: "ABC", weight: "65", height: "70"},{name: "ABC", weight: "65", height: "70"}]
  }

  editHistory(client){
    this.showSidebar = true;
  }

  addNew(client){
    this.showSidebar = true;
  }

}
