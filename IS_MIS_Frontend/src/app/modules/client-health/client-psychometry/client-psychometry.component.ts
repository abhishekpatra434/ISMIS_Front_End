import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../client/client.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ClientHealthService } from '../client-health.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from 'src/app/core/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-client-psychometry',
  templateUrl: './client-psychometry.component.html',
  styleUrls: ['./client-psychometry.component.css']
})
export class ClientPsychometryComponent implements OnInit {

  dateFormat: any;
  minDate: any;
  maxDate: any;
  searchClientForm: FormGroup;
  psychometryForm: FormGroup;
 // exportToexcelForm : FormGroup;
  user: any;
  clientUIDList: any = [];
  clientNameList: any = [];
  clientPsychometicTestList: any = [];
  showClientPsychometryTestList: boolean = false;
  addEditTest: boolean = false;
  clientView: any;
  profilePhoto: any = "";
  domSanitizer: any;
  allowToAdd: boolean = true;
  bmiClassList: any = [];
  isView: any = "N";
  clientId: any = null;
  gafScoreList:any = [];
  pagination = { first: 0, last: 0, rows: 10, totalRecords: 0 };

  constructor(private _router: Router, private _fb: FormBuilder,
    private clientService: ClientService,
    private commonService: CommonService,
    private clientHealthService: ClientHealthService,
    private _domSanitizer: DomSanitizer,
    private toastService: ToastService) {
    this.domSanitizer = _domSanitizer;
  }


  ngOnInit() {
    this.dateFormat = environment.DATE_FORMAT;
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.searchClientForm = this._fb.group({
      clientId: [""],
      clientName: [""],
      clientUID: [""],
      homeId: [this.user.homeId]
    })
    this.createPsychometryTestForm();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.commonService.getAttributesByCategoryId(10).subscribe((res) => {
      this.gafScoreList = res.value;
    })
  }

  createPsychometryTestForm() {
    this.psychometryForm = this._fb.group({

      clientId: [this.clientId],
      sequenceNo: [null],
      userId: [this.user.userId],
      clientPsychoGafBean: this._fb.group({
        psychoGafId: [null],
        clientId: [this.clientId],
        gafScore: [null],
        gafClass: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoIdeasBean: this._fb.group({
        psychoIdeasId: [null],
        clientId: [this.clientId],
        sc: [null],
        ia: [null],
        c_and_u: [null],
        wrk: [null],
        doi: [null],
        //gds: [null],
        gis: [null],
        ideasStatus: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoLspBean: this._fb.group({
        psychoLspId: [null],
        clientId: [this.clientId],
        lspScore: [null],
        lspClass: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoPanss: this._fb.group({
        psychoPanssId: [null],
        clientId: [this.clientId],
        ps: [null],
        ns: [null],
        gp: [null],
        total: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      })
    })
  }


  exportToexcelForm = this._fb.group({
     homeId:[""],
     fromDate:[""],
     toDate:[""]
  })

  setCohortYear(selectedDate, _fromGroup) {
    let cohortYear;
    let quarter;

    if (selectedDate != null) {
      cohortYear = this.commonService.getCohortYear(selectedDate);
      quarter = this.commonService.getQuarter(selectedDate);
      console.log(cohortYear);
      console.log(quarter);

      if(_fromGroup == 'clientPsychoIdeasBean'){
        this.psychometryForm.get("clientPsychoIdeasBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientPsychoPanss'){
        this.psychometryForm.get("clientPsychoPanss").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientPsychoGafBean'){
        this.psychometryForm.get("clientPsychoGafBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientPsychoLspBean'){
        this.psychometryForm.get("clientPsychoLspBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }
      
    }
  }

  getclientUIDList(event) {
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

  getClientNameList(event) {
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

  setClientUID(event) {
    console.log(event);
    let searchForm = this.searchClientForm;
    searchForm.controls.clientUID.patchValue(event.clientUid);
    searchForm.controls.clientName.patchValue(event.clientName);
    searchForm.controls.clientId.patchValue(event.clientId);
    this.showClientPsychometryTestList = true;
    this.getClientDetailsById(event.clientId);
    // this.getClientBMIList(event.clientId);
    this.psychometryForm.patchValue({
      clientId: event.clientId
    })
    this.clientId = event.clientId;
  }

  setClientName(event) {
    console.log(event);
    let searchForm = this.searchClientForm;
    searchForm.controls.clientName.patchValue(event.clientName);
    searchForm.controls.clientUID.patchValue(event.clientUid);
    searchForm.controls.clientId.patchValue(event.clientId);
    this.showClientPsychometryTestList = true;
    this.getClientDetailsById(event.clientId);
    //this.getClientBMIList(event.clientId);
    this.psychometryForm.patchValue({
      clientId: event.clientId
    })
    this.clientId = event.clientId;
  }


  manageUIDValue(clientUID) {
    let searchForm = this.searchClientForm;
    if (clientUID != searchForm.controls.clientUID.value) {
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientName.patchValue(null);
      this.showClientPsychometryTestList = false;
      this.clientView = null;
      this.profilePhoto = "";
      this.psychometryForm.patchValue({
        clientId: null
      })
      this.clientId = null;
    }
    if (searchForm.controls.clientUID.value == "") {
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientName.patchValue("");
    }
  }

  manageNameValue(clientName) {
    let searchForm = this.searchClientForm;
    if (clientName != searchForm.controls.clientName.value) {
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientUID.patchValue(null);
      this.showClientPsychometryTestList = false;
      this.clientView = null;
      this.profilePhoto = "";
      this.psychometryForm.patchValue({
        clientId: null
      })
      this.clientId = null;
    }
    if (searchForm.controls.clientName.value == "") {
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientUID.patchValue("");
    }
  }

 

  getClientPsychommetryTestList(clientId) {
    let payload = {
      clientId: clientId
    }
    this.clientHealthService.getPshychometryTestList(payload).subscribe(res => {
      console.log(res);
      if (res.key == 0) {
        this.clientPsychometicTestList = res.value;
        this.pagination.totalRecords = this.clientPsychometicTestList.length;
          this.pagination.first = 0;
          this.pagination.last = this.pagination.rows;
        if (this.clientPsychometicTestList.length == 0) {      
          this.addNewTest();
        }
      }
      else {
        this.toastService.showI18nToastFadeOut(res.message, "error");
      }
    })
  }

  saveUpdateClientPsychometryTest() {
    if (this.psychometryForm.controls.clientPsychoGafBean.value.dateOfEntry==null && this.psychometryForm.controls.clientPsychoIdeasBean.value.dateOfEntry==null
      && this.psychometryForm.controls.clientPsychoLspBean.value.dateOfEntry==null && this.psychometryForm.controls.clientPsychoPanss.value.dateOfEntry==null) {
      this.toastService.showI18nToastFadeOut("Please fill atleast one test detail.", "warning");
      return false;
    }
    this.psychometryForm.controls.clientPsychoGafBean.patchValue({isDirty: this.psychometryForm.controls.clientPsychoGafBean.dirty});
    this.psychometryForm.controls.clientPsychoIdeasBean.patchValue({isDirty: this.psychometryForm.controls.clientPsychoIdeasBean.dirty});
    this.psychometryForm.controls.clientPsychoLspBean.patchValue({isDirty: this.psychometryForm.controls.clientPsychoLspBean.dirty});
    this.psychometryForm.controls.clientPsychoPanss.patchValue({isDirty: this.psychometryForm.controls.clientPsychoPanss.dirty});
    console.log(this.psychometryForm);
    
    let data = this.psychometryForm.value;
    let payload = {
      "clientId": data.clientId,
      "sequenceNo": data.sequenceNo,
      "userId": data.userId,
      "clientPsychoGafBean": data.clientPsychoGafBean.dateOfEntry==null?null:data.clientPsychoGafBean,
      "clientPsychoIdeasBean": data.clientPsychoIdeasBean.dateOfEntry==null?null:data.clientPsychoIdeasBean,
      "clientPsychoLspBean": data.clientPsychoLspBean.dateOfEntry==null?null:data.clientPsychoLspBean,
      "clientPsychoPanss": data.clientPsychoPanss.dateOfEntry==null?null:data.clientPsychoPanss,
    }

    this.clientHealthService.saveUpdateClientPsychometryTest(payload).subscribe(res => {
      console.log(res);
      if (res.key == 0) {
        this.toastService.showI18nToastFadeOut("Psychometry test record updated", "success");
        this.getClientPsychommetryTestList(this.psychometryForm.value.clientId);
        this.showClientPsychometryTestList = true;
      }
      else {
        this.toastService.showI18nToastFadeOut(res.message, "error");
      }
    })    
  }

  addNewTest() {
    if (!this.allowToAdd) {
      this.toastService.showI18nToastFadeOut("You must have to enter Psychometry test data in intake form", "error");
      return false;
    }
    this.showClientPsychometryTestList = false;
    this.addEditTest = true;
    this.createPsychometryTestForm();
    this.seqNo = null;
  }


  dateOfEntry:any;
  getClientDetailsById(clientId) {
    let payload = {
      clientId: clientId,
      //homeId: this.user.homeId
    }
    this.clientService.getClientIntakeFormDataById(payload).subscribe(res => {
      console.log(res);
      if (res.key == 0) {

        this.clientView = res.value;
        this.dateOfEntry = this.convert(this.clientView.clientMasterBean.dateOfEntry);
        // if (this.clientView.clientBMIBean.bmi == null) {
        //   this.allowToAdd = false;
        // }
        // else {
        //   this.allowToAdd = true;
        // }
        this.getClientPsychommetryTestList(clientId);
      }
      else {
        this.toastService.showI18nToastFadeOut(res.message, "error");
      }

    })

    let payloadForPhoto = {
      clientId: clientId,
      documetType: "Profile_Picture"
    }
    this.clientService.getClientUploadedFile(payloadForPhoto).subscribe(res => {
      console.log(res);
      if (res.value != null) {
        this.profilePhoto = "data:image/jpeg;base64," + res.value;
      }

    })

  }

  resetScreen() {
    this.ngOnInit();
    this.clientView = null;
    this.showClientPsychometryTestList = false;
  }

  backToList() {
    this.showClientPsychometryTestList = true;
    this.seqNo = null;
  }

  
  convert(d) {
    var date = new Date(d);
    return new Date(date.setTime(date.getTime() + (6 * 60 * 60 * 1000)))
  }



  scErrMsg: any = "";
  iaErrMsg: any = "";
  cuErrMsg: any = "";
  wErrMsg: any = "";
  doiErrMsg: any = "";

  psErrMsg: any = "";
  nsErrMsg: any = "";
  gpErrMsg: any = "";

  lspErrMsg: any = "";


  validateField(v, field) {
    let value = parseInt(v);
    // IDEAS
    if (field == "sc") {
      if (value < 0 || value > 4) {
        this.scErrMsg = "SC range is 0-4";
        this.psychometryForm.controls.clientPsychoIdeasBean.patchValue({ sc: null });
      }
      else {
        this.scErrMsg = "";
      }
    }

    if (field == "ia") {
      if (value < 0 || value > 4) {
        this.iaErrMsg = "IA range is 0-4";
        this.psychometryForm.controls.clientPsychoIdeasBean.patchValue({ ia: null });
      }
      else {
        this.iaErrMsg = "";
      }
    }

    if (field == "cu") {
      if (value < 0 || value > 4) {
        this.cuErrMsg = "C&U range is 0-4";
        this.psychometryForm.controls.clientPsychoIdeasBean.patchValue({ c_and_u: null });
      }
      else {
        this.cuErrMsg = "";
      }
    }

    if (field == "w") {
      if (value < 0 || value > 4) {
        this.wErrMsg = "W range is 0-4";
        this.psychometryForm.controls.clientPsychoIdeasBean.patchValue({ wrk: null });
      }
      else {
        this.wErrMsg = "";
      }
    }

    if (field == "doi") {
      if (value < 0 || value > 4) {
        //this.toastService.showI18nToastFadeOut("Error","error")
        this.doiErrMsg = "DOI range is 0-4";
        this.psychometryForm.controls.clientPsychoIdeasBean.patchValue({ doi: null });
      }
      else {
        this.doiErrMsg = "";
      }
    }
    // PANSS 
    if (field == "ps") {
      if (value < 7 || value > 49) {
        this.psErrMsg = "PS range is 7-49";
        this.psychometryForm.controls.clientPsychoPanss.patchValue({ ps: null });
      }
      else {
        this.psErrMsg = "";
      }
    }

    if (field == "ns") {
      if (value < 7 || value > 49) {
        this.nsErrMsg = "PS range is 7-49";
        this.psychometryForm.controls.clientPsychoPanss.patchValue({ ns: null });
      }
      else {
        this.nsErrMsg = "";
      }
    }

    if (field == "gp") {
      if (value < 16 || value > 112) {
        this.gpErrMsg = "GP range is 16-112";
        this.psychometryForm.controls.clientPsychoPanss.patchValue({ gp: null });
      }
      else {
        this.gpErrMsg = "";
      }
    }

    // LSP  
    if (field == "lspScore") {
      if (value < 0 || value > 48) {
        this.lspErrMsg = "LSP Score range is 0-48";
        this.psychometryForm.controls.clientPsychoLspBean.patchValue({ lspScore: null });
      }
      else {
        this.lspErrMsg = "";
      }
    }
  }


  checkDoA(field, value) {

    if (field == 'ideas') {
      let ideas = this.psychometryForm.controls.clientPsychoIdeasBean.value;
      if (ideas.dateOfEntry == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.psychometryForm.controls.clientPsychoIdeasBean.patchValue({
          sc: null,
          ia: null,
          c_and_u: null,
          wrk: null,
          doi: null,
          //gds: [null],
          gis: null,
        })
      }
    }
    if (field == 'panss') {
      let panss = this.psychometryForm.controls.clientPsychoPanss.value;
      if (panss.dateOfEntry == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.psychometryForm.controls.clientPsychoPanss.patchValue({
          ps: null,
          ns: null,
          gp: null,
          total: null,
        })
      }
    }
    if (field == 'gaf') {
      let gaf = this.psychometryForm.controls.clientPsychoGafBean.value;
      if (gaf.dateOfEntry == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.psychometryForm.controls.clientPsychoGafBean.patchValue({
          gafScore: null,
        })
      }
    }
    if (field == 'lsp') {
      let lsp = this.psychometryForm.controls.clientPsychoLspBean.value;
      if (lsp.dateOfEntry == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.psychometryForm.controls.clientPsychoLspBean.patchValue({
          lspScore: null,
        })
      }
    }
  }

  calculateGIS() {
    let ideaData = this.psychometryForm.controls.clientPsychoIdeasBean.value;
    console.log(ideaData);  
    let gis = parseInt(ideaData.sc == null || ideaData.sc == "" ? 0 : ideaData.sc) + parseInt(ideaData.ia == null || ideaData.ia == "" ? 0 : ideaData.ia)
      + parseInt(ideaData.c_and_u == null || ideaData.c_and_u == "" ? 0 : ideaData.c_and_u) + parseInt(ideaData.wrk == null || ideaData.wrk == "" ? 0 : ideaData.wrk)
      + parseInt(ideaData.doi == null || ideaData.doi == "" ? 0 : ideaData.doi);   
    this.psychometryForm.controls.clientPsychoIdeasBean.patchValue({ gis: gis });
  }

  seqNo: any=null;
  editPsychometry(data){
    this.seqNo = data.sequenceNo
    this.showClientPsychometryTestList = false;
    this.addEditTest = true;
    this.psychometryForm = this._fb.group({
      clientId: [data.clientId],
      sequenceNo: [data.sequenceNo],
      userId: [this.user.userId],
      clientPsychoGafBean: this._fb.group({
        psychoGafId: [data.clientPsychoGafBean.psychoGafId==0?null:data.clientPsychoGafBean.psychoGafId],
        clientId: [data.clientPsychoGafBean.clientId==0?this.clientId:data.clientPsychoGafBean.clientId],
        gafScore: [data.clientPsychoGafBean.gafScore],
        gafClass: [data.clientPsychoGafBean.gafClass],
        dateOfEntry: [data.clientPsychoGafBean.dateOfEntry==null?null:this.convert(data.clientPsychoGafBean.dateOfEntry)],
        cohortYear: [data.clientPsychoGafBean.cohortYear],
        qtrOfYear: [data.clientPsychoGafBean.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoIdeasBean: this._fb.group({
        psychoIdeasId: [data.clientPsychoIdeasBean.psychoIdeasId==0?null:data.clientPsychoIdeasBean.psychoIdeasId],
        clientId: [data.clientPsychoIdeasBean.clientId==0?this.clientId:data.clientPsychoIdeasBean.clientId],
        sc: [data.clientPsychoIdeasBean.sc],
        ia: [data.clientPsychoIdeasBean.ia],
        c_and_u: [data.clientPsychoIdeasBean.c_and_u],
        wrk: [data.clientPsychoIdeasBean.wrk],
        doi: [data.clientPsychoIdeasBean.doi],
        //gds: [null],
        gis: [data.clientPsychoIdeasBean.gis],
        ideasStatus: [data.clientPsychoIdeasBean.ideasStatus],
        dateOfEntry: [data.clientPsychoIdeasBean.dateOfEntry==null?null:this.convert(data.clientPsychoIdeasBean.dateOfEntry)],
        cohortYear: [data.clientPsychoIdeasBean.cohortYear],
        qtrOfYear: [data.clientPsychoIdeasBean.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoLspBean: this._fb.group({
        psychoLspId: [data.clientPsychoLspBean.psychoLspId==0?null:data.clientPsychoLspBean.psychoLspId],
        clientId: [data.clientPsychoLspBean.clientId==0?this.clientId:data.clientPsychoLspBean.clientId],
        lspScore: [data.clientPsychoLspBean.lspScore],
        lspClass: [data.clientPsychoLspBean.lspClass],
        dateOfEntry: [data.clientPsychoLspBean.dateOfEntry==null?null:this.convert(data.clientPsychoLspBean.dateOfEntry)],
        cohortYear: [data.clientPsychoLspBean.cohortYear],
        qtrOfYear: [data.clientPsychoLspBean.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoPanss: this._fb.group({
        psychoPanssId: [data.clientPsychoPanss.psychoPanssId==0?null:data.clientPsychoPanss.psychoPanssId],
        clientId: [data.clientPsychoPanss.clientId==0?this.clientId:data.clientPsychoPanss.clientId],
        ps: [data.clientPsychoPanss.ps],
        ns: [data.clientPsychoPanss.ns],
        gp: [data.clientPsychoPanss.gp],
        total: [data.clientPsychoPanss.total],
        dateOfEntry: [data.clientPsychoPanss.dateOfEntry==null?null:this.convert(data.clientPsychoPanss.dateOfEntry)],
        cohortYear: [data.clientPsychoPanss.cohortYear],
        qtrOfYear: [data.clientPsychoPanss.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      })
    })

    console.log(this.psychometryForm.value);
    
  }

  viewData:any;
  viewDialog: boolean = false;
  viewPsychometry(data){
    this.viewData=data;
    this.viewDialog = true;
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

    var fileName = "PsychometryReport";
      var a = document.createElement("a");
      let payload = {
        homeId:this.user.homeId,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),       
       }
      this.commonService.exportToExcelPsychometryTest(payload).subscribe(response => {
        var a = document.createElement("a");
        if(response.type == 'text/html'){
          console.log("No Record Found");
        } else {
          var file = new Blob([response], {type: 'application/vnd.ms-excel'});
          var fileURL = URL.createObjectURL(file);
          //var w = window.open("about:blank");
          a.href = fileURL;
          a.download = fileName;
          a.click();
        }
        
      })
  }
  setFromDate(date){

  }
  setToDate(date){

  }
}
