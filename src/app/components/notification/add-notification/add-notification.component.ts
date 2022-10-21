import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/shared/models/notification';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { UuidUtils } from 'src/app/shared/util/uuid.utils';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss']
})
export class AddNotificationComponent implements OnInit {

  notification: Notification = new Notification();

  submitted = false;

  constructor(private firestoreService: FirestoreService, private uuidUtils: UuidUtils) {}

  ngOnInit(): void {
  }

  sendNotification(): void {
    this.notification.cancel = false;
    this.notification.isScheduled = false;
    this.notification.scheduleTime = new Date();
    this.notification.sent = false;
    this.notification.test = true;

    this.firestoreService.create(this.notification).then(() => {
      console.log('Created new item successfully!');
      this.submitted = false;
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
