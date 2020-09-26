class Building {
  constructor(typeRes, countRes, countWorkplaces, countLivingPlaces, countBuildings) {
    this.typeRes = typeRes;
    this.countRes = countRes;
    this.countWorkplaces = countWorkplaces;
    this.countLivingPlaces = countLivingPlaces;
    this.countBuildings = countBuildings;
  }
  income(){
    return this.countBuildings * this.countRes * buildEfficiency();
  }
  totalWorkplaces(){
    return this.countWorkplaces * this.countBuildings;
  }
  totalLivingPlaces(){
    return this.countLivingPlaces * this.countBuildings;
  }
}

let farm = new Building("food",         0.7,  25, 25, 0);
let bank = new Building("money",        0.25, 20, 5,  0);
let barn = new Building("foodLimit",    50,   15, 15, 0);
let barracks = new Building("warrior",  0.2,    25, 25, 0);
let house = new Building("empty",0,  0,  50, 0);

const populationGrowth = 0.02, initialFoodLimit = 10000;
let population = 100;
let money = 400;
let food = 130, foodLimit = initialFoodLimit;
let currentTurn = 0;
let balanceFood, balanceMoney, balancePopulation, balanceFoodLimit = 0;
let constructionCells = 50;
let livingPlaces =  constructionCells * 15;

function freeCells() {
  return constructionCells - totalBuildings();
}
function totalBuildings() {
  return farm.countBuildings + bank.countBuildings + barn.countBuildings;
}

function balanceAccrual(){
  balanceMoney = Math.floor(Math.min(population,sumWorkplaces()) * 3 + bank.income());
  if (population > sumWorkplaces()){
    balanceMoney += Math.floor(population-sumWorkplaces());
  }

  livingPlaces = constructionCells * 15 + sumLivingPlaces();

  balanceFood = Math.floor(farm.income() + (constructionCells * 5) - population);
  foodLimit = barn.income() + initialFoodLimit;

  if ((food + balanceFood) > foodLimit)
    balanceFood = foodLimit - food;
  balancePopulation = Math.floor(population * populationGrowth);
  if(food == 0){
    balancePopulation = 0;
  }
  if((population + balancePopulation) > livingPlaces){
    balancePopulation = livingPlaces - population;
  }
  //Если прирост еды положительный, и
  //Еды с учетом прироста не хватает на население с учетом прироста, то
  //баланс населения равен разнице между едой (с уч.прироста) и популяцией (с уч.прироста)
  if (balanceFood >= 0 && (food+balanceFood) < (population + balancePopulation) && (farm.income() < population)){
    balancePopulation = (food + balanceFood) - (population + balancePopulation);
  }
}

function buildEfficiency(){
  let td;
  let result;
  td = document.getElementById("buildEfficiency");
  if (sumWorkplaces() <= population){
    result = 100;
    td.innerHTML = result;
      return result;
  }
 else{
    let result = population / sumWorkplaces();
    result = result * 100;
    result = result.toFixed(2);
    td.innerHTML = result;
    return result;
  }
}
function sumWorkplaces(){
  return farm.totalWorkplaces() + bank.totalWorkplaces() + barn.totalWorkplaces();
}
function sumLivingPlaces(){
  return farm.totalLivingPlaces() + bank.totalLivingPlaces() + barn.totalLivingPlaces() + barracks.totalLivingPlaces() + house.totalLivingPlaces();
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
    td.innerHTML = livingPlaces;


    td = document.getElementById('constructionCell');
    td.innerHTML = constructionCells;

    td = document.getElementById('freeCells');
    td.innerHTML = freeCells();

    td = document.getElementById('workplaces');
    td.innerHTML = sumWorkplaces();

    td = document.getElementById('currentTurn');
    td.innerHTML = currentTurn;

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


  currentTurn ++;
  updateStat();
}

function  building(build){
  countBuildings = build.value;
  buildName = build.name;
  if (money >= 100){
    let input = document.getElementById(buildName).value;
    let countBuildings = Number(build.value);
    if (countBuildings >= 1){
        while(money >= 100 && countBuildings >= 1){
          if (freeCells() >= 1){
            eval(buildName).countBuildings++;
            countBuildings--;
            money = money - 100;
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
window.onload = function() {
  updateStat();
}
