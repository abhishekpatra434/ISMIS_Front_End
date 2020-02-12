import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ClientService } from '../../client/client.service';
import { CommonService } from '../../../core/services/common.service';
import { ClientHealthService } from '../client-health.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-pathology',
  templateUrl: './client-pathology.component.html',
  styleUrls: ['./client-pathology.component.css']
})
export class ClientPathologyComponent implements OnInit {

  dateFormat: any;
  minDate: any;
  maxDate: any;
  searchClientForm: FormGroup;
  pathologyForm: FormGroup;
  user: any;
  clientUIDList: any = [];
  clientNameList: any = [];
  clientPathologyTestList: any = [];
  showClientPathologyTestList: boolean = false;
  addEditTest: boolean = false;
  clientView: any;
  profilePhoto: any = "";
  domSanitizer: any;
  allowToAdd: boolean = true;
  isView: any = "N";
  clientId: any = null;
  pagination = { first: 0, last: 0, rows: 10, totalRecords: 0 };
  seqNo: any = null;
  viewData:any;
  viewDialog: boolean = false;

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
    this.createPathologyTestForm();
    this.minDate = new Date();
    this.maxDate = new Date();
  }

  createPathologyTestForm(){
    //let otherTests: FormGroup[] = [];
    //otherTests.push(this.createOtherTestListForm());
    this.pathologyForm = this._fb.group({
      clientId: [this.clientId],
      userId: [this.user.userId],
      sequenceNo: [null],
      clientThyroidSignificanceBean: this._fb.group({
        thyroidSignfId: [null],
        clientId: [this.clientId],
        thyroTsh: [null],
        thyroT3: [null],
        thyroT4: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientDiabetesSignificanceBean: this._fb.group({
        diabetesSignfId: [null],
        clientId: [this.clientId],
        diabetesRBS: [null],
        diabetesFBS: [null],
        diabetesPPBS: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientHemoglobinSignificanceBean: this._fb.group({
        hemoglobinSignfId: [null],
        clientId: [this.clientId],
        hbPercent: [null],
        esr: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientHivTestBean: this._fb.group({
        hivId: [null],
        clientId: [this.clientId],
        hivData: [null],
        dateOfAdmin: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        seqId: [null],
        isDirty: [false]
      }),
      // listClientOthTest: this._fb.array(otherTests)
      listClientOthTest: this._fb.array([])
    })
  }

  get listClientOthTest(): FormArray {
    return this.pathologyForm.get('listClientOthTest') as FormArray;
  }

  createOtherTestListForm(): FormGroup {
    return this._fb.group({
      otherTestId: [null],
      clientId: [this.clientId],
      othTestName: [null],
      othTestData: [""],
      dateOfAdmin: [null],
      cohortYear: [null],
      qtrOfYear: [null],
      isDeleted: ['N'],
      createdBy: [this.user.userId],
      isDirty: [false]
    });
  }

  addNewOtherTest(){
    this.listClientOthTest.push(this.createOtherTestListForm());
  }

  othTestArray: any = [];
  deleteOthTest(index){
    if (this.listClientOthTest.controls[index].get('otherTestId').value === null) {
      this.listClientOthTest.controls.splice(index, 1);
      this.listClientOthTest.value.splice(index, 1);
    }
    else {
      this.listClientOthTest.value[index].isDeleted = "Y";
      this.listClientOthTest.controls.splice(index, 1);
      this.othTestArray.push(this.listClientOthTest.value[index]);
      this.listClientOthTest.value.splice(index, 1);
    }

  }

  assignIsDeletedToOthTest() {
    var testList = this.pathologyForm.get('listClientOthTest') as FormArray;
    let value = testList.value;
    for(let i=0; i<this.othTestArray.length; i++)
    {
      let existingId = false;
      for(let j=0; j < value.length; j++) {
        var deleteTest: any = this.othTestArray[i];
        if(value[j].otherTestId != '' && value[j].otherTestId == deleteTest.otherTestId)
        {
          existingId = true;
          break;
        }
      }
      if (!existingId) {
        testList.value.push(this.othTestArray[i]);
      }
    }
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

      if(_fromGroup == 'clientThyroidSignificanceBean'){
        this.pathologyForm.get("clientThyroidSignificanceBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientDiabetesSignificanceBean'){
        this.pathologyForm.get("clientDiabetesSignificanceBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientHemoglobinSignificanceBean'){
        this.pathologyForm.get("clientHemoglobinSignificanceBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientHivTestBean'){
        this.pathologyForm.get("clientHivTestBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }
      
    }
  }

  checkDoA(field, value) {

    if (field == 'thyro') {
      let ideas = this.pathologyForm.controls.clientThyroidSignificanceBean.value;
      if (ideas.dateOfEntry == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.pathologyForm.controls.clientThyroidSignificanceBean.patchValue({
          thyroTsh: null,
          thyroT3: null,
          thyroT4: null,
        })
      }
    }
    if (field == 'diabetes') {
      let panss = this.pathologyForm.controls.clientDiabetesSignificanceBean.value;
      if (panss.dateOfEntry == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.pathologyForm.controls.clientDiabetesSignificanceBean.patchValue({
          diabetesRBS: null,
          diabetesFBS: null,
          diabetesPPBS: null
        })
      }
    }
    if (field == 'blood') {
      let gaf = this.pathologyForm.controls.clientHemoglobinSignificanceBean.value;
      if (gaf.dateOfEntry == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.pathologyForm.controls.clientHemoglobinSignificanceBean.patchValue({
          hbPercent: null,
          esr: null,
        })
      }
    }
    if (field == 'hiv') {
      let lsp = this.pathologyForm.controls.clientHivTestBean.value;
      if (lsp.dateOfAdmin == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.pathologyForm.controls.clientHivTestBean.patchValue({
          hivData: null,
        })
      }
    }
    
  }

  checkDoAOtherTest(value, index){
      let test = this.listClientOthTest.controls[index].value;
      if (test.dateOfAdmin == null && value != "") {
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.listClientOthTest.controls[index].patchValue({
          othTestName: null,
          othTestData: null,
        })
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
    this.showClientPathologyTestList = true;
    this.getClientDetailsById(event.clientId);
    // this.getClientBMIList(event.clientId);
    this.pathologyForm.patchValue({
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
    this.showClientPathologyTestList = true;
    this.getClientDetailsById(event.clientId);
    //this.getClientBMIList(event.clientId);
    this.pathologyForm.patchValue({
      clientId: event.clientId
    })
    this.clientId = event.clientId;
  }


  manageUIDValue(clientUID) {
    let searchForm = this.searchClientForm;
    if (clientUID != searchForm.controls.clientUID.value) {
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientName.patchValue(null);
      this.showClientPathologyTestList = false;
      this.clientView = null;
      this.profilePhoto = "";
      this.pathologyForm.patchValue({
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
      this.showClientPathologyTestList = false;
      this.clientView = null;
      this.profilePhoto = "";
      this.pathologyForm.patchValue({
        clientId: null
      })
      this.clientId = null;
    }
    if (searchForm.controls.clientName.value == "") {
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientUID.patchValue("");
    }
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
        this.getClientPathologyTestList(clientId);
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

  getClientPathologyTestList(clientId){
    let payload = {
      clientId: clientId
    }
    this.clientHealthService.getPathologyTestList(payload).subscribe(res => {
      console.log(res);
      if (res.key == 0) {
        this.clientPathologyTestList = res.value;
        this.pagination.totalRecords = this.clientPathologyTestList.length;
          this.pagination.first = 0;
          this.pagination.last = this.pagination.rows;
        if (this.clientPathologyTestList.length == 0) {      
          this.addNewTest();
        }
      }
      else {
        this.toastService.showI18nToastFadeOut(res.message, "error");
      }
    })
  }

  saveUpdateClientPathologyTest(){
    this.assignIsDeletedToOthTest();
    console.log(this.pathologyForm.value);
    if (this.pathologyForm.controls.clientThyroidSignificanceBean.value.dateOfEntry==null && this.pathologyForm.controls.clientDiabetesSignificanceBean.value.dateOfEntry==null
      && this.pathologyForm.controls.clientHemoglobinSignificanceBean.value.dateOfEntry==null && this.pathologyForm.controls.clientHivTestBean.value.dateOfAdmin==null) {
      this.toastService.showI18nToastFadeOut("Please fill atleast one test detail.", "warning");
      return false;
    }
    this.pathologyForm.controls.clientThyroidSignificanceBean.patchValue({isDirty: this.pathologyForm.controls.clientThyroidSignificanceBean.dirty});
    this.pathologyForm.controls.clientDiabetesSignificanceBean.patchValue({isDirty: this.pathologyForm.controls.clientDiabetesSignificanceBean.dirty});
    this.pathologyForm.controls.clientHemoglobinSignificanceBean.patchValue({isDirty: this.pathologyForm.controls.clientHemoglobinSignificanceBean.dirty});
    this.pathologyForm.controls.clientHivTestBean.patchValue({isDirty: this.pathologyForm.controls.clientHivTestBean.dirty});
    for(let i=0;i<this.listClientOthTest.length;i++){
      console.log(this.listClientOthTest.controls[i]);
      if(this.listClientOthTest.controls[i].value.dateOfAdmin==null){
        this.toastService.showI18nToastFadeOut("Please fill atleast one other test detail.", "warning");
        return false;
      }
      this.listClientOthTest.controls[i].patchValue({isDirty: this.listClientOthTest.controls[i].dirty});
    }
    console.log(this.pathologyForm);
    
    let data = this.pathologyForm.value;
    let payload = {
      "clientId": data.clientId,
      "sequenceNo": data.sequenceNo,
      "userId": data.userId,
      "clientThyroidSignificanceBean": data.clientThyroidSignificanceBean.dateOfEntry==null?null:data.clientThyroidSignificanceBean,
      "clientDiabetesSignificanceBean": data.clientDiabetesSignificanceBean.dateOfEntry==null?null:data.clientDiabetesSignificanceBean,
      "clientHemoglobinSignificanceBean": data.clientHemoglobinSignificanceBean.dateOfEntry==null?null:data.clientHemoglobinSignificanceBean,
      "clientHivTestBean": data.clientHivTestBean.dateOfAdmin==null?null:data.clientHivTestBean,
      "listClientOthTest": data.listClientOthTest.length==0?[]:data.listClientOthTest
    }
    console.log(payload);
    

    this.clientHealthService.savePathologyTest(payload).subscribe(res => {
      console.log(res);
      if (res.key == 0) {
        this.toastService.showI18nToastFadeOut("Pathology test record updated", "success");
        this.getClientPathologyTestList(this.pathologyForm.value.clientId);
        this.showClientPathologyTestList = true;
      }
      else {
        this.toastService.showI18nToastFadeOut(res.message, "error");
      }
    })    
    
  }

  resetScreen() {
    this.ngOnInit();
    this.clientView = null;
    this.showClientPathologyTestList = false;
  }

  backToList() {
    this.showClientPathologyTestList = true;
    this.seqNo = null;
  }

  addNewTest() {
    if (!this.allowToAdd) {
      this.toastService.showI18nToastFadeOut("You must have to enter Pathology test data in intake form", "error");
      return false;
    }
    this.showClientPathologyTestList = false;
    this.addEditTest = true;
    this.createPathologyTestForm();
    this.seqNo = null;
  }

  editPathology(data){
    this.seqNo = data.sequenceNo
    this.showClientPathologyTestList = false;
    this.addEditTest = true;
    this.pathologyForm = this._fb.group({
      clientId: [data.clientId],
      sequenceNo: [data.sequenceNo],
      userId: [this.user.userId],
      clientThyroidSignificanceBean: this._fb.group({
        thyroidSignfId: [data.clientThyroidSignificanceBean.thyroidSignfId==0?null:data.clientThyroidSignificanceBean.thyroidSignfId],
        clientId: [data.clientThyroidSignificanceBean.clientId==0?this.clientId:data.clientThyroidSignificanceBean.clientId],
        thyroTsh: [data.clientThyroidSignificanceBean.thyroTsh],
        thyroT3: [data.clientThyroidSignificanceBean.thyroT3],
        thyroT4: [data.clientThyroidSignificanceBean.thyroT4],
        dateOfEntry: [data.clientThyroidSignificanceBean.dateOfEntry==null?null:this.convert(data.clientThyroidSignificanceBean.dateOfEntry)],
        cohortYear: [data.clientThyroidSignificanceBean.cohortYear],
        qtrOfYear: [data.clientThyroidSignificanceBean.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientDiabetesSignificanceBean: this._fb.group({
        diabetesSignfId: [data.clientDiabetesSignificanceBean.diabetesSignfId==0?null:data.clientDiabetesSignificanceBean.diabetesSignfId],
        clientId: [data.clientDiabetesSignificanceBean.clientId==0?this.clientId:data.clientDiabetesSignificanceBean.clientId],
        diabetesRBS: [data.clientDiabetesSignificanceBean.diabetesRBS],
        diabetesFBS: [data.clientDiabetesSignificanceBean.diabetesFBS],
        diabetesPPBS: [data.clientDiabetesSignificanceBean.diabetesPPBS],
        dateOfEntry: [data.clientDiabetesSignificanceBean.dateOfEntry==null?null:this.convert(data.clientDiabetesSignificanceBean.dateOfEntry)],
        cohortYear: [data.clientDiabetesSignificanceBean.cohortYear],
        qtrOfYear: [data.clientDiabetesSignificanceBean.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientHemoglobinSignificanceBean: this._fb.group({
        hemoglobinSignfId: [data.clientHemoglobinSignificanceBean.hemoglobinSignfId==0?null:data.clientHemoglobinSignificanceBean.hemoglobinSignfId],
        clientId: [data.clientHemoglobinSignificanceBean.clientId==0?this.clientId:data.clientHemoglobinSignificanceBean.clientId],
        hbPercent: [data.clientHemoglobinSignificanceBean.hbPercent],
        esr: [data.clientHemoglobinSignificanceBean.esr],
        dateOfEntry: [data.clientHemoglobinSignificanceBean.dateOfEntry==null?null:this.convert(data.clientHemoglobinSignificanceBean.dateOfEntry)],
        cohortYear: [data.clientHemoglobinSignificanceBean.cohortYear],
        qtrOfYear: [data.clientHemoglobinSignificanceBean.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientHivTestBean: this._fb.group({
        hivId: [data.clientHivTestBean.hivId==0?null:data.clientHivTestBean.hivId],
        clientId: [data.clientHivTestBean.clientId==0?this.clientId:data.clientHivTestBean.clientId],
        hivData: [data.clientHivTestBean.hivData],
        dateOfAdmin: [data.clientHivTestBean.dateOfAdmin==null?null:this.convert(data.clientHivTestBean.dateOfAdmin)],
        cohortYear: [data.clientHivTestBean.cohortYear],
        qtrOfYear: [data.clientHivTestBean.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      listClientOthTest: this._fb.array([])
    })
    let otherTests: any
    if(data["listClientOthTest"]){
      for (let i = 0; i < data["listClientOthTest"].length; i++) {
        otherTests = this.pathologyForm.get('listClientOthTest') as FormArray;
        otherTests.push(this.editOtherTestForm(data["listClientOthTest"][i]));
      }
    }
    
    console.log(this.pathologyForm.value);
  }

  editOtherTestForm(test): FormGroup {
    return this._fb.group({
      otherTestId: [test.otherTestId],
      clientId: [test.clientId],
      othTestName: [test.othTestName],
      othTestData: [test.othTestData],
      dateOfAdmin: [test.dateOfAdmin==null?null:this.convert(test.dateOfAdmin)],
      cohortYear: [test.cohortYear],
      qtrOfYear: [test.qtrOfYear],
      isDeleted: [test.isDeleted],
      modifiedBy: [this.user.userId],
      isDirty: [false]
    });
  }

  viewPathology(data){
    this.viewData=data;
    this.viewDialog = true;
  }

  convert(d) {
    var date = new Date(d);
    return new Date(date.setTime(date.getTime() + (6 * 60 * 60 * 1000)))
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
    var fileName = "PathologyReport";
    var a = document.createElement("a");
    let payload = {
      homeId:this.user.homeId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),       
     }
    this.commonService.exportToExcelPathologyTest(payload).subscribe(response => {
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
