import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { ApiProvider } from '../api/api';

@Injectable()
export class AuthProvider {

  public currentUser: any;

  constructor(
    public http: Http,
    public apiProvider: ApiProvider,
    public events: Events,
    private storage: Storage,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController) {
    
  }

  isAuthed(): Promise<boolean> {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'crescent',
      enableBackdropDismiss: false
    });

    loading.present();
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        console.log(this.currentUser)
        this.events.publish('user:login');
        loading.dismiss();
        resolve(true);
      } else {
        this.checkStorageUser().then(userData =>{
          if (!this.currentUser) {
            reject(false);
            loading.dismiss();
          } else {
            this.events.publish('user:login', this.currentUser);
            loading.dismiss();
            resolve(true);
          }
        }, error => {
          loading.dismiss();
          reject(false);
        });
      }
    })
  }

  updateCurrentUser(user) {
    this.storage.set('user', user);
    this.storage.set('userExp', new Date(Date.now() + (1000*60*60*24)));
    this.currentUser = user;
  }

  checkStorageUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('userExp').then(userExp => {
        let userStorageValid = this.compareExpirationDate(userExp);
        if (userStorageValid) {
          this.storage.get('user').then(userdata => {
            this.currentUser = userdata;
            this.geolocation.getCurrentPosition().then((resp) => {
              this.currentUser.location = {
                heading : resp.coords.heading,
                accuracy: resp.coords.accuracy,
                latitude : resp.coords.latitude,
                longitude: resp.coords.longitude
              }
              this.updateUser(this.currentUser);
            }).catch((error) => {
              console.log('Error getting location', error);
            });
            resolve(this.currentUser);
          })
        } else {
          reject('No local user found');
        }
      })
    });
  }

  loginUser(email: string, password: string): Promise<any> {
    let promise: Promise<any> = this.http.post(this.apiProvider.apiRoutes.userLogin, { email, password } )
      .map((res: any) => res.json())
      .toPromise();

      promise.then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.storage.set('user', data);
          this.storage.set('userExp', new Date(Date.now() + (1000*60*60*24)));
          this.currentUser = data;
          console.log(this.currentUser)
          this.geolocation.getCurrentPosition().then((resp) => {
              this.currentUser.location = {
                heading : resp.coords.heading,
                accuracy: resp.coords.accuracy,
                latitude : resp.coords.latitude,
                longitude: resp.coords.longitude
              }
              this.updateUser(this.currentUser);
          }).catch((error) => {
            console.log('Error getting location', error);
          });
        }
      })

    return promise;
  }

  signupUser(email: string, password: string, membertype: string, location: Object): Promise<any> {
    let promise = this.http.post(this.apiProvider.apiRoutes.userSignup, { email: email, password: password, membertype: membertype, location: location, firstname: 'Marty', lastname: 'Byrde', city: 'Sunrise Beach', state: 'MO' } )
      .map((res: any) => res.json())
      .toPromise();

      promise.then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.storage.set('user', data);
          this.storage.set('userExp', new Date(Date.now() + (1000*60*60*24)));
          this.currentUser = data;
        }
      })
      
    return promise;
  }

  updateUser(userData: any): Promise<any> {
    let promise = this.http.put(this.apiProvider.apiRoutes.userUpdate + userData._id, userData )
      .map((res: any) => res.json())
      .toPromise();

      promise.then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.storage.set('user', data);
          this.storage.set('userExp', new Date(Date.now() + (1000*60*60*24)));
          this.currentUser = data;
        }
      })

    return promise;
  }

  resetPassword(email: string): any {
    // TODO: implement feature
    return '';
  }

  logoutUser(): any {
    return new Promise((resolve, reject) => {
      this.currentUser = null;
      this.storage.remove('user').then(() => {
        this.storage.remove('userExp').then(() => {
          resolve();
        }, error => {
          reject(error);
        });
      }, error => {
        reject(error);
      });
    });
  }

  compareExpirationDate(expDate: Date): boolean {
    let currentDate = new Date(Date.now());
    if (currentDate > expDate) {
      return false;
    } else {
      return true;
    }
  }

}
