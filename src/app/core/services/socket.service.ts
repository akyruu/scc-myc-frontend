import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Socket} from 'ngx-socket-io';

import {SocketResult} from '../../shared';

/**
 * Available events: https://socket.io/docs/client-api/#io-url-options
 */
@Injectable({providedIn: 'root'})
export class SocketService {
  /* FIELDS ================================================================ */
  readonly exceptionThrown = this._socket.fromEvent<{ code: string, data: any }>('exception');

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _snackBar: MatSnackBar,
    private _socket: Socket,
    private _translate: TranslateService
  ) {}

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

  async emit<T>(event: string, data?: any): Promise<T> {
    const promise = this._socket.fromOneTimeEvent<SocketResult<T>>(event + '_result');
    this._socket.emit(event, data);

    const result = await promise;
    if (result.status === 'failed') {
      this._snackBar.open(this._translate.instant('app.socket.error.' + result.error.code, result.error.data));
      throw new Error('[SocketError] Failed to execute event <' + event + '>: ' + JSON.stringify(result.error));
    }
    return result.payload;
  }
}
