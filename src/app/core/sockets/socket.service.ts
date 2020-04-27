import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable({providedIn: 'root'})
export class SocketService {
  /* FIELDS ================================================================ */
  readonly exceptionThrown = this._socket.fromEvent<{ code: string, data: any }>('exception');

  /* CONSTRUCTOR =========================================================== */
  constructor(private _socket: Socket) {}
}
