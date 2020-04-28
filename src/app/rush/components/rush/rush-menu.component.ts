import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Group, NavItem, Player, Rush} from '../../../shared';

@Component({
  selector: 'app-rush-menu',
  templateUrl: './rush-menu.component.html',
  styleUrls: ['./rush-menu.component.scss']
})
export class RushMenuComponent implements OnInit {
  /* FIELDS ================================================================ */
  @Input() player: Player;
  @Input() rush: Rush;
  @Input() group: Group;

  items: NavItem[];

  /* CONSTRUCTOR =========================================================== */
  constructor(private _translate: TranslateService) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    const items = [];
    if (this.rush.single) {
      const playerNode = this._createPlayerItem(this.player);
      items.push(...playerNode.children);
    } else {
      // TODO
    }
    this.items = items;
  }

  private _createPlayerItem(player: Player): NavItem {
    const playerItem = {name: player.name, children: []};
    playerItem.children.push(this._createTransPathItem('rush.player.overview', '/rush/player/overview'));
    if (this.player.vehicle) {
      playerItem.children.push(this._createPathItem(this.player.vehicle.name, '/rush/player/vehicle'));
    }
    playerItem.children.push(this._createTransPathItem('rush.player.rucksack', '/rush/player/rucksack'));
    return playerItem;
  }

  private _createPathItem(name: string, path: string): NavItem {
    return {name: name, path: path};
  }

  private _createTransPathItem(name: string, path: string): NavItem {
    return {name: this._translate.instant(name), path: path};
  }
}
