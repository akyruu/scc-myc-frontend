import {Injectable} from '@angular/core';

import {Box, BoxItem, Group, Harvest, Ore, Player, Rush, RushUtils, Settings, SettingsUtils, Vehicle} from '../../shared';
import {AppContext} from '../contexts';

@Injectable({providedIn: 'root'})
export class ModelBinder {
  /* CONSTRUCTOR =========================================================== */
  private constructor(private _appContext: AppContext) {}

  /* METHODS =============================================================== */
  bindRush(data: Rush, myPlayer: Player): Rush {
    const rush = Object.assign(new Rush(), data);
    rush.settings = this.bindSettings(rush.settings);
    this._bindPlayers(rush.players, rush.settings, myPlayer);
    this._bindGroups(rush.groups, rush.settings, myPlayer);
    rush.leader = this._bindPlayer(rush.leader, rush.settings, ...rush.players);
    return rush;
  }

  /* Group ----------------------------------------------------------------- */
  private _bindGroups(groups: Group[], settings: Settings, myPlayer?: Player): void {
    for (let i = 0; i < groups.length; i++) {
      groups[i] = this._bindGroup(groups[i], settings, myPlayer);
    }
  }

  bindGroup(data: Group): Group {
    return this._bindGroup(data, this._appContext.rush?.settings, this._appContext.player);
  }

  private _bindGroup(data: Group, settings: Settings, myPlayer?: Player): Group {
    const group = Object.assign(new Group(), data);
    this._bindPlayers(group.players, settings, myPlayer);
    group.leader = this._bindPlayer(group.leader, settings, ...group.players);
    return group;
  }

  /* Player ---------------------------------------------------------------- */
  private _bindPlayers(players: Player[], settings: Settings, myPlayer?: Player): void {
    for (let i = 0; i < players.length; i++) {
      players[i] = this._bindPlayer(players[i], settings, myPlayer);
    }
  }

  bindPlayer(data: Player): Player {
    return this._appContext.rush
      ? this._bindPlayer(data, this._appContext.rush.settings, ...RushUtils.findAllPlayers(this._appContext.rush))
      : this._bindPlayer(data, null);
  }

  private _bindPlayer(data: Player, settings: Settings, ...players: Player[]): Player {
    let player = players.find(p => p?.name === data.name);
    if (!player) {
      player = Object.assign(new Player(), data);
      if (player.rucksack) {
        player.rucksack = this._bindBox(player.rucksack, settings);
      }
      for (let i = 0; i < player.boxes.length; i++) {
        player.boxes[i] = this._bindBox(player.boxes[i], settings);
      }
    }
    return player;
  }

  private _bindBox(data: Box, settings: Settings): Box {
    const box = Object.assign(new Box(), data);
    for (let i = 0; i < box.items.length; i++) {
      box.items[i] = this._bindBoxItem(box.items[i], settings);
    }
    return box;
  }

  bindBoxItem(data: BoxItem): BoxItem {
    return this._bindBoxItem(data, this._appContext.rush.settings);
  }

  private _bindBoxItem(data: BoxItem, settings: Settings): BoxItem {
    const boxItem = Object.assign(new BoxItem(), data);
    if (boxItem.type === 'harvest') {
      boxItem.item = SettingsUtils.findHarvest(settings, boxItem.item.name);
    } else if (boxItem.type === 'ore') {
      boxItem.item = SettingsUtils.findOre(settings, boxItem.item.name);
    }
    return boxItem;
  }

  /* Settings -------------------------------------------------------------- */
  bindSettings(data: Settings): Settings {
    const settings = Object.assign(new Settings(), data);
    for (let i = 0; i < settings.harvests.length; i++) {
      settings.harvests[i] = Object.assign(new Harvest(), settings.harvests[i]);
    }
    for (let i = 0; i < settings.ores.length; i++) {
      settings.ores[i] = Object.assign(new Ore(), settings.ores[i]);
    }
    for (let i = 0; i < settings.vehicles.length; i++) {
      settings.vehicles[i] = Object.assign(new Vehicle(), settings.vehicles[i]);
    }
    return settings;
  }
}
