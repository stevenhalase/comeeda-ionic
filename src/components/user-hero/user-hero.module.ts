import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { UserHeroComponent } from './user-hero';

@NgModule({
  declarations: [
    UserHeroComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    UserHeroComponent
  ]
})
export class UserHeroComponentModule {}
