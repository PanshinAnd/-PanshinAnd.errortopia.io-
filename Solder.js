export class Solder{
  constructor(name, costHiring, costMaintеnanceMoney, costMaintеnanceFood, countUnits){
    this.name = name;
    this.costHiring = costHiring;
    this.costMaintеnanceMoney = costMaintеnanceMoney;
    this.costMaintеnanceFood  = costMaintеnanceFood;
    this.countUnits = countUnits;
  }
  totalMaintеnanceMoney(){
    return this.costMaintеnanceMoney * this.countUnits;
  }
  totalMaintеnanceFood(){
    return this.costMaintеnanceFood * this.countUnits;
  }
}
