import {Component, Input} from '@angular/core';

import {GroupSocket} from '../../../../core';
import {Player, Rush} from '../../../../shared';

// TODO add rights managements

@Component({
  selector: 'app-lobby-players',
  templateUrl: './lobby-players.component.html',
  styleUrls: ['./lobby-players.component.scss']
})
export class LobbyPlayersComponent {
  /* FIELDS ================================================================ */
  @Input() player: Player;
  @Input() rush: Rush;

  /* CONSTRUCTOR =========================================================== */
  constructor(private _lobbyGroupSocket: GroupSocket) {}
}
