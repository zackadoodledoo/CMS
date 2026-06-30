import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {}

  // GET all messages from Node server
  getMessages() {
    this.http
      .get<{ message: string, messages: Message[] }>('http://localhost:3000/messages')
      .subscribe(
        (responseData) => {
          this.messages = responseData.messages;

          this.messages.sort((a, b) =>
            a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : 0
          );

          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getMessage(id: string): Message {
    return this.messages.find((msg) => msg.id === id);
  }

  // POST — add new message to Node server
  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // Node server generates the ID
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string, messageData: Message }>(
        'http://localhost:3000/messages',
        message,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.messages.push(responseData.messageData);
        this.sortAndSend();
      });
  }

  // PUT — update message on Node server
  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
    if (pos < 0) {
      return;
    }

    // Keep same ID
    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put('http://localhost:3000/messages/' + originalMessage.id,
        newMessage,
        { headers: headers }
      )
      .subscribe(() => {
        this.messages[pos] = newMessage;
        this.sortAndSend();
      });
  }

  // DELETE — delete message on Node server
  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos < 0) {
      return;
    }

    this.http
      .delete('http://localhost:3000/messages/' + message.id)
      .subscribe(() => {
        this.messages.splice(pos, 1);
        this.sortAndSend();
      });
  }

  private sortAndSend() {
    this.messages.sort((a, b) =>
      a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : 0
    );
    this.messageChangedEvent.next(this.messages.slice());
  }
}
