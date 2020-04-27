import {Component, OnInit} from '@angular/core';

import {AppContext} from '../../../core';
import {Player} from '../../../shared';

@Component({
  selector: 'app-rush-player',
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: Player;

  readonly tabs = ['overview', 'box'];

  /* CONSTRUCTOR =========================================================== */
  constructor(private _appContext: AppContext) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;
  }
}
