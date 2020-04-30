import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Group} from '../../../../shared';

@Component({
  selector: 'app-group-vehicle',
  templateUrl: './group-vehicle.component.html'
})
export class GroupVehicleComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  group: Group;

  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(private _route: ActivatedRoute) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscription = this._route.data.subscribe((data: { group: Group }) => this.group = data.group);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
