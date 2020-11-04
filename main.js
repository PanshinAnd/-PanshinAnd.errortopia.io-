class Solder{
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
class Building {
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
const populationGrowth = 0.02;
let constructionCells = 50;
let population = 200;
let money = 400;
let food = 130;
let currentTurn = 0;
let balanceFood, balancePopulation, balanceFoodLimit = 0;
let balanceMoney = 0;
let researchingCells = 0;

let farm = new Building("food",         0.7,  25, 25, 0,   defaultBuldingCost());
let bank = new Building("money",        0.25, 20, 5,  0,   defaultBuldingCost());
let barn = new Building("foodLimit",    50,   0, 15, 0,   defaultBuldingCost());
let barracks = new Building("infantryman",  0.2,  25, 25, 0,   defaultBuldingCost());
let house = new Building("empty",       0,    0,  50, 0,   defaultBuldingCost());
let wasteland = new Building("food", 0.05, 0,  15,    constructionCells,   0);
let infantryman = new Solder('infantryman',5,5,1,0);
wasteland.cost = researchCostMoney();
let countSoldersStatTurn = infantryman.countUnits;

let foodLimit = initialFoodLimit();
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
    balancePopulation = (food + balanceFood) - population;
  }
  //
  if (food+balanceFood == population + balancePopulation)
    balanceFood = food * (-1);
}

function buildEfficiency(){
  let td;
  let result;
  td = document.getElementById("buildEfficiency");
  if (sumWorkplaces() <= civils()){
    result = 100;
    td.innerHTML = result;
      return result;
  }
 else{
    let result = civils() / sumWorkplaces();
    result = result * 100;
    result = result.toFixed(2);
    td.innerHTML = result;
    return result;
  }
}
function sumWorkplaces(){
  return farm.totalWorkplaces() + bank.totalWorkplaces() + barn.totalWorkplaces() + barracks.totalWorkplaces();
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
  countSoldersStatTurn = infantryman.countUnits;
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
    if(eval(recruitName).countUnits + countRecruits <= countSoldersStatTurn + barracks.income()){
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
