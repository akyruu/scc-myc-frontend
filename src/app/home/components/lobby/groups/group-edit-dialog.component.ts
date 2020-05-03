import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupSocket} from '../../../../core/sockets';
import {Group, Settings} from '../../../../shared/models';

export interface GroupEditData {
  group: Group;
  groupIndex: number;
  settings: Settings;
}

@Component({
  selector: 'app-group-edit-rush-dialog',
  templateUrl: './group-edit-dialog.component.html'
})
export class GroupEditDialogComponent {
  /* FIELDS ================================================================ */
  groupName: string;
  vehicleName: string;
  leaderName: string;


  /* CONSTRUCTOR =========================================================== */
  constructor(
    public dialogRef: MatDialogRef<GroupEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupEditData,
    private _lobbyGroupSocket: GroupSocket,
  ) {
    this.groupName = this.data.group.name;
    this.vehicleName = this.data.group.vehicle?.name;
    this.leaderName = this.data.group.leader?.name;
  }

  /* METHODS =============================================================== */
  async doSubmit(): Promise<void> {
    const group = this.data.group;

    const updatedProps = {
      name: this.groupName !== group.name ? this.groupName : undefined,
      vehicleName: this.vehicleName !== group.vehicle?.name ? this.vehicleName : undefined,
      leaderName: this.leaderName !== group.leader?.name ? this.leaderName : undefined,
    };
    if (Object.keys(updatedProps).length > 0) {
      await this._lobbyGroupSocket.updateGroupProps(group.index, updatedProps);
    }

    this.dialogRef.close();
  };

  doClose(): void {
    this.dialogRef.close();
  };
}
