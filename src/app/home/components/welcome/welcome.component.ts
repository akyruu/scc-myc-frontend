import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {ApiHttp, AppContext, RushSocket, SocketService} from '../../../core';
import {RushUtils} from '../../../shared';
import {JoinRushData, JoinRushDialogComponent} from './join-rush-dialog.component';
import {LaunchRushData, LaunchSoloRushDialogComponent} from './launch-solo-rush-dialog.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  /* FIELDS ================================================================ */
  playerName: string;
  loading = false;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translate: TranslateService,
    private _apiHttp: ApiHttp,
    private _appContext: AppContext,
    private _lobbyRushSocket: RushSocket,
    private _socket: SocketService,
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.playerName = this._appContext.playerName.value;
  }

  /* Events ---------------------------------------------------------------- */
  async doCreateRush(): Promise<void> {
    this._appContext.playerName.next(this.playerName);

    this.loading = true;
    const success = await this._socket.connect();
    if (success) {
      const result = await this._lobbyRushSocket.createRush(this.playerName);
      this._appContext.player = result.player;
      this._appContext.rush = result.rush;
      this._router.navigate(['/lobby']).then();
    } else {
      this._snackBar.open(
        this._translate.instant('app.socket.connect.failed'),
        null,
        {duration: 3000}
      );
    }
    this.loading = false;
  }

  async doLaunchSoloRush(): Promise<void> {
    this._appContext.playerName.next(this.playerName);

    const settings = await this._apiHttp.loadSettings();
    this._appContext.player = RushUtils.createPlayer(this.playerName);
    this._appContext.rush = RushUtils.createRush(this._appContext.player, settings, true);

    this._dialog.open(LaunchSoloRushDialogComponent, {
      data: <LaunchRushData>{
        player: this._appContext.player,
        rush: this._appContext.rush
      }
    });
  }

  doJoinRush(): void {
    this._appContext.playerName.next(this.playerName);
    this._dialog.open(JoinRushDialogComponent, {data: <JoinRushData>{playerName: this.playerName}});
  }

}
