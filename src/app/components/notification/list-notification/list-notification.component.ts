import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { Notification } from 'src/app/shared/models/notification';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.scss']
})
export class ListNotificationComponent implements OnInit {

  notifications?: Notification[];
  currentNotification?: Notification = new Notification();
  currentIndex = -1;
  title = '';

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.retrieveNotifications();
  }

  refreshList(): void {
    this.currentNotification = undefined;
    this.currentIndex = -1;
    this.retrieveNotifications();
  }

  retrieveNotifications(): void {
    this.firestoreService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.notifications = data;
    });
  }

  setActiveNotification(notification: Notification, index: number): void {
    console.log(notification, index);
    this.currentNotification = notification;
    this.currentIndex = index;
  }

  deleteNotification(notification: Notification): void {
    if (notification.id) {
      this.firestoreService.delete(notification.id)
        .then(() => {
          alert('Campanha excluída com sucesso.');
        })
        .catch(err => console.log(err));
    }
  }

  close() {
    this.currentNotification = undefined;
    this.currentIndex = -1;
  }

}





