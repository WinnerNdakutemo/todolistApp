class ToDoList {
  _items = [];
  constructor() {
    const storageItems = localStorage.getItem("todos")?.toString();
    this._items = storageItems ? JSON.parse(storageItems) : [];
  }

  get items() {
    return this._items;
  }

  addItem(item) {
    item.id = this._items.at(-1) ? this._items.at(-1).id + 1 : 1;
    this.items.push(item);
    this.onUpdate();
  }

  removeItem(itemId) {
    this.items.forEach((toDoItem, index) => {
      if (toDoItem.id === itemId) {
        this._items.splice(index, 1);
      }
    });
    this.onUpdate();
  }
  onUpdate() {
    localStorage.setItem("todos", JSON.stringify(this._items));
  }

  getItem(itemId) {
    const foundElement = this.items.find((toDoItem) => {
      return toDoItem.id === itemId;
    });
    return foundElement;
  }
}

class ToDoItem {
  constructor(title) {
    this.title = title;
    this.completed = false;
  }
}
const myTodo = new ToDoList();

//modification du Dom
const addForm = document.querySelector(".formulaire");
const addFormInput = document.querySelector(".form-control");
const filterButtons = document.querySelectorAll(".filter-button");
const toDoUl = document.querySelector(".list-group");
let checkbox = document.querySelectorAll(".form-check-input");
let removeButtons = document.querySelectorAll(".bi-trash");

filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    changeActiveFilterButton(e);
    toDoUl.innerHTML = "";
    let condition = e.currentTarget.getAttribute("data-filter");
    loadToDo(condition);
  });
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const datas = new FormData(e.currentTarget);
  const newToDoElement = new ToDoItem(datas.get("title"));
  myTodo.addItem(newToDoElement);
  addFormInput.value = "";
  const actualZoneCondition = document
    .querySelector(".active")
    .getAttribute("data-filter");
  reload(actualZoneCondition);
});

function changeActiveFilterButton(e) {
  const actualActived = document.querySelector(".active");
  actualActived.classList.remove("active");
  e.currentTarget.classList.add("active");
}

function loadToDo(condition) {
  if (condition === "all") {
    myTodo.items.forEach((element) => {
      const newElement = createTemplateForToDoItem(element);
      toDoUl.append(newElement);
    });
  } else if (condition === "done") {
    const newItems = myTodo.items.filter((item) => {
      return item.completed;
    });

    newItems.forEach((item) => {
      const newElement = createTemplateForToDoItem(item);
      toDoUl.append(newElement);
    });
  } else {
    const newItems = myTodo.items.filter((item) => {
      return !item.completed;
    });
    newItems.forEach((item) => {
      const newElement = createTemplateForToDoItem(item);
      toDoUl.append(newElement);
    });
  }
  removeButtons = document.querySelectorAll(".bi-trash");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = button.parentNode.parentNode.children[0];
      const id = parseInt(target.getAttribute("id").split("-").at(-1));
      myTodo.removeItem(id);
      reload(condition);
    });
  });

  checkbox = document.querySelectorAll(".form-check-input");
  checkbox.forEach((box) => {
    box.addEventListener("change", (e) => {
      const target = e.currentTarget.parentNode.children[0];
      const id = parseInt(target.getAttribute("id").split("-").at(-1));
      const item = myTodo.getItem(id);
      item.completed = e.currentTarget.checked;
      myTodo.onUpdate();
    });
  });
}

function createTemplateForToDoItem(item) {
  const itemElement = document.createElement("li");
  const itemCheckBox = document.createElement("input");
  const label = document.createElement("label");

  //adding classes
  let liClasses = "todo list-group-item d-flex align-items-center".split(" ");
  itemElement.classList.add(...liClasses);

  itemCheckBox.classList.add("form-check-input");

  let labelClassList = "ms-2 form-check-label".split(" ");
  label.classList.add(...labelClassList);

  //adding attributes
  itemCheckBox.setAttribute("type", "checkbox");
  itemCheckBox.setAttribute("id", `todo-${item.id}`);

  label.setAttribute("for", `todo-${item.id}`);
  if (item.completed) {
    itemCheckBox.setAttribute("checked", "checked");
  }

  //setting structure
  itemElement.append(itemCheckBox, label);

  //setting innerHTML code
  label.innerText = item.title;
  itemElement.innerHTML += `            
  <label class="ms-auto btn btn-danger btn-sm">
    <i class="bi-trash"> </i>
  </label>`;
  return itemElement;
}

function reload(condition = "all") {
  toDoUl.innerHTML = "";
  loadToDo(condition);
}

window.addEventListener("load", (e) => reload());
