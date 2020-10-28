import {Building} from './building.js'
import {buildings} from './main.js'
function initialFoodLimit(){
  //Каждая ячейка пустыря прибавляет 200 к лимиту еды
  return wasteland.countBuildings * 200;
}

function civils(){
  return population - infantryman.countUnits;
}
function defaultBuldingCost() {
  return 100;
}
function researchCostMoney(){
  return 500 + totalBuildingsCells() * 10;
}
function researchCostSolders(){
  return 2 + totalBuildingsCells();
}
function freeCells() {
  return constructionCells - totalBuildings();
}
function totalBuildings() {
  return farm.countBuildings + bank.countBuildings + barn.countBuildings + barracks.countBuildings + house.countBuildings;
}
function totalBuildingsCells() {
  return farm.countBuildings + bank.countBuildings + barn.countBuildings + barracks.countBuildings + house.countBuildings + wasteland.countBuildings;
}
function jobless(){
  let jobless = civils() - sumWorkplaces();
  if (jobless < 0){
    jobless = 0;
  }
  return jobless;
}
function buildEfficiency(){
  let td;
  let result;
  if (sumWorkplaces() <= civils()){
    result = 100;
  }
 else{
    let result = civils() / sumWorkplaces();
    result = result * 100;
    result = result.toFixed(2);
  }
  return result;
}
function sumWorkplaces(){
  var result = 0;
  for (var i = 0; i < buildings.length; i++){
    result += buildings[i].totalWorkplaces;
  }
  return result;
}
export {initialFoodLimit, civils, defaultBuldingCost,researchCostMoney, researchCostSolders, freeCells, totalBuildingsCells, jobless, buildEfficiency, sumWorkplaces};
