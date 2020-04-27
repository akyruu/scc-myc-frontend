import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AppContext} from '../../../core/contexts';
import {LobbyRushSocket} from '../../../core/sockets';

export interface JoinRushData {
  playerName: string;
}

@Component({
  selector: 'app-join-rush-dialog',
  templateUrl: './join-rush-dialog.component.html',
  styleUrls: ['./join-rush-dialog.component.scss']
})
export class JoinRushDialogComponent {
  /* FIELDS ================================================================ */
  rushUuid: string;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    public dialogRef: MatDialogRef<JoinRushDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: JoinRushData,
    private _router: Router,
    private _appContext: AppContext,
    private _lobbyRushSocket: LobbyRushSocket,
  ) {}

  /* METHODS =============================================================== */
  async doSubmit(): Promise<void> {
    const result = await this._lobbyRushSocket.joinRush(this._data.playerName, this.rushUuid);
    this._appContext.player = result.player;
    this._appContext.rush = result.rush;

    this._router.navigate(['/lobby']).then();
    this.dialogRef.close();
  };

  doClose(): void {
    this.dialogRef.close();
  };
}
