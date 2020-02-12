
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BroadcastService } from '../../core/services/broadcast.service';
import { ApiService } from '../../core/services/api.service';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private broadcastService: BroadcastService, private router: Router, private apiService: ApiService) { }


  saveIntakeForm(query: any): Observable<any> {
    return this.apiService.SaveIntakeForm.postByQuery(query);
  }

  getClientUidList(query: any): Observable<any> {
    return this.apiService.GetClientUidList.getByQuery(query);
  }

  getClientNameList(query: any): Observable<any> {
    return this.apiService.GetClientNameList.getByQuery(query);
  }

  getCohortYrList(query: any): Observable<any> {
    return this.apiService.GetCohortYrList.getByQuery(query);
  }

  getClientBasicInfo(query: any): Observable<any> {
    return this.apiService.GetClientBasicInfo.getByQuery(query);
  }

  getClientIntakeFormDataById(query: any): Observable<any> {
    return this.apiService.GetClientIntakeFormDataById.getByQuery(query);
  }
  

  getMseFormLabelsTemplate(): Observable<any> {
    return this.apiService.GetMseFormLabelsTemplate.get();
  }

  saveUpdateMseResult(query: any): Observable<any> {
    return this.apiService.SaveUpdateMseResult.postByQuery(query);
  }

  getClientMseResult(query: any): Observable<any> {
    return this.apiService.GetClientMseResult.getByQuery(query);
  }

  getClientMsePendinglist(query: any): Observable<any> {
    return this.apiService.GetClientMsePendinglist.getByQuery(query);
  }

  getClientUploadedFile(query: any): Observable<any> {
    return this.apiService.GetClientUploadedFile.getByQuery(query);
  }
  
  getClientUidListMSE(query: any): Observable<any> {
    return this.apiService.GetClientUidListMSE.getByQuery(query);
  }

  getClientNameListMSE(query: any): Observable<any> {
    return this.apiService.GetClientNameListMSE.getByQuery(query);
  }
  getClientBasicInfoMSE(query: any): Observable<any> {
    return this.apiService.GetClientBasicInfoMSE.getByQuery(query);
  }

  getHomeList(): Observable<any> {
    return this.apiService.GetHomeList.get();
  }

  getAgeClassList(): Observable<any> {
    return this.apiService.GetAgeClassList.get();
  }
  getBmiClassList(): Observable<any> {
    return this.apiService.GetBmiClassList.get();
  }
}
