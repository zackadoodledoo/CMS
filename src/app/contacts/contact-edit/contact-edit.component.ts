import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {

  originalContact: Contact;
  contact: Contact;
  editMode = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];

      if (!id) {
        this.editMode = false;
        return;
      }

      this.originalContact = this.contactService.getContact(id);

      if (!this.originalContact) {
        return;
      }

      this.editMode = true;

      // Deep copy so editing doesn’t mutate the original
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
    });
  }

  onSubmit(form) {
    const newContact = form.value;

    if (this.editMode) {
      // ⭐ Required by assignment
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      // ⭐ Required by assignment
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }
}
