import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AppContext} from '../../../../core/contexts';
import {LobbyGroupSocket, LobbyRoomSocket} from '../../../../core/sockets';
import {RoomGroup, Settings} from '../../../../shared/models';

export interface GroupEditData {
  group: RoomGroup;
  groupIndex: number;

  groupName: string;
  vehicleName: string;

  settings: Settings;
}

@Component({
  selector: 'app-group-edit-room-dialog',
  templateUrl: './group-edit-dialog.component.html'
})
export class GroupEditDialogComponent {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    public dialogRef: MatDialogRef<GroupEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupEditData,
    private _lobbyGroupSocket: LobbyGroupSocket,
  ) {}

  /* METHODS =============================================================== */
  async doSubmit(): Promise<void> {
    const group = this.data.group;

    const updatedProps = {
      name: this.data.groupName !== group.name ? this.data.groupName : undefined,
      vehicleName: this.data.vehicleName !== group.vehicle?.name ? this.data.vehicleName : undefined
    };
    if (Object.keys(updatedProps).length > 0) {
      await this._lobbyGroupSocket.updateGroupProps(group.name, updatedProps);
    }

    this.dialogRef.close();
  };

  doClose(): void {
    this.dialogRef.close();
  };
}
