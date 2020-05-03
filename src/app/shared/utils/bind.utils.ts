import {Group, Harvest, Ore, Player, Rush, Settings, Vehicle} from '../models';

export class BindUtils {
  /* STATIC METHODS ======================================================== */
  public static bindRush(data: Rush, myPlayer: Player): Rush {
    const rush = Object.assign(new Rush(), data);
    rush.settings = this.bindSettings(rush.settings);
    this.bindPlayers(rush.players, myPlayer);
    this.bindGroups(rush.groups, myPlayer);
    rush.leader = this.bindPlayer(rush.leader, ...rush.players);
    return rush;
  }

  public static bindGroups(groups: Group[], myPlayer?: Player): void {
    for (let i = 0; i < groups.length; i++) {
      groups[i] = this.bindGroup(groups[i], myPlayer);
    }
  }

  public static bindGroup(data: Group, myPlayer?: Player): Group {
    const group = Object.assign(new Group(), data);
    this.bindPlayers(group.players, myPlayer);
    group.leader = this.bindPlayer(group.leader, ...group.players);
    return group;
  }

  public static bindPlayers(players: Player[], myPlayer?: Player): void {
    for (let i = 0; i < players.length; i++) {
      players[i] = this.bindPlayer(players[i], myPlayer);
    }
  }

  public static bindPlayer(data: Player, ...players: Player[]): Player {
    let player = players.find(p => p?.name === data.name);
    return player || Object.assign(new Player(), data);
  }

  public static bindSettings(data: Settings): Settings {
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

  /* CONSTRUCTOR =========================================================== */
  private constructor() {}
}
