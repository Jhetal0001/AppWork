import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  animations: [
    trigger('init', [
      state('void', style({opacity: 0})),
      transition('void <-> *', [
        animate('300ms', style({opacity: 1}))
      ])
    ])
  ]
})
export class ChatsComponent {

}
