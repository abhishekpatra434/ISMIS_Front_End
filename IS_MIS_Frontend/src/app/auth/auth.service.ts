
import { Injectable } from '@angular/core';
import { BroadcastService } from './../core/services/broadcast.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private broadcastService: BroadcastService, private router: Router, private apiService: ApiService) { }

  logout() {
    sessionStorage.removeItem("user");
    this.broadcastService.setAuth(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(){
    return sessionStorage.getItem('user');
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }

  userLogin(query: any): Observable<any> {
    return this.apiService.UserLogin.postByQuery(query);
  }

  getMenu(query: any): Observable<any> {
    return this.apiService.GetMenu.postByQuery(query);
  }

}
