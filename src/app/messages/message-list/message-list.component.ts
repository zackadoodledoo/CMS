import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Hello!', 'The grades for this assignment have been posted', 'Bro. Jackson'),
    new Message('2', 'How are you?', 'When is assignment 3 due', 'Steve Johnon'),
    new Message('3', 'Angular is fun!', 'Assignment 3 is due on Saturday at 11:30 PM', 'Bro. Jackson'),
    new Message('4', 'Angular is fun!', 'Can I meet with you sometime. I need help with assignment 3', 'Mark Smith'),
    new Message('5', 'Angular is fun!', 'I can meet with you today at 4:00 PM in my office.', 'Bro. Jackson'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
