import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Settings} from '../../shared';

@Injectable({providedIn: 'root'})
export class ApiHttp {
  /* CONSTRUCTOR =========================================================== */
  constructor(private _http: HttpClient) {}

  /* METHODS =============================================================== */
  async loadSettings(): Promise<Settings> {
    const settings = await this._http.get('/api/settings').toPromise();
    return Object.assign(new Settings(), settings);
  }
}
