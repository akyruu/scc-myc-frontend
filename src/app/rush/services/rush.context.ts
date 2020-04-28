import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class RushContext {
  /* FIELDS ================================================================ */
  readonly title = new BehaviorSubject<string>(null);
}
