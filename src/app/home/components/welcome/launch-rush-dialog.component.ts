import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {AppContext, LobbyPlayerSocket, LobbyRushSocket} from '../../../core';
import {Player, Rush} from '../../../shared';

export interface LaunchRushData {
  player: Player;
  rush: Rush;
}

@Component({
  selector: 'app-launch-rush-dialog',
  templateUrl: './launch-rush-dialog.component.html',
})
export class LaunchRushDialogComponent {
  /* FIELDS ================================================================ */
  vehicleName: string;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    public dialogRef: MatDialogRef<LaunchRushDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LaunchRushData,
    private _router: Router,
    private _appContext: AppContext,
    private _lobbyPlayerSocket: LobbyPlayerSocket,
    private _lobbyRushSocket: LobbyRushSocket,
  ) {}

  /* METHODS =============================================================== */
  async doSubmit(): Promise<void> {
    if (this.vehicleName) {
      await this._lobbyPlayerSocket.updatePlayerProps(this.data.player.name, {vehicleName: this.vehicleName});
    }

    await this._lobbyRushSocket.launchRush();
    this._appContext.rush.launched = true;

    this._router.navigate(['/rush']).then();
    this.dialogRef.close();
  };

  doClose(): void {
    this.dialogRef.close();
  };
}
