const myButton = document.querySelector("[id='newTask']");

const createMenu = document.querySelector("[id='creationMenu']");

const form = document.querySelector("[name='my']");

const catForm = document.querySelector("[name='catCreator']");
const createCatButton = document.querySelector("[id='createCat']");
const catList = document.querySelector("[id='catList']");

const tableHeaders = document.querySelectorAll("[class = 'tableheader");

const list = document.querySelector("[id='todo'");
const finList = document.querySelector("[id='done'")

const itemList = [];
const doneList =[];
const jsCatList = [];

myButton.addEventListener("click", showTaskCreation);
form.addEventListener("submit", userAdd);
catList.addEventListener("click", selectCategory);
catForm.addEventListener("submit", newCategory);

let catWait;

class category {
  constructor(name, color = "#0D0630") {
    this.name = name;
    this.color = color;
  }
}

class entry {
  constructor(name, completed, category) {
    this.name = name;
    this.completed = completed;
    this.category = category;
  }
}

// localStorage.clear(); //Reset "button" for local storage. WARNING: DO NOT UNCOMMENT UNLESS NECESSARY

const pastCat = JSON.parse(localStorage.getItem('category')) ?? [];
for(let i = 0; i < pastCat.length; i++) {
  jsCatList[i] = pastCat[i];
  printNewCat(jsCatList[i], catList);
}

//For every uncompleted element stored in local storage, add them to the current uncompleted list
const pastList = JSON.parse(localStorage.getItem('todoData'));
const todoData = pastList ?? [];
for(let i = 0; i < todoData.length; i++) {
  itemList[i] = pastList[i];
  addNewItem(itemList[i], list);
}

//For every completed element stored in local storage, add them to the current completed list
const pastDone = JSON.parse(localStorage.getItem('doneData'));
const tempDone = pastDone ?? [];
for(let i = 0; i < tempDone.length; i++) {
  doneList[i] = tempDone[i];
  addNewItem(doneList[i], finList);
}

/* 
* In case the settings button for the entire table ever needs to be brought back
*
for (i = 0; i < tableHeaders.length; i++) {
  tableHeaders[i].addEventListener("mouseover", toggleSettings);
  tableHeaders[i].addEventListener("mouseout", toggleSettings);
  // let gear = tableHeaders[i].querySelector('img');
  tableHeaders[i].addEventListener("click", showSettingsMenu);
}
*/

//if a user ipnuts a new todo item then create one and add it to the list
function userAdd(event) {
  event.preventDefault();
  catWait = catWait ?? new category("none");
  newEntry = new entry(form.elements.todo.value, false, catWait);
  catWait = null;
  form.elements.todo.value = "";
  itemList.push(newEntry);
  addNewItem(newEntry, list);
  localStorage.setItem('todoData', JSON.stringify(itemList));
  createMenu.hidden = true;
  myButton.hidden = false;
}

//Adds a new list item to a given list when given an item to add
function addNewItem(entry, table) {
  const elem = document.createElement('tr');
  elem.innerHTML = "<td>" + entry.name + "</td><td>" + entry.category.name + "</td><td>soon</td><td class=\"settings\"><img src = \"images/geardark.png\" alt=\"settings\" class = \"settingsButton\" hidden></td>";
  elem.addEventListener("mouseover", toggleSettings)
  elem.addEventListener("mouseout", toggleSettings)
  let elemName = elem.firstChild;
  elemName.classList.add("entryName");
  let catBlock = elem.childNodes[1];
  catBlock.style.backgroundColor = jsCatList[findCategory(catBlock)].color;
  elem.addEventListener("click", markDone);
  elem.classList.add(entry.completed? "doneentry":"todoentry");
  table.appendChild(elem);
}

function markDone(event) {
  event.preventDefault();
  //if the settings button was clicked on alter functionality
  if(event.target.classList[0] === 'settingsButton') {
    if(this.classList[0] === "doneentry") {
      deleteEntry(this);
    }
    return;
  }
  this.style.display = 'none';

  let idx;
  let temp;

  if(this.classList[0] === "todoentry") {
    idx = findEntry(itemList, this);
    temp = itemList[idx];
  }
  else if(this.classList[0] === "doneentry") {
    idx = findEntry(doneList, this);
    temp = doneList[idx];
  }

  (temp.completed? doneList:itemList).splice(idx, 1);
  resetStorage(temp.completed? 'doneData':'todoData', (temp.completed? doneList:itemList));
  temp.completed = !temp.completed;
  (temp.completed? doneList:itemList).push(temp);
  addNewItem(temp, temp.completed? finList:list);
  resetStorage(temp.completed? 'doneData':'todoData', (temp.completed? doneList:itemList));
  // localStorage.removeItetam('doneData'); //uncomment this to enable manual clearing of completed tasks in local storage
}

//searches a list and return the index of a given element. Returns undefined if the element is not found
function findEntry (list, elem) {
  let tempList = list ?? [];
  let itemName = elem.firstChild.innerHTML;
  for(let i = 0; i < tempList.length; i++) {
    if(tempList[i].name === itemName) {
      return i
    }
  }
  return undefined;
}

function findCategory (elem) {
  let tempList = jsCatList ?? [];
  let itemName = elem.innerHTML;
  for(let i = 0; i < tempList.length; i++) {
    if(tempList[i].name === itemName) {
      return i
    }
  }
  return undefined;
}

//updates the storage of an item type
function resetStorage (type, list) {
  localStorage.removeItem(type);
  localStorage.setItem(type, JSON.stringify(list));
  return;
}

function toggleSettings(event) {
  event.preventDefault();
  let icon = this.querySelector("[class=settingsButton]");
  icon.hidden = !icon.hidden;
}

function hideSettings(event) {
  event.preventDefault();
  let icon = this.querySelector("[class=settingsButton]");
  icon.hidden = !icon.hidden;
}

function showSettingsMenu(event) {
  event.preventDefault();
  //WIP to be implemented
}

function showTaskCreation(event) {
  event.preventDefault();
  resetCatList();
  myButton.hidden = true;
  createMenu.hidden = false;
}

function newCategory(event) {
  event.preventDefault();
  let tempCat = new category(catForm.elements.catNamer.value, catForm.elements.catColor.value)
  catForm.elements.catNamer.value = "";
  catForm.elements.catColor.value = "#0D0630"
  printNewCat(tempCat);
  jsCatList.push(tempCat);
  localStorage.setItem('category', JSON.stringify(jsCatList));
  catForm.hidden = true;
}

function printNewCat(cat) {
  let elem = document.createElement('li');
  elem.innerHTML = cat.name;
  elem.classList.add("catItem")
  elem.style.backgroundColor = cat.color;
  catList.prepend(elem);
}

function selectCategory(event) {
  event.preventDefault();
  if(event.target.id == "createCat") {
    catForm.hidden = !catForm.hidden;
    return;
  }
  if(event.target.classList[0] != "catItem") {
    return;
  }
  resetCatList();
  catWait = jsCatList[findCategory(event.target)];
  event.target.style.borderStyle = 'solid';
  event.target.style.borderWidth = '2px';
  event.target.style.borderColor = "white"//catWait.color;
  return;
}

function resetCatList() {
  for(let i = 0; i < document.getElementsByClassName("catItem").length - 1; i++) {
    document.getElementsByClassName("catItem")[i].style.border = "none";
  }
}

function recolorCatList() {
  for(let i = 0; i < document.getElementsByClassName("catItem").length - 1; i++) {
    let colorCat = jsCatList[findCategory(document.getElementsByClassName("catItem")[i])];
    document.getElementsByClassName("catItem")[i].style.backgroundColor = colorCat.color;
    document.getElementsByClassName("catItem")[i].style.color = "#000";
  }
}

function deleteEntry(elem) {
  elem.style.display = "none";
  let idx = findEntry(doneList, elem);
  doneList.splice(idx, 1);
  resetStorage('doneData', doneList);
}
