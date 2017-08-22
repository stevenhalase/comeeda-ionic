import { Component, ViewChild } from '@angular/core';
import { Events } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'user-statistics',
  templateUrl: 'user-statistics.html'
})
export class UserStatisticsComponent {

  userNumberOfPickups: number = 0;
  userTotalDistanceOfPickups: number = 0;
  userTotalTimeOfPickups: number = 0;

  constructor(public apiProvider: ApiProvider, public authProvider: AuthProvider, public events: Events) {
    // if (this.authProvider.currentUser) {
    //   this.apiProvider.getUserNumberOfPickups(this.authProvider.currentUser._id).then(data => {
    //     this.userNumberOfPickups = data.result;
    //   });

    //   this.apiProvider.getUserTotalDistanceOfPickups(this.authProvider.currentUser._id).then(data => {
    //     this.userTotalDistanceOfPickups = data.result;
    //   });

    //   this.apiProvider.getUserTotalTimeOfPickups(this.authProvider.currentUser._id).then(data => {
    //     this.userTotalTimeOfPickups = data.result;
    //   });
    // }

    // this.events.subscribe('user:login', data => {
    //   this.apiProvider.getUserNumberOfPickups(this.authProvider.currentUser._id).then(data => {
    //     this.userNumberOfPickups = data.result;
    //   });

    //   this.apiProvider.getUserTotalDistanceOfPickups(this.authProvider.currentUser._id).then(data => {
    //     this.userTotalDistanceOfPickups = data.result;
    //   });

    //   this.apiProvider.getUserTotalTimeOfPickups(this.authProvider.currentUser._id).then(data => {
    //     this.userTotalTimeOfPickups = data.result;
    //   });

    // })
  }

}
