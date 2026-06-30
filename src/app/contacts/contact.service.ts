import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {}

  // GET all contacts from Node server
  getContacts() {
    this.http
      .get<{ message: string, contacts: Contact[] }>('http://localhost:3000/contacts')
      .subscribe(
        (responseData) => {
          this.contacts = responseData.contacts;

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
    return this.contacts.find((contact) => contact.id === id);
  }

  // POST — add new contact to Node server
  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // Node server generates the ID
    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string, contact: Contact }>(
        'http://localhost:3000/contacts',
        contact,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      });
  }

  // PUT — update contact on Node server
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }

    // Keep same ID
    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put('http://localhost:3000/contacts/' + originalContact.id,
        newContact,
        { headers: headers }
      )
      .subscribe(() => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      });
  }

  // DELETE — delete contact on Node server
  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) {
      return;
    }

    this.http
      .delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(() => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      });
  }

  private sortAndSend() {
    this.contacts.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
