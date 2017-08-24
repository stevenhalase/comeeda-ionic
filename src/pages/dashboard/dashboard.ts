import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { AuthPage } from '../../pages/auth/auth';
import { PickupListPage } from '../../pages/pickup-list/pickup-list';
import { SocketProvider } from '../../providers/socket/socket';

// import anime from 'animejs'
// import ProgressBar from 'progressbar.js';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  userNumberOfPickups: number = 0;
  userTotalDistanceOfPickups: number = 0;
  userTotalTimeOfPickups: number = 0;
  statSelection = this.apiProvider.statSelectionEnum.week;

  constructor(
    public navCtrl: NavController, 
    public authProvider: AuthProvider,
    public apiProvider: ApiProvider,
    public modalCtrl: ModalController,
    public socketProvider: SocketProvider,
    public events: Events) {
  }

  ionViewDidEnter() {
    this.authProvider.isAuthed().then(isAuthed => {
      if (!isAuthed) {
        this.presentAuthModal();
      } else {
        this.socketProvider.connect();
        this.apiProvider.getUserStats(this.authProvider.currentUser._id, this.apiProvider.statSelectionEnum.week).then(data => {
          this.userNumberOfPickups = data.result.count;
          this.userTotalDistanceOfPickups = data.result.totalDistance;
          this.userTotalTimeOfPickups = data.result.totalTime;
        });
      }
    }, error => {
      this.presentAuthModal();
    })
  }

  changeStatFrame() {
    this.apiProvider.getUserStats(this.authProvider.currentUser._id, this.statSelection).then(data => {
      this.userNumberOfPickups = data.result.count;
      this.userTotalDistanceOfPickups = data.result.totalDistance;
      this.userTotalTimeOfPickups = data.result.totalTime;
    });
  }

  presentPickupList() {
    this.apiProvider.getUserPickups(this.authProvider.currentUser._id, this.statSelection).then(data => {
      let pickupListModal = this.modalCtrl.create(PickupListPage, { pickups: data });
      pickupListModal.present();
    });
  }

  presentAuthModal() {
    let authModal = this.modalCtrl.create(AuthPage, null, { enableBackdropDismiss: false });
    authModal.present();
  }

}
