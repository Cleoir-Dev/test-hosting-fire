import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentSnapshot
} from '@angular/fire/compat/firestore';
import { Notification } from 'src/app/shared/models/notification';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private dbPath = '/notifications';

  notificationsRef: AngularFirestoreCollection<Notification>;

  constructor(private db: AngularFirestore) {
    this.notificationsRef = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Notification> {
    return this.notificationsRef;
  }

  create(notification: Notification): any {
    return this.notificationsRef.add({ ...notification });
  }

  update(id: string, data: any): Promise<void> {
    return this.notificationsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.notificationsRef.doc(id).delete();
  }
}
