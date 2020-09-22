let population = 100;
let money = 400;
let food = 130;
let populationGrowth = 0.02;
let currentTurn = 0;

function buildEfficiency(){
  if (sumWorkplaces() <= population){
      return 1;
  }
 else{
    let result = population / sumWorkplaces();
    result = result.toFixed(2);
    return result;
  }
}
class Building {
  constructor(typeRes, countRes, countWorkplaces, countBuildings) {
    this.typeRes = typeRes;
    this.countRes = countRes;
    this.countWorkplaces = countWorkplaces;
    this.countBuildings = countBuildings;
  }
  income(){
    return this.countBuildings * this.countRes * buildEfficiency();
  }
  totalWorkplaces(){
    return this.countWorkplaces * this.countBuildings;
  }
}

let farm = new Building("food", 70, 25, 0);
let bank = new Building("money", 25, 20, 0);

function sumWorkplaces(){
  return farm.totalWorkplaces() + bank.totalWorkplaces();
}
function updateStat(){
  let td;
    td = document.getElementById("population");
    td.innerHTML = population;

    td = document.getElementById('farm');
    td.innerHTML = farm.countBuildings;

    td = document.getElementById('bank');
    td.innerHTML = bank.countBuildings;

    td = document.getElementById('money');
    td.innerHTML = money;

    td = document.getElementById('food');
    td.innerHTML = food;

    td = document.getElementById('workplaces');
    td.innerHTML = sumWorkplaces();

    td = document.getElementById('currentTurn');
    td.innerHTML = currentTurn;

    nextTurnViewStat();
}
function nextTurnViewStat() {
  let td, balancePopulation, balanceMoney, balanceFood;
  populationGrowth = 0.02
/*
  if(population <= food){
    balancePopulation = Math.floor(population * populationGrowth);
    if(balancePopulation < 1)
      balancePopulation = 1;
  }
  else {
    balancePopulation = food - population;
  }
  balanceMoney = Math.floor(Math.min(population,sumWorkplaces()) * 3) + bank.income();
  if (population > workplaces)
    balanceMoney += population-sumWorkplaces() + bank.income();
  balanceFood = Math.floor(farm.income() - population);

*/

  // Начисляю ресурсы
  balanceMoney = Math.floor(Math.min(population,sumWorkplaces()) * 3) + bank.income();
  if (population > workplaces)
    balanceMoney += population-sumWorkplaces() + bank.income();

  balanceFood = farm.income();

  balancePopulation = Math.floor(population * populationGrowth) - population;
  if (balancePopulation < 1){
    balancePopulation = 1;
  }

  //Расходую ресурсы
  balanceFood = balanceFood - population;
  if (balanceFood < 0){
    balancePopulation = population - balanceFood;
    balanceFood = 0;
  }


  if(balancePopulation >= 0){
    td = document.getElementById("population");
    td.innerHTML += ' + ';
    td.innerHTML += balancePopulation;
  }
  else{
    td = document.getElementById("population");
    td.innerHTML += balancePopulation;
  }
  if(balanceMoney >= 0)
  {
    td = document.getElementById('money');
    td.innerHTML +=  ' + ';
    td.innerHTML += balanceMoney;
  }
  else{
    td = document.getElementById('money');
    td.innerHTML += balanceMoney;
  }
  if(balanceFood >= 0){
    td = document.getElementById('food');
    td.innerHTML += ' + ';
    td.innerHTML += balanceFood;
  }
  else{
    td = document.getElementById('food')
    td.innerHTML += balanceFood;
  }
}

function nextTurn(){
  populationGrowth = 0.02;
  /*if(food < population)
    populationGrowth = 0;
  population += Math.floor(population * populationGrowth);
  foodchange = food + Math.floor(farm.income() - population);
  food = foodchange;
  if(foodchange < 0){
    population += foodchange;
    food = 0;
  }
  money += Math.floor(Math.min(population,sumWorkplaces()) * 3) + bank.income(); //работающий житель = 3 монеты, неработающий = 1 монета
  if (population > sumWorkplaces())
    money += Math.floor(population-sumWorkplaces());
*/

  //Начисляю ресурсы
  balanceMoney = Math.floor(Math.min(population,sumWorkplaces()) * 3) + bank.income();
  if (population > workplaces)
    balanceMoney += population-sumWorkplaces() + bank.income();
  money += balanceMoney;

  food += farm.income();

  balancePopulation = Math.floor(population * populationGrowth);
  if (balancePopulation < 1){
    balancePopulation = 1;
  }

  //Расходую ресурсы
food -= population;
if (food < 0){
  population -= Math.abs(food) - populationGrowth;
  food = 0;
}

/*

    if(population <= food){
      balancePopulation = Math.floor(population * populationGrowth);
      if (balancePopulation < 1){
        balancePopulation = 1;
      }
    }
    else {
      balancePopulation = food - population;
    }
    balanceMoney = Math.floor(Math.min(population,sumWorkplaces()) * 3) + bank.income();
    if (population > workplaces)
      balanceMoney += population-sumWorkplaces() + bank.income();
    balanceFood = Math.floor(farm.income() - population);
  */

  population += Math.floor(balancePopulation);
  workplaces = Math.floor(farm.totalWorkplaces() + bank.totalWorkplaces());

  currentTurn ++;
  updateStat();
}
//Функция должна считать данные с форм ввода (фермы и банки) и построить соответствующее количество зданий каждого типа
function  building(build){
  countBuildings = build.value;
  //alert(count); //1
  //alert(build.name); //bank
  buildName = build.name;
  if (money >= 100){
    let input = document.getElementById(buildName).value;
    //alert(input);
    let countBuildings = Number(build.value);
    //alert(countBuildings);
    if (countBuildings >= 1){
      while(money >= 100 && countBuildings >= 1){
        eval(buildName).countBuildings++;
        countBuildings--;
        money = money - 100;
      }
    }
    if (money==0 && Building > 0){
      alert("Вы хотите возвести больше построек, чем можете себе позволить. Постройки возведены на все ваши деньги");
    }
    updateStat();
  }
}
window.onload = function() {
  updateStat();
}
