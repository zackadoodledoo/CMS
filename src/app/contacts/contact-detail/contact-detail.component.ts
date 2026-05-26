import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  contact: Contact;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.contact = this.contactService.getContact(id);
    });
  }

  onEdit() {
    this.router.navigate(['/contacts', this.contact.id, 'edit']);
  }

  onDelete() {
  this.contactService.deleteContact(this.contact);
  this.router.navigateByUrl('/contacts');
}

}
