
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private authService = new Subject<any>();
  private userData = new Subject<any>();
  private login = new Subject<any>();
  private isVisible = new Subject<any>(); 
  private searchData = new Subject<any>();
  private txt = new Subject<any>();

  constructor() { }

  setAuth(isAuthenticated: boolean) {
    this.authService.next(isAuthenticated);
  }
  getAuth(): Observable<any> {
    return this.authService.asObservable();
  }

  setUserData(obj: any) {
    this.userData.next(obj);

  }
  getUserData(): Observable<any> {
    return this.userData.asObservable();
  }

  setLogin(obj: any = {}) {
    this.login.next(obj);
  }
  getLogin(): Observable<any> {
    return this.login.asObservable();
  }

  //bitan 30102019
  setSideVisiblity(isVisible: boolean) {
    this.isVisible.next(isVisible);
  }
  //bitan 30102019
  getSideVisiblity(): Observable<any> {
    return this.isVisible.asObservable();
  }

  setSearchData(obj: any) {
    this.searchData.next(obj);

  }
  getSearchData(): Observable<any> {
    return this.searchData.asObservable();
  }
  setTxt(obj: any) {
    this.txt.next(obj);

  }
  getTxt(): Observable<any> {
    return this.txt.asObservable();
  }
}
