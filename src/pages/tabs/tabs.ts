import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';
import { ServicePage } from '../service/service';
import { SettingsPage } from '../settings/settings';

import { AuthProvider } from '../../providers/auth/auth';
import { SocketProvider } from '../../providers/socket/socket';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabs: Array<any> = [];
  chatConnected: Boolean = false;
  chatOpen: Boolean = false;
  connectedChatUser = {};
  userMessage: String = '';
  messages: Array<any> = [];
  unreadCount: number = 0;

  constructor(
    public events: Events,
    public authProvider: AuthProvider,
    public socketProvider: SocketProvider) {
      this.tabs = [
        { title: "Dashboard", root: DashboardPage, icon: "home" },
        { title: "Service", root: ServicePage, icon: "navigate" },
        { title: "Settings", root: SettingsPage, icon: "cog" },
      ];

      this.events.subscribe('chatConnected', user => {
        this.chatConnected = true;
        this.connectedChatUser = user;
      });

      this.events.subscribe('newChatMessage', message => {
        this.addMessage(message, true);
        if (!this.chatOpen) {
          this.unreadCount++;
        }
      });

      this.events.subscribe('chatMessageSentConfirmation', message => {
        let localMessage;
        for (let el of this.messages) {
          if (el.message.id == message.id) {
            el.sentConfirmed = true;
          }
        }
      });

      this.events.subscribe('chatMessageReceivedConfirmation', message => {
        let localMessage;
        for (let el of this.messages) {
          if (el.message.id == message.id) {
            el.receivedConfirmed = true;
          }
        }
      });
  }

  toggleChat() {
    if (!this.chatOpen) {
      this.unreadCount = 0;
      this.chatOpen = true;
    } else {
      this.chatOpen = false;
    }
  }

  sendMessage() {
    if (this.userMessage.length > 0) {
        let completeMessage = {
        messageContent: this.userMessage,
        id: this.guid(),
        sentConfirmed: false,
        receivedConfirmed: false
      }
      this.addMessage(completeMessage, false);
      this.socketProvider.sendChatMessage(completeMessage, this.connectedChatUser);
      this.userMessage = '';
    }
  }

  addMessage(message, incoming) {
    this.messages.push({
      message: message,
      incoming: incoming
    });
  }

  findMessage(el) {

  }

  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
