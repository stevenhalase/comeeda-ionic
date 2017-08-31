import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { AuthProvider } from '../../providers/auth/auth';
import { SocketProvider } from '../../providers/socket/socket';

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: './auth.html',
})
export class AuthPage {

  authType: string = 'signIn';
  email: string = '';
  password: string = '';
  membertype: string = 'donator';
  location: any;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider, 
    public viewCtrl: ViewController, 
    private geolocation: Geolocation,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'crescent',
      enableBackdropDismiss: false
    });

    loading.present();
    this.authProvider.loginUser(this.email, this.password).then(data => {
      if (data.error) {
        console.log(data.error)
        loading.dismiss();
        this.authFailureToast(data.error);
      } else {
        loading.dismiss();
        this.viewCtrl.dismiss(data);
      }
    })
  }

  signUp() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'crescent',
      enableBackdropDismiss: false
    });

    loading.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.location = {
        heading : resp.coords.heading,
        accuracy: resp.coords.accuracy,
        latitude : resp.coords.latitude,
        longitude: resp.coords.longitude
      }
      this.authProvider.signupUser(this.email, this.password, this.membertype, this.location).then(data => {
        if (data.error) {
          loading.dismiss();
          console.log(data.error);
          this.authFailureToast(data.error);
        } else {
          loading.dismiss();
          this.viewCtrl.dismiss(data);
        }
      })
    }).catch((error) => {
      loading.dismiss();
      console.log('Error getting location', error);
    });
  }

  authFailureToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
