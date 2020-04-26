import {Room, RoomGroup} from '../models';

export class RoomUtils {
  /* STATIC METHODS ====================================================== */
  static findGroup(room: Room, groupName: string): RoomGroup {
    return room.groups.find(group => group.name === groupName);
  }

  static findGroupIndex(room: Room, groupName: string): number {
    return room.groups.findIndex(group => group.name === groupName);
  }

  /* CONSTRUCTOR ========================================================= */
  private constructor() {}
}
