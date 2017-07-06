import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiProvider {

  apiRoot: string;
  apiRoutes: ApiRoutes;

  constructor(public http: Http) {
    this.apiRoot = 'https://comeeda-api.herokuapp.com/api/';

    this.apiRoutes = {
      userLogin: this.apiRoot + 'users/login',
      userSignup: this.apiRoot + 'users',
      userUpdate: this.apiRoot + 'users/'
    }
  }

}

class ApiRoutes {
  userLogin: string;
  userSignup: string;
  userUpdate: string;
}
