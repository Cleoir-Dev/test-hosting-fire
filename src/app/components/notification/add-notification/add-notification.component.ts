import { Component, OnInit } from '@angular/core';
import { MessageFCM } from 'src/app/shared/models/message-fcm';
import { Notification } from 'src/app/shared/models/notification';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { UuidUtils } from 'src/app/shared/util/uuid.utils';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss'],
})
export class AddNotificationComponent implements OnInit {
  notification: Notification = new Notification();

  submitted = false;

  constructor(
    private firestoreService: FirestoreService,
    private uuidUtils: UuidUtils,
    private fcm: FcmService
  ) {}

  ngOnInit(): void {}

  sendNotification(): void {
    this.notification.uuid = this.uuidUtils.generateUUID();
    this.notification.dateSend = new Date();

    this.firestoreService
      .create(this.notification)
      .then(async (response: any) => {
        console.log('Created new item successfully!', response);
        this.submitted = false;
        let message: MessageFCM = {
          message: {
            notification: {
              title: this.notification.title,
              body: this.notification.description,
            },
            token:
              'dCYX8AkwRD2uTuUKCYr8di:APA91bF_pzv2dv06WpnQ6-obMTkPC3xwbXFty0dNbxVBHN-X3WJau02klaw2KtaqhoRh8Ne9PyMfuAZR3bKFPLetBCAfnWgYCQXP7iAU6K3PcH7DvsMScbAusKFqB9S6pOyfuHz1JvTk',
          },
        };
         if (await this.fcm.sendMessage(message)) {
           console.log('Push enviado com sucesso!', message);
         }
      });
  }

  newNotification(): void {
    this.submitted = true;
    this.notification = new Notification();
  }

  close() {
    this.submitted = !this.submitted;
    this.notification = new Notification();
  }
}
