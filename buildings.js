import {resources, infantryman, wasteland, researchingCells, updateTopStat, defaultBuldingCost, freeCells} from './main.js';
import {farm, pasture, garden, bank, barn, barracks, house} from './main.js';

function updateBuildingStat(){
    let td;
    td = document.getElementById('BuildingAvailable');
    td.innerHTML = Math.floor(Math.min(resources.money/defaultBuldingCost(), wasteland.countBuildings));

    //td = document.getElementById('freeCells'); //сколько ячеек доступно для строительства
    //td.innerHTML = wasteland.countBuildings;

    td = document.getElementById('farm');
    td.innerHTML = farm.countBuildings;

    td = document.getElementById('pasture');
    td.innerHTML = pasture.countBuildings;

    td = document.getElementById('garden');
    td.innerHTML = garden.countBuildings;

    td = document.getElementById('bank');
    td.innerHTML = bank.countBuildings;

    td = document.getElementById('barn');
    td.innerHTML = barn.countBuildings;

    td = document.getElementById('barracks');
    td.innerHTML = barracks.countBuildings;

    td = document.getElementById('house');
    td.innerHTML = house.countBuildings;
}
function building(build){
  console.log(build);
  let countBuildings = build.value;
  let buildName = build.name;
  if (buildName == "wasteland"){
    research(countBuildings);
    return;
  }
  if (countBuildings < 1){
    alert("Нужно возвести хотя бы одну постройку");
    return;
  }
  if (resources.money >= 100){
    let input = document.getElementById(buildName).value;
    let countBuildings = Number(build.value);
    if (countBuildings >= 1){
        while(resources.money >= 100 && countBuildings >= 1){
          if (freeCells() >= 1){
            eval(buildName).countBuildings++;
            console.log(eval(buildName).countBuildings);
            countBuildings--;
            wasteland.countBuildings--;
            resources.money -= 100;
          }
          else{
            alert("Все ячейки строительства заняты");
            break;
          }
        }
    }
    if (resources.money==0 && Building > 0){
      alert("Вы хотите возвести больше построек, чем можете себе позволить. Постройки возведены на все ваши деньги");
    }
    updateTopStat();
    updateBuildingStat();
  }
  else{
    alert("Недостаточно денег для постройки");
  }
}
window.building = building;

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
  updateTopStat();
  updateBuildingStat();
}

updateTopStat();
updateBuildingStat();
