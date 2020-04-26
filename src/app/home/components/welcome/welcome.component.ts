import {Component, HostBinding, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {AppContext} from '../../../core/contexts';
import {LobbyRoomSocket} from '../../../core/sockets';
import {JoinRoomData, JoinRoomDialogComponent} from './join-room-dialog.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: string;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private _appContext: AppContext,
    private _lobbyRoomSocket: LobbyRoomSocket,
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player.value;
  }

  /* Events ---------------------------------------------------------------- */
  doJoinRoom(): void {
    this._appContext.player.next(this.player);
    this._dialog.open(JoinRoomDialogComponent, {data: <JoinRoomData>{player: this.player}});
  }

  async doCreateRoom(): Promise<void> {
    this._appContext.player.next(this.player);

    const room = await this._lobbyRoomSocket.createRoom(this.player);
    this._appContext.room.next(room);

    this._router.navigate(['/lobby']).then();
  }
}
