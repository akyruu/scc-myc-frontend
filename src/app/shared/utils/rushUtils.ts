import {Group, Player, Rush} from '../models';

export class RushUtils {
  /* STATIC METHODS ====================================================== */
  static findGroup(rush: Rush, groupName: string): Group {
    return rush.groups.find(group => group.name === groupName);
  }

  static deleteGroup(rush: Rush, groupName: string): Group | false {
    const index = rush.groups.findIndex(group => group.name === groupName);
    return (index >= 0) ? rush.groups.splice(index, 1)[0] : false;
  }

  /* Player ---------------------------------------------------------------- */
  static isLeader(rush: Rush, playerName: string): boolean {
    return rush.leader?.name === playerName;
  }

  static findPlayer(rush: Rush, playerName: string): Player {
    return rush.players.find(player => player.name === playerName);
  }

  static deletePlayer(rush: Rush, playerName: string): Player | false {
    const index = rush.players.findIndex(player => player.name === playerName);
    return (index >= 0) ? rush.players.splice(index, 1)[0] : false;
  }

  /* CONSTRUCTOR ========================================================= */
  private constructor() {}
}
