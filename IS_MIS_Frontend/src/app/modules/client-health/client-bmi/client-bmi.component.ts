import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../client/client.service';
import { CommonService } from '../../../core/services/common.service';
import { ClientHealthService } from '../client-health.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-bmi',
  templateUrl: './client-bmi.component.html',
  styleUrls: ['./client-bmi.component.css']
})
export class ClientBmiComponent implements OnInit {
  dateFormat: any;
  minDate: any;
  maxDate: any;
  searchClientForm: FormGroup;
  bmiForm: FormGroup;
  user: any;
  clientUIDList: any = [];
  clientNameList: any = [];
  clientBMIList: any=[];
  showClientBMIList: boolean=false;
  addEditBmi: boolean = false;
  clientView: any;
  profilePhoto: any = "";
  domSanitizer: any;
  allowToAdd: boolean = true;
  bmiClassList: any = [];
  isView: any = "N";
  clientId: any=null;
  bmiId: any=null;
  pagination = { first: 0, last: 0, rows: 10, totalRecords: 0 };

  constructor(private _router: Router, private _fb:FormBuilder,
      private clientService : ClientService,
      private commonService: CommonService,
      private clientHealthService: ClientHealthService,
      private _domSanitizer: DomSanitizer,
      private toastService: ToastService) { 
        this.domSanitizer= _domSanitizer;
      }


  ngOnInit() {
    this.dateFormat = environment.DATE_FORMAT;
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.searchClientForm = this._fb.group({
      clientId: [""],
      clientName: [""],
      clientUID: [""],
      homeId:[this.user.homeId]
    })
    this.createBmiForm();
    this.getBMIClassList();
    this.minDate=new Date();
    this.maxDate=new Date();
  }

  createBmiForm(){
    this.bmiForm = this._fb.group({
      bmiId: [null],
      clientId: [this.clientId],
      dateOfEntry: [""],
      weight: [""],
      height: [this.clientView==null || this.clientView.clientBMIBean==null || this.clientView.clientBMIBean.height==null?"":this.clientView.clientBMIBean.height],
      bp: [""],
      bmi: [""],
      bmiClass: [""],
      bmiClassStr: [""],
      cohortYear: [null],
      qtrOfYear: [null],
      isDeleted: ['N'],
      createdBy: [this.user.userId],
    })
  }

  setCohortYear(selectedDate) {
    let cohortYear;
    let quarter;

    if (selectedDate != null) {
      cohortYear = this.commonService.getCohortYear(selectedDate);
      quarter = this.commonService.getQuarter(selectedDate);
      console.log(cohortYear);
      console.log(quarter);
      
      this.bmiForm.patchValue({
        cohortYear: cohortYear,
        qtrOfYear: quarter
      })
    }
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
      this.showClientBMIList = true;
      this.getClientDetailsById(event.clientId);
     // this.getClientBMIList(event.clientId);
      this.bmiForm.patchValue({
        clientId: event.clientId
      })
      this.clientId = event.clientId;
  }

  setClientName(event){
    console.log(event);
    let searchForm = this.searchClientForm;
    searchForm.controls.clientName.patchValue(event.clientName);
    searchForm.controls.clientUID.patchValue(event.clientUid);
    searchForm.controls.clientId.patchValue(event.clientId);
    this.showClientBMIList = true;
    this.getClientDetailsById(event.clientId);
    //this.getClientBMIList(event.clientId);
    this.bmiForm.patchValue({
      clientId: event.clientId
    })
    this.clientId = event.clientId;
  }


  manageUIDValue(clientUID){
    let searchForm = this.searchClientForm;
    if(clientUID != searchForm.controls.clientUID.value){
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientName.patchValue(null);
      this.showClientBMIList = false;
      this.clientView = null;
      this.profilePhoto = "";
      this.bmiForm.patchValue({
        clientId: null
      })
      this.clientId = null;
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
      this.showClientBMIList = false;
      this.clientView = null;
      this.profilePhoto = "";
      this.bmiForm.patchValue({
        clientId: null
      })
      this.clientId = null;
    }
    if(searchForm.controls.clientName.value==""){
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientUID.patchValue("");
    }
  }

  getClientBMIList(clientId){
    let payload = {
      clientId: clientId
    }
    this.clientHealthService.getBmiList(payload).subscribe(res=>{
      console.log(res);
      if(res.key==0){
          this.clientBMIList = res.value;
          this.pagination.totalRecords = this.clientBMIList.length;
          this.pagination.first = 0;
          this.pagination.last = this.pagination.rows;
          if(this.clientBMIList.length==0){
            // this.showClientBMIList = false;
            // this.createBmiForm();
            // this.addEditBmi = true;
            this.addNewBMI();
          }
      }
      else{
        this.toastService.showI18nToastFadeOut(res.message,"error");
      }      
    })
  }

  saveUpdateClientBmi(){
    if(this.bmiForm.invalid){
      this.toastService.showI18nToastFadeOut("Please fill the mandatory fields.","warning");
      return false;
    }
    this.clientHealthService.saveUpdateClientBmi(this.bmiForm.value).subscribe(res=>{
      console.log(res);
      if(res.key==0){
          this.toastService.showI18nToastFadeOut("BMI record updated","success");
          this.getClientBMIList(this.bmiForm.value.clientId);
          this.showClientBMIList = true;
      }
      else{
        this.toastService.showI18nToastFadeOut(res.message,"error");
      }      
    })
  }

  addNewBMI(){
    if(!this.allowToAdd){
      this.toastService.showI18nToastFadeOut("Please fill up primary BMI details in the Intake Form.","error");
      return false;
    }
    this.showClientBMIList = false;
    this.addEditBmi = true;
    this.createBmiForm();
    this.bmiClassStr = "";
    this.bmiId = null;
  }

 dateOfEntry: any;
  getClientDetailsById(clientId){
    let payload = {
      clientId: clientId,
     //homeId: this.user.homeId
    }
    this.clientService.getClientIntakeFormDataById(payload).subscribe(res=>{
      console.log(res);
      if(res.key==0){
       
          this.clientView = res.value;
          this.dateOfEntry = this.convert(this.clientView.clientMasterBean.dateOfEntry);
          
          if(this.clientView.clientBMIBean==null || this.clientView.clientBMIBean.bmi==null){
           
            this.allowToAdd = false;
          }
          else{
            this.setBMIClassIntake(this.clientView.clientBMIBean.bmi);
            this.allowToAdd = true;
            this.getClientBMIList(clientId);
           
          }
          
      }
      else{
        this.toastService.showI18nToastFadeOut(res.message,"error");
      }
      
    })

    let payloadForPhoto = {
      clientId: clientId,
      documetType: "Profile_Picture"
    }
    this.clientService.getClientUploadedFile(payloadForPhoto).subscribe(res=>{
      console.log(res);
      if(res.value!=null)
      {
        this.profilePhoto = "data:image/jpeg;base64,"+res.value;
      }
        
    })

  }

  resetScreen(){
    this.ngOnInit();
    this.clientView=null;
    this.showClientBMIList = false;
  }

  backToBMIList(){
    this.showClientBMIList = true;
    this.bmiId = null;
  }
  
  editBMI(bmi){
    this.bmiId = bmi.bmiId
    this.showClientBMIList = false;
    this.addEditBmi = true;
    this.setBMIClass(bmi.bmi);
    this.bmiForm = this._fb.group({
      bmiId: [bmi.bmiId],
      clientId: [bmi.clientId],
      dateOfEntry: [this.convert(bmi.dateOfEntry)],
      weight: [bmi.weight],
      height: [bmi.height],
      bp: [bmi.bp],
      bmi: [bmi.bmi],
      bmiClass: [bmi.bmiClass],
      bmiClassStr: [bmi.bmiClassStr],
      cohortYear: [bmi.cohortYear],
      qtrOfYear: [bmi.qtrOfYear],
      modifiedBy: [this.user.userId],
    })
  }
  convert(d) {
    var date = new Date(d);
   return new Date(date.setTime(date.getTime() + (6*60*60*1000)))
  }

  getBMIClassList(){
    this.clientService.getBmiClassList().subscribe(res=>{
      console.log(res);
      if(res.key==0){
        this.bmiClassList = res.value;
      }
    })
  }

  calculateBMI(weight, height){
    if(weight=="" || height==""){
      this.bmiForm.patchValue({
        bmi: null,
        bmiClass: null
      })
      this.bmiClassStr = "";
    }
    if(weight!=="" && height!==""){
      let bmi = weight/(height*height);
      this.setBMIClass(bmi);
      this.bmiForm.patchValue({
        bmi: bmi.toFixed(2)
      })
    }
  }

  bmiClassStr: any = "";
  bmiClassStrIntake: any = "";
  setBMIClass(bmi){
    let bmiClass: any=0;
    for(let i=0; i < this.bmiClassList.length; i++){
      if(bmi>=this.bmiClassList[i].lowerBmi && bmi<=this.bmiClassList[i].upperBmi){
        bmiClass = this.bmiClassList[i].bmiClassId
        this.bmiClassStr = this.bmiClassList[i].bmiClass;
        this.bmiClassStrIntake = this.bmiClassList[i].bmiClass;
        this.bmiForm.patchValue({
          bmiClass: bmiClass
        })
      }
    }
  }
  setBMIClassIntake(bmi){
    for(let i=0; i < this.bmiClassList.length; i++){
      if(bmi>=this.bmiClassList[i].lowerBmi && bmi<=this.bmiClassList[i].upperBmi){
        this.bmiClassStrIntake = this.bmiClassList[i].bmiClass;
      }
    }
  }

  viewData:any;
  viewDialog: boolean = false;
  viewBMI(data){
    this.viewData=data;
    this.viewDialog = true;
  }

  bpErrMsg : any = "";
  checkBPFormat(bp){
    let bpPattern = new RegExp("^[0-9]{2,3}[\/][0-9]{2,3}$");
    var res = bpPattern.test(bp);
    if(bpPattern.test(bp)){
      this.bpErrMsg="";
    }
    else{
      this.bpErrMsg="Invalid BP Format";
      this.bmiForm.patchValue({
        bp: null
      })
    }

  }
  
  searchPaginate(event) {
    this.pagination.first = event.first;
    this.pagination.last = event.first + event.rows;
  }

  showExportDailog: boolean = false;
    openExportDialog() {
        this.showExportDailog = true;
    }
    exportToExcel(fromDate, toDate){

    }
    setFromDate(date){

    }
    setToDate(date){

    }
}
