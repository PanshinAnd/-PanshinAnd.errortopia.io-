import {buildEfficiency} from './utilities.js';
export class Building {
  constructor(typeRes, countRes, countWorkplaces, countLivingPlaces, countBuildings,  cost) {
    this.typeRes = typeRes;
    this.countRes = countRes;
    this.countWorkplaces = countWorkplaces;
    this.countLivingPlaces = countLivingPlaces;
    this.countBuildings = countBuildings;
    this.cost = cost;
  }
  income(){
    if (this.countWorkplaces > 0){
        return this.countBuildings * this.countRes * buildEfficiency();
    }
    else{
      return this.countBuildings * this.countRes * 100;
    }
  }
  totalWorkplaces(){
    return this.countWorkplaces * this.countBuildings;
  }
  totalLivingPlaces(){
    return this.countLivingPlaces * this.countBuildings;
  }
}
