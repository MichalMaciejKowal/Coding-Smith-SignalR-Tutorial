import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-signalr',
  templateUrl: './signalr.component.html',
  styleUrls: ['./signalr.component.css']
})
export class SignalrComponent implements OnInit, OnDestroy {

  messages: string[] = new Array();
  inputedMessage: string;
  useHttp: boolean;

  constructor(private signarrService: SignalrService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.signarrService.startConnection();

    // listen for new messages and add push them into array
    const messages = this.messages;
    this.signarrService.addBroadcastMessageListener((message: string) => {
      messages.push(message);
    });
  }

  ngOnDestroy() {
    this.signarrService.stopConnection();
  }

  sendMessage() {
    if (this.useHttp) {
      this.httpClient.post('/api/message/SendMessageToAll', { message: this.inputedMessage} ).subscribe(x => {
        console.log('message send to controller and received by it');
        this.inputedMessage = '';
      });
    } else {
      this.signarrService.broadcastMessage(this.inputedMessage);
      this.inputedMessage = '';
    }
  }

}
