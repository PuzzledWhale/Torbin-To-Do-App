const myButton = document.querySelector("[id='newTask']");
const delButton = document.querySelector("[id='clearStorage']");

const createMenu = document.querySelector("[id='creationMenu']");
const xbutton = document.querySelector("[id='cancelCreator']");

const form = document.querySelector("[name='my']");

const catForm = document.querySelector("[name='catCreator']");
const createCatButton = document.querySelector("[id='createCat']");
const catList = document.querySelector("[id='catList']");

const dateForm = document.querySelector("[name='date'");
const dateCreate = document.querySelector("[id='dateInput'");

const tableHeaders = document.querySelectorAll("[class = 'tableheader");

const list = document.querySelector("[id='todo'");
const finList = document.querySelector("[id='done'")

const itemList = [];
const doneList =[];
const jsCatList = [];

let editing = false;
let editElem, editedItem;

//creation of settings menu UI
settingsElements = "<td class=\"settings\"><img src = \"images/geardark.png\" alt=\"Settings\" class = \"settingsButton\" ><div class = \"settingsMenu\"><ul><li id = \"edit\">Edit</li><li id = \"delete\">Delete</li></ul></div></td>";

myButton.addEventListener("click", toggleCreator);
delButton.addEventListener("click", fullClear)
form.addEventListener("submit", userSave);
catList.addEventListener("click", selectCategory);
catForm.addEventListener("submit", newCategory);
dateForm.addEventListener("change", getDate);
xbutton.addEventListener("click", hideMenu);

let catWait;
let dateWait;

function category(name, color = "#0D0630") {
  this.name = name;
  this.color = color;
  this.textColor = "#000";
}

function entry(name, completed, category, date) {
  this.name = name;
  this.completed = completed;
  this.category = category;
  this.date = date;
  this.dateString = date.toLocaleDateString();//this.date.getMonth() + 1 +"/" + this.date.getDate() + "/" + this.date.getFullYear();
  this.timeString = date.toLocaleTimeString().slice(0,4) + date.toLocaleTimeString().slice(7);//createTimeString(this.date);

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
function userSave(event) {
  event.preventDefault();
  createMenu.style.display = "none";
  toggleBlur();
  catWait = catWait ?? new category("none");
  dateWait = dateWait ?? new Date();
  if(!editing) {
    newEntry = new entry(form.elements.todo.value, false, catWait, dateWait);
    catWait = null;
    addNewItem(newEntry, list);
    itemList.push(newEntry);
    localStorage.setItem('todoData', JSON.stringify(itemList));
  }
  else {
    editedItem = editedItem ?? new entry();

    //update the parameters of the item to be edited (very inefficient and dumb but object methods are wacky)
    editedItem.name = form.elements.todo.value;
    editedItem.category = catWait;
    editedItem.date = dateWait;
    editedItem.dateString = editedItem.date.toLocaleDateString();
    editedItem.timeString = editedItem.date.toLocaleTimeString().slice(0,4) + editedItem.date.toLocaleTimeString().slice(7);

    //Update the element itself based on the changes made
    editElem = editElem ?? document.createElement('tr');
    editElem.innerHTML = "<td>" + editedItem.name + "</td><td>" + editedItem.category.name + "</td><td>" + editedItem.dateString + "</td><td>" + editedItem.timeString + "</td>";
    editElem.innerHTML += settingsElements;

    let elemName = editElem.firstChild;
    elemName.classList.add("entryName");
    let catBlock = editElem.childNodes[1];
    let currentCat = jsCatList[findCategory(catBlock)];
    if(catBlock.innerHTML != "none") {
      catBlock.style.backgroundColor = currentCat.color;
      catBlock.style.color = currentCat.textColor;
    }
    editing = false;
    (editedItem.completed? doneList:itemList)[findEntry(editedItem.completed? doneList:itemList, editElem)] = editedItem;
    resetStorage(editedItem.completed? 'doneData':'todoData', (editedItem.completed? doneList:itemList));
  }
  form.elements.todo.value = "";
  dateForm.elements.dateInput.value = null;
  // createMenu.hidden = true;
  myButton.hidden = false;
}

//Adds a new list item to a given list when given an item to add
function addNewItem(entry, table) {
  const elem = document.createElement('tr');
  elem.innerHTML = "<td>" + entry.name + "</td><td>" + entry.category.name + "</td><td>" + entry.dateString + "</td><td>" + entry.timeString + "</td>";
  elem.innerHTML += settingsElements;
  // elem.addEventListener("mouseover", toggleSettings)
  // elem.addEventListener("mouseout", toggleSettings)
  let elemName = elem.firstChild;
  elemName.classList.add("entryName");
  let catBlock = elem.childNodes[1];
  let currentCat = jsCatList[findCategory(catBlock)];
  if(catBlock.innerHTML != "none") {
    catBlock.style.backgroundColor = currentCat.color;
    catBlock.style.color = currentCat.textColor;
  }
  elem.addEventListener("click", tableClick);
  elem.classList.add(entry.completed? "doneentry":"todoentry");
  table.appendChild(elem);
}

//If a user clicks on an entry then detect what part of the entry was clicked and respond accordingly
function tableClick(event) {
  event.preventDefault();
  //if the delete button was clicked on alter functionality
  if(event.target.id === 'edit') {
    // alert("edit");
    editEntry(((this.classList[0] === "todoentry")? itemList : doneList), this);
    return;
  } 
  if(event.target.id === 'delete') {
    deleteEntry(this, (this.classList[0] === "todoentry")? itemList : doneList);
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

  this.remove();
  (temp.completed? doneList:itemList).splice(idx, 1);
  resetStorage(temp.completed? 'doneData':'todoData', (temp.completed? doneList:itemList));
  temp.completed = !temp.completed;
  (temp.completed? doneList:itemList).push(temp);
  addNewItem(temp, temp.completed? finList:list);
  resetStorage(temp.completed? 'doneData':'todoData', (temp.completed? doneList:itemList));
  // localStorage.removeItetam('doneData'); //uncomment this to enable manual clearing of completed tasks in local storage
}

//searches a js list and return the index of a given element. Returns undefined if the element is not found
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

//searches the js categories list for a given category button element
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
  // settingsMenu.hidden = true;//icon.hidden? true:false;
}

function toggleCreator(event) {
  event.preventDefault();
  resetCatList();
  createMenu.style.display = createMenu.style.display === "block"? "none":"block";
  // document.body.addEventListener("click", hideMenu);
  toggleBlur();
}

//blurs all elements thar are not the creation menu
function toggleBlur() {
  let inCreateMenu = false;
  for(const elem of document.body.getElementsByTagName('*')) {
    if(elem.classList[0] === "center") {
      inCreateMenu = true;
    }
    else if(elem.classList[0] === "listSection") {
      inCreateMenu = false;
    }
    if(!inCreateMenu) {
      elem.style.filter = elem.style.filter === "blur(6px)"? "none":"blur(6px)";
    }
  }
}

//Create a new category based off of user inputs
function newCategory(event) {
  event.preventDefault();
  let tempCat = new category(catForm.elements.catNamer.value, catForm.elements.catColor.value)
  catForm.elements.catNamer.value = "";
  catForm.elements.catColor.value = "#0D0630"
  if(isDark(tempCat.color)) {
    tempCat.textColor = "#FFF";
  }
  printNewCat(tempCat);
  jsCatList.push(tempCat);
  localStorage.setItem('category', JSON.stringify(jsCatList));
  catForm.hidden = true;
}

//Prints a category
function printNewCat(cat) {
  let elem = document.createElement('li');
  elem.innerHTML = cat.name;
  elem.classList.add("catItem")
  elem.style.backgroundColor = cat.color;
  elem.style.color = cat.textColor;
  catList.prepend(elem);
}

//If a user clicks on a category, then highlight their selection and set it internally
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
  event.target.style.borderWidth = '3px';
  event.target.style.borderColor = "white";
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

function deleteEntry(elem, someList) {
  elem.remove();
  let idx = findEntry(someList, elem);
  someList.splice(idx, 1);
  resetStorage((elem.classList[0] === "todoentry")? 'todoData':'doneData', someList);
}

function getDate(event) {
  event.preventDefault();
  let tempDate = new Date(dateForm.elements.dateInput.value);
  dateWait = tempDate;
}

function fullClear(event) {
  event.preventDefault();
  localStorage.clear();
  if(!confirm("Pressing this will completely reset all tasks and categories permanently. Are you sure you want this?")) {
    return;
  }
  clearList(list);
  clearList(finList);
}

function clearList(tempList) {
  for(let i = 2; i < tempList.childNodes.length; i++) {
    tempList.childNodes[i].style.display = "none";
  }
}

//Detect if a given color is too dark. If so, return true
function isDark(color) {
  let col = color.substring(1);      // strip #
  let rgb = parseInt(col, 16);   // convert rrggbb to decimal
  let red = (rgb >> 16) & 0xff;  // extract red
  let green = (rgb >>  8) & 0xff;  // extract green
  let blue = (rgb >>  0) & 0xff;  // extract blue

  var luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue; // per ITU-R BT.709

  if (luma < 70) {
    return true;
  }
  return false;
}

function editEntry(givenList, elem) {
  let tempEntry = givenList[findEntry(givenList, elem)];
  //display the creation menu for users to edit with
  toggleBlur();
  createMenu.style.display = createMenu.style.display === "block"? "none":"block";
  resetCatList()
  highlightCategory(tempEntry.category);
  form.elements.todo.value = tempEntry.name;
  dateWait = tempEntry.date;
  // dateForm.elements.dateInput.value = tempEntry.date.toISOString().slice(0,16);
  editing = true;
  editElem = elem; 
  editedItem = tempEntry;
  return;
}

function setDateForm(givenDate) {
  givenDate.setMinutes(givenDate.getMinutes() - givenDate.getTimezoneOffset());
  dateForm.value = given.toISOString().slice(0,16);
}

function hideMenu(event) {
  event.preventDefault();
  // document.body.removeEventListener("click", hideMenu);
  createMenu.style.display = "none";
  toggleBlur();
  return;
}


//searches the category element list and highlights the given category
function highlightCategory(givenCat) {
  for(const elem of catList.children) {
    if(elem.id === "createCat") {
      continue;
    }
    if(elem.innerText === givenCat.name) {
      resetCatList();
      catWait = givenCat;
      elem.style.borderStyle = 'solid';
      elem.style.borderWidth = '3px';
      elem.style.borderColor = "white";
    }
  }
}