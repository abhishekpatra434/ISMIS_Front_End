
import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { PlatformLocation } from '@angular/common';

import { BroadcastService } from './../../core/services/broadcast.service';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}


@Injectable({
  providedIn: 'root'
})
export class GoBackGuardService implements CanDeactivate<ComponentCanDeactivate>, CanLoad {
  changeFromBack = false;
  stopedBack = new EventEmitter<boolean>();
  islogedin = false;
  constructor(private location: PlatformLocation, private broadcastService: BroadcastService, private router: Router) {

  }
  canLoad() {
      this.changeFromBack = false;
      return true;
  }
  canDeactivate(component: ComponentCanDeactivate, route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot, nextState: RouterStateSnapshot) {
      let temp = this.changeFromBack;
      this.changeFromBack = false;
      if (component && component.canDeactivate) {
          const can = component.canDeactivate();
          if (!can) {
              temp = false;
          }
      }
      if (temp) {
          this.stopedBack.emit();
      }
      return !temp;
  }
}