import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

import { ImagePicker } from '@ionic-native/image-picker';

import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

  filestackClient: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public apiProvider: ApiProvider,
    public toastCtrl: ToastController, 
    public viewCtrl: ViewController,
    private imagePicker: ImagePicker) {
  }

  updateUser() {
    this.authProvider.updateUser(this.authProvider.currentUser)
      .then(userData => {
        console.log(userData);
        this.presentToast();
      })
      .catch(error => {
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
          let profileImg = results[i];
          this.apiProvider.uploadProfilePicture(this.authProvider.currentUser._id, profileImg).then(data => {
              console.log(data);
            })
            .catch(error => {
              console.log(error);
            })
      }
    }, (err) => { console.log(err) });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
