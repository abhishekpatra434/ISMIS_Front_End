import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: any;
  menuList: any = [];

  public show: boolean = true;
  currentActiveMenu: number;
  currentActiveSubMenu: number;
  currentActiveChildSubMenu: number;
  subMenuLists;
  childSubMenuLists: any = []; //new


  constructor(private authService: AuthService, private _broadcastService: BroadcastService) { }
  ngOnInit() {
    if (localStorage.getItem("activeMenu") != null) {
      this.currentActiveMenu = +localStorage.getItem("activeMenu");
    }
    if (localStorage.getItem("activeSubMenu") != null) {
      this.currentActiveSubMenu = +localStorage.getItem("activeSubMenu");
    }
    if (localStorage.getItem("activeChildSubMenu") != null) {
      this.currentActiveChildSubMenu = +localStorage.getItem("activeChildSubMenu");
    }




    let user = JSON.parse(sessionStorage.getItem('user'));
    this.user = user;
    this._broadcastService.getUserData().subscribe(user => {
      this.user = user;
    });
    let payload = {
      userId: user.userId
    }
    this.authService.getMenu(payload).subscribe(res => {
      console.log(res);
      this.menuList = res.value;
      if (this.menuList.length > 0 && this.currentActiveMenu >= 0) {
        this.toggle(this.currentActiveMenu);
      }
      if (this.currentActiveSubMenu >= 0) {
        this.toggleSubMenu(this.currentActiveMenu, this.currentActiveSubMenu);
      }
      if (this.currentActiveChildSubMenu >= 0) {
        this.togglechildSubMenu(this.currentActiveMenu, this.currentActiveSubMenu, this.currentActiveChildSubMenu);
      }
    })
    this._broadcastService.setSideVisiblity(this.show);
  }



  menuHideShow() {
    this.show = !this.show;
    this._broadcastService.setSideVisiblity(this.show);

  }


  toggle(index: number) {
    console.log(this.menuList);
    this.menuList.filter(
      (menu, i) => i !== index && menu.active
    ).forEach(menu => menu.active = !menu.active);
    this.menuList[index].active = !this.menuList[index].active;
    localStorage.setItem("activeMenu", index.toString());

    /* 
        let ObjForMenuIndex = { level: index };
        localStorage.setItem("menuIndex", JSON.stringify(ObjForMenuIndex));
        console.log("FROM LOCAL STROAGE::", JSON.parse(localStorage.getItem("menuIndex"))); */
  }

  toggleSubMenu(menuIndex: number, subMenuIndex: number) {

    this.menuList[menuIndex].menuLists.filter(
      (submenu, j) => j !== subMenuIndex && submenu.active
    ).forEach(submenu => submenu.active = !submenu.active);
    this.menuList[menuIndex].menuLists[subMenuIndex].active = !this.menuList[menuIndex].menuLists[subMenuIndex].active;

    for (let menu of this.menuList) {
      if (menu.menuId != this.menuList[menuIndex].menuId && menu.menuLists != null) {
        for (let submenu of menu.menuLists) {
          submenu.active = false;
        }
      }
    }
    localStorage.setItem("activeSubMenu", subMenuIndex.toString());

    /*    let ObjForMenuIndex = { level: subMenuIndex };
       localStorage.setItem("menuIndex", JSON.stringify(ObjForMenuIndex));
        console.log("FROM LOCAL STROAGE::", JSON.parse(localStorage.getItem("menuIndex"))); */
  }


  togglechildSubMenu(menuIndex: number, subMenuIndex: number, childSubMenuIndex: number) {

    console.log(menuIndex);
    //console.log("ARrray:::::", this.menuList[menuIndex].menuLists[subMenuIndex].menuLists);
    if (this.menuList[menuIndex].menuLists[subMenuIndex].menuLists != null) {
      for (let childSubMenus of this.menuList[menuIndex].menuLists[subMenuIndex].menuLists) {
        childSubMenus.active = false;
      }
      this.menuList[menuIndex].menuLists[subMenuIndex].menuLists.find(childSubMenu => childSubMenu.menuId == childSubMenuIndex).active = true;
    }

   
    localStorage.setItem("activeChildSubMenu", childSubMenuIndex.toString());


  }

}
