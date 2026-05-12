import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
  new Document(
    '1',
    'CIT 260 - Object Oriented Programming',
    'Learn the fundamentals of object-oriented programming using Java.',
    'https://content.byui.edu/file/260-course-description.pdf',
    null
  ),
  new Document(
    '2',
    'CIT 366 - Full Web Stack Development',
    'Learn how to develop modern web applications using the MEAN stack.',
    'https://content.byui.edu/file/366-course-description.pdf',
    null
  ),
  new Document(
    '3',
    'CIT 425 - Data Warehousing',
    'Introduction to data warehousing concepts and ETL processes.',
    'https://content.byui.edu/file/425-course-description.pdf',
    null
  ),
  new Document(
    '4',
    'CIT 460 - Enterprise Development',
    'Learn enterprise-level software development patterns and practices.',
    'https://content.byui.edu/file/460-course-description.pdf',
    null
  ),
  new Document(
    '5',
    'CIT 495 - Senior Practicum',
    'Capstone project experience working with real clients.',
    'https://content.byui.edu/file/495-course-description.pdf',
    null
  )
];


  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
