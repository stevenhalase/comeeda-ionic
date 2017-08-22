import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

import { ImagePicker } from '@ionic-native/image-picker';

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
    public viewCtrl: ViewController,
    private imagePicker: ImagePicker) {
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

  selectProfileImage() {
    this.imagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
      for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
      }
    }, (err) => { console.log(err) });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
