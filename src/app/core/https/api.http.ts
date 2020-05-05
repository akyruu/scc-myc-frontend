import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Settings} from '../../shared';
import {ModelBinder} from '../services';

@Injectable({providedIn: 'root'})
export class ApiHttp {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _http: HttpClient,
    private _modelBinder: ModelBinder,
  ) {}

  /* METHODS =============================================================== */
  async loadSettings(): Promise<Settings> {
    const settings = await this._http.get<Settings>('/api/settings').toPromise();
    return this._modelBinder.bindSettings(settings);
  }
}
