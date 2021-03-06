import {Component, OnDestroy, OnInit} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {AppContext, PlayerSocket} from '../../../../core';
import {Box, Group, GroupUtils, Player, RushUtils} from '../../../../shared';

@Component({
  selector: 'app-group-overview',
  templateUrl: './group-overview.component.html'
})
export class GroupOverviewComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  group: Group;

  rucksackCount = 0;
  boxCount = 0;
  boxes: Box[] = [];

  estimatedTotal = 0;

  private readonly _subscriptions: Subscription[] = [];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _route: ActivatedRoute,
    private _appContext: AppContext,
    private _playerSocket: PlayerSocket
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscriptions.push(this._route.data.subscribe((data: { group: Group }) => {
      this.group = data.group;
      this._initBoxes();
      this._estimateTotal();
    }));
    this._subscriptions.push(
      this._playerSocket.rucksackBoxItemUpdated.subscribe(data => {
        if (GroupUtils.findPlayer(this.group, data.playerName)) {
          this._initBoxes();
          this._estimateTotal();
        }
      }),
      this._playerSocket.rucksackMovedToBox.subscribe(data => {
        if (GroupUtils.findPlayer(this.group, data.playerName)) {
          this._initBoxes();
        }
      })
    );
  }


  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /* View ------------------------------------------------------------------ */
  getColor(player: Player): ThemePalette { // FIXME duplicated code with lobby-drop-list
    if (player.name === this._appContext.player.name) {
      return 'primary';
    } else if (this.group && GroupUtils.isLeader(this.group, player.name)) {
      return 'accent';
    } else if (RushUtils.isLeader(this._appContext.rush, player.name)) {
      return 'warn';
    }
    return undefined;
  }

  /* Tools ----------------------------------------------------------------- */
  private _initBoxes(): void {
    this.rucksackCount = 0;
    this.boxCount = 0;
    this.boxes = [];

    this.group.players.forEach(player => {
      this.boxCount += player.boxes.length;
      this.boxes.push(...player.boxes);
      if (player.rucksack) {
        this.rucksackCount += player.rucksack.calculated.quantity > 0 ? 1 : 0;
        this.boxes.push(player.rucksack);
      }
    });
  }

  private _estimateTotal(): void {
    this.estimatedTotal = this.group.cargo?.calculated.value || 0;
    this.boxes.forEach(box => this.estimatedTotal += box.calculated.value);
  }
}
