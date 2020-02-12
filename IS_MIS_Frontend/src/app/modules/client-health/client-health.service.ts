import { Injectable } from '@angular/core';
import { BroadcastService } from '../../core/services/broadcast.service';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ClientHealthService {
  
    constructor(
        private broadcastService: BroadcastService, private router: Router, private apiService: ApiService) { }

        saveUpdateClientBmi(query: any): Observable<any> {
            return this.apiService.SaveUpdateClientBmi.postByQuery(query);
          }
        
          getBmiList(query: any): Observable<any> {
            return this.apiService.GetBmiList.getByQuery(query);
          }

          getPshychometryTestList(query: any): Observable<any> {
            return this.apiService.GetPsychometryTestList.getByQuery(query);
          }

          saveUpdateClientPsychometryTest(query: any): Observable<any> {
            return this.apiService.saveUpdateClinetPsychometryTest.postByQuery(query);
          }

          saveUpdateClientMedication(query: any): Observable<any> {
            return this.apiService.SaveUpdateClientMedication.postByQuery(query);
          }
        
          getMedicationList(query: any): Observable<any> {
            return this.apiService.GetMedicationList.getByQuery(query);
          }
          getLastDiagnosisAndDoctor(query: any): Observable<any> {
            return this.apiService.GetLastDiagnosisAndDoctor.getByQuery(query);
          }

          getPathologyTestList(query: any): Observable<any> {
            return this.apiService.GetPathologyTestList.getByQuery(query);
          }

          savePathologyTest(query: any): Observable<any> {
            return this.apiService.SavePathologyTest.postByQuery(query);
          }
  }