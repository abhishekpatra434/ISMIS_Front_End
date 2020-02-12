import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { ToastService } from '../../../core/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mse',
  templateUrl: './mse.component.html',
  styleUrls: ['./mse.component.css'],
  providers: [ConfirmationService]
})
export class MseComponent implements OnInit {

  searchClientForm: FormGroup;
  mseFormTemplate: any = [];
  highestLevel: any;
  mseAnswerSet: any = [];
  clientUIDList: any = [];
  clientNameList: any = [];
  user: any;
  showMseForm: boolean = false;
  dateFormat: any;
  clientId: any = null;
  isEdit: boolean = false
  isView: any;
  fromIntake: any;
  clientList: any = [];
  summaryTxt: any;
  columns: any = [];
  domSanitizer: any;

  constructor(private clientService: ClientService, private _fb: FormBuilder,
    private route :ActivatedRoute, private router: Router,
    private confirmationService: ConfirmationService, private toastService: ToastService,
    private _domSanitizer: DomSanitizer) {
      this.domSanitizer = _domSanitizer;
     }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.clientId = this.route.snapshot.paramMap.get('clientId');
    this.isView = this.route.snapshot.paramMap.get('isView');
    this.fromIntake = this.route.snapshot.paramMap.get('fr0m1n');

    const url = window.location.href.toString();
    if(this.fromIntake!="Y")
      localStorage.removeItem("insVal");
      //console.log(url);
      if (url.indexOf('/clientmse') < 0) {
        localStorage.removeItem("msVal");
      }
    
    if(this.clientId!=null){
      this.isEdit = true;
      this.getClientMSEDetailsById(this.clientId);
    }
    else{
      this.getMseFormTemplate();
    }
    this.dateFormat = environment.DATE_FORMAT;
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
      dateOfEntry: [""],
      homeId:[this.user.homeId]
    })

    this.pendingMSEClientList();

  }

  pendingMSEClientList(){
    let payload = {
      homeId: this.user.homeId,
     //homeId: this.user.homeId
    }
    this.clientService.getClientMsePendinglist(payload).subscribe(res=>{
      console.log(res);
        this.clientList = res.value;
      
    })
  }

  getClientMSEDetailsById(clientId){
    let payload = {
      clientId: clientId,
     //homeId: this.user.homeId
    }
    this.clientService.getClientIntakeFormDataById(payload).subscribe(res=>{
      console.log(res);
      if(res.key==0){
        this.clientData = res.value.clientMasterBean;
      }
      else{
        this.toastService.showI18nToastFadeOut(res.message,"error");
      }
      
    })
    this.clientService.getClientMseResult(payload).subscribe(res=>{
      console.log(res.value);
      if(res.key==0){
        console.log(res);
        this.showMseForm = true;
        this.summaryTxt = res.value.summeryTxt;
        this.mseFormTemplate = res.value.clientMseResultTempBeans.childNode;
        this.mseAnswerSet = res.value.clientMseBean;
      }
      else{
        this.toastService.showI18nToastFadeOut(res.message,"error");
      }
      
    })
  }

  getMseFormTemplate() {
    this.clientService.getMseFormLabelsTemplate().subscribe(res => {
      this.mseFormTemplate = res.value.childNode;
      console.log(this.mseFormTemplate);
      this.highestLevel = parseInt(res.message);
    })
  }

  
  map: any = {
    clientId: null,
    parentId: null,
    current_lbl_Id: null,
    status: null,
    txtValue: null
  };
  setAnswerTemplate(parent, current) {
    console.log(parent);
    console.log(current);
    let addFlag: boolean = true;
    this.map = {
      clientId: this.clientData.clientId,
      parentId: null,
      current_lbl_Id: null,
      status: null,
      txtValue: null
    };

    for (let i = 0; i < this.mseAnswerSet.length; i++) {
      if (this.mseAnswerSet[i]["parentId"] == parent.mental_status_lbl_id && current.option_type=="R") {
        this.mseAnswerSet[i]["current_lbl_Id"] = current.mental_status_lbl_id;
        addFlag = false;
      }
      else {
        continue;
      }
    }

    if (addFlag) {
      this.map.parentId = parent.mental_status_lbl_id;
      this.map.current_lbl_Id = current.mental_status_lbl_id;
      this.map.status = "Y";
      this.mseAnswerSet.push(this.map);
    }

    if (this.mseAnswerSet.length == 0) {
      this.map.parentId = parent.mental_status_lbl_id;
      this.map.current_lbl_Id = current.mental_status_lbl_id;
      this.map.status = "Y";
      this.mseAnswerSet.push(this.map);
    }

    console.log(this.mseAnswerSet);
  }

  setTextToMSETemplate(txt, current){
    let addFlag: boolean = true;
    this.map = {
      clientId: this.clientData.clientId,
      parentId: null,
      current_lbl_Id: null,
      status: null,
      txtValue: null
    };
    for (let i = 0; i < this.mseAnswerSet.length; i++) {
      if (this.mseAnswerSet[i]["parentId"] == current.mental_status_lbl_parent_id && current.option_type=="T") {
        this.mseAnswerSet[i]["txtValue"] = txt;
        addFlag = false;
      }
      else {
        continue;
      }
    }
    if(txt!="" && addFlag){
      this.map.parentId = current.mental_status_lbl_parent_id;
      this.map.current_lbl_Id = current.mental_status_lbl_id;
      this.map.txtValue = txt;
      this.map.status = "N";
      this.mseAnswerSet.push(this.map);
    }
    console.log(this.mseAnswerSet);
    
  }

  str: any = [];
  setAnswerTemplateCheckbox(parent, current , event){
    let addFlag: boolean = true;
    this.map = {
      clientId: this.clientData.clientId,
      parentId: null,
      current_lbl_Id: null,
      status: null,
      txtValue: null
    };
    if(event.target.checked){
      for (let i = 0; i < this.mseAnswerSet.length; i++) {
        if (this.mseAnswerSet[i]["parentId"] == parent.mental_status_lbl_id && current.option_type=="R") {
          this.mseAnswerSet[i]["current_lbl_Id"] = current.mental_status_lbl_id;
          addFlag = false;
        }
        else {
          continue;
        }
      }
  
      if (addFlag) {
        this.map.parentId = parent.mental_status_lbl_id;
        this.map.current_lbl_Id = current.mental_status_lbl_id;
        this.map.status = "Y";
        this.mseAnswerSet.push(this.map);
      }
  
      if (this.mseAnswerSet.length == 0) {
        this.map.parentId = parent.mental_status_lbl_id;
        this.map.current_lbl_Id = current.mental_status_lbl_id;
        this.map.status = "Y";
        this.mseAnswerSet.push(this.map);
      }
    }
    else{
      let index = this.findIndexToUpdateLabel(current.mental_status_lbl_id);
      this.mseAnswerSet.splice(index, 1);
    }
    
   
      // for (let i = 0; i < this.mseAnswerSet.length; i++) {
      //   if (this.mseAnswerSet[i]["parentId"] == parent.mental_status_lbl_id) {
      //     if(event.target.checked){
      //       this.str.push(current.mental_status_lbl_id)
      //       this.mseAnswerSet[i]["current_lbl_Id"] = this.str;
      //       addFlag = false;
      //     }
      //     else{
      //       let index;
      //       for (let i = 0; i < this.str.length; i++) {
      //         if (this.str[i] == current.mental_status_lbl_id)
      //         index = i;
      //       }
      //       this.str.splice(index, 1);
      //     }
      //   }
      //   else {
      //     continue;
      //   }
      // }

      
    
      // // if (addFlag) {
      // //   this.map.parentId = parent.mental_status_lbl_id;
      // //   this.map.current_lbl_Id = current.mental_status_lbl_id;
      // //   this.map.status = "Y";
      // //   this.mseAnswerSet.push(this.map);
      // // }
  
      // if (this.mseAnswerSet.length == 0) {
      //   this.str.push(current.mental_status_lbl_id);
      //   this.map.parentId = parent.mental_status_lbl_id;
      //   this.map.current_lbl_Id = this.str;
      //   this.map.status = "Y";
      //   this.mseAnswerSet.push(this.map);
      // }
    
      // if(!event.target.checked && this.str.length==0){
      //   let index = this.findIndexToUpdateLabel(parent.mental_status_lbl_id);
      //   this.mseAnswerSet.splice(index, 1);
      // }
    

    console.log(this.mseAnswerSet);
  }
  findIndexToUpdateLabel(currentLabelId) {
    for (let i = 0; i < this.mseAnswerSet.length; i++) {
      if (this.mseAnswerSet[i]["current_lbl_Id"] == currentLabelId)
        return i;
    }
  }

  removeFromArray(arr, ax) {
    var what, a = arguments, L = a.length;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
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
      this.mseAnswerSet = [];
      this.showMseForm = true;
      let searchForm = this.searchClientForm;
      searchForm.controls.clientUID.patchValue(event.clientUid);
      searchForm.controls.clientName.patchValue(event.clientName);
      searchForm.controls.clientId.patchValue(event.clientId);
      searchForm.controls.dateOfEntry.patchValue(new Date(event.dateOfEntry));
  }

  setClientName(event){
    console.log(event);
    this.mseAnswerSet = [];
    this.showMseForm = true;
    let searchForm = this.searchClientForm;
    searchForm.controls.clientName.patchValue(event.clientName);
    searchForm.controls.clientUID.patchValue(event.clientUid);
    searchForm.controls.clientId.patchValue(event.clientId);
    searchForm.controls.dateOfEntry.patchValue(new Date(event.dateOfEntry));
  }


  manageUIDValue(clientUID){
    let searchForm = this.searchClientForm;
    if(clientUID != searchForm.controls.clientUID.value){
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientName.patchValue(null);
      searchForm.controls.dateOfEntry.patchValue(null);
      this.showMseForm = false;
    }
    if(searchForm.controls.clientUID.value==""){
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientName.patchValue("");
      searchForm.controls.dateOfEntry.patchValue("");
      this.showMseForm = false;
    }
  }

  manageNameValue(clientName){
    let searchForm = this.searchClientForm;
    if(clientName != searchForm.controls.clientName.value){
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientUID.patchValue(null);
      searchForm.controls.dateOfEntry.patchValue(null);
      this.showMseForm = false;
    }
    if(searchForm.controls.clientName.value==""){
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientUID.patchValue("");
      searchForm.controls.dateOfEntry.patchValue("");
      this.showMseForm = false;
    }
  }

  summary: any;
  setSummaryText(summary){
    this.summary = summary;
  }

  saveOrUpdateMseForm(){
    if(this.mseAnswerSet.length==0){
      this.toastService.showI18nToastFadeOut("Please fill the MSE form","error");
      return false;
    }
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        let payload = {
          clientMseBean: this.mseAnswerSet,
          summeryTxt: this.summary,
          clientId: this.clientId==null?this.clientData.clientId:this.clientId,
          newEntry: this.clientId==null?true:false,
        }
        console.log(payload);
        
        this.clientService.saveUpdateMseResult(payload).subscribe(res=>{
          console.log(res);
          if(res.key==0){
          this.toastService.showI18nToastFadeOut("Saved Successfully","success");
          if(this.clientId==null){
            this.ngOnInit();
            this.showMseForm = false;
          }
          else{
            this.router.navigate(["client/search-mse"]);
          }
          
          }
        });
      },
      reject: () => {

      }
    });
  }

  clientData: any = null;
  insertToMSEForm(clientId){
    this.showMseForm = true;
    this.clientData = clientId;
  }
  backToClientList(){
    if(this.clientId==null){
      this.showMseForm = false;
    }
    else{
      if(this.fromIntake=="Y"){
        this.router.navigate(["client/search-client"]);
      }
      else{
        this.router.navigate(["client/search-mse"]);
      }
      
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
