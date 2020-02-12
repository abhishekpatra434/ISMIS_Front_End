import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../client.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from '../../../core/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search-client-mse',
  templateUrl: './search-client-mse.component.html',
  styleUrls: ['./search-client-mse.component.css']
})
export class SearchClientMseComponent implements OnInit {

  searchClientForm: FormGroup;
  clientList: any = [];
  user: any;
  submitted: boolean= false;
  cohortYearList: any = [];
  clientUIDList: any = [];
  clientNameList: any = [];
  columns: any = [];
  domSanitizer: any;

  constructor(private _router: Router, private _fb:FormBuilder,
      private clientService : ClientService,
      private broadcastService: BroadcastService,
      private toastService: ToastService,
      private _domSanitizer: DomSanitizer) {
      this.domSanitizer = _domSanitizer;
     }

  ngOnInit() {
    localStorage.removeItem("insVal");
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.getCohortYearList();
    this.columns=[
      { field: 'clientUid', header: 'Client UID' },
      { field: 'clientName', header: 'Client Name' },
      { field: 'age', header: 'Age(in yrs)' },
      { field: 'policeStation', header: 'Police Station' },
      { field: 'dateOfEntry', header: 'Date of Entry' },
      { field: 'cohortYear', header: 'Cohort Year' }    
    ];
    this.searchClientForm = this._fb.group({
      clientId: [""],
      clientName: [""],
      clientUID: [""],
      cohortYr: [""],
      homeId:[this.user.homeId]
    })
    
    this.broadcastService.setTxt("");
    this.broadcastService.getSearchData().subscribe(data =>{
      console.log(data);
      
    })
    let msVal = JSON.parse(localStorage.getItem('msVal'));
    if(msVal!=null && msVal!=""){
      this.searchClientForm = this._fb.group({
        clientId: [msVal.clientId],
        clientName: [msVal.clientName],
        clientUID: [msVal.clientUID],
        cohortYr: [msVal.cohortYr],
        homeId:[msVal.homeId]
      })
      this.searchClientList();
    }
  }

  editClient(clientId){
    this._router.navigate(["client/clientmse", { clientId: clientId, isView: "N" }])
  }

  viewClient(clientId){
    this._router.navigate(["client/clientmse", { clientId: clientId, isView: "Y" }])
  }

  getCohortYearList(){
    let payload = {
      homeId: this.user.homeId
    }
    this.clientService.getCohortYrList(payload).subscribe(res=>{
      console.log(res);
      if(res.key==0){
        this.cohortYearList = res.value;
      }
    }) 
  }

 
  getclientUIDList(event){
    console.log(event.query);
    let payload = {
      clientUid: event.query,
      homeId: this.user.homeId
    }
    this.clientService.getClientUidListMSE(payload).subscribe((res) => {
      console.log(res.value);
      this.clientUIDList = res.value;
    });
  }

  getClientNameList(event){
    console.log(event.query);
    let payload = {
      clientName: event.query,
      homeId: this.user.homeId
    }
    this.clientService.getClientNameListMSE(payload).subscribe((res) => {
      console.log(res.value);
      this.clientNameList = res.value;
    });
  }

  setClientUID(event){
      console.log(event);
      let searchForm = this.searchClientForm;
      searchForm.controls.clientUID.patchValue(event.clientUid);
      searchForm.controls.clientName.patchValue(event.clientName);
      searchForm.controls.clientId.patchValue(event.clientId);
      this.clientList = [];
    this.submitted = false;
  }

  setClientName(event){
    console.log(event);
    let searchForm = this.searchClientForm;
    searchForm.controls.clientName.patchValue(event.clientName);
    searchForm.controls.clientUID.patchValue(event.clientUid);
    searchForm.controls.clientId.patchValue(event.clientId);
    this.clientList = [];
    this.submitted = false;
  }


  manageUIDValue(clientUID){
    let searchForm = this.searchClientForm;
    if(clientUID != searchForm.controls.clientUID.value){
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientName.patchValue(null);
    }
    if(searchForm.controls.clientUID.value==""){
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientName.patchValue("");
    }
  }

  manageNameValue(clientName){
    let searchForm = this.searchClientForm;
    if(clientName != searchForm.controls.clientName.value){
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientUID.patchValue(null);
    }
    if(searchForm.controls.clientName.value==""){
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientUID.patchValue("");
    }
  }

  searchClientList(){
    this.submitted = true;
    this.clientService.getClientBasicInfoMSE(this.searchClientForm.value).subscribe(res=>{
      console.log(res);
      if(res.key==0){
        localStorage.setItem("msVal",JSON.stringify(this.searchClientForm.value));
        this.broadcastService.setSearchData(this.searchClientForm.value);
        this.clientList = res.value;
      // this.ngOnInit();
      }
      else{
        this.toastService.showI18nToastFadeOut(res.message,"error");
      }
      
    })
  }

  resetForm(){
    //this.searchClientForm.reset();
    
    this.searchClientForm.patchValue({
      clientId: [""],
      clientName: [""],
      clientUID: [""],
      cohortYr: [""],
    })
    this.clientList = [];
    this.submitted = false;
  }

  ngOnDestroy(){
    const url = window.location.href.toString();
      //console.log(url);
      if (url.indexOf('/search-mse') < 0) {
      }else{
        localStorage.removeItem("msVal");
      }
  }

  profilePhoto: any = "";
  hasPhoto: boolean = false;
  showProfilePhoto(clientId){
    let payloadForPhoto = {
      clientId: clientId,
      documetType: "Profile_Picture"
    }
    this.clientService.getClientUploadedFile(payloadForPhoto).subscribe(res=>{
      console.log(res);
      if(res.value!=null)
      {
        this.hasPhoto = true;
        this.profilePhoto = "data:image/jpeg;base64,"+res.value;
      }
      else{
        this.hasPhoto = false;
        this.profilePhoto = "";
      }
        
    })
  }
}
