import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {AppContext} from '../../core';
import {Group, Player, Rush} from '../../shared';
import {RushContext} from '../services';

@Component({
  selector: 'app-rush',
  templateUrl: './rush.component.html',
  styleUrls: ['./rush.component.scss']
})
export class RushComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  player: Player;
  rush: Rush;
  group: Group;

  title: string;

  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _translate: TranslateService,
    private _appContext: AppContext,
    private _rushContext: RushContext
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;
    this.rush = this._appContext.rush;
    this.group = this._appContext.group.value;

    this.title = this._rushContext.title.value;
    this._subscription = this._rushContext.title.subscribe(title => this.title = title);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
