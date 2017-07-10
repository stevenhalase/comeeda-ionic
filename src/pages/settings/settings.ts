import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { ProfileEditPage } from '../../pages/profile-edit/profile-edit';
import { AuthPage } from '../../pages/auth/auth';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController, 
    public authProvider: AuthProvider,
    public modalCtrl: ModalController) {

  }

  openProfileEdit() {
    let profileEditModal = this.modalCtrl.create(ProfileEditPage, null, { enableBackdropDismiss: true });
    profileEditModal.present();
  }

  logout() {
    this.authProvider.logoutUser().then(() => {
      let authModal = this.modalCtrl.create(AuthPage, null, { enableBackdropDismiss: false });
      authModal.present();
    }, error => {
      console.log(error);
    })
  }

}
