import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { AuthPage } from '../../pages/auth/auth';
import { SocketProvider } from '../../providers/socket/socket';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  constructor(
    public navCtrl: NavController, 
    public authProvider: AuthProvider,
    public modalCtrl: ModalController,
    public socketProvider: SocketProvider) {
      
  }

  ionViewDidLoad() {
    this.authProvider.isAuthed().then(isAuthed => {
      if (!isAuthed) {
        this.presentAuthModal();
      } else {
        this.socketProvider.connect();
      }
    }, error => {
      this.presentAuthModal();
    })
  }

  presentAuthModal() {
    let authModal = this.modalCtrl.create(AuthPage, null, { enableBackdropDismiss: false });
    authModal.present();
  }

  

}
