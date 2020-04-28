import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {AppContext} from '../../core';
import {Group, Player, Rush} from '../../shared';

@Component({
  selector: 'app-rush',
  templateUrl: './rush.component.html',
  styleUrls: ['./rush.component.scss']
})
export class RushComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: Player;
  rush: Rush;
  group: Group;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _translate: TranslateService,
    private _appContext: AppContext
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;
    this.rush = this._appContext.rush;
    this.group = this._appContext.group.value;
  }
}
