import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../core/services/broadcast.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ClientService } from '../../modules/client/client.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  user: any;
  homeList: any = [];
  constructor(private _broadcastService: BroadcastService, 
    private _router: Router,
    private _fb: FormBuilder,
    private authService: AuthService,
    private clientService: ClientService,
    private toastService: ToastService) { }

  ngOnInit() {
    localStorage.clear();
    this.createForm();
    // this.loginForm.valueChanges.subscribe(data => 
    //   console.log('form changes', data)
    // );

    this.clientService.getHomeList().subscribe(res=>{
      console.log(res);
      if(res.key==0){
        this.homeList = res.value;
      }
    })
  }

  createForm(){
    this.loginForm = this._fb.group({
      userCode: [null, Validators.required],
      userPassword: [null, Validators.required],
      //roleId: [0],
      homeId: [0]
    });
  }

  login(){
    this.submitted = true;
    console.log(this.loginForm.value);
    
    if(this.loginForm.invalid){
      this.loginForm.markAsDirty();
      return false;
    }
    if(this.loginForm.value.homeId==0){
      return false;
    }

      // let user = {"name": "A"};
      // sessionStorage.setItem("user", JSON.stringify(user));
      // this._broadcastService.setAuth(true);
      // this._router.navigate(['dashboard']);
      this.authService.userLogin(this.loginForm.value).subscribe(res=>{
        console.log(res);
        if(res.key==0){
          sessionStorage.setItem("user", JSON.stringify(res.value));
          sessionStorage.setItem("token", res.message);
          this._broadcastService.setAuth(true);
          this._broadcastService.setUserData(res.value);
          this._router.navigate(['dashboard']);
        }
        else{
          this.toastService.showI18nToastFadeOut(res.message,"error");
        }
        
      })
    
  }

  reset(){
    this.submitted = false;
    this.loginForm.patchValue({
      userCode: null,
      userPassword: null,
      homeId: 0
    })
  }

  enterToLogin(ev){
    const code = (ev.keyCode ? ev.keyCode : ev.which);
      if (code === 13) {
        this.login();
      }
  }
}
