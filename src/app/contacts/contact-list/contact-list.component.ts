import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts: Contact[] = [];
  term: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // Subscribe to changes
    this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );

    // Trigger initial load
    this.contactService.getContacts();
  }

  // Required by template for search box
  search(value: string) {
    this.term = value;
  }
}
