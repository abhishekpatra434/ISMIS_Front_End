import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../client.service';
import { BsDatepickerDirective } from 'ngx-bootstrap';
import { CommonService } from '../../../core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpResponse, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Accordion } from 'primeng/accordion';

@Component({
  selector: 'app-intake-form',
  templateUrl: './intake-form.component.html',
  styleUrls: ['./intake-form.component.css'],
  providers: [ConfirmationService]
})
export class IntakeFormComponent implements OnInit {

  dateFormat: any;
  index: number = 0;
  intakeForm: FormGroup;
  user: any;
  cohortYear: any;
  quarter: any;
  submitted: boolean = false;
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  referredByList: any = [];
  typeOfEntryList: any = [];
  relationshipList: any = [];
  religionList: any = [];
  diagnosisList: any = [];
  educationList: any = [];
  exitStatusList: any = [];
  gafScoreList: any = [];
  genderList: any = [];
  clientId: any = null;
  isEdit: boolean = false
  isView: any;
  profilePhoto: any="";
  domSanitizer: any;
  hasPhoto: boolean = false;
  isDirtyPhoto: boolean = false;
  ageClassList: any = [];
  bmiClassList: any = [];
  minDate: any;
  maxDate: any;
  clientView: any;
  @ViewChild('accordion', { static: false }) accordion: Accordion;

  constructor(private _fb: FormBuilder, 
    private clientService: ClientService,
    private commonService: CommonService,
    private route :ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private toastr: ToastrService, private http: HttpClient,
    private _domSanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private el: ElementRef
  ) {
    this.domSanitizer = _domSanitizer;
   }

  ngOnInit() {
    const url = window.location.href.toString();
      //console.log(url);
      localStorage.removeItem("msVal");
      if (url.indexOf('/edit-intake-form') < 0) {
        localStorage.removeItem("insVal");
      }
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.clientId = this.route.snapshot.paramMap.get('clientId');
    this.isView = this.route.snapshot.paramMap.get('isView');
    this.minDate = new Date();
    this.maxDate = new Date();
    this.getAgeClassList();
    this.getBMIClassList();
    if(this.clientId!=null){
      this.isEdit = true;
      this.getClientDetailsById(this.clientId);
    }
    this.dateFormat = environment.DATE_FORMAT;
    this.createIntakeForm();
    this.getAttributesByCategoryId();
    
    
    
  }

  getAgeClassList(){
    this.clientService.getAgeClassList().subscribe(res=>{
      //console.log(res);
      if(res.key==0){
        this.ageClassList = res.value;
      }
    })
  }

  getBMIClassList(){
    this.clientService.getBmiClassList().subscribe(res=>{
      console.log(res);
      if(res.key==0){
        this.bmiClassList = res.value;
      }
    })
  }

  ageClass: any = "";
  setAgeClass(age){
    let ageClass: any="";
    for(let i=0; i < this.ageClassList.length; i++){
      if(parseInt(age)>=this.ageClassList[i].lowerAge && parseInt(age)<=this.ageClassList[i].upperAge){
        ageClass = this.ageClassList[i].ageClass
        this.ageClass = this.ageClassList[i].ageClass;
      }
    }
   // this.intakeForm.controls.clientMasterBean.patchValue({ageClass:ageClass});
  }
  getClientDetailsById(clientId){
    let payload = {
      clientId: clientId,
     //homeId: this.user.homeId
    }
    this.clientService.getClientIntakeFormDataById(payload).subscribe(res=>{
      console.log(res);
      if(res.key==0){
        this.editIntakeForm(res.value);
        if(this.isView=="Y"){
          this.clientView = res.value;
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
        this.hasPhoto = true;
        this.profilePhoto = "data:image/jpeg;base64,"+res.value;
      }
        
    })

  }

  getAttributesByCategoryId(){
    this.commonService.getAttributesByCategoryId(1).subscribe((res) => {
      this.referredByList = res.value;
    })

    this.commonService.getAttributesByCategoryId(2).subscribe((res) => {
      this.typeOfEntryList = res.value;
    })

    this.commonService.getAttributesByCategoryId(3).subscribe((res) => {
      this.relationshipList = res.value;
    })

    this.commonService.getAttributesByCategoryId(4).subscribe((res) => {
      this.religionList = res.value;
    })

    this.commonService.getAttributesByCategoryId(5).subscribe((res) => {
      this.diagnosisList = res.value;
    })

    this.commonService.getAttributesByCategoryId(6).subscribe((res) => {
      this.educationList = res.value;
    })

    this.commonService.getAttributesByCategoryId(7).subscribe((res) => {
      this.exitStatusList = res.value;
    })

    this.commonService.getAttributesByCategoryId(8).subscribe((res) => {
      this.genderList = res.value;
    })

    this.commonService.getAttributesByCategoryId(10).subscribe((res) => {
      this.gafScoreList = res.value;
    })
  }

  scrollToHideDatePicker() {
    this.datepicker.hide();
  }

  doe: any;
  // setCohortYear1(selectedDate) {
  //   let cohortYear;
  //   let quarter;
  //   this.doe = selectedDate;
  //   if (selectedDate != null) {
  //     cohortYear = this.commonService.getCohortYear(selectedDate);
  //     quarter = this.commonService.getQuarter(selectedDate);
  //     console.log(cohortYear);
  //     console.log(quarter);
  //     let clientMaster  = this.intakeForm.get("clientMasterBean");
  //     let clientBMI  = this.intakeForm.get("clientBMIBean");
  //     let clientPsychoGaf  = this.intakeForm.get("clientPsychoGafBean");
  //     let clientPsychoIdeas  = this.intakeForm.get("clientPsychoIdeasBean");
  //     let clientPsychoLsp  = this.intakeForm.get("clientPsychoLspBean");
  //     let clientPsychoPanss  = this.intakeForm.get("clientPsychoPanss");
  //     let clientThyroidSignificance  = this.intakeForm.get("clientThyroidSignificanceBean");
  //     let clientDiabetesSignificance  = this.intakeForm.get("clientDiabetesSignificanceBean");
  //     let clientHemoglobinSignificance  = this.intakeForm.get("clientHemoglobinSignificanceBean");


  //     clientMaster.patchValue({
  //       cohortYear: cohortYear,
  //       dateOfIdentification: this.convert(selectedDate)
  //     })
  //     clientBMI.patchValue({
  //       cohortYear: cohortYear,
  //       qtrOfYear: quarter,
  //     })
  //     clientPsychoGaf.patchValue({
  //       cohortYear: cohortYear,
  //       qtrOfYear: quarter
  //     })
  //     clientPsychoIdeas.patchValue({
  //       cohortYear: cohortYear,
  //       qtrOfYear: quarter
  //     })
  //     clientPsychoLsp.patchValue({
  //       cohortYear: cohortYear,
  //       qtrOfYear: quarter
  //     })
  //     clientPsychoPanss.patchValue({
  //       cohortYear: cohortYear,
  //       qtrOfYear: quarter
  //     })
  //     clientThyroidSignificance.patchValue({
  //       cohortYear: cohortYear,
  //       qtrOfYear: quarter
  //     })
  //     clientDiabetesSignificance.patchValue({
  //       cohortYear: cohortYear,
  //       qtrOfYear: quarter
  //     })
  //     clientHemoglobinSignificance.patchValue({
  //       cohortYear: cohortYear,
  //       qtrOfYear: quarter
  //     })
  //   }
  // }

  setCohortYear(selectedDate, _fromGroup) {
    let cohortYear;
    let quarter;
    if (selectedDate != null) {
      cohortYear = this.commonService.getCohortYear(selectedDate);
      quarter = this.commonService.getQuarter(selectedDate);
      console.log(cohortYear);
      console.log(quarter);

      if(_fromGroup == 'clientMasterBean'){
        this.doe = selectedDate;
        this.intakeForm.get("clientMasterBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter,
          dateOfIdentification: this.convert(selectedDate)
        })
      }else if(_fromGroup == 'clientBMIBean'){
        this.intakeForm.get("clientBMIBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientPsychoIdeasBean'){
        this.intakeForm.get("clientPsychoIdeasBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientPsychoPanss'){
        this.intakeForm.get("clientPsychoPanss").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientPsychoGafBean'){
        this.intakeForm.get("clientPsychoGafBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientPsychoLspBean'){
        this.intakeForm.get("clientPsychoLspBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientThyroidSignificanceBean'){
        this.intakeForm.get("clientThyroidSignificanceBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientDiabetesSignificanceBean'){
        this.intakeForm.get("clientDiabetesSignificanceBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }else if(_fromGroup == 'clientHemoglobinSignificanceBean'){
        this.intakeForm.get("clientHemoglobinSignificanceBean").patchValue({
          cohortYear: cohortYear,
          qtrOfYear: quarter
        })
      }
      
    }
  }

  onTabOpen(e) {
    if(this.intakeForm.invalid){
      this.toastService.showI18nToastFadeOut("Please fill up all the mandatory(*) fields","warning");
      return false;
    }
    this.index = e.index;
  }
  openNext() {
    console.log(this.intakeForm);
    if(this.intakeForm.invalid){
      this.toastService.showI18nToastFadeOut("Please fill up all the mandatory(*) fields","warning");
      return false;
    }
    this.index = this.index + 1;
  }
  openPrev() {
    this.index = this.index - 1;
  }

  createIntakeForm() {
    this.intakeForm = this._fb.group({
      file: [null],
      clientDocuments: this._fb.group({
        clientId: [null],
        documentType: ["PROFILE_PHOTO"],
        isDirty: [false]
      }),
      clientMasterBean: this._fb.group({
        clientId: [null],
        homeId: [this.user.homeId],
        clientUid: [null],
        clientName: [null],
        age: [null],
        //ageClass: [null],
        sex: [null],
        dateOfEntry: [null],
        typeOfEntry: [1], // Set 'New' by default
        cohortYear: [null],
        foundInArea: [null],
        landmark: [null],
        policeStation: [null],
        wardNo: [null],
        referredBy: [null],
        referredByIfOth: [null],
        referredDesc: [null],
        referenceNo: [null],
        dateOfIdentification: [null],
        identificationMark: [null],
        religionId: [null],
        religionIfOth: [null],
        motherTongue: [null],
        othLangKnown: [null],
        educationLevel: [null],
        othInformation: [null],
        exitDate: [null],
        exitStatus: [null],
        exitStatusIfOth: [null],
        exitRemarks: [null],
        durationOfStay: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientAddressBean: this._fb.group({
        addressId: [null],
        clientId: [null],
        gramPanchayatMouza: [null],
        paraVillage: [null],
        policeStation: [null],
        postOffice: [null],
        pinNo: [null],
        district: [null],
        state: [null],
        country: [null],
        createdBy: [this.user.userId],
        isDirty: [false]

      }),
      clientFamilyBean: this._fb.group({
        familyId: [null],
        clientId: [null],
        guardianName: [null],
        contactAddress: [null],
        contact1No: [null],
        contact2No: [null],
        relationWithGuardian: [null],
        relationIfOth: [null],
        familySize: [null],
        occupationOfFamily: [null],
        monthlyIncomeOfFamily: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]

      }),
      clientInitMedicalDetBean: this._fb.group({
        initMedicalDetId: [null],
        clientId: [null],
        provisionalDiagnosis: [null],
        diagnosisGroup: [null],
        diagnosisGroupIfOth: [null],
        comorbidity: [null],
        othMedicalConditionFound: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientBMIBean: this._fb.group({
        bmiId: [null],
        clientId: [null],
        weight: [null],
        weightUnit: [null],
        height: [null],
        heightUnit: [null],
        bmi: [null],
        bmiClass: [null],
        bp: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoGafBean: this._fb.group({
        psychoGafId: [null],
        clientId: [null],
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
        clientId: [null],
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
        clientId: [null],
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
        clientId: [null],
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
      }),
      clientThyroidSignificanceBean: this._fb.group({
        thyroidSignfId: [null],
        clientId: [null],
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
        clientId: [null],
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
        clientId: [null],
        hbPercent: [null],
        esr: [null],
        hemoglobinLevel: [null],
        othLabTest: [null],
        othDateOfEntry: [null],
        dateOfEntry: [null],
        cohortYear: [null],
        qtrOfYear: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
      clientIntakeAdministrationBean: this._fb.group({
        intakeAdminId: [null],
        clientId: [null],
        caregiverName: [null],
        doctorSignature: [null],
        doctorSignatureDate: [null],
        counsellorSwName: [null],
        counsellorSignDate: [null],
        coordinatorName: [null],
        coordinatorSignDate: [null],
        remarks: [null],
        isDeleted: ['N'],
        createdBy: [this.user.userId],
        isDirty: [false]
      }),
    })
  }

  convert(d) {
    var date = new Date(d);
   return new Date(date.setTime(date.getTime() + (6*60*60*1000)))
  }

  editIntakeForm(res){
    if(res.clientMasterBean.age!=null){
      this.setAgeClass(res.clientMasterBean.age);
    }
    if(res.clientBMIBean.bmi!=null){
      this.setBMIClass(res.clientBMIBean.bmi);
    }
    if(res.clientMasterBean.referredByStr=="Others") this.showReferredOth = true;
    if(res.clientMasterBean.religionIdStr=="Others") this.showReligionOth = true;
    if(res.clientMasterBean.exitStatusStr=="Others") this.showExitStatusOth = true;
    if(res.clientInitMedicalDetBean.diagnosisGroupStr=="Others") this.showDiagnosisGroupOth = true;
    if(res.clientFamilyBean.relationWithGuardianStr=="Others") this.showRelationOth = true;

    this.doe = res.clientMasterBean.dateOfEntry==null?null:this.convert(res.clientMasterBean.dateOfEntry);
    this.intakeForm = this._fb.group({
      file: [null],
      clientDocuments: this._fb.group({
        clientId: [res.clientMasterBean.clientId],
        documentType: [null],
        isDirty: this.isDirtyPhoto
      }),
      clientMasterBean: this._fb.group({
        clientId: [res.clientMasterBean.clientId],
        homeId: [res.clientMasterBean.homeId],
        clientUid: [res.clientMasterBean.clientUid],
        clientName: [res.clientMasterBean.clientName],
        age: [res.clientMasterBean.age],
        //ageClass: [res.clientMasterBean.ageClass],
        sex: [res.clientMasterBean.sex],
        dateOfEntry: [res.clientMasterBean.dateOfEntry==null?null:this.convert(res.clientMasterBean.dateOfEntry)],
        typeOfEntry: [res.clientMasterBean.typeOfEntry], 
        cohortYear: [res.clientMasterBean.cohortYear],
        foundInArea: [res.clientMasterBean.foundInArea],
        landmark: [res.clientMasterBean.landmark],
        policeStation: [res.clientMasterBean.policeStation],
        wardNo: [res.clientMasterBean.wardNo],
        referredBy: [res.clientMasterBean.referredBy],
        referredByIfOth: [res.clientMasterBean.referredByIfOth],
        referredDesc: [res.clientMasterBean.referredDesc],
        referenceNo:[res.clientMasterBean.referenceNo],
        dateOfIdentification: [res.clientMasterBean.dateOfIdentification==null?null:this.convert(res.clientMasterBean.dateOfIdentification)],
        //dateOfIdentification: [res.clientMasterBean.dateOfIdentification==null?null:new Date(2018, 0, 24,5, 29, 0, 0)],
        identificationMark: [res.clientMasterBean.identificationMark],
        religionId: [res.clientMasterBean.religionId],
        religionIfOth: [res.clientMasterBean.religionIfOth],
        motherTongue: [res.clientMasterBean.motherTongue],
        othLangKnown: [res.clientMasterBean.othLangKnown],
        educationLevel: [res.clientMasterBean.educationLevel],
        othInformation: [res.clientMasterBean.othInformation],
        exitDate: [res.clientMasterBean.exitDate==null?null:this.convert(res.clientMasterBean.exitDate)],
        exitStatus: [res.clientMasterBean.exitStatus],
        exitStatusIfOth: [res.clientMasterBean.exitStatusIfOth],
        exitRemarks:[res.clientMasterBean.exitRemarks],
        durationOfStay: [res.clientMasterBean.durationOfStay],
        isDeleted: [res.clientMasterBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientAddressBean: this._fb.group({
        addressId: [res.clientAddressBean.addressId],
        clientId: [res.clientAddressBean.clientId],
        gramPanchayatMouza: [res.clientAddressBean.gramPanchayatMouza],
        paraVillage: [res.clientAddressBean.paraVillage],
        policeStation: [res.clientAddressBean.policeStation],
        postOffice: [res.clientAddressBean.postOffice],
        pinNo: [res.clientAddressBean.pinNo],
        district: [res.clientAddressBean.district],
        state: [res.clientAddressBean.state],
        country: [res.clientAddressBean.country],
        modifiedBy: [this.user.userId],
        isDirty: [false]

      }),
      clientFamilyBean: this._fb.group({
        familyId: [res.clientFamilyBean.familyId],
        clientId: [res.clientFamilyBean.clientId],
        guardianName: [res.clientFamilyBean.guardianName],
        contactAddress: [res.clientFamilyBean.contactAddress],
        contact1No: [res.clientFamilyBean.contact1No],
        contact2No: [res.clientFamilyBean.contact2No],
        relationWithGuardian: [res.clientFamilyBean.relationWithGuardian],
        relationIfOth: [res.clientFamilyBean.relationIfOth],
        familySize: [res.clientFamilyBean.familySize],
        occupationOfFamily: [res.clientFamilyBean.occupationOfFamily],
        monthlyIncomeOfFamily: [res.clientFamilyBean.monthlyIncomeOfFamily],
        isDeleted: [res.clientFamilyBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]

      }),
      clientInitMedicalDetBean: this._fb.group({
        initMedicalDetId: [res.clientInitMedicalDetBean.initMedicalDetId],
        clientId: [res.clientInitMedicalDetBean.clientId],
        provisionalDiagnosis: [res.clientInitMedicalDetBean.provisionalDiagnosis],
        diagnosisGroup: [res.clientInitMedicalDetBean.diagnosisGroup],
        diagnosisGroupIfOth: [res.clientInitMedicalDetBean.diagnosisGroupIfOth],
        comorbidity: [res.clientInitMedicalDetBean.comorbidity],
        othMedicalConditionFound: [res.clientInitMedicalDetBean.othMedicalConditionFound],
        isDeleted: [res.clientInitMedicalDetBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientBMIBean: this._fb.group({
        bmiId: [res.clientBMIBean.bmiId],
        clientId: [res.clientBMIBean.clientId],
        weight: [res.clientBMIBean.weight],
        weightUnit: [res.clientBMIBean.weightUnit],
        height: [res.clientBMIBean.height],
        heightUnit: [res.clientBMIBean.heightUnit],
        bmi: [res.clientBMIBean.bmi],
        bmiClass: [res.clientBMIBean.bmiClass],
        bp: [res.clientBMIBean.bp],
        dateOfEntry: [res.clientBMIBean.dateOfEntry==null?null:this.convert(res.clientBMIBean.dateOfEntry)],
        cohortYear: [res.clientBMIBean.cohortYear],
        qtrOfYear: [res.clientBMIBean.qtrOfYear],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoGafBean: this._fb.group({
        psychoGafId: [res.clientPsychoGafBean.psychoGafId],
        clientId: [res.clientPsychoGafBean.clientId],
        gafScore: [res.clientPsychoGafBean.gafScore],
        gafClass: [res.clientPsychoGafBean.gafClass],
        dateOfEntry: [res.clientPsychoGafBean.dateOfEntry==null?null:this.convert(res.clientPsychoGafBean.dateOfEntry)],
        cohortYear: [res.clientPsychoGafBean.cohortYear],
        qtrOfYear: [res.clientPsychoGafBean.qtrOfYear],
        isDeleted: [res.clientPsychoGafBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoIdeasBean: this._fb.group({
        psychoIdeasId: [res.clientPsychoIdeasBean.psychoIdeasId],
        clientId: [res.clientPsychoIdeasBean.clientId],
        sc: [res.clientPsychoIdeasBean.sc],
        ia: [res.clientPsychoIdeasBean.ia],
        c_and_u: [res.clientPsychoIdeasBean.c_and_u],
        wrk: [res.clientPsychoIdeasBean.wrk],
        doi: [res.clientPsychoIdeasBean.doi],
        //gds: [res.clientPsychoIdeasBean.gds],
        gis: [res.clientPsychoIdeasBean.gis],
        ideasStatus: [res.clientPsychoIdeasBean.ideasStatus],
        dateOfEntry: [res.clientPsychoIdeasBean.dateOfEntry==null?null:this.convert(res.clientPsychoIdeasBean.dateOfEntry)],
        cohortYear: [res.clientPsychoIdeasBean.cohortYear],
        qtrOfYear: [res.clientPsychoIdeasBean.qtrOfYear],
        isDeleted: [res.clientPsychoIdeasBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoLspBean: this._fb.group({
        psychoLspId: [res.clientPsychoLspBean.psychoLspId],
        clientId: [res.clientPsychoLspBean.clientId],
        lspScore: [res.clientPsychoLspBean.lspScore],
        lspClass: [res.clientPsychoLspBean.lspClass],
        dateOfEntry: [res.clientPsychoLspBean.dateOfEntry==null?null:this.convert(res.clientPsychoLspBean.dateOfEntry)],
        cohortYear: [res.clientPsychoLspBean.cohortYear],
        qtrOfYear: [res.clientPsychoLspBean.qtrOfYear],
        isDeleted: [res.clientPsychoLspBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientPsychoPanss: this._fb.group({
        psychoPanssId: [res.clientPsychoPanss.psychoPanssId],
        clientId: [res.clientPsychoPanss.clientId],
        ps: [res.clientPsychoPanss.ps],
        ns: [res.clientPsychoPanss.ns],
        gp: [res.clientPsychoPanss.gp],
        total: [res.clientPsychoPanss.total],
        dateOfEntry: [res.clientPsychoPanss.dateOfEntry==null?null:this.convert(res.clientPsychoPanss.dateOfEntry)],
        cohortYear: [res.clientPsychoPanss.cohortYear],
        qtrOfYear: [res.clientPsychoPanss.qtrOfYear],
        isDeleted: [res.clientPsychoPanss.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientThyroidSignificanceBean: this._fb.group({
        thyroidSignfId: [res.clientThyroidSignificanceBean.thyroidSignfId],
        clientId: [res.clientThyroidSignificanceBean.clientId],
        thyroTsh: [res.clientThyroidSignificanceBean.thyroTsh],
        thyroT3: [res.clientThyroidSignificanceBean.thyroT3],
        thyroT4: [res.clientThyroidSignificanceBean.thyroT4],
        dateOfEntry: [res.clientThyroidSignificanceBean.dateOfEntry==null?null:this.convert(res.clientThyroidSignificanceBean.dateOfEntry)],
        cohortYear: [res.clientThyroidSignificanceBean.cohortYear],
        qtrOfYear: [res.clientThyroidSignificanceBean.qtrOfYear],
        isDeleted: [res.clientThyroidSignificanceBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientDiabetesSignificanceBean: this._fb.group({
        diabetesSignfId: [res.clientDiabetesSignificanceBean.diabetesSignfId],
        clientId: [res.clientDiabetesSignificanceBean.clientId],
        diabetesRBS: [res.clientDiabetesSignificanceBean.diabetesRBS],
        diabetesFBS: [res.clientDiabetesSignificanceBean.diabetesFBS],
        diabetesPPBS: [res.clientDiabetesSignificanceBean.diabetesPPBS],
        dateOfEntry: [res.clientDiabetesSignificanceBean.dateOfEntry==null?null:this.convert(res.clientDiabetesSignificanceBean.dateOfEntry)],
        cohortYear: [res.clientDiabetesSignificanceBean.cohortYear],
        qtrOfYear: [res.clientDiabetesSignificanceBean.qtrOfYear],
        isDeleted: [res.clientDiabetesSignificanceBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientHemoglobinSignificanceBean: this._fb.group({
        hemoglobinSignfId: [res.clientHemoglobinSignificanceBean.hemoglobinSignfId],
        clientId: [res.clientHemoglobinSignificanceBean.clientId],
        hbPercent: [res.clientHemoglobinSignificanceBean.hbPercent],
        esr: [res.clientHemoglobinSignificanceBean.esr],
        hemoglobinLevel: [res.clientHemoglobinSignificanceBean.hemoglobinLevel],
        othLabTest: [res.clientHemoglobinSignificanceBean.othLabTest],
        othDateOfEntry: [res.clientHemoglobinSignificanceBean.othDateOfEntry==null?null:this.convert(res.clientHemoglobinSignificanceBean.othDateOfEntry)],
        dateOfEntry: [res.clientHemoglobinSignificanceBean.dateOfEntry==null?null:this.convert(res.clientHemoglobinSignificanceBean.dateOfEntry)],
        cohortYear: [res.clientHemoglobinSignificanceBean.cohortYear],
        qtrOfYear: [res.clientHemoglobinSignificanceBean.qtrOfYear],
        isDeleted: [res.clientHemoglobinSignificanceBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
      clientIntakeAdministrationBean: this._fb.group({
        intakeAdminId: [res.clientIntakeAdministrationBean.intakeAdminId],
        clientId: [res.clientIntakeAdministrationBean.clientId],
        caregiverName: [res.clientIntakeAdministrationBean.caregiverName],
        doctorSignature: [res.clientIntakeAdministrationBean.doctorSignature],
        doctorSignatureDate: [res.clientIntakeAdministrationBean.doctorSignatureDate==null?null:this.convert(res.clientIntakeAdministrationBean.doctorSignatureDate)],
        counsellorSwName: [res.clientIntakeAdministrationBean.counsellorSwName],
        counsellorSignDate: [res.clientIntakeAdministrationBean.counsellorSignDate==null?null:this.convert(res.clientIntakeAdministrationBean.counsellorSignDate)],
        coordinatorName: [res.clientIntakeAdministrationBean.coordinatorName],
        coordinatorSignDate: [res.clientIntakeAdministrationBean.coordinatorSignDate==null?null:this.convert(res.clientIntakeAdministrationBean.coordinatorSignDate)],
        remarks: [res.clientIntakeAdministrationBean.remarks],
        isDeleted: [res.clientIntakeAdministrationBean.isDeleted],
        modifiedBy: [this.user.userId],
        isDirty: [false]
      }),
    })
  }

  saveIntakeForm(todo) {
    console.log(this.intakeForm);
    console.log(this.accordion);
    const invalidControl = this.el.nativeElement.querySelector('.form-control.ng-invalid');
    //console.log(invalidControl.closest(".ui-accordion-content-wrapper"));
    if(invalidControl!=null)
      invalidControl.focus();
    this.submitted =true;
    if(this.clientId!=null){
      this.intakeForm.controls.clientMasterBean.patchValue({isDirty: this.intakeForm.controls.clientMasterBean.dirty});
      this.intakeForm.controls.clientAddressBean.patchValue({isDirty: this.intakeForm.controls.clientAddressBean.dirty});
      this.intakeForm.controls.clientFamilyBean.patchValue({isDirty: this.intakeForm.controls.clientFamilyBean.dirty});
      this.intakeForm.controls.clientInitMedicalDetBean.patchValue({isDirty: this.intakeForm.controls.clientInitMedicalDetBean.dirty});
      this.intakeForm.controls.clientBMIBean.patchValue({isDirty: this.intakeForm.controls.clientBMIBean.dirty});
      this.intakeForm.controls.clientPsychoGafBean.patchValue({isDirty: this.intakeForm.controls.clientPsychoGafBean.dirty});
      this.intakeForm.controls.clientPsychoIdeasBean.patchValue({isDirty: this.intakeForm.controls.clientPsychoIdeasBean.dirty});
      this.intakeForm.controls.clientPsychoLspBean.patchValue({isDirty: this.intakeForm.controls.clientPsychoLspBean.dirty});
      this.intakeForm.controls.clientPsychoPanss.patchValue({isDirty: this.intakeForm.controls.clientPsychoPanss.dirty});
      this.intakeForm.controls.clientThyroidSignificanceBean.patchValue({isDirty: this.intakeForm.controls.clientThyroidSignificanceBean.dirty});
      this.intakeForm.controls.clientDiabetesSignificanceBean.patchValue({isDirty: this.intakeForm.controls.clientDiabetesSignificanceBean.dirty});
      this.intakeForm.controls.clientHemoglobinSignificanceBean.patchValue({isDirty: this.intakeForm.controls.clientHemoglobinSignificanceBean.dirty});
      this.intakeForm.controls.clientIntakeAdministrationBean.patchValue({isDirty: this.intakeForm.controls.clientIntakeAdministrationBean.dirty});
    }
    console.log(this.intakeForm);
    if(this.intakeForm.invalid){
      this.toastService.showI18nToastFadeOut("Please fill up all the mandatory(*) fields","warning");
      this.intakeForm.markAsDirty();
      return false;
    }
    console.log(this.intakeForm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        let data = this.intakeForm.value;
        let formdata = new FormData();
    
        let documentDtoList = JSON.stringify({
          "clientMasterBean": data.clientMasterBean,
          "clientAddressBean": data.clientAddressBean,
          "clientFamilyBean": data.clientFamilyBean,
          "clientInitMedicalDetBean": data.clientInitMedicalDetBean,
          "clientBMIBean": data.clientBMIBean,
          "clientPsychoGafBean": data.clientPsychoGafBean,
          "clientPsychoIdeasBean": data.clientPsychoIdeasBean,
    
          "clientPsychoLspBean": data.clientPsychoLspBean,
          "clientPsychoPanss": data.clientPsychoPanss,
          "clientThyroidSignificanceBean": data.clientThyroidSignificanceBean,
          "clientDiabetesSignificanceBean": data.clientDiabetesSignificanceBean,
          "clientHemoglobinSignificanceBean": data.clientHemoglobinSignificanceBean,
          "clientIntakeAdministrationBean": data.clientIntakeAdministrationBean,
          "clientDocuments": this.isDirtyPhoto ? data.clientDocuments : null
        });
        console.log(documentDtoList);
        
        console.log(data.file);
        
        formdata.append('file', data.file==null?null:data.file);
        formdata.append('document', documentDtoList);
      //   this.saveClientIntakeForm(formdata).subscribe(res => {
    
      //     if (res.key==0) {
      //       this.toastService.showI18nToastFadeOut("Saved Successfully","success");
      //       if(this.clientId!=null){
      //         this.router.navigate(['client/search-client']);
      //       }
      //       else{
      //         this.ngOnInit();
      //       }
      //     } else {
      //        this.toastService.showI18nToastFadeOut(res.message,"error");
      //     }
      // });
    
      this.clientService.saveIntakeForm(formdata).subscribe(res=>{
          console.log(res);
          if(res.key==0){
            this.toastService.showI18nToastFadeOut("Saved Successfully","success");
           if(this.clientId!=null && todo=="submit"){
            this.router.navigate(['client/search-client']);
           }
           else{
             if(todo=="submit"){
              this.index = 0;
              //this.intakeForm.reset();
              this.createIntakeForm();
              this.ageClass = "";
              this.bmiClassStr = "";
              this.submitted = false;
              this.profilePhoto="";
              this.imgURL="";
             }
             if(todo=="save"){
              this.router.navigate(["client/intake_form", { clientId: res.value.clientMasterBean.clientId, isView: "D" }])
              
             }
           }
          }
          else{
            this.toastService.showI18nToastFadeOut(res.message,"error");
          }
          
        })
      },
      reject: () => {
        console.log("reject");
     }
  });
    



 ///--------------------------------------------///

   
    // this.clientService.saveIntakeForm(this.intakeForm.value).subscribe(res=>{
    //   console.log(res);
    //   if(res.key==0){
    //    //this.toastService.showI18nToast("Saved Successfully", "success")
    //    //this.toastr.success("Saved Successfully")
    //    if(this.clientId!=null){
    //     this.router.navigate(['client/search-client']);
    //    }
    //    else{

    //     this.ngOnInit();
    //    }
       
    //   }
    //   else{
    //      this.toastService.showI18nToastFadeOut(res.message,"error");
    //   }
      
    // })

  }

  saveClientIntakeForm(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'client/saveClientIntakeDetails', formData, {
     // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
   
  }

  updateClientData(type){
    if(type=="Gen"){

    }
  }

  imagePath: any;
  imgURL: any="";
  message: string;
  selectedImage : File = null;
  preview(event) {
    let files = event.target.files[0]
    console.log(files);
    
    if (files.length === 0)
      return;
 
    var mimeType = files.type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    if (Math.round(files.size / 1024) > 500) {
      this.message = "Image is larger.";
      return;
    }

    this.selectedImage = <File>files;
    const fd = new FormData();
    fd.append('file', this.selectedImage, this.selectedImage.name);
    this.intakeForm.patchValue({file: this.selectedImage});
    console.log(this.intakeForm.value);

    
    let width: any;
    let height: any;
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files); 
    reader.onload = (_event) => { 
      var img = new Image();
      img.onload = () => {
        width=img.width;
        height=img.height;
      };
      //img.src = reader.result;
      if(img.width>200 && img.height>200){
        this.message = "Image must have dimension within 200 x 200.";
        return; 
      }
      else{
        this.imgURL = reader.result; 
        this.intakeForm.markAsDirty();
        if(this.hasPhoto){
          this.isDirtyPhoto = true;
          this.intakeForm.controls.clientDocuments.patchValue({isDirty:true});
          
        }
        else{
          // this.intakeForm.patchValue({
          //   clientDocuments: null
          // })
        }
        console.log(this.intakeForm.value);
        
        this.profilePhoto="";
        this.message = "";
      }
      
    }

    // const fd = new FormData();
    // fd.append('file', this.selectedImage, this.selectedImage.name);
    // this.http.post('http://192.168.1.71:8080/client/uploadFile', fd)
    // .subscribe(res =>{
    //   console.log("happy");
    // });
  }

  backToSearch(){
    this.router.navigate(['client/search-client'])
  }

  showReferredOth: boolean = false;
  showReligionOth: boolean = false;
  showDiagnosisGroupOth: boolean = false;
  showExitStatusOth: boolean = false;
  showRelationOth: boolean = false;
  setReferredByIfOth(event){
    let v = event.target.selectedOptions[0].innerText.trim();
    if(v=="Others"){
      this.showReferredOth = true;
    }
    else{
      this.showReferredOth = false;
    }
  }
  setReligionIfOth(event){
    let v = event.target.selectedOptions[0].innerText.trim();
    if(v=="Others"){
      this.showReligionOth = true;
    }
    else{
      this.showReligionOth = false;
    }
  }
  setDiagnosisGroupIfOth(event){
    let v = event.target.selectedOptions[0].innerText.trim();
    if(v=="Others"){
      this.showDiagnosisGroupOth = true;
    }
    else{
      this.showDiagnosisGroupOth = false;
    }
  }
  setExitStatusIfOth(event){
    let v = event.target.selectedOptions[0].innerText.trim();
    if(v=="Others"){
      this.showExitStatusOth = true;
    }
    else{
      this.showExitStatusOth = false;
    }
  }

  setRelationIfOth(event){
    let v = event.target.selectedOptions[0].innerText.trim();
    if(v=="Others"){
      this.showRelationOth = true;
    }
    else{
      this.showRelationOth = false;
    }
  }

  calculateBMI(weight, height){
    if(weight=="" || height==""){
      this.intakeForm.controls.clientBMIBean.patchValue({
        bmi: null,
        bmiClass: null
      })
      this.bmiClassStr = "";
    }
    if(weight!=="" && height!==""){
      let bmi = weight/(height*height);
      this.setBMIClass(bmi);
      this.intakeForm.controls.clientBMIBean.patchValue({
        bmi: bmi.toFixed(2)
      })
    }
  }

  bmiClassStr: any = "";
  setBMIClass(bmi){
    let bmiClass: any=0;
    for(let i=0; i < this.bmiClassList.length; i++){
      if(bmi>=this.bmiClassList[i].lowerBmi && bmi<=this.bmiClassList[i].upperBmi){
        bmiClass = this.bmiClassList[i].bmiClassId
        this.bmiClassStr = this.bmiClassList[i].bmiClass;
        this.intakeForm.controls.clientBMIBean.patchValue({
          bmiClass: bmiClass
        })
      }
    }
  }

  calculateGIS(){
    let ideaData = this.intakeForm.controls.clientPsychoIdeasBean.value;
    console.log(ideaData);
    // let gis = parseInt(ideaData.sc==null || ideaData.sc.trim()==""?0:ideaData.sc) + parseInt(ideaData.ia==null || ideaData.ia.trim()==""?0:ideaData.ia)
    //           + parseInt(ideaData.c_and_u==null || ideaData.c_and_u.trim()==""?0:ideaData.c_and_u) + parseInt(ideaData.wrk==null || ideaData.wrk.trim()==""?0:ideaData.wrk)
    //           + parseInt(ideaData.doi==null || ideaData.doi.trim()==""?0:ideaData.doi);
    let gis = parseInt(ideaData.sc==null || ideaData.sc==""?0:ideaData.sc) + parseInt(ideaData.ia==null || ideaData.ia==""?0:ideaData.ia)
              + parseInt(ideaData.c_and_u==null || ideaData.c_and_u==""?0:ideaData.c_and_u) + parseInt(ideaData.wrk==null || ideaData.wrk==""?0:ideaData.wrk)
              + parseInt(ideaData.doi==null || ideaData.doi==""?0:ideaData.doi);
    
    //this.intakeForm.controls.clientPsychoIdeasBean.patchValue({gds: gds});
    this.intakeForm.controls.clientPsychoIdeasBean.patchValue({gis: gis});
  }

  setDurationOfStay(event){
    let clientMaster = this.intakeForm.controls.clientMasterBean.value;
    let doe = clientMaster.dateOfEntry;
    var diff = Math.abs(doe.getTime() - event.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    //alert(diffDays);
    this.intakeForm.controls.clientMasterBean.patchValue({durationOfStay: diffDays});
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
  
  validateField(v, field){
    let value = parseInt(v);
    // IDEAS
    if(field=="sc"){
      if(value<0 || value>4){
        this.scErrMsg="SC range is 0-4";
        this.intakeForm.controls.clientPsychoIdeasBean.patchValue({sc: null});
      }
      else{
        this.scErrMsg="";
      }
    }

    if(field=="ia"){
      if(value<0 || value>4){
        this.iaErrMsg="IA range is 0-4";
        this.intakeForm.controls.clientPsychoIdeasBean.patchValue({ia: null});
      }
      else{
        this.iaErrMsg="";
      }
    }

    if(field=="cu"){
      if(value<0 || value>4){
        this.cuErrMsg="C&U range is 0-4";
        this.intakeForm.controls.clientPsychoIdeasBean.patchValue({c_and_u: null});
      }
      else{
        this.cuErrMsg="";
      }
    }

    if(field=="w"){
      if(value<0 || value>4){
        this.wErrMsg="W range is 0-4";
        this.intakeForm.controls.clientPsychoIdeasBean.patchValue({wrk: null});
      }
      else{
        this.wErrMsg="";
      }
    }

    if(field=="doi"){
      if(value<0 || value>4){
        //this.toastService.showI18nToastFadeOut("Error","error")
        this.doiErrMsg="DOI range is 0-4";
        this.intakeForm.controls.clientPsychoIdeasBean.patchValue({doi: null});
      }
      else{
        this.doiErrMsg="";
      }
    }
    // PANSS 
    if(field=="ps"){
      if(value<7 || value>49){
        this.psErrMsg="PS range is 7-49";
        this.intakeForm.controls.clientPsychoPanss.patchValue({ps: null});
      }
      else{
        this.psErrMsg="";
      }
    }

    if(field=="ns"){
      if(value<7 || value>49){
        this.nsErrMsg="PS range is 7-49";
        this.intakeForm.controls.clientPsychoPanss.patchValue({ns: null});
      }
      else{
        this.nsErrMsg="";
      }
    }

    if(field=="gp"){
      if(value<16 || value>112){
        this.gpErrMsg="GP range is 16-112";
        this.intakeForm.controls.clientPsychoPanss.patchValue({gp: null});
      }
      else{
        this.gpErrMsg="";
      }
    }

    // LSP  
    if(field=="lspScore"){
      if(value<0 || value>48){
        this.lspErrMsg="LSP Score range is 0-48";
        this.intakeForm.controls.clientPsychoLspBean.patchValue({lspScore: null});
      }
      else{
        this.lspErrMsg="";
      }
    }
  }


  checkDoA(field, value){
    if(field=='bmi'){
      let bmi=this.intakeForm.controls.clientBMIBean.value;
      if(bmi.dateOfEntry==null && value!=""){
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.intakeForm.controls.clientBMIBean.patchValue({
          height: null,
          weight: null,
          bp: null,
          bmi: null,
          bmiClass: null
        })
        this.bmiClassStr="";
      }
    }
    if(field=='ideas'){
      let ideas=this.intakeForm.controls.clientPsychoIdeasBean.value;
      if(ideas.dateOfEntry==null && value!=""){
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.intakeForm.controls.clientPsychoIdeasBean.patchValue({
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
    if(field=='panss'){
      let panss=this.intakeForm.controls.clientPsychoPanss.value;
      if(panss.dateOfEntry==null && value!=""){
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.intakeForm.controls.clientPsychoPanss.patchValue({
          ps: null,
          ns: null,
          gp: null,
          total: null,
        })
      }
    }
    if(field=='gaf'){
      let gaf=this.intakeForm.controls.clientPsychoGafBean.value;
      if(gaf.dateOfEntry==null && value!=""){
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.intakeForm.controls.clientPsychoGafBean.patchValue({
          gafScore: null,
        })
      }
    }
    if(field=='lsp'){
      let lsp=this.intakeForm.controls.clientPsychoLspBean.value;
      if(lsp.dateOfEntry==null && value!=""){
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.intakeForm.controls.clientPsychoLspBean.patchValue({
          lspScore: null,
        })
      }
    }
    if(field=='thyro'){
      let thyro=this.intakeForm.controls.clientThyroidSignificanceBean.value;
      if(thyro.dateOfEntry==null && value!=""){
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.intakeForm.controls.clientThyroidSignificanceBean.patchValue({
          thyroTsh: null,
          thyroT3: null,
          thyroT4: null,
        })
      }
    }
    if(field=='diabetes'){
      let diabetes=this.intakeForm.controls.clientDiabetesSignificanceBean.value;
      if(diabetes.dateOfEntry==null && value!=""){
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.intakeForm.controls.clientDiabetesSignificanceBean.patchValue({
          diabetesRBS: null,
          diabetesFBS: null,
          diabetesPPBS: null,
        })
      }
    }
    if(field=='blood'){
      let blood=this.intakeForm.controls.clientHemoglobinSignificanceBean.value;
      if(blood.dateOfEntry==null && value!=""){
        this.toastService.showI18nToastFadeOut("Please enter date first", "warning");
        this.intakeForm.controls.clientHemoglobinSignificanceBean.patchValue({
          hbPercent: null,
          esr: null,
          hemoglobinLevel: null,
        })
      }
    }
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
      this.intakeForm.controls.clientBMIBean.patchValue({
        bp: null
      })
    }

  }

}
