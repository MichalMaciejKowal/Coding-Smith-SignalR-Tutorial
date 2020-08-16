import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private connection: signalR.HubConnection;
  private thenable: Promise<void>;

  constructor() { }

  public startConnection = () => {
    this.connection = new signalR.HubConnectionBuilder().withUrl('/messageHub').withAutomaticReconnect().build();
    this.thenable = this.connection.start();
    this.thenable.then(() => console.log('Connection started'))
    .catch(err => console.log('Error while starting connection: ' + err));
  }

  public stopConnection = () => {
    if (this.connection === null || this.connection === undefined) {
      console.error('No established connection found');
      return;
    }
    return this.connection.stop().then(() => {
      console.log('Connection stopped');
    });
  }

  public broadcastMessage(message: string): void {
    this.thenable.then(() => {
      this.connection.invoke('SendMessage', message).catch(error => { console.error(error); });
    });
  }

  public addBroadcastMessageListener(callback: (message: string) => void): void {
    this.thenable.then(() => {
      this.connection.on('ReceiveMessage', (message) => { callback(message); });
    });
  }
}
