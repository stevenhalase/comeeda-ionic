import { Component, PACKAGE_ROOT_URL, ViewChild } from '@angular/core';
import { NavController, ModalController, Events, LoadingController } from 'ionic-angular';

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
  rankingSelection = this.apiProvider.rankingSelectionEnum.pickups;
  rankedNumberUsers: Array<any> = [];
  rankedTimeUsers: Array<any> = [];
  rankedDistanceUsers: Array<any> = [];

  constructor(
    public navCtrl: NavController, 
    public authProvider: AuthProvider,
    public apiProvider: ApiProvider,
    public modalCtrl: ModalController,
    public socketProvider: SocketProvider,
    public events: Events,
    public loadingCtrl: LoadingController) {
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
        this.apiProvider.getRankedUsers(this.rankingSelection).then(data => {
          this.rankedNumberUsers = data;
        });
      }
    }, error => {
      this.presentAuthModal();
    })
  }

  changeStatFrame() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'crescent',
      enableBackdropDismiss: false
    });

    loading.present();
    this.apiProvider.getUserStats(this.authProvider.currentUser._id, this.statSelection).then(data => {
      this.userNumberOfPickups = data.result.count;
      this.userTotalDistanceOfPickups = data.result.totalDistance;
      this.userTotalTimeOfPickups = data.result.totalTime;
      loading.dismiss();
    });
  }

  changeRankedFrame() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'crescent',
      enableBackdropDismiss: false
    });

    loading.present();
    this.apiProvider.getRankedUsers(this.rankingSelection).then(data => {
      if (this.rankingSelection == this.apiProvider.rankingSelectionEnum.pickups) {
        this.rankedNumberUsers = data;
      } else if (this.rankingSelection == this.apiProvider.rankingSelectionEnum.time) {
        this.rankedTimeUsers = data;
      } else if (this.rankingSelection == this.apiProvider.rankingSelectionEnum.distance) {
        this.rankedDistanceUsers = data;
      }
      loading.dismiss();
    });
  }

  presentPickupList() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'crescent',
      enableBackdropDismiss: false
    });

    loading.present();
    this.apiProvider.getUserPickups(this.authProvider.currentUser._id, this.statSelection).then(data => {
      let pickupListModal = this.modalCtrl.create(PickupListPage, { pickups: data });
      loading.dismiss();
      pickupListModal.present();
    });
  }

  presentAuthModal() {
    let authModal = this.modalCtrl.create(AuthPage, null, { enableBackdropDismiss: false });
    authModal.present();
    authModal.onDidDismiss(() => {
      this.apiProvider.getUserStats(this.authProvider.currentUser._id, this.apiProvider.statSelectionEnum.week).then(data => {
          this.userNumberOfPickups = data.result.count;
          this.userTotalDistanceOfPickups = data.result.totalDistance;
          this.userTotalTimeOfPickups = data.result.totalTime;
        });
        this.apiProvider.getRankedUsers(this.rankingSelection).then(data => {
          this.rankedNumberUsers = data;
        });
    })
  }

}
