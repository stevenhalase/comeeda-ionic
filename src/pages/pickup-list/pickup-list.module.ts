import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickupListPage } from './pickup-list';

@NgModule({
  declarations: [
    PickupListPage,
  ],
  imports: [
    IonicPageModule.forChild(PickupListPage),
  ],
  exports: [
    PickupListPage
  ]
})
export class PickupListPageModule {}
