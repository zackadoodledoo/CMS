import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  documents: Document[] = [];

  // Still allowed — child → parent communication
  documentSelectedEvent = new Subject<Document>();

  // Required by assignment — Observable for list changes
  documentChangedEvent = new Subject<Document[]>();

  // Required by assignment — used to generate new IDs
  maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();   // Required step
  }

  // Required by assignment
  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  // Required by assignment
  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);

    this.documentChangedEvent.next(this.documents.slice());
  }

  updateDocument(original: Document, newDoc: Document) {
    if (!original || !newDoc) {
      return;
    }

    const pos = this.documents.indexOf(original);
    if (pos < 0) {
      return;
    }

    newDoc.id = original.id;
    this.documents[pos] = newDoc;

    this.documentChangedEvent.next(this.documents.slice());
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
