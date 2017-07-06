import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { UserStatisticsComponent } from './user-statistics';

@NgModule({
  declarations: [
    UserStatisticsComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    UserStatisticsComponent
  ]
})
export class UserStatisticsComponentModule {}
