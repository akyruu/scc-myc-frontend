import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {AppContext} from '../../../../core';
import {NavItem, Player, Rush} from '../../../../shared';

@Component({
  selector: 'app-rush-container',
  templateUrl: './rush-container.component.html',
  styleUrls: ['./rush-container.component.scss']
})
export class RushContainerComponent implements OnInit {
  /* FIELDS ================================================================ */
  @Input() title: string;

  rush: Rush;
  items: NavItem[];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _translate: TranslateService,
    private _appContext: AppContext
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.rush = this._appContext.rush;

    const items = [];
    if (this.rush.single) {
      const playerNode = this._createPlayerItem(this._appContext.player, '/rush/my-player');
      items.push(...playerNode.children);
    } else {
      // TODO
    }
    this.items = items;
  }

  private _createPlayerItem(player: Player, baseUrl: string): NavItem {
    const playerItem = {name: player.name, children: []};
    playerItem.children.push(this._createTransPathItem('rush.player.overview', baseUrl + '/overview'));
    if (this._appContext.player.vehicle) {
      playerItem.children.push(this._createPathItem(this._appContext.player.vehicle.name, baseUrl + '/vehicle'));
    }
    playerItem.children.push(this._createTransPathItem('rush.player.rucksack', baseUrl + '/rucksack'));
    return playerItem;
  }

  private _createPathItem(name: string, path: string): NavItem {
    return {name: name, path: path};
  }

  private _createTransPathItem(name: string, path: string): NavItem {
    return {name: this._translate.instant(name), path: path};
  }
}
