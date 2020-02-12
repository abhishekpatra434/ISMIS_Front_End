
import { Injectable, EventEmitter } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { BroadcastService } from './../../core/services/broadcast.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
        providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad {
        constructor(private router: Router, private broadcastService: BroadcastService, private authService:AuthService,) {
        }

        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
                // implement the logic for gaurding the route to activate or not
                if(this.authService.isLoggedIn()){
                        return true;
                }else{
                this.router.navigate(['/auth/login']);
                return false;
               }
                // return true;
        }
        CanDeactivate() {
                return false;
        }
        canLoad(route: Route): Observable<boolean> {
                const user = JSON.parse(sessionStorage.getItem('user'));
                if (user) {
                        this.broadcastService.setAuth(true);
                } else {
                        this.broadcastService.setAuth(false);                        
                }

                return Observable.create(observer => {
                        observer.next(true);
                        observer.complete();
                });

        }
}
