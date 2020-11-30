import {money, barracks, infantryman, wasteland, researchingCells, updateTopStat, buildEfficiency, defaultBuldingCost, totalBuildingsCells, researchCostMoney} from './main.js';

function updateExpansionStat(){
  let td;
  td = document.getElementById('SoldiersAvailable');
  td.innerHTML = Math.floor(Math.min(barracks.income(), (money/infantryman.costHiring)));

  td = document.getElementById('WastelandAvailable');
  td.innerHTML = Math.floor(Math.min((money/researchCostMoney()),(infantryman.countUnits/researchCostSolders())));

  td = document.getElementById('countWarriors');
  td.innerHTML = infantryman.countUnits;
}
function researchCostSolders(){
  return 2 + totalBuildingsCells();
}

window.research = async function(wasteland) {
  while(wasteland.value >= 1){
    if(money >= researchCostMoney()){
      if (infantryman.countUnits >= researchCostSolders()){
        money -= researchCostMoney();
        infantryman.countUnits -= researchCostSolders();
        researchingCells++;
        wasteland.value--;
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
  updateTopStat();
}
window.recruitment = async function (recruit){
  let countRecruits = Number(recruit.value);
  let recruitName = recruit.name;
  if (countRecruits <= barracks.income()){
    //Костыль, предотвращающий найм большего числа юнитов, чем могут позволить казармы
    //путем найма несколько раз за один ход небольшго числа солдат
    if(eval(recruitName).countUnits + countRecruits <= countSoldersStatTurn + barracks.income()){
      if (money >= (countRecruits * eval(recruitName).costHiring)){
        eval(recruitName).countUnits += countRecruits;
        money -= countRecruits * infantryman.costHiring;
        console.log(eval(recruitName).countUnits);
        updateTopStat();
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
  updateExpansionStat();
  updateTopStat();
