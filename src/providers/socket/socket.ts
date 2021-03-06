import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as io from 'socket.io-client';

import { AuthProvider } from '../auth/auth';

@Injectable()
export class SocketProvider {

  public socket:any;
  public socketUrl: string;

  constructor(public http: Http, private events: Events, public authProvider: AuthProvider) {

    // this.socketUrl = 'http://localhost:4000';
    this.socketUrl = 'https://comeeda-api.herokuapp.com';

    this.socket = io.connect(this.socketUrl);
    this.socket.on('connected', () => this.connect());
    this.socket.on('disconnected', () => this.disconnect());
    this.socket.on('error', (error: string) => {
        console.log(`ERROR: '${error}' (${this.socketUrl})`);
    });
    this.socket.on('foundVolunteers', (foundVolunteers: any) => this.foundVolunteers(foundVolunteers));
    this.socket.on('tryAssignment', (tempPickup: any) => this.tryAssignment(tempPickup));
    this.socket.on('volunteerAssigned', (volunteer: any) => this.assignVolunteer(volunteer));
    this.socket.on('startPickup', (activePickup: any) => this.startPickup(activePickup));
    this.socket.on('pickupCanceledDonator', () => this.pickupCanceledDonator());
    this.socket.on('pickupCanceledVolunteer', () => this.pickupCanceledVolunteer());
    this.socket.on('pickupCompleteDonator', () => this.pickupCompleteDonator());
    this.socket.on('pickupCompleteVolunteer', () => this.pickupCompleteVolunteer());
    this.socket.on('updateVolunteerLocationForDonator', (volLatLng: any) => this.updateVolunteerLocationForDonator(volLatLng));
    this.socket.on('chatConnected', (user: any) => this.chatConnected(user));
    this.socket.on('newChatMessage', (message: any, sendingUser: any) => this.newChatMessage(message, sendingUser));
    this.socket.on('chatMessageSentConfirmation', (message: any) => this.chatMessageSentConfirmation(message));
    this.socket.on('chatMessageReceivedConfirmation', (message: any) => this.chatMessageReceivedConfirmation(message));
  }

  connect() {
    console.log('Connected');
  }

  disconnect() {
    console.log('Disconnected');
  }

  goOnline() {
    this.socket.emit('volunteerOnline', this.authProvider.currentUser);
  }

  goOffline() {
    this.socket.emit('volunteerOffline', this.authProvider.currentUser);
  }

  findVolunteers() {
    this.socket.emit('findVolunteers', this.authProvider.currentUser);
  }

  foundVolunteers(foundVolunteers: any) {
    this.events.publish('foundVolunteers', foundVolunteers);
  }

  requestPickup() {
    this.socket.emit('requestPickup', this.authProvider.currentUser);
  }

  tryAssignment(tempPickup: any) {
    this.events.publish('tryAssignment', tempPickup);
  }

  acceptPickupRequest(tempPickup: any) {
    console.log(tempPickup)
    this.socket.emit('acceptPickupRequest', tempPickup);
  }

  denyPickupRequest(tempPickup: any) {
    console.log(tempPickup)
    this.socket.emit('denyPickupRequest', tempPickup);
  }

  assignVolunteer(volunteer) {
    this.events.publish('volunteerAssigned', volunteer);
  }

  startPickup(activePickup) {
    this.events.publish('startPickup', activePickup);
  }

  updateVolunteerLocation(latLng: any, activePickup: any) {
    this.socket.emit('updateVolunteerLocation', latLng, activePickup);
  }

  updateVolunteerLocationForDonator(volLatLng: any) {
    this.events.publish('updateVolunteerLocationForDonator', volLatLng);
  }

  cancelPickup(activePickup) {
    this.socket.emit('cancelPickup', activePickup);
  }

  completePickup(activePickup) {
    this.socket.emit('completePickup', activePickup);
  }

  pickupCanceledDonator() {
    this.events.publish('pickupCanceledDonator');
  }
  
  pickupCanceledVolunteer() {
    this.events.publish('pickupCanceledVolunteer');
  }

  pickupCompleteDonator() {
    this.events.publish('pickupCompleteDonator');
  }

  pickupCompleteVolunteer() {
    this.events.publish('pickupCompleteVolunteer');
  }

  chatConnected(user) {
    this.events.publish('chatConnected', user);
  }

  sendChatMessage(message, receivingUser) {
    this.socket.emit('sendChatMessage', message, this.authProvider.currentUser, receivingUser);
  }

  newChatMessage(message, sendingUser) {
    this.events.publish('newChatMessage', message);
    this.socket.emit('chatMessageRecievedConfirmation', message, sendingUser);
  }

  chatMessageSentConfirmation(message) {
    this.events.publish('chatMessageSentConfirmation', message);
  }

  chatMessageReceivedConfirmation(message) {
    this.events.publish('chatMessageReceivedConfirmation', message);
  }


}
