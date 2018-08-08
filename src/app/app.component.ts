import { Component, ViewChild, NgZone } from '@angular/core';

import { Platform, MenuController, Nav , LoadingController, AlertController} from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HTTP } from '@ionic-native/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Pro } from '@ionic/pro';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = HelloIonicPage;
  pages: Array<{title: string, component: any}>;
  public loader2;
  IonicCordova: any;
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public ngZone: NgZone,
    public http: HTTP,
    public loadingCtrl: LoadingController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'My First List', component: ListPage }
    ];
  }
/*  test() {
    this.http.get('http://ionic.io', {}, {})
      .then(data => {

        console.log(data.status);
        console.log(data.data); // data received by server
        console.log(data.headers);

      })
      .catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });

  }*/
  initializeApp() {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.ionicDeployCheck2();

      // this.test();



    });
  }




  async checkChannel() {
    try {
      const res = await Pro.deploy.getConfiguration();
      console.log(res);
      return res;
    } catch (err) {
      /*Pro.monitoring.exception(err);*/
      console.log(err);
    }
  }
  async ionicDeployDownload() {
    try {
      let me = this;
      this.loader2 = this.loadingCtrl.create({
        content: `
                    <div class="custom-spinner-container">
                        <div class="custom-spinner-box">Start Updating</div>
                    </div>
                    `,
        showBackdrop: true
      });
      me.loader2.present();

      await Pro.deploy.downloadUpdate((progress) => {
        console.log('downloadUpdate progress:', progress);
        me.ngZone.run(() => {
          me.loader2.setContent('downloadUpdate progress:' + progress + '%');
        });

      });
      await Pro.deploy.extractUpdate((progress) => {
        console.log('extractUpdate progress:', progress);
        me.ngZone.run(() => {
          me.loader2.setContent('extractUpdate progress:' + progress + '%');
        });
      });
      me.loader2.dismiss();

      await Pro.deploy.reloadApp();
    } catch (err) {
      /*Pro.monitoring.exception(err);*/
      console.log(err);
    }
  }
  async performManualUpdate() {
    let me = this;

    try {
      let update = null ;
      try{
        update = await Pro.deploy.checkForUpdate();
        } catch (err2) {
          /*Pro.monitoring.exception(err);*/
          console.log("err2");
          console.log(err2);
        }
      console.log(update);

      if (update.available){


        let msg = "Would you update?";
        let confirmUpdateAlert = this.alertCtrl.create({
          title: "Update Found",
          message: msg,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'Update',
            handler: () => {
              me.ionicDeployDownload();
            }
          }]
        });
        confirmUpdateAlert.present().then(() => {
        });

      }
    } catch (err) {
      /*Pro.monitoring.exception(err);*/
      console.log(err);
    }

  }

  private ionicDeployCheck2() {
    this.checkChannel();
    this.performManualUpdate();
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
