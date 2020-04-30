import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {AppContext, LobbyPlayerSocket, LobbyRushSocket} from '../../../core';
import {Player, Rush, Vehicle} from '../../../shared';

export interface LaunchRushData {
  player: Player;
  rush: Rush;
}

@Component({
  selector: 'app-launch-solo-rush-dialog',
  templateUrl: './launch-solo-rush-dialog.component.html',
})
export class LaunchSoloRushDialogComponent {
  /* FIELDS ================================================================ */
  vehicle: Vehicle;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    public dialogRef: MatDialogRef<LaunchSoloRushDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LaunchRushData,
    private _router: Router,
    private _appContext: AppContext,
    private _lobbyPlayerSocket: LobbyPlayerSocket,
    private _lobbyRushSocket: LobbyRushSocket,
  ) {}

  /* METHODS =============================================================== */
  async doSubmit(): Promise<void> {
    this.data.player.vehicle = this.vehicle;
    this._appContext.rush.launched = true;

    this._router.navigate(['/rush/my-player']).then();
    this.dialogRef.close();
  };

  doClose(): void {
    this.dialogRef.close();
  };
}
