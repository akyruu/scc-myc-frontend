import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AppContext} from '../../../core';
import {Player} from '../../../shared';

@Component({
  selector: 'app-rush-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: Player;

  readonly tabs = ['overview', 'vehicle', 'rucksack'];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _router: Router,
    private _appContext: AppContext
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;
    if (!this.player.vehicle) {
      this.tabs.splice(this.tabs.indexOf('vehicle'), 1);
    }
  }
}
