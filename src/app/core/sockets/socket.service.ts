import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

/**
 * Available events: https://socket.io/docs/client-api/#io-url-options
 */
@Injectable({providedIn: 'root'})
export class SocketService {
  /* FIELDS ================================================================ */
  readonly exceptionThrown = this._socket.fromEvent<{ code: string, data: any }>('exception');

  /* CONSTRUCTOR =========================================================== */
  constructor(private _socket: Socket) {}

  /* METHODS =============================================================== */
  async connect(): Promise<boolean> {
    let result = true;
    if (!this._socket.ioSocket.isConnected) {
      const promise = new Promise<boolean>(resolve => {
        this._socket.fromOneTimeEvent('connect').then(() => resolve(true));
        this._socket.fromOneTimeEvent('connect_failed').then(() => resolve(false));
        this._socket.fromOneTimeEvent('reconnect_failed').then(() => resolve(false));
      });
      this._socket.connect();
      result = await promise;
    }
    return result;
  }
}
