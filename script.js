const list = document.querySelector("[id='todo'");
const form = document.querySelector("[name='my']");
const itemList = [];
const doneList =[];

//For every element stored in local storage, add them to the current list
const pastList = JSON.parse(localStorage.getItem('todoData'));
const todoData = pastList ?? [];
for(let i = 0; i < todoData.length; i++) {
  itemList[i] = pastList[i];
  const elem = document.createElement('li');
  elem.innerHTML = itemList[i].name;
  elem.addEventListener("click", markDone);
  list.append(elem);
}

form.addEventListener("submit", userAdd);

//if a user ipnuts a new todo item then create one and add it to the list
function userAdd(event) {
  event.preventDefault();
  let newEntry = new entry(form.elements.todo.value)
  form.elements.todo.value = "";
  itemList.push(newEntry);
  const elem = document.createElement('li');
  elem.innerHTML = newEntry.name;
  elem.addEventListener("click", markDone);
  list.appendChild(elem);
  localStorage.setItem('todoData', JSON.stringify(itemList));
}

class entry {
  constructor(name) {
    this.name = name;
  }
}

function markDone(event) {
  event.preventDefault();
  this.style.display = 'none';
  let idx;

  //searches for the first item in the todo list that matches the clicked element
  let tempList = itemList ?? [];
  for(let i = 0; i < tempList.length ?? 0; i++) {
    if(itemList[i].name === this.innerHTML) {
      idx = i;
      break;
    }
  }
  let temp = itemList[idx];
  itemList.splice(idx);
  localStorage.removeItem('todoData');
  doneList.push(temp);
  localStorage.setItem('doneData', JSON.stringify(doneList));
}

// document.onunload = function (event) {
//   event.preventDefault();
//   for(let i = 0; i < itemList.length; i++) {
    
//   }
// }


