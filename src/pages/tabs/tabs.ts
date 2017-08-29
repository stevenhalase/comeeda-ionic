import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';
import { ServicePage } from '../service/service';
import { SettingsPage } from '../settings/settings';

import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { SocketProvider } from '../../providers/socket/socket';

declare var $;

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
    public apiProvider: ApiProvider,
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
        for (let el of this.messages) {
          if (el.message.id == message.id) {
            el.message.sentConfirmed = true;
          }
        }
      });

      this.events.subscribe('chatMessageReceivedConfirmation', message => {
        for (let el of this.messages) {
          if (el.message.id == message.id) {
            el.message.receivedConfirmed = true;
          }
        }
      });
  }

  toggleChat() {
    if (!this.chatOpen) {
      this.unreadCount = 0;
      this.chatOpen = true;
      $(".message-container").stop().animate({ scrollTop: $(".message-container")[0].scrollHeight}, 1000);
    } else {
      this.chatOpen = false;
    }
  }

  closeChat() {
    this.chatOpen = false;
  }

  sendMessage() {
    if (this.userMessage.length > 0) {
        let completeMessage = {
        messageContent: this.userMessage,
        id: this.guid(),
        datetime: new Date(),
        sentConfirmed: false,
        receivedConfirmed: false,
        showDate: false
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
    $(".message-container").stop().animate({ scrollTop: $(".message-container")[0].scrollHeight}, 1000);
  }

  toggleDate(message) {
    message.message.showDate ? message.message.showDate = false : message.message.showDate = true;
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
