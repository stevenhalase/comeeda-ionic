import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, LoadingController } from 'ionic-angular';

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
    private imagePicker: ImagePicker,
    public loadingCtrl: LoadingController) {
  }

  updateUser() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'crescent',
      enableBackdropDismiss: false
    });

    loading.present();
    this.authProvider.updateUser(this.authProvider.currentUser)
      .then(userData => {
        console.log(userData);
        loading.dismiss();
        this.presentToast('Profile updated successfully');
      })
      .catch(error => {
        loading.dismiss();
        console.log(error);
      })
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  selectProfileImage() {
    this.imagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
      for (var i = 0; i < results.length; i++) {
          let profileImg = results[i];
          let loading = this.loadingCtrl.create({
            content: 'Please wait...',
            spinner: 'crescent',
            enableBackdropDismiss: false
          });

          loading.present();
          this.apiProvider.uploadProfilePicture(this.authProvider.currentUser._id, profileImg).then(data => {
              loading.dismiss();
              this.authProvider.updateCurrentUser(data);
              this.presentToast('Profile picture updated successfully');
            })
            .catch(error => {
              loading.dismiss();
              this.presentToast(error);
            })
      }
    }, (err) => { console.log(err) });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
