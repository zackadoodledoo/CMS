import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  // Your Firebase URL (must end with a slash)
  private databaseUrl = 'https://zack-cms-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient) { }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  // HTTP GET — loads contacts from Firebase
  getContacts() {
    this.http
      .get<Contact[]>(this.databaseUrl + 'contacts.json')
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();

          this.contacts.sort((a, b) =>
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0
          );

          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  // HTTP PUT — saves contacts to Firebase
  storeContacts() {
    const contactsString = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.databaseUrl + 'contacts.json', contactsString, { headers })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  // Updated to call storeContacts()
  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(original: Contact, newContact: Contact) {
    if (!original || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(original);
    if (pos < 0) {
      return;
    }

    newContact.id = original.id;
    this.contacts[pos] = newContact;

    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }
}
