import {Component, OnInit} from '@angular/core';

import {AppContext} from '../../../core';
import {Box, BoxItem, Player, Settings} from '../../../shared';
import {RushService} from '../../services';

@Component({
  selector: 'app-player-overview',
  templateUrl: './player-overview.component.html'
})
export class PlayerOverviewComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: Player;
  settings: Settings;

  readonly boxColumns = ['unitPrice', 'name', 'quantity', 'estimatedValue'];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _appContext: AppContext,
    private _rushService: RushService
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;
    this.settings = this._appContext.rush.settings;
  }

  /* View ------------------------------------------------------------------ */
  get estimatedTotal(): number {
    return this._rushService.estimatePlayerValue(this.player);
  }

  getEstimatedBoxValue(box: Box): number {
    return this._rushService.estimateBoxValue(box);
  }

  getEstimatedBoxItemValue(boxItem: BoxItem): number {
    return this._rushService.estimateBoxItemValue(boxItem);
  }
}
