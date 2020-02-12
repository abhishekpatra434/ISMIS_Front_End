
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getCohortYear(date){
    let cohortYear;
    if (date.getMonth() > 2) {
      cohortYear = date.getFullYear() + "-" + ((date.getFullYear() + 1) + "").substring(2, 4);
    }
    else {
      cohortYear = (date.getFullYear() - 1) + "-" + (date.getFullYear() + "").substring(2, 4);
    }
    return cohortYear;
  }
  getQuarter(date){
    let qrt;
    if (date.getMonth() > 2 &&  date.getMonth() < 6) {
      qrt = 1;
    }
    if (date.getMonth() > 5 &&  date.getMonth() < 9) {
      qrt = 2;
    }
    if (date.getMonth() > 8) {
      qrt = 3;
    }
    if (date.getMonth() <3) {
      qrt = 4;
    }
    return qrt;
    
  }

  getAttributesByCategoryId(query: any): Observable<any> {
    return this.apiService.GetAttributesByCategoryId.getByPath(query);
  }

  apiUrl = environment.apiUrl;
  downloadFile(payload): Observable<any>{		
		return this.http.post(this.apiUrl+'client/exportToExcel', payload, { responseType: 'blob' });
   }


   exportToExcelPsychometryTest(payload): Observable<any>{		
		return this.http.post(this.apiUrl+'client/psychometryTestExport', payload, { responseType: 'blob' });
   }

   exportToExcelPathologyTest(payload): Observable<any>{		
		return this.http.post(this.apiUrl+'client/pathologicalTestExport', payload, { responseType: 'blob' });
   }
  
  

   getNotifications(): Observable<any> {
    return this.apiService.GetNotifications.get();
  }
  
  logout(query:any): Observable<any> {
    return this.apiService.Logout.postByQuery(query);
  }
}
