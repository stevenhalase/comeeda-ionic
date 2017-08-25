import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { ServicePage } from '../pages/service/service';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthPage } from '../pages/auth/auth';
import { ProfileEditPage } from '../pages/profile-edit/profile-edit';
import { PickupListPage } from '../pages/pickup-list/pickup-list';

import { AuthProvider } from '../providers/auth/auth';
import { SocketProvider } from '../providers/socket/socket';
import { ApiProvider } from '../providers/api/api';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserHeroComponent } from '../components/user-hero/user-hero';
import { UserStatisticsComponent } from '../components/user-statistics/user-statistics';

import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { GoogleMaps } from '@ionic-native/google-maps';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    ServicePage,
    SettingsPage,
    TabsPage,
    AuthPage,
    ProfileEditPage,
    PickupListPage,
    UserHeroComponent,
    UserStatisticsComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    ServicePage,
    SettingsPage,
    TabsPage,
    AuthPage,
    ProfileEditPage,
    PickupListPage,
    UserHeroComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    SocketProvider,
    ApiProvider,
    Geolocation,
    GoogleMaps,
    LaunchNavigator,
    ImagePicker,
    FileTransfer,
    File
  ]
})
export class AppModule {}
