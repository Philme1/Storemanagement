
let element = document.getElementById("delete-btn");

const removeDiv = (e) => {
  e.target.parentElement.remove();
}

element.addEventListener("click", removeDiv)