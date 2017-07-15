import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiProvider {

  apiRoot: string;
  apiRoutes: ApiRoutes;

  constructor(public http: Http) {
    // this.apiRoot = 'http://localhost:4000/api/';
    this.apiRoot = 'https://comeeda-api.herokuapp.com/api/';

    this.apiRoutes = {
      userLogin: this.apiRoot + 'users/login',
      userSignup: this.apiRoot + 'users',
      userUpdate: this.apiRoot + 'users/',
      userNumberOfPickups: this.apiRoot + 'pickups/user/number/',
      userTotalDistanceOfPickups: this.apiRoot + 'pickups/user/distance/',
      userTotalTimeOfPickups: this.apiRoot + 'pickups/user/time/'
    }
  }

  getUserNumberOfPickups(userId: string): Promise<any> {
    let promise = this.http.get(this.apiRoutes.userNumberOfPickups + userId)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

  getUserTotalDistanceOfPickups(userId: string): Promise<any> {
    let promise = this.http.get(this.apiRoutes.userTotalDistanceOfPickups + userId)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

  getUserTotalTimeOfPickups(userId: string): Promise<any> {
    let promise = this.http.get(this.apiRoutes.userTotalTimeOfPickups + userId)
      .map((res: any) => res.json())
      .toPromise();

    return promise;
  }

}

class ApiRoutes {
  userLogin: string;
  userSignup: string;
  userUpdate: string;
  userNumberOfPickups: string;
  userTotalDistanceOfPickups: string;
  userTotalTimeOfPickups: string;
}
