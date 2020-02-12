import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientService } from '../client.service';
import { CommonService } from '../../../core/services/common.service';
import { ToastService } from '../../../core/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search-client-intake',
  templateUrl: './search-client-intake.component.html',
  styleUrls: ['./search-client-intake.component.css']
})
export class SearchClientIntakeComponent implements OnInit {
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
      private commonService: CommonService,
      private toastService: ToastService,
      private _domSanitizer: DomSanitizer) {
        this.domSanitizer = _domSanitizer;
       }

  ngOnInit() {
    localStorage.removeItem("msVal");
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

    let insVal = JSON.parse(localStorage.getItem('insVal'));
    if(insVal!=null && insVal!=""){
      this.searchClientForm = this._fb.group({
        clientId: [insVal.clientId],
        clientName: [insVal.clientName],
        clientUID: [insVal.clientUID],
        cohortYr: [insVal.cohortYr],
        homeId:[insVal.homeId]
      })
      this.searchClientList();
    }
  }

  editClient(clientId){
    this._router.navigate(["client/edit-intake-form", { clientId: clientId, isView: "N" }])
  }

  viewClient(clientId){
    this._router.navigate(["client/edit-intake-form", { clientId: clientId, isView: "Y" }])
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
    this.clientService.getClientUidList(payload).subscribe((res) => {
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
    this.clientService.getClientNameList(payload).subscribe((res) => {
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
    this.clientService.getClientBasicInfo(this.searchClientForm.value).subscribe(res=>{
      console.log(res);
      if(res.key==0){
        localStorage.setItem("insVal",JSON.stringify(this.searchClientForm.value));
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
      clientId: "",
      clientName: "",
      clientUID: "",
      cohortYr: "",
    })
    this.clientList = [];
    this.submitted = false;
  }
  navigateToMSE(clientId){
    this._router.navigate(["client/clientmse", { clientId: clientId, isView: "Y", fr0m1n: "Y"}])
  }

  ngOnDestroy(){
    const url = window.location.href.toString();
      //console.log(url);
      if (url.indexOf('/search-client') < 0) {
      }else{
        localStorage.removeItem("insVal");
      }
  }

  first: any = 0;
  paginate(event) {
    console.log(event);
    this.first = event.first;
  }

  exportToExcel(){
    var fileName = "Report";
      var a = document.createElement("a");
      let payload = {
        homeId:this.user.homeId+"",
        clientId: this.searchClientForm.value.clientId,
        cohortYr: this.searchClientForm.value.cohortYr,
        exportFor:"INTAKE",
       }
      this.commonService.downloadFile(payload).subscribe(response => {
        var a = document.createElement("a");
        var file = new Blob([response], {type: 'application/vnd.ms-excel'});
        var fileURL = URL.createObjectURL(file);
        //var w = window.open("about:blank");
        a.href = fileURL;
        a.download = fileName;
        a.click();
      })
     
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
