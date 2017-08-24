import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiProvider {

  apiRoot: string;
  apiRoutes: ApiRoutes;
  statSelectionEnum = {
    week: 'Week',
    month: 'Month',
    year: 'Year'
  }

  constructor(public http: Http) {
    // this.apiRoot = 'http://localhost:4000/api/';
    this.apiRoot = 'https://comeeda-api.herokuapp.com/api/';

    this.apiRoutes = {
      userLogin: this.apiRoot + 'users/login',
      userSignup: this.apiRoot + 'users',
      userUpdate: this.apiRoot + 'users/',
      userPickups: this.apiRoot + 'pickups/user/',
      userNumberOfPickups: this.apiRoot + 'pickups/user/number/',
      userTotalDistanceOfPickups: this.apiRoot + 'pickups/user/distance/',
      userTotalTimeOfPickups: this.apiRoot + 'pickups/user/time/',
      userStats: this.apiRoot + 'pickups/user/stats/',
      pickupStaticMap: this.apiRoot + 'pickups/staticmap/'
    }
  }

  getUserPickups(userId: string, frame: any = null): Promise<any> {
    let url = this.apiRoutes.userPickups + userId;
    if (frame) {
      url += '/?frame=' + frame;
    }
    let promise = this.http.get(url)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

  getUserNumberOfPickups(userId: string, frame: any = null): Promise<any> {
    let url = this.apiRoutes.userNumberOfPickups + userId;
    if (frame) {
      url += '/?frame=' + frame;
    }
    let promise = this.http.get(url)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

  getUserTotalDistanceOfPickups(userId: string, frame: any = null): Promise<any> {
    let url = this.apiRoutes.userTotalDistanceOfPickups + userId;
    if (frame) {
      url += '/?frame=' + frame;
    }
    let promise = this.http.get(url)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

  getUserTotalTimeOfPickups(userId: string, frame: any = null): Promise<any> {
    let url = this.apiRoutes.userTotalTimeOfPickups + userId;
    if (frame) {
      url += '/?frame=' + frame;
    }
    let promise = this.http.get(url)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

  getUserStats(userId: string, frame: any): Promise<any> {
    let url = this.apiRoutes.userStats + userId;
    if (frame) {
      url += '/?frame=' + frame;
    }
    let promise = this.http.get(url)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

  getPickupStaticMap(pickupId): Promise<any> {
    let url = this.apiRoutes.pickupStaticMap + pickupId;
    let promise = this.http.get(url)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

}

class ApiRoutes {
  userLogin: string;
  userSignup: string;
  userUpdate: string;
  userPickups: string;
  userNumberOfPickups: string;
  userTotalDistanceOfPickups: string;
  userTotalTimeOfPickups: string;
  userStats: string;
  pickupStaticMap: string;
}
