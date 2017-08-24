import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-pickup-list',
  templateUrl: 'pickup-list.html',
})
export class PickupListPage {

  pickups: Array<any>;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider) {
    let pickups = this.navParams.get('pickups');
    pickups.sort(function(a,b){
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    for (let pickup of pickups) {
      pickup.distance = this.getPickupDistance(pickup);
      pickup.time = this.getPickupTime(pickup);
      for (let status of pickup.status) {
        if (status.name === 'Canceled') {
          pickup.cancelled = true;
        }
      }
      
      this.generateStaticMapUrl(pickup).then(mapUrl => {
        pickup.mapUrl = mapUrl;
      });
    }
    this.pickups = pickups;
  }

  ionViewDidLoad() {
    
  }

  presentPickupDetail(pickup) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  generateStaticMapUrl(pickup) {
    return this.apiProvider.getPickupStaticMap(pickup._id);
  }

  getPickupDistance(pickup) {
    let distance = 0;
    if (pickup.geo) {
      if (pickup.geo.waypoints) {
        if (pickup.geo.waypoints.length > 1) {
          for (let i = 1; i < pickup.geo.waypoints.length; i++) {
            distance += this.calculateDistance(pickup.geo.waypoints[i].lat, pickup.geo.waypoints[i].lng, pickup.geo.waypoints[i - 1].lat, pickup.geo.waypoints[i - 1].lng, "M");
          }
        }
      }
    }
    return distance;
  }

  getPickupTime(pickup) {
    let totalTime = 0;
    let minutes = 0;
    if (pickup.status) {
      let hasAcceptedStatus = false;
      let hasCanceledStatus = false;
      let hasCompleteStatus = false;
      let startDate = null;
      let endDate = null;
      for (let status of pickup.status) {
        if (status.name === 'Accepted') {
          hasAcceptedStatus = true;
          startDate = status.date;
        } else if (status.name === 'Canceled') {
          hasCanceledStatus = true;
          endDate = status.date;
        } else if (status.name === 'Complete') {
          hasCompleteStatus = true;
          endDate = status.date;
        }
      }
      if (startDate && endDate) {
        totalTime += Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
        minutes += Math.round(totalTime / 60000);
      }
    }
    return minutes;
  }

  calculateDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }

}
