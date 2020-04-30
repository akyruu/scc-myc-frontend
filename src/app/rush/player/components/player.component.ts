import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Player} from '../../../shared';

@Component({
  selector: 'app-rush-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  player: Player;

  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(private _route: ActivatedRoute) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscription = this._route.data.subscribe((data: { player: Player }) => this.player = data.player);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
