import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { environment } from '../../../environments/environment';
import { IModel } from './models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }
    UserLogin = new Api<IModel>(this.http, this.apiUrl + 'login');
    GetMenu = new Api<IModel>(this.http, this.apiUrl + 'getMenuList');
    GetHomeList = new Api<IModel>(this.http, this.apiUrl + 'getHomeList');
    GetAttributesByCategoryId = new Api<IModel>(this.http, this.apiUrl + 'getCategoryWiseAttrList');
    SaveIntakeForm = new Api<IModel>(this.http, this.apiUrl + 'client/saveClientIntakeDetails');
    GetClientUidList = new Api<IModel>(this.http, this.apiUrl + 'client/getClientUidList'); 
    GetClientNameList = new Api<IModel>(this.http, this.apiUrl + 'client/getClientNameList'); 
    GetCohortYrList = new Api<IModel>(this.http, this.apiUrl + 'client/getCohortYrList');
    GetClientBasicInfo = new Api<IModel>(this.http, this.apiUrl + 'client/getClientBasicInfo'); 
    GetClientIntakeFormDataById = new Api<IModel>(this.http, this.apiUrl + 'client/getClientIntakeDetails');

    GetMseFormLabelsTemplate = new Api<IModel>(this.http, this.apiUrl + 'client/mse/getMseFormLabelsTemplate');
    SaveUpdateMseResult = new Api<IModel>(this.http, this.apiUrl + 'client/mse/saveUpdateMseResult');

    GetClientMseResult = new Api<IModel>(this.http, this.apiUrl + 'client/mse/getClientMseResult');

    GetClientMsePendinglist = new Api<IModel>(this.http, this.apiUrl + 'client/mse/getClientMsePendinglist');

    GetClientUploadedFile = new Api<IModel>(this.http, this.apiUrl + 'client/getUploadedFile');

    GetClientUidListMSE = new Api<IModel>(this.http, this.apiUrl + 'client/mse/getClientUidList'); 
    GetClientNameListMSE = new Api<IModel>(this.http, this.apiUrl + 'client/mse/getClientNameList'); 
    GetClientBasicInfoMSE = new Api<IModel>(this.http, this.apiUrl + 'client/mse/getClientBasicInfo'); 

    GetAgeClassList = new Api<IModel>(this.http, this.apiUrl + 'getAgeClassList');
    GetBmiClassList = new Api<IModel>(this.http, this.apiUrl + 'getBmiClassList');

    GetNotifications = new Api<IModel>(this.http, this.apiUrl + 'getNotifications');
    Logout = new Api<IModel>(this.http, this.apiUrl + 'logOut');

    GetBmiList = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/bmi/getBmiList'); 
    SaveUpdateClientBmi = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/bmi/saveUpdateClientBmi');
    
    GetMedicationList = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/medication/getMedicationList'); 
    SaveUpdateClientMedication = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/medication/saveUpdateClientMedication');
    GetLastDiagnosisAndDoctor = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/medication/getLastDiagnosisAndDoctor'); 
    saveUpdateClinetPsychometryTest = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/psychometry/saveUpdateClientPsychometryTest'); 
    GetPsychometryTestList = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/psychometry/getClientPsychometryTestList'); 

    GetPathologyTestList  = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/medication/getPathologicalTestList'); 
    SavePathologyTest  = new Api<IModel>(this.http, this.apiUrl + 'clientHealth/pathological/saveUpdatePathologicalTest'); 
}
