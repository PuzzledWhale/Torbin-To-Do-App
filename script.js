const list = document.querySelector("[id='todo'");
const finList = document.querySelector("[id='done'")
const form = document.querySelector("[name='my']");
const myButton = document.querySelector("[id='newTask']");
const tableHeaders = document.querySelectorAll("[class = 'tableheader");
const itemList = [];
const doneList =[];

// localStorage.clear(); //Reset "button" for local storage. WARNING: DO NOT UNCOMMENT UNLESS NECESSARY

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

myButton.addEventListener("click", showTaskCreation);
form.addEventListener("submit", userAdd);
// for (i = 0; i < tableHeaders.length; i++) {
//   tableHeaders[i].addEventListener("mouseover", toggleSettings);
//   tableHeaders[i].addEventListener("mouseout", toggleSettings);
//   // let gear = tableHeaders[i].querySelector('img');
//   tableHeaders[i].addEventListener("click", showSettingsMenu);
// }


//if a user ipnuts a new todo item then create one and add it to the list
function userAdd(event) {
  event.preventDefault();
  let newEntry = new entry(form.elements.todo.value, false, "none");
  form.elements.todo.value = "";
  itemList.push(newEntry);
  addNewItem(newEntry, list);
  localStorage.setItem('todoData', JSON.stringify(itemList));
  form.hidden = true;
  myButton.hidden = false;
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
  elem.innerHTML = "<td>" + entry.name + "</td><td>" + entry.category + "</td><td>soon</td><td class=\"settings\"><img src = \"images/geardark.png\" alt=\"settings\" class = \"settingsButton\" hidden></td>";
  elem.addEventListener("mouseover", toggleSettings)
  elem.addEventListener("mouseout", toggleSettings)
  let elemName = elem.firstChild;
  elemName.classList.add("entryName");
  elem.addEventListener("click", markDone);
  elem.classList.add(entry.completed? "doneentry":"todoentry");
  table.appendChild(elem);
}

function markDone(event) {
  event.preventDefault();
  //if the settings button was clicked on alter functionality
  if(event.target.classList[0] === 'settingsButton') {
    alert('settings!');
    return;
  }
  this.style.display = 'none';

  let idx;
  let temp;

  if(this.classList[0] === "todoentry") {
    idx = findEntry((itemList), this);
    temp = itemList[idx];
  }
  else if(this.classList[0] === "doneentry") {
    idx = findEntry((doneList), this);
    temp = doneList[idx];
  }

  (temp.completed? doneList:itemList).splice(idx, 1);
  resetStorage(temp.completed? 'doneData':'todoData', (temp.completed? doneList:itemList));
  temp.completed = !temp.completed;
  (temp.completed? doneList:itemList).push(temp);
  addNewItem(temp, temp.completed? finList:list);
  // localStorage.setItem((temp.completed? 'doneData':'todoData'), (temp.completed? doneList:itemList));
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
  myButton.hidden = true;
  form.hidden = false;
}

