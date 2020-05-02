import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {Icon, Label} from '../../models';

export class NavItem {
  name: Label;
  disabled?: boolean;
  icon?: Icon;
  path?: string;
  children?: NavItem[];
  section?: boolean;
}

@Component({
  selector: 'app-list-tree-item',
  templateUrl: './list-tree-item.component.html',
  styleUrls: ['./list-tree-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class ListTreeItemComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  @Input() item: NavItem;
  @Input() level = 0;

  @HostBinding('attr.class') className = 'list-tree-item';
  @HostBinding('attr.aria-expanded') expanded = false;

  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(public router: Router) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (this.item.path && url) {
          this.expanded = url.indexOf(this.item.path) === 0;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /* Events ---------------------------------------------------------------- */
  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.path]).then();
    }
    if (item.children?.length > 0) {
      this.expanded = !this.expanded;
    }
  }
}
