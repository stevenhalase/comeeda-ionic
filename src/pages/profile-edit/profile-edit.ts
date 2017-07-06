import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public toastCtrl: ToastController, 
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    
  }

  updateUser() {
    this.authProvider.updateUser(this.authProvider.currentUser).then(userData => {
      console.log(userData);
      this.presentToast();
    }, error => {
      console.log(error);
    })
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Profile updated successfully',
      duration: 3000
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
