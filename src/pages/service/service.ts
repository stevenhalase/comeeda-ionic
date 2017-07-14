import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Events, LoadingController, ToastController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';

import { AuthProvider } from '../../providers/auth/auth';
import { SocketProvider } from '../../providers/socket/socket';

declare var google;

@Component({
  selector: 'page-service',
  templateUrl: 'service.html'
})
export class ServicePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  online: boolean = false;
  loadingPopup: any;
  completionLoadingPopup: any;
  tempPickup: any;
  volunteer: any;
  currentMarker: any;
  volunteerMarkers: Array<any> = [];
  volunteerMarker: any;
  donatorMarker: any;
  directionsService: any;
  directionsDisplay: any;
  activePickup: any = null;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public socketProvider: SocketProvider,
    public events: Events,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private launchNavigator: LaunchNavigator,
    private geolocation: Geolocation) {

      this.events.subscribe('foundVolunteers', foundVolunteers => {
        for (let volunteer of foundVolunteers) {
          let latLng = new google.maps.LatLng(volunteer.location.latitude, volunteer.location.longitude);
          var image = {
            url: 'assets/images/volunteer.png',
            scaledSize: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(20, 30)
          };
          this.volunteerMarkers.push(new google.maps.Marker({
            position: latLng,
            title: volunteer.firstname,
            snippet: volunteer.firstname,
            animation: google.maps.Animation.DROP,
            icon: image,
            map: this.map
          }));
        }
      });

      this.events.subscribe('tryAssignment', (tempPickup) => {
        this.tempPickup = tempPickup;
        let donLatLng = new google.maps.LatLng(tempPickup.donator.location.latitude, tempPickup.donator.location.longitude);
        let volLatLng = new google.maps.LatLng(this.authProvider.currentUser.location.latitude, this.authProvider.currentUser.location.longitude);
        var image = {
          url: 'assets/images/pin2.png',
          scaledSize: new google.maps.Size(45, 50),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(22, 50)
        };
        this.donatorMarker = new google.maps.Marker({
          position: donLatLng,
          map: this.map,
          title: tempPickup.donator.firstname,
          snippet: tempPickup.donator.firstname,
          animation: google.maps.Animation.DROP,
          icon: image
        });
        this.map.panTo(volLatLng);
        this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, volLatLng, donLatLng);
        let toast = this.toastCtrl.create({
          message: tempPickup.donator.firstname + ' has requested a pickup.',
          duration: 10000,
          closeButtonText: 'Accept',
          showCloseButton: true
        });
        toast.present();
        toast.onDidDismiss(() => {
          tempPickup.geo = {
            request: {
              origin: volLatLng,
              destination: donLatLng
            }
          }
          this.socketProvider.acceptPickupRequest(tempPickup);
        });
      });

      this.events.subscribe('volunteerAssigned', (volunteer) => {
        for (let volunteerMarker of this.volunteerMarkers) {
          volunteerMarker.setMap(null);
        }
        this.volunteerMarkers = [];
        this.volunteer = volunteer;
        let volLatLng = new google.maps.LatLng(volunteer.location.latitude, volunteer.location.longitude);
        let donLatLng = new google.maps.LatLng(this.authProvider.currentUser.location.latitude, this.authProvider.currentUser.location.longitude);

        var image = {
          url: 'assets/images/volunteer.png',
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(20, 30)
        };
        this.volunteerMarker = new google.maps.Marker({
          position: volLatLng,
          title: volunteer.firstname,
          snippet: volunteer.firstname,
          animation: google.maps.Animation.DROP,
          icon: image,
          map: this.map
        });

        this.map.panTo(volLatLng);
        this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, donLatLng, volLatLng);
        this.loadingPopup.dismiss();
        let toast = this.toastCtrl.create({
          message: volunteer.firstname + ' is on his way!',
          showCloseButton: true
        });
        toast.present();
      });

      this.events.subscribe('startPickup', (activePickup) => {
        this.activePickup = activePickup;

        var destination: string = activePickup.donator.location.latitude.toString() + ', ' + activePickup.donator.location.longitude.toString();
        var start: string = this.authProvider.currentUser.location.latitude.toString() + ', ' + this.authProvider.currentUser.location.longitude.toString();
        console.log('launching navigator');
        this.launchNavigator.navigate(destination, {
          start: start,
          app: launchNavigator.APP.GOOGLE_MAPS
        })
      });

      this.events.subscribe('updateVolunteerLocationForDonator', (volLatLng) => {
        this.volunteerMarker.setPosition(volLatLng);
        let donLatLng = new google.maps.LatLng(this.authProvider.currentUser.location.latitude, this.authProvider.currentUser.location.longitude);
        this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, donLatLng, volLatLng);
      })

      this.events.subscribe('pickupCanceledDonator', () => {
        for (let volunteerMarker of this.volunteerMarkers) {
          volunteerMarker.setMap(null);
        }
        this.volunteerMarkers = [];
        this.socketProvider.findVolunteers();
        this.clearRoute();
        this.map.panTo(this.currentMarker.position);
        let toast = this.toastCtrl.create({
          message: 'Pickup has been canceled!',
          showCloseButton: true
        });
        toast.present();
      })

      this.events.subscribe('pickupCompleteDonator', () => {
        for (let volunteerMarker of this.volunteerMarkers) {
          volunteerMarker.setMap(null);
        }
        this.volunteerMarkers = [];
        this.socketProvider.findVolunteers();
        this.clearRoute();
        this.map.panTo(this.currentMarker.position);
        let toast = this.toastCtrl.create({
          message: 'Pickup has been completed!',
          showCloseButton: true
        });
        toast.present();
      })

      this.events.subscribe('pickupCanceledVolunteer', () => {
        this.donatorMarker.setMap(null);
        this.clearRoute();
        this.map.panTo(this.currentMarker.position);
        this.completionLoadingPopup.dismiss();
        this.activePickup = null;
        let toast = this.toastCtrl.create({
          message: 'Pickup successfully canceled!',
          showCloseButton: true
        });
        toast.present();
      })

      this.events.subscribe('pickupCompleteVolunteer', () => {
        this.donatorMarker.setMap(null);
        this.clearRoute();
        this.map.panTo(this.currentMarker.position);
        this.completionLoadingPopup.dismiss();
        this.activePickup = null;
        let toast = this.toastCtrl.create({
          message: 'Pickup successfully completed!',
          showCloseButton: true
        });
        toast.present();
      })
  }

  ngAfterViewInit() {
    this.loadMap();
    this.socketProvider.findVolunteers();
  }

  loadMap(){
        let latLng = new google.maps.LatLng(this.authProvider.currentUser.location.latitude, this.authProvider.currentUser.location.longitude);
 
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
 
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.directionsService = new google.maps.DirectionsService,
        this.directionsDisplay = new google.maps.DirectionsRenderer({
          map: this.map
        })
        var image = {
          url: 'assets/images/pin.png',
          scaledSize: new google.maps.Size(30, 50),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(15, 50)
        };
        this.currentMarker = new google.maps.Marker({
          position: latLng,
          title: this.authProvider.currentUser.firstname,
          snippet: this.authProvider.currentUser.firstname,
          animation: google.maps.Animation.DROP,
          icon: image,
          map: this.map
        });

        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          let currentLatLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
          this.currentMarker.setPosition(currentLatLng);
          this.map.panTo(currentLatLng);
          console.log('Updating location');
          if (this.activePickup) {
            this.socketProvider.updateVolunteerLocation(currentLatLng, this.activePickup);
            let donLatLng = new google.maps.LatLng(this.activePickup.donator.location.latitude, this.activePickup.donator.location.longitude);
            this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, currentLatLng, donLatLng);
          }
        });
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        this.timeEstimate = response.routes[0].legs[0].duration.text;
        directionsDisplay.setOptions( { suppressMarkers: true } );
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  clearRoute() {
    this.directionsDisplay.setDirections({routes: []});
  }

  changeOnline() {
    if (this.online) {
      this.socketProvider.goOnline();
    } else {
      this.socketProvider.goOffline();
    }
  }

  requestPickup() {
    this.loadingPopup = this.loadingCtrl.create({
      content: 'Finding nearest volunteer...'
    });
    this.loadingPopup.present();
    this.socketProvider.requestPickup();
  }

  cancelPickup() {
    this.socketProvider.cancelPickup(this.activePickup);
    this.completionLoadingPopup = this.loadingCtrl.create({
      content: 'Canceling pickup...'
    });
    this.completionLoadingPopup.present();
  }

  completePickup() {
    this.socketProvider.completePickup(this.activePickup);
    this.completionLoadingPopup = this.loadingCtrl.create({
      content: 'Completing pickup...'
    });
    this.completionLoadingPopup.present();
  }

}
