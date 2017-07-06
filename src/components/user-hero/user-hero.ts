import { Component } from '@angular/core';

import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'user-hero',
  templateUrl: 'user-hero.html'
})
export class UserHeroComponent {

  constructor(
    public authProvider: AuthProvider) {
      
  }

}
