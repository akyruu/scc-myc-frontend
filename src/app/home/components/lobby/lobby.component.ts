import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {LobbyGroupSocket, LobbyRushSocket} from '../../../core';
import {Menu, Player, Rush, RushUtils} from '../../../shared';
import {LobbyService} from '../../services';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  player: Player;
  rush: Rush;

  menu: Menu = {
    items: [{
      name: 'app.action.ready', icon: 'check', showAsAction: 'ifRoom',
      action: this.doReady.bind(this),
      visible: () => !this.isRushLeader() && !this.player.ready,
    }, {
      name: 'app.action.cancel', icon: 'cancel', showAsAction: 'ifRoom',
      action: this.doCancel.bind(this),
      visible: () => !this.isRushLeader() && this.player.ready
    }, {
      name: 'home.lobby.launch', icon: 'launch', showAsAction: 'ifRoom',
      action: this.doLaunch.bind(this),
      disabled: () => !this.isRushValid(),
      visible: () => this.isRushLeader()
    }, {
      name: 'home.lobby.quit', icon: 'exit_to_app', showAsAction: 'ifRoom',
      action: this.doQuit.bind(this)
    }]
  };

  private readonly _subscriptions: Subscription[] = [];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _router: Router,
    private _translate: TranslateService,
    private _lobbyService: LobbyService,
    private _lobbyGroupSocket: LobbyGroupSocket,
    private _lobbyRushSocket: LobbyRushSocket,
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._lobbyService.player;
    this.rush = this._lobbyService.rush;

    this._subscriptions.push(
      ...this._lobbyService.bindRushEvents(),
      ...this._lobbyService.bindGroupEvents(),
      ...this._lobbyService.bindPlayerEvents()
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /* View ------------------------------------------------------------------ */
  get group() { // Group is updated
    return this._lobbyService.group;
  }

  isRushLeader(): boolean {
    return RushUtils.isLeader(this.rush, this.player.name);
  }

  isRushValid(): boolean {
    if (this.rush.players.length > 0) {
      return false;
    }
    for (let group of this.rush.groups) {
      if (group.players.length === 0) {
        return false;
      }
    }
    return true;
  }

  /* Events ---------------------------------------------------------------- */
  doReady(): void {
    // TODO
  }

  doCancel(): void {
    // TODO
  }

  doLaunch() {
    this._lobbyRushSocket.launchRush().then(); // Event consumed at event binding
  }

  async doQuit(): Promise<void> {
    await this._lobbyRushSocket.leaveRush();
    this._router.navigate(['/welcome']).then();
  }
}
