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
  maxDocumentId: number;

  // Replace with YOUR Firebase URL (must end with a slash)
  //private databaseUrl = 'https://YOUR_PROJECT_ID.firebaseio.com/'; 
  private databaseUrl = 'https://zack-cms-default-rtdb.firebaseio.com/';


  constructor(private http: HttpClient) { }

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

  // HTTP GET — loads documents from Firebase
  getDocuments() {
    this.http
      .get<Document[]>(this.databaseUrl + 'documents.json')
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();

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
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  // HTTP PUT — saves documents to Firebase
  storeDocuments() {
    const documentsString = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.databaseUrl + 'documents.json', documentsString, { headers })
      .subscribe(() => {
        this.documentChangedEvent.next(this.documents.slice());
      });
  }

  // Updated to call storeDocuments()
  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);
    this.storeDocuments();
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

    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
