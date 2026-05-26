import { Component } from '@angular/core';
import { Document } from '../document.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent {
  document!: Document;
  nativeWindow: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private windRefService: WindRefService
  ) {
    this.nativeWindow = this.windRefService.getNativeWindow();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.document = this.documentService.getDocument(id);
    });

    this.nativeWindow = this.windRefService.getNativeWindow();
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }

  onView() {
  if (this.document?.url) {
    this.nativeWindow.open(this.document.url);
  }
}

}
