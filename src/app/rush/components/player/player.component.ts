import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {AppContext} from '../../../core';
import {Player} from '../../../shared';
import {RushContext} from '../../services';

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
    private _translate: TranslateService,
    private _appContext: AppContext,
    private _rushContext: RushContext
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;
    if (!this.player.vehicle) {
      this.tabs.splice(this.tabs.indexOf('vehicle'), 1);
    }

    setTimeout(() => this._rushContext.title.next(this._translate.instant('rush.player.title', this.player)), 0);
  }
}
