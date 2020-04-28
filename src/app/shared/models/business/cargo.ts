// TODO shared between frontend and backend
import {Fragment} from './fragment';
import {Vehicle} from './vehicle';

export class Cargo {
  index: number;
  vehicle: Vehicle;

  fragment: Fragment;
  fragments: Fragment[];
}
