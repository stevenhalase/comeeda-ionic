import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { AuthProvider } from '../../providers/auth/auth';
import { SocketProvider } from '../../providers/socket/socket';

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {

  authType: string = 'signIn';
  email: string = '';
  password: string = '';
  membertype: string = 'donator';
  location: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authProvider: AuthProvider, 
    public viewCtrl: ViewController, 
    private geolocation: Geolocation,
    public toastCtrl: ToastController) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthPage');
  }

  login() {
    this.authProvider.loginUser(this.email, this.password).then(data => {
      if (data.error) {
        console.log(data.error)
        this.authFailureToast(data.error);
      } else {
        this.viewCtrl.dismiss(data);
      }
    })
  }

  signUp() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.location = {
        heading : resp.coords.heading,
        accuracy: resp.coords.accuracy,
        latitude : resp.coords.latitude,
        longitude: resp.coords.longitude
      }
      this.authProvider.signupUser(this.email, this.password, this.membertype, this.location).then(data => {
        if (data.error) {
          console.log(data.error);
          this.authFailureToast(data.error);
        } else {
          this.viewCtrl.dismiss(data);
        }
      })
    }).catch((error) => {
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
