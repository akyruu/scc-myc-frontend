import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {AppContext} from '../../../../core';
import {Group, GroupUtils, Label, NavItem, Player, Rush, RushUtils} from '../../../../shared';

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
    const player = this._appContext.player;
    const group = this._appContext.group.value;
    this.rush = this._appContext.rush;

    const items = [];
    if (this.rush.single) {
      items.push(...this._createPlayerItem(player, '/rush/player/0').children);
    } else { // Multi
      items.push({name: '@app.common.overview', path: '/rush/overview'});
      this.rush.groups.forEach((g, index) => items.push(this._createGroupItem(g, '/rush/group/' + index)));
      this.rush.players.forEach((p, index) => items.push(this._createPlayerItem(p, '/rush/player/' + index)));

      // My details
      items.push({name: '@rush.menu.my.title', section: true});
      let baseUrl: string;
      if (group) {
        baseUrl = '/rush/group/' + RushUtils.findGroupIndex(this.rush, group.index);
        items.push(this._createGroupItem(group, baseUrl, '@rush.menu.my.group'));
        baseUrl += '/player/' + GroupUtils.findPlayerIndex(group, player.name);
      } else {
        baseUrl = '/rush/player/' + RushUtils.findPlayerIndex(this.rush, player.name);
      }
      items.push(this._createPlayerItem(player, baseUrl, '@rush.menu.my.player'));
    }
    this.items = items;
  }

  private _createPlayerItem(player: Player, baseUrl: string, label?: Label): NavItem {
    const playerItem = {name: label || {key: 'app.label.player', args: player}, children: []};
    playerItem.children.push({name: '@app.common.overview', path: baseUrl + '/overview'});
    if (player.vehicle) {
      playerItem.children.push({name: {key: 'app.label.vehicle', args: player.vehicle}, path: baseUrl + '/vehicle'});
    }
    playerItem.children.push({name: '@app.model.rucksack', path: baseUrl + '/rucksack'});
    return playerItem;
  }

  private _createGroupItem(group: Group, baseUrl: string, label?: Label): NavItem {
    const groupItem = {name: label || {key: 'app.label.group.default', args: group}, children: []};
    groupItem.children.push({name: '@app.common.overview', path: baseUrl + '/overview'});

    if (group.vehicle) {
      groupItem.children.push({name: {key: 'app.label.vehicle', args: group.vehicle}, path: baseUrl + '/vehicle'});
    }

    group.players.forEach((player, index) =>
      groupItem.children.push(this._createPlayerItem(player, baseUrl + '/player/' + index)));

    return groupItem;
  }
}
