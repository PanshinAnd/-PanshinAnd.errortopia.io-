// TODO:
// * Отредактировать функцию balanceAccrual() так, чтобы она считала доходы по всем типам еды

class ResourceManagment {
  constructor (alcohol, money){
    this.alcohol = alcohol;
    this.money = money;
  }
}
class FoodManagment {
  constructor(meet,corn,fruits, bread){
    this.meet = meet;
    this.corn = corn;
    this.fruits = fruits;
    this.bread = bread;
  }
  sumFood(){
    let result = this.meet + this.corn + this.fruits + this.bread;
    return result;
  }
  countRes(){
    return 4;
  }
  resourcesAvailable(){
    let i = 0;
    if (this.meet > 0)
    i++;
    if (this.corn > 0)
    i++;
    if (this.fruits > 0)
    i++;
    if (this.bread > 0)
    i++;
    return i;
  }
  minRes(){
    function minimum (a, b){
      if (a < b)
        return a;
      else
      return b;
    }
    return minimum(minimum(meet,corn), minimum(fruits, bread));
  }
  consumption(consumptionRate){
    this.meet -= consumptionRate;
    this.corn -= consumptionRate;
    this.fruits -= consumptionRate;
    this.bread -= consumptionRate;
  }
  limit (){
    return barn.income() + initialFoodLimit();
  }
  meetIncome(){
    return wasteland.income() + pasture.income();
  }
  cornIncome(){
    return farm.income();
  }
  fruitsIncome(){
    return garden.income();
  }
  allIncome(){
    //инкам всех производящих зданий, не зависит от типа еды. Нужен, чтобы посчитать баланс
    return farm.income() + wasteland.income() + pasture.income() + garden.income();
  }
}
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
export let researchingCells = 0;

const populationGrowth = 0.02;
let constructionCells = 50;
let population = 200;
let currentTurn = 0;
let balancePopulation, balanceFoodLimit = 0;
let balanceMoney = 0;

let food = new FoodManagment(50, 40, 40, 40);
export let resources = new ResourceManagment(0, 400);

export let farm = new Building("corn",         1.5,  25, 25, 0,   defaultBuldingCost());
export let bank = new Building("money",        0.25, 20, 5,  0,   defaultBuldingCost());
export let barn = new Building("foodLimit",    50,   0,  15, 0,   defaultBuldingCost());
export let house = new Building("empty",       0,    0,  50, 0,   defaultBuldingCost());
export let pasture = new Building("meet",     0.7,   20, 20, 0,   defaultBuldingCost());
export let garden = new Building("fruits",    1,     10, 5,  0,   defaultBuldingCost());
export let barracks = new Building("infantryman",0.2,25, 25, 0,   defaultBuldingCost());
export let wasteland = new Building("meet",   0.05,  0,  15,    constructionCells,   0);
export let infantryman = new Solder('infantryman',5,5,1,0);

wasteland.cost = researchCostMoney();
let countSoldersStatTurn = infantryman.countUnits;

function initialFoodLimit(){
  //Каждая ячейка пустыря прибавляет 200 к лимиту еды
  return wasteland.countBuildings * 200;
}

function civils(){
  return population - infantryman.countUnits;
}
export function defaultBuldingCost() {
  return 100;
}
export function researchCostMoney(){
 return 500 + totalBuildingsCells() * 10;
}
export function freeCells() {
  return constructionCells - totalBuildings();
}
function totalBuildings() {
  return farm.countBuildings + bank.countBuildings + barn.countBuildings + barracks.countBuildings + house.countBuildings;
}
export function totalBuildingsCells() {
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

  balancePopulation = Math.floor(population * populationGrowth);
  if(food.sumFood() == 0){
    balancePopulation = 0;
  }
  if((population + balancePopulation) > sumLivingPlaces()){
    balancePopulation = sumLivingPlaces() - population;
  }
  //Если прирост еды положительный, и
  //Еды с учетом прироста не хватает на население с учетом прироста, то
  //баланс населения равен разнице между едой (с уч.прироста) и популяцией (с уч.прироста)
  if (balanceFood >= 0 && (food.sumFood() + balanceFood) < (population + balancePopulation) && (farm.income() < population)){
    balancePopulation = (food.sumFood() + balanceFood) - population;
  }
  // Если еды (с уч.прироста) хватает ровно на то, чтобы прокормить население (с уч.прироста)
  // То вся еда тратится
  if (food.sumFood() + balanceFood == population + balancePopulation)
    balanceFood = food.sumFood() * (-1);
}
function balanceFood(){
  //Нужно запомнить сколько ресурса есть, прибавить еду food.allIncome(), отнять потребление foodConsumption()
  //Затем посчитать разницу между запомненым количеством еды и тем, что получилось после всех действий
  let result =  Math.floor(food.allIncome() - population);
  if ((food.sumFood() + result) > food.limit())
    result = food.limit() - food.sumFood();

  return result;
}

function foodConsumption() {  //Потребление еды.
  //Вычитаем по формуле популяцию из еды на складе
  //Считаю потребление еды с учетом разбиения ее на отдельные ресурсы (мясо, зерно и пр.)
  /*Смотрим сколько ресурсов больше 0.
  Делим население на число ресурсов - столько и есть норма потребления для каждого ресурса.
  Если не хватает, то вычитаем население, которое было уже накормлено по такой пропорции и возвращаемся к 1 шагу */
  let hungry = population + balancePopulation;
  let consumptionRate = Math.floor(hungry / food.resourcesAvailable()); //норма потребления
  console.log(consumptionRate);
  while(consumptionRate > 0){
    //сейчас из каждого ресурса вычитаю эту норму потребления
    //если ресов каждого типа достаточно, то просто вычитаю норму потребления - население накормлено
    if (consumptionRate <= food.minRes()){
      food.consumption(consumptionRate);
      consumptionRate = 0;
      }
      //иначе вычитаю норму, равную минимальному ресурсу, а затем пересчитываю норму потребления
      else {
        hungry -= food.minRes() * food.resourcesAvailable();
        food.consumption(food.minRes());
        consumptionRate = Math.floor(hungry / food.resourcesAvailable());
      }
  }
}//Проблема вот в чем: если у нас осталось 2 голодных и 3 ресурса. Каков будет результат работы функции?


export function buildEfficiency(){
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

//Функцию разносим на разные. Для начала на 2. Те места, которые нужно вынести пометил комментами
//Чтобы понять, какую функцию вызывать на какой странице, разношу все функции по разных js файлам
//И для каждой страницы создаю свой js файл, импортируя туда нужные функции

//Таблица с общей статистикой вверху каждой страницы
export function updateTopStat(){
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
    td.innerHTML = resources.money;
    if(balanceMoney >= 0){
      td.innerHTML +=  ' + ';
      td.innerHTML += balanceMoney;
    }
    else{
      td.innerHTML += balanceMoney;
    }

    td = document.getElementById('food');
    td.innerHTML = food.sumFood();
    if(balanceFood() >= 0){
      td.innerHTML += ' + ';
      td.innerHTML += balanceFood();
    }
    else {
      td.innerHTML += balanceFood();
    }

    td = document.getElementById('livingPlaces');
    td.innerHTML = sumLivingPlaces();

    td = document.getElementById('civils');
    td.innerHTML = civils();

    td = document.getElementById('jobless');
    td.innerHTML = jobless();

    td = document.getElementById('constructionCell');
    td.innerHTML = constructionCells;

    td = document.getElementById('workplaces');
    td.innerHTML = sumWorkplaces();

    td = document.getElementById('currentTurn');
    td.innerHTML = currentTurn;

    td = document.getElementById('buildEfficiency');
    td.innerHTML = buildEfficiency();
}

function nextTurn() {
  //вычисляю баланс ресурсов
  resources.money += Math.floor(balanceMoney);
  //food += balanceFood;
  population += balancePopulation;

  if(food < 0){
    population += food;
    //food.sumFood() = 0; Ошибка! к функции нельзя присвоить значение.
  }
  wasteland.countBuildings += researchingCells;
  constructionCells += researchingCells;
  researchingCells = 0;

  if  (population < infantryman.countUnits){
    infantryman.countUnits = population;
  }

  currentTurn ++;
  countSoldersStatTurn = infantryman.countUnits;
  updateTopStat();
}
window.onload = function() {
  updateTopStat();
}
