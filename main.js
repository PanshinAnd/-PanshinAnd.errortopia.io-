import {Building} from './building.js';
import {Solder} from './Solder.js';
import { initialFoodLimit, civils, defaultBuldingCost,researchCostMoney, researchCostSolders, freeCells, totalBuildingsCells, jobless, buildEfficiency, sumWorkplaces } from './utilities.js';


const populationGrowth = 0.02;
let constructionCells = 50;
let population = 200;
let money = 400;
let food = 130;
let currentTurn = 0;
let balanceFood, balancePopulation, balanceFoodLimit = 0;
let balanceMoney = 0;
let researchingCells = 0;

let buildings = [];

 buildings.push(farm = new Building("food",            0.7,  25, 25, 0,   defaultBuldingCost()));
 buildings.push(bank = new Building("money",           0.25, 20, 5,  0,   defaultBuldingCost()));
 buildings.push(barn = new Building("foodLimit",       50,   0,  15, 0,   defaultBuldingCost()));
 buildings.push(barracks = new Building("infantryman", 0.2,  25, 25, 0,   defaultBuldingCost()));
 buildings.push(house = new Building("empty",          0,    0,  50, 0,   defaultBuldingCost()));
 buildings.push(wasteland = new Building("food", 0.05, 0,  15,    constructionCells,   0));
let infantryman = new Solder('infantryman',5,5,1,0);
wasteland.cost = researchCostMoney();
export {buildings};

let countSoldersStartTurn = infantryman.countUnits;

let foodLimit = initialFoodLimit();
function balanceAccrual(){
  balanceMoney = 0;
  balanceMoney -= infantryman.totalMaintеnanceMoney();
  balanceMoney += Math.floor(Math.min(civils(),sumWorkplaces()) * 3 + bank.income());
  if (civils() > sumWorkplaces())
    balanceMoney += Math.floor(civils()-sumWorkplaces());

  livingPlaces = livingPlaces + sumLivingPlaces();

  balanceFood = Math.floor(farm.income() + (wasteland.income()) - population);
  foodLimit = barn.income() + initialFoodLimit();

  if ((food + balanceFood) > foodLimit)
    balanceFood = foodLimit - food;
  balancePopulation = Math.floor(population * populationGrowth);
  if(food == 0){
    balancePopulation = 0;
  }
  if((population + balancePopulation) > sumLivingPlaces()){
    balancePopulation = sumLivingPlaces() - population;
  }
  //Если прирост еды положительный, и
  //Еды с учетом прироста не хватает на население с учетом прироста, то
  //баланс населения равен разнице между едой (с уч.прироста) и популяцией (с уч.прироста)
  if (balanceFood >= 0 && (food+balanceFood) < (population + balancePopulation) && (farm.income() < population)){
    balancePopulation = (food + balanceFood) - (population + balancePopulation);
  }
}
function sumLivingPlaces(){
  return farm.totalLivingPlaces() + bank.totalLivingPlaces() + barn.totalLivingPlaces() + barracks.totalLivingPlaces() + house.totalLivingPlaces() + wasteland.totalLivingPlaces();
}
function updateStat(){
  let td;
  balanceAccrual();
    td = document.getElementById("population");
    td.innerHTML = population;
    if(balancePopulation >= 0){
      td.innerHTML += " + ";
      td.innerHTML += balancePopulation;
    }
    else{
      td.innerHTML += balancePopulation;
    }

    td = document.getElementById('money');
    td.innerHTML = money;
    if(balanceMoney >= 0){
      td.innerHTML +=  ' + ';
      td.innerHTML += balanceMoney;
    }
    else{
      td.innerHTML += balanceMoney;
    }

    td = document.getElementById('food');
    td.innerHTML = food;
    if(balanceFood >= 0){
      td.innerHTML += ' + ';
      td.innerHTML += Math.floor(balanceFood);
    }
    else {
      td.innerHTML += Math.floor(balanceFood);
    }

    td = document.getElementById('livingPlaces');
    td.innerHTML = sumLivingPlaces();

    td = document.getElementById('civils');
    td.innerHTML = civils();

    td = document.getElementById('jobless');
    td.innerHTML = jobless();

    td = document.getElementById('constructionCell');
    td.innerHTML = constructionCells;

    td = document.getElementById('freeCells');
    td.innerHTML = wasteland.countBuildings;

    td = document.getElementById('workplaces');
    td.innerHTML = sumWorkplaces();

    td = document.getElementById("buildEfficiency");
    td.innerHTML = buildEfficiency();

    td = document.getElementById('currentTurn');
    td.innerHTML = currentTurn;

    td = document.getElementById('buildEfficiency');
    td.innerHTML = buildEfficiency();

    td = document.getElementById('farm');
    td.innerHTML = farm.countBuildings;

    td = document.getElementById('bank');
    td.innerHTML = bank.countBuildings;

    td = document.getElementById('barn');
    td.innerHTML = barn.countBuildings;

    td = document.getElementById('barracks');
    td.innerHTML = barracks.countBuildings;

    td = document.getElementById('house');
    td.innerHTML = house.countBuildings;

    td = document.getElementById('countWarriors');
    td.innerHTML = infantryman.countUnits;

    //Доступные солдаты, постройки и пустыри
    td = document.getElementById('SoldiersAvailable');
    td.innerHTML = Math.floor(Math.min(barracks.income(), (money/infantryman.costHiring)));

    td = document.getElementById('WastelandAvailable');
    td.innerHTML = Math.floor(Math.min((money/researchCostMoney()),(infantryman.countUnits/researchCostSolders())));

    td = document.getElementById('BuildingAvailable');
    td.innerHTML = Math.floor(Math.min(money/defaultBuldingCost(), wasteland.countBuildings));

}
function nextTurn() {
  //вычисляю баланс ресурсов
  money += Math.floor(balanceMoney);
  food += balanceFood;
  population += balancePopulation;

  if(food < 0){
    population += food;
    food = 0;
  }
  wasteland.countBuildings += researchingCells;
  constructionCells += researchingCells;
  researchingCells = 0;

  if  (population < infantryman.countUnits){
    infantryman.countUnits = population;
  }

  currentTurn ++;
  countSoldersStartTurn = infantryman.countUnits;
  updateStat();
}

function research(countBuildings){
  console.log(researchCostMoney());
  console.log(researchCostSolders());
  while(countBuildings >= 1){
    if(money >= researchCostMoney()){
      if (infantryman.countUnits >= researchCostSolders()){
        money -= researchCostMoney();
        infantryman.countUnits -= researchCostSolders();
        researchingCells++;
        countBuildings--;
      }
      else{
        alert("Недостаточно солдат на исследование");
        break;
      }
    }
    else{
      alert("Недостаточно денег на исследование");
      break;
    }
  }
  if (researchingCells > 0){
    alert("Исследовано " + researchingCells  + " ячеек");
  }
  updateStat();
}

function  building(build){
  console.log(build);
  countBuildings = build.value;
  buildName = build.name;
  if (buildName == "wasteland"){
    research(countBuildings);
    return;
  }
  if (countBuildings < 1){
    alert("Нужно возвести хотя бы одну постройку");
    return;
  }
  if (money >= 100){
    let input = document.getElementById(buildName).value;
    let countBuildings = Number(build.value);
    if (countBuildings >= 1){
        while(money >= 100 && countBuildings >= 1){
          if (freeCells() >= 1){
            eval(buildName).countBuildings++;
            countBuildings--;
            wasteland.countBuildings--;
            money -= 100;
          }
          else{
            alert("Все ячейки строительства заняты");
            break;
          }
        }
    }
    if (money==0 && Building > 0){
      alert("Вы хотите возвести больше построек, чем можете себе позволить. Постройки возведены на все ваши деньги");
    }
    updateStat();
  }
  else{
    alert("Недостаточно денег для постройки");
  }
}
function demolition(build) {
  console.log(build);
  let countBuildings = Number(build.value);
  buildName = build.name;
  if (countBuildings < 1){
    alert("Невозможно снести меньше одной постройки");
    return;
  }
  let input = document.getElementById(buildName).value;
  while(countBuildings >= 1 && eval(buildName).countBuildings >= 1){
    eval(buildName).countBuildings--;
    countBuildings --;
    wasteland.countBuildings++;
  }
  updateStat();
}


function recruitment(recruit){
  console.log(recruit);
  countRecruits = Number(recruit.value);
  recruitName = recruit.name;
  if (countRecruits <= barracks.income()){
    //Костыль, предотвращающий найм большего числа юнитов, чем могут позволить казармы
    //путем найма несколько раз за один ход небольшго числа солдат
    if(eval(recruitName).countUnits + countRecruits <= countSoldersStartTurn + barracks.income()){
      if (money >= (countRecruits * eval(recruitName).costHiring)){
        eval(recruitName).countUnits += countRecruits;
        money -= countRecruits * infantryman.costHiring;
        console.log(eval(recruitName).countUnits);
        updateStat();
      }
      else{
        alert("Вы хотите обучить больше воинов, чем может позволить ваш бюджет");
      }
    }
    else {
      alert("Вы хотите обучить больше юнитов, чем это могут сделать казармы");
    }
  }
  else {
    alert("Вы хотите обучить больше юнитов, чем это могут сделать казармы");
  }
}
window.onload = function() {
  updateStat();
}
