import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AppContext} from '../../../core/contexts';
import {LobbyRoomSocket} from '../../../core/sockets';

export interface JoinRoomData {
  player: string;
}

@Component({
  selector: 'app-join-room-dialog',
  templateUrl: './join-room-dialog.component.html',
  styleUrls: ['./join-room-dialog.component.scss']
})
export class JoinRoomDialogComponent {
  /* FIELDS ================================================================ */
  roomUuid: string;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    public dialogRef: MatDialogRef<JoinRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: JoinRoomData,
    private _router: Router,
    private _appContext: AppContext,
    private _lobbyRoomSocket: LobbyRoomSocket,
  ) {}

  /* METHODS =============================================================== */
  async doSubmit(): Promise<void> {
    const room = await this._lobbyRoomSocket.joinRoom(this._data.player, this.roomUuid);
    this._appContext.room.next(room);

    this._router.navigate(['/lobby']).then();
    this.dialogRef.close();
  };

  doClose(): void {
    this.dialogRef.close();
  };
}
