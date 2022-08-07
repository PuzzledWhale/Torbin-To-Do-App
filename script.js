const list = document.querySelector("[id='todo'");
const finList = document.querySelector("[id='done'")
const form = document.querySelector("[name='my']");
const tableHeaders = document.querySelectorAll("[class = 'tableheader");
const itemList = [];
const doneList =[];

//For every element stored in local storage, add them to the current list
const pastList = JSON.parse(localStorage.getItem('todoData'));
const todoData = pastList ?? [];
for(let i = 0; i < todoData.length; i++) {
  itemList[i] = pastList[i];
  addNewItem(itemList[i], list);
}

const pastDone = JSON.parse(localStorage.getItem('doneData'));
const tempDone = pastDone ?? [];
for(let i = 0; i < tempDone.length; i++) {
  doneList[i] = tempDone[i];
  addNewItem(doneList[i], finList);
}

form.addEventListener("submit", userAdd);
for (i = 0; i < tableHeaders.length; i++) {
  tableHeaders[i].addEventListener("mouseover", showSettings);
  tableHeaders[i].addEventListener("mouseout", hideSettings)
}


//if a user ipnuts a new todo item then create one and add it to the list
function userAdd(event) {
  event.preventDefault();
  let newEntry = new entry(form.elements.todo.value, false, "none");
  form.elements.todo.value = "";
  itemList.push(newEntry);
  addNewItem(newEntry, list);
  localStorage.setItem('todoData', JSON.stringify(itemList));
}

class entry {
  constructor(name, completed, category = "none") {
    this.name = name;
    this.completed = completed;
    this.category = category;
  }
}

//Adds a new list item to a given list when given an item to add
function addNewItem(entry, table) {
  const elem = document.createElement('tr');
  elem.innerHTML = "<td>" + entry.name + "</td><td>" + entry.category + "</td><td>soon</td><td class=\"settings\"><img src = \"images/gear.png\" alt=\"settings\" class = \"settingsButton\"></td>";
  let gear = elem.lastChild;
  gear.addEventListener("mouseover", showSettings)
  gear.addEventListener("mouseout", hideSettings)
  //set the name of the entry to the proper class
  let elemName = elem.firstChild;
  elemName.classList.add("entryName");
  if(entry.completed == false) {
    elem.addEventListener("click", markDone);
    elem.classList.add("todoentry");
  }
  else {
    elem.classList.add("doneentry");
  }
  table.appendChild(elem);
}

function markDone(event) {
  event.preventDefault();
  this.style.display = 'none';
  let idx;

  //searches for the first item in the todo list that matches the clicked element
  let tempList = itemList ?? [];
  for(let i = 0; i < tempList.length; i++) {
    let itemName = this.firstChild.innerHTML;
    if(itemList[i].name === itemName) {
      idx = i;
      break;
    }
  }

  let temp = itemList[idx];
  itemList.splice(idx, 1);
  localStorage.removeItem('todoData');
  localStorage.setItem('todoData', JSON.stringify(itemList));
  temp.completed = true;
  this.removeEventListener("click", markDone);
  doneList.push(temp);
  addNewItem(temp, finList);
  localStorage.setItem('doneData', JSON.stringify(doneList));
  // localStorage.removeItem('doneData'); //uncomment this to enable manual clearing of completed tasks in local storage
}

function showSettings(event) {
  event.preventDefault();
  let icon = this.querySelector("[class=settingsButton]");
  icon.style.display = "inline";
}

function hideSettings(event) {
  event.preventDefault();
  let icon = this.querySelector("[class=settingsButton]");
  icon.style.display = "none";
}

