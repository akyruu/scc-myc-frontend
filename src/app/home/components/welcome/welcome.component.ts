import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {AppContext} from '../../../core/contexts';
import {LobbyRushSocket} from '../../../core/sockets';
import {JoinRushData, JoinRushDialogComponent} from './join-rush-dialog.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  /* FIELDS ================================================================ */
  playerName: string;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private _appContext: AppContext,
    private _lobbyRushSocket: LobbyRushSocket,
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.playerName = this._appContext.playerName.value;
  }

  /* Events ---------------------------------------------------------------- */
  doJoinRush(): void {
    this._appContext.playerName.next(this.playerName);
    this._dialog.open(JoinRushDialogComponent, {data: <JoinRushData>{playerName: this.playerName}});
  }

  async doCreateRush(): Promise<void> {
    this._appContext.playerName.next(this.playerName);

    const result = await this._lobbyRushSocket.createRush(this.playerName);
    this._appContext.player = result.player;
    this._appContext.rush = result.rush;

    this._router.navigate(['/lobby']).then();
  }
}
