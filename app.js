console.log("Js Connected");
const form = document.querySelector("form");
const showErrorMsg = document.getElementById("error-msg");
const todoList = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");
const successNotification = document.getElementById("liveToast");
document.addEventListener("DOMContentLoaded", getInputs);
// error message will be none in begining
showErrorMsg.style.display = "none";

// id of local storage
let localStorageId = 0;

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("Inputs");
  todoList.remove();
});

let date = new Date().toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// Form funtionality
form.addEventListener("submit", submitHandler);
function submitHandler(e) {
  e.preventDefault();
  try {
    if (form.input.value === "") {
      showErrorMsg.style.display = "";
      showErrorMsg.innerText = "Input can't be empty";
      e.stopPropagation();
    } else if (form.input.value.length <= 4) {
      showErrorMsg.style.display = "";
      showErrorMsg.innerText = "Length must be greater than 4";
      e.stopPropagation();
    } else {
      showErrorMsg.style.display = "none";
      form.classList.add("was-validated");

      const inputVal = form.input.value;
      localStorageId += 1;
      const object = {
        Id: localStorageId,
        input: inputVal,
        date: date,
        isCompleted: false,
      };
      storeInput(object);
      form.input.value = "";
      todoList.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-start" id="li-${
      object.Id
    }"> 
    ${object.Id}
                      <div class="ms-2 me-auto">
                        <div class="fw-bold  ${
                          object.isCompleted
                            ? "text-decoration-line-through"
                            : ""
                        }"  id="${object.Id}">${object.input}</div>
                        <span class="small " id="todo-date">${
                          object.date
                        }</span>
                      </div>
                      <div class="btn-group" role="group" aria-label="Basic example">
                         ${
                           inputVal.isCompleted
                             ? `<button type="button" class="btn btn-warning" id="complete-todo" onclick="unCompleteTodo(${inputVal.Id})"><i class="bi bi-arrow-counterclockwise"></i></button>`
                             : `<button type="button" class="btn btn-success" id="complete-todo" onclick="completeTodo(${inputVal.Id})"><i class="bi bi-check-lg"></i></button>`
                         }
                        <button type="button" class="btn btn-danger" id="delete-todo" onClick="deleteTodo(${
                          object.Id
                        })"><i class="bi bi-trash-fill"></i></button>
                      </div>
                    </li>
    `;
      const toast = new bootstrap.Toast(successNotification);
      toast.show();
      window.location.reload()
    }
  } catch (error) {
    console.log(error);
  }
}

// function for storing input in local storage
function storeInput(inputVal) {
  let array = [];
  if (localStorage.length <= 0) {
    localStorage.setItem("Inputs", JSON.stringify(array));
  }
  array = JSON.parse(localStorage.getItem("Inputs"));
  array.forEach((element) => {
    if (inputVal.Id === element.Id) {
      inputVal.Id = element.Id + 1;
    }
  });
  array.push(inputVal);
  localStorage.setItem("Inputs", JSON.stringify(array));
  document.addEventListener("load", getInputs);
}

// function for retreving the data on page

function getInputs() {
  let myInputs;
  if (localStorage.length <= 0) {
    console.log("There is no input yet");
  } else {
    myInputs = JSON.parse(localStorage.getItem("Inputs"));
    myInputs.forEach((indivisualInputs) => {
      todoList.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-start" id="li-${
      indivisualInputs.Id
    }">
                    ${indivisualInputs.Id}
                      <div class="ms-2 me-auto">
                        <div class="fw-bold  ${
                          indivisualInputs.isCompleted
                            ? "text-decoration-line-through"
                            : ""
                        }"  id="${indivisualInputs.Id}">${
        indivisualInputs.input
      }</div>
                        <span class="small " id="todo-date">${
                          indivisualInputs.date
                        }</span>
                      </div>
                      <div class="btn-group" role="group" aria-label="Basic example">
                      ${
                        indivisualInputs.isCompleted
                          ? `<button type="button" class="btn btn-warning fw-bold" id="complete-todo" onclick="unCompleteTodo(${indivisualInputs.Id})"><i class="bi bi-arrow-counterclockwise"></i></button>`
                          : `<button type="button" class="btn btn-success" id="complete-todo" onclick="completeTodo(${indivisualInputs.Id})"><i class="bi bi-check-lg"></i></button>`
                      }
                        
                        <button type="button" class="btn btn-danger" id="delete-todo" onClick="deleteTodo(${
                          indivisualInputs.Id
                        })"><i class="bi bi-trash-fill"></i></button>
                      </div>
                    </li>
    `;
    });
  }
}

function completeTodo(localStorageId) {
  try {
    console.log(localStorageId);
    let todoarray = [];
    todoarray = JSON.parse(localStorage.getItem("Inputs"));
    todoarray.forEach((inputs) => {
      if (localStorageId === inputs.Id) {
        inputs.isCompleted = true;
      }
    });
    localStorage.setItem("Inputs", JSON.stringify(todoarray));
    const todo = document.getElementById(`${localStorageId}`);
    todo.classList.add("text-decoration-line-through");
    window.location.reload();
  } catch (error) {
    console.error("Error completing todo:", error);
  }
}

function unCompleteTodo(localStorageId) {
  try {
    let todoArray = [];
    todoArray = JSON.parse(localStorage.getItem("Inputs"));
    todoArray.forEach((todo) => {
      if (localStorageId === todo.Id) {
        todo.isCompleted = !todo.isCompleted;
      }
    });
    localStorage.setItem("Inputs", JSON.stringify(todoArray));
    const todo = document.getElementById(`${localStorageId}`);
    todo.classList.remove("text-decoration-line-through");
    window.location.reload();
  } catch (error) {
    console.error("Error uncompleting todo:", error);
  }
}

function deleteTodo(localStorageId) {
  try {
    let todoArray = JSON.parse(localStorage.getItem("Inputs"));
    let todoIndex = todoArray.findIndex((todo) => todo.Id === localStorageId);

    if (todoIndex !== -1) {
      todoArray.splice(todoIndex, 1);
      localStorage.setItem("Inputs", JSON.stringify(todoArray));

      const todoElement = document.getElementById(`li-${localStorageId}`);
      if (todoElement) {
        todoElement.remove(); // Remove the element directly
      }
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}
