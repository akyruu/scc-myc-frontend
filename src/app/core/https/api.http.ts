import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BindUtils, Settings} from '../../shared';

@Injectable({providedIn: 'root'})
export class ApiHttp {
  /* CONSTRUCTOR =========================================================== */
  constructor(private _http: HttpClient) {}

  /* METHODS =============================================================== */
  async loadSettings(): Promise<Settings> {
    const settings = await this._http.get<Settings>('/api/settings').toPromise();
    return BindUtils.bindSettings(settings);
  }
}
