import {Component, OnInit} from '@angular/core';

import {AppContext} from '../../../core';
import {Group, Player, Rush} from '../../../shared';

class GroupWrapper {
  boxes = 0;
  rucksacks = 0;
  boxesAndRucksacksValue = 0;

  constructor(public group: Group) {}
}

class PlayerWrapper {
  boxesAndRucksackValue = 0;

  constructor(public player: Player) {}
}

@Component({
  selector: 'app-rush-overview',
  templateUrl: './rush-overview.component.html',
  styleUrls: ['./rush-overview.component.scss']
})
export class RushOverviewComponent implements OnInit {
  /* FIELDS ================================================================ */
  groupWrappers: GroupWrapper[] = [];
  playerWrappers: PlayerWrapper[] = [];

  private _rush: Rush;

  /* CONSTRUCTOR =========================================================== */
  constructor(private _appContext: AppContext) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._rush = this._appContext.rush;
    this._initGroups();
    this._initPlayers();
  }

  private _initGroups(): void {
    this.groupWrappers = [];
    this._rush.groups.forEach(group => {
      const wrapper = new GroupWrapper(group);
      group.players.forEach(player => {
        if (player.rucksack?.calculated.quantity > 0) {
          wrapper.rucksacks++;
          wrapper.boxesAndRucksacksValue += player.rucksack.calculated.value;
        }
        wrapper.boxes += player.boxes.length;
        player.boxes.forEach(box => wrapper.boxesAndRucksacksValue += box.calculated.value);
      });
      this.groupWrappers.push(wrapper);
    });
  }

  private _initPlayers(): void {
    this.playerWrappers = [];
    this._rush.players.forEach(player => {
      const wrapper = new PlayerWrapper(player);
      if (player.rucksack) {
        wrapper.boxesAndRucksackValue += player.rucksack.calculated.value;
      }
      player.boxes.forEach(box => wrapper.boxesAndRucksackValue += box.calculated.value);
      this.playerWrappers.push(wrapper);
    });
  }
}
