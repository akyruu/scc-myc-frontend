import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {AppContext} from '../../../../core';
import {Box, Player} from '../../../../shared';

@Component({
  selector: 'app-player-overview',
  templateUrl: './player-overview.component.html'
})
export class PlayerOverviewComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  player: Player;
  boxes: Box[] = [];

  estimatedTotal = 0;

  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _route: ActivatedRoute,
    private _appContext: AppContext
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscription = this._route.data.subscribe((data: { player: Player }) => {
      this.player = data.player;
      this._initBoxes();
      this._estimateTotal();
    });
  }

  private _initBoxes(): void {
    this.boxes = [...this.player.boxes];
    if (this.player.rucksack) {
      this.boxes.push(this.player.rucksack);
    }
  }

  private _estimateTotal(): void {
    this.estimatedTotal = this.player.cargo?.calculated.value || 0;
    this.boxes.forEach(box => this.estimatedTotal += box.calculated.value);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
