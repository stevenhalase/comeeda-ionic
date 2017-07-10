import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';
import { ServicePage } from '../service/service';
import { SettingsPage } from '../settings/settings';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabs: Array<any> = [];

  constructor(
    public events: Events,
    public authProvider: AuthProvider) {
      this.tabs = [
        { title: "Dashboard", root: DashboardPage, icon: "home" },
        { title: "Service", root: ServicePage, icon: "navigate" },
        { title: "Settings", root: SettingsPage, icon: "cog" },
      ];
  }

  handleUserLogin(userData) {
    
  }
}
