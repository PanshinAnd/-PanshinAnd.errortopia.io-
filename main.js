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

let farm = new Building("food", 0.7, 25, 0);
let bank = new Building("money", 0.25, 20, 0);

const populationGrowth = 0.02;
let population = 100;
let money = 400;
let food = 130;
let currentTurn = 0;
let balanceFood, balanceMoney, balancePopulation = 0;


function balanceAccrual(){
  balanceMoney = Math.floor(Math.min(population,sumWorkplaces()) * 3) + bank.income();
  if (population > sumWorkplaces()){
    balanceMoney += population-sumWorkplaces() + bank.income();
  }
  balanceFood = Math.floor(farm.income() - population);
  balancePopulation = Math.floor(population * populationGrowth);
  if(food == 0){
    balancePopulation = 0;
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
  return farm.totalWorkplaces() + bank.totalWorkplaces();
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

    td = document.getElementById('farm');
    td.innerHTML = farm.countBuildings;

    td = document.getElementById('bank');
    td.innerHTML = bank.countBuildings;

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
      td.innerHTML += balanceFood;
    }
    else {
      td.innerHTML += balanceFood;
    }

    td = document.getElementById('workplaces');
    td.innerHTML = sumWorkplaces();

    td = document.getElementById('currentTurn');
    td.innerHTML = currentTurn;

}
function nextTurn() {
  //вычисляю баланс ресурсов
  money += balanceMoney;
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
  else{
    alert("Недостаточно денег для постройки");
  }
}
window.onload = function() {
  updateStat();
}
