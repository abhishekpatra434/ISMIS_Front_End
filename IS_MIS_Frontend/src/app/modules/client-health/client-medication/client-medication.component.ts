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
  selector: 'app-client-medication',
  templateUrl: './client-medication.component.html',
  styleUrls: ['./client-medication.component.css']
})
export class ClientMedicationComponent implements OnInit {

  dateFormat: any;
  minDate: any;
  maxDate: any;
  searchClientForm: FormGroup;
  medicationForm: FormGroup;
  user: any;
  clientUIDList: any = [];
  clientNameList: any = [];
  clientMedicationList: any=[];
  showClientMedicationList: boolean=false;
  addEditMedication: boolean = false;
  clientView: any;
  profilePhoto: any = "";
  domSanitizer: any;
  allowToAdd: boolean = true;
  isView: any = "N";
  clientId: any=null;
  medicationId: any=null;
  diagnosisList:any = [];
  medicineType: any = [];
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
    this.createMedicationForm();
    this.minDate=new Date();
    this.maxDate=new Date();
    this.commonService.getAttributesByCategoryId(5).subscribe((res) => {
      this.diagnosisList = res.value;
    })
    this.commonService.getAttributesByCategoryId(9).subscribe((res) => {
      this.medicineType = res.value;
    })
  }

  createMedicationForm(){
    let medicineList: FormGroup[] = [];
    medicineList.push(this.createMedicationDetailForm());
    this.medicationForm = this._fb.group({
      medicationId: [null],
      clientId: [this.clientId],
      diagnosis: [""],
      doctorName: [""],
      dateOfPrescription: [""],
      cohortYear: [null],
      qtrOfYear: [null],
      isDeleted: ['N'],
      createdBy: [this.user.userId],
      clientMedicationDetailsList: this._fb.array(medicineList)
    })
  }

  get clientMedicationDetailsList(): FormArray {
    return this.medicationForm.get('clientMedicationDetailsList') as FormArray;
  }

  createMedicationDetailForm(): FormGroup {
    return this._fb.group({
      medicationDetailId: [null],
      clientId: [this.clientId],
      medicationId: [null],
      medicineName: [""],
      medicineDoses: [""],
      medicineType: [""],
      medicineTypeStr: [""],
      isDeleted: ['N'],
      createdBy: [this.user.userId],
    });
  }

  editMedication(medicine){
    this.medicationId = medicine.medicationId
    this.showClientMedicationList = false;
    this.addEditMedication = true;
    this.medicationForm = this._fb.group({
      medicationId: [medicine.medicationId],
      clientId: [medicine.clientId],
      dateOfPrescription: [this.convert(medicine.dateOfPrescription)],
      diagnosis: [medicine.diagnosis],
      doctorName: [medicine.doctorName],
      clientMedicationDetailsList: this._fb.array([]),
      cohortYear: [medicine.cohortYear],
      qtrOfYear: [medicine.qtrOfYear],
      modifiedBy: [this.user.userId],
    })
    let clientMedicationDetailsList: any
    for (let i = 0; i < medicine["clientMedicationDetailsList"].length; i++) {
      clientMedicationDetailsList = this.medicationForm.get('clientMedicationDetailsList') as FormArray;
      clientMedicationDetailsList.push(this.editMedicationDetailForm(medicine["clientMedicationDetailsList"][i]));
    }
  }

 editMedicationDetailForm(medicine): FormGroup {
    return this._fb.group({
      medicationDetailId: [medicine.medicationDetailId],
      clientId: [medicine.clientId],
      medicationId: [medicine.medicationId],
      medicineName: [medicine.medicineName],
      medicineDoses: [medicine.medicineDoses],
      medicineType: [medicine.medicineType],
      medicineTypeStr: [medicine.medicineTypeStr],
      isDeleted: [medicine.isDeleted],
      modifiedBy: [this.user.userId],
    });
  }

  addNewMedicine(){
    this.clientMedicationDetailsList.push(this.createMedicationDetailForm());
  }

  clientMedicineArray: any = [];
  deleteMedicine(index){
    if (this.clientMedicationDetailsList.controls[index].get('medicationDetailId').value === null) {
      this.clientMedicationDetailsList.controls.splice(index, 1);
      this.clientMedicationDetailsList.value.splice(index, 1);
    }
    else {
      this.clientMedicationDetailsList.value[index].isDeleted = "Y";
      this.clientMedicationDetailsList.controls.splice(index, 1);
      this.clientMedicineArray.push(this.clientMedicationDetailsList.value[index]);
      this.clientMedicationDetailsList.value.splice(index, 1);
    }
    console.log(this.medicationForm.value);
    console.log(this.clientMedicineArray);
  }

  assignIsDeletedToMedicine() {
    var medicineList = this.medicationForm.get('clientMedicationDetailsList') as FormArray;
    let value = medicineList.value;
    for(let i=0; i<this.clientMedicineArray.length; i++)
    {
      let existingId = false;
      for(let j=0; j < value.length; j++) {
        var deleteMed: any = this.clientMedicineArray[i];
        if(value[j].medicationDetailId != '' && value[j].medicationDetailId == deleteMed.medicationDetailId)
        {
          existingId = true;
          break;
        }
      }
      if (!existingId) {
        medicineList.value.push(this.clientMedicineArray[i]);
      }
    }
  }

  setCohortYear(selectedDate) {
    let cohortYear;
    let quarter;

    if (selectedDate != null) {
      cohortYear = this.commonService.getCohortYear(selectedDate);
      quarter = this.commonService.getQuarter(selectedDate);
      console.log(cohortYear);
      console.log(quarter);
      
      this.medicationForm.patchValue({
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
      this.showClientMedicationList = true;
      this.getClientDetailsById(event.clientId);
     // this.getClientMedicationList(event.clientId);
      this.medicationForm.patchValue({
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
    this.showClientMedicationList = true;
    this.getClientDetailsById(event.clientId);
    //this.getClientMedicationList(event.clientId);
    this.medicationForm.patchValue({
      clientId: event.clientId
    })
    this.clientId = event.clientId;
  }


  manageUIDValue(clientUID){
    let searchForm = this.searchClientForm;
    if(clientUID != searchForm.controls.clientUID.value){
      searchForm.controls.clientId.patchValue(0);
      searchForm.controls.clientName.patchValue(null);
      this.showClientMedicationList = false;
      this.clientView = null;
      this.profilePhoto = "";
      this.medicationForm.patchValue({
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
      this.showClientMedicationList = false;
      this.clientView = null;
      this.profilePhoto = "";
      this.medicationForm.patchValue({
        clientId: null
      })
      this.clientId = null;
    }
    if(searchForm.controls.clientName.value==""){
      searchForm.controls.clientId.patchValue("");
      searchForm.controls.clientUID.patchValue("");
    }
  }

  getClientMedicationList(clientId){
    let payload = {
      clientId: clientId
    }
    this.clientHealthService.getMedicationList(payload).subscribe(res=>{
      console.log(res);
      if(res.key==0){
          this.clientMedicationList = res.value;
          this.pagination.totalRecords = this.clientMedicationList.length;
          this.pagination.first = 0;
          this.pagination.last = this.pagination.rows;
          if(this.clientMedicationList.length==0){
            // this.showClientMedicationList = false;
            // this.createmedicationForm();
            // this.addEditMedication = true;
            this.addNewMedication();
          }
      }
      else{
        this.toastService.showI18nToastFadeOut(res.message,"error");
      }      
    })
  }

  searchPaginate(event) {
    this.pagination.first = event.first;
    this.pagination.last = event.first + event.rows;
  }

  saveUpdateClientMedication(){
    if(this.medicationForm.invalid){
      this.toastService.showI18nToastFadeOut("Please fill the mandatory fields.","warning");
      return false;
    }
    this.assignIsDeletedToMedicine();
    this.clientHealthService.saveUpdateClientMedication(this.medicationForm.value).subscribe(res=>{
      console.log(res);
      if(res.key==0){
          this.toastService.showI18nToastFadeOut("Medication record updated","success");
          this.getClientMedicationList(this.medicationForm.value.clientId);
          this.showClientMedicationList = true;
      }
      else{
        this.toastService.showI18nToastFadeOut(res.message,"error");
      }      
    })
  }

  addNewMedication(){
    if(!this.allowToAdd){
      this.toastService.showI18nToastFadeOut("Please fill up primary Medication details in the Intake Form.","error");
      return false;
    }
    this.showClientMedicationList = false;
    this.addEditMedication = true;
    this.createMedicationForm();
    this.medicationId = null;
    let payload = {
      clientId: this.medicationForm.value.clientId
    }
    this.clientHealthService.getLastDiagnosisAndDoctor(payload).subscribe(res=>{
      console.log(res);
      if(res.value!=null){
        this.medicationForm.patchValue({
          diagnosis: res.value.diagnosis,
          doctorName: res.value.doctorName
        })
      }
      else{
        this.medicationForm.patchValue({
          diagnosis: this.clientView.clientInitMedicalDetBean!=null?(this.clientView.clientInitMedicalDetBean.diagnosisGroupStr=="Others"?this.clientView.clientInitMedicalDetBean.diagnosisGroupIfOth:this.clientView.clientInitMedicalDetBean.diagnosisGroupStr):null,
          doctorName: this.clientView.clientIntakeAdministrationBean!=null?this.clientView.clientIntakeAdministrationBean.doctorSignature:null
        })
      }
    });
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
          this.getClientMedicationList(clientId);
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
    this.showClientMedicationList = false;
  }

  backToMedicationList(){
    this.showClientMedicationList = true;
    this.medicationId = null;
  }
  
  convert(d) {
    var date = new Date(d);
   return new Date(date.setTime(date.getTime() + (6*60*60*1000)))
  }

  viewData:any;
  viewDialog: boolean = false;
  viewMedication(data){
    this.viewData=data;
    this.viewDialog = true;
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
