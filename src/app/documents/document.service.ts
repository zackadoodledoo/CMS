import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) { }

  // GET all documents from Node server
  getDocuments() {
    this.http
      .get<{ message: string, documents: Document[] }>('http://localhost:3000/documents')
      .subscribe(
        (responseData) => {
          this.documents = responseData.documents;

          this.documents.sort((a, b) =>
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0
          );

          this.documentChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getDocument(id: string): Document {
    return this.documents.find((doc) => doc.id === id);
  }

  // POST — add new document to Node server
  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // Node server generates the ID
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string, document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  // PUT — update document on Node server
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    // Keep same ID
    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put('http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe(() => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }

  // DELETE — delete document on Node server
  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) {
      return;
    }

    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe(() => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      });
  }

  private sortAndSend() {
    this.documents.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
    this.documentChangedEvent.next(this.documents.slice());
  }
}
