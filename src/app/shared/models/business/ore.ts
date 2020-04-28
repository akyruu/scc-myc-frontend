// TODO shared between frontend and backend
export class Ore {
  name: string;
  density: number;
  price: number;
  mineableBy: ('player' | 'vehicle')[];
}
