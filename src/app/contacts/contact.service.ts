import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact[] = [];

  // Child → parent communication (still allowed)
  contactSelectedEvent = new Subject<Contact>();

  // Required Observable for list changes
  contactListChangedEvent = new Subject<Contact[]>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  // ⭐ Required by assignment
  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    // Generate new ID
    const maxId = this.getMaxId();
    const newId = (maxId + 1).toString();
    newContact.id = newId;

    this.contacts.push(newContact);

    this.contactListChangedEvent.next(this.contacts.slice());
  }

  // ⭐ Required by assignment
  updateContact(original: Contact, newContact: Contact) {
    if (!original || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(original);
    if (pos < 0) {
      return;
    }

    // Keep the same ID
    newContact.id = original.id;

    this.contacts[pos] = newContact;

    this.contactListChangedEvent.next(this.contacts.slice());
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

    this.contactListChangedEvent.next(this.contacts.slice());
  }

  // ⭐ Needed to generate unique IDs
  private getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }
}
