'use strict';

const inputText = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const cocktailsList = document.querySelector('.js-results');
const listFavorites = document.querySelector('.js-favs');
let cocktailsDataList = [];
let listDataFavorites = [];

const cocktailsStored = JSON.parse(localStorage.getItem('cocktails'));
if(cocktailsStored) {
  cocktailsDataList = cocktailsStored;
  renderListFavorites(listDataFavorites);
}

//Fetch pinta margaritas por defecto
fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita')
  .then((response) => response.json())
  .then((data) => {
    cocktailsDataList = data.drinks;
    renderCocktailList(cocktailsDataList);
  });


//pintar todos los elementos
function renderCocktailList(cocktailsDataList) {
  cocktailsList.innerHTML = 'Resultados';
  
  for (const cocktail of cocktailsDataList) {
    cocktailsList.innerHTML += renderCocktail(cocktail);
    console.log(cocktail.currentTarget);
    /* const selectedCocktail = cocktailsDataList.find(cocktail => cocktail.idDrink === cocktail.currentTarget.id);
    const selectedFavorite = listDataFavorites.find(cocktail =>cocktail.strDrink === cocktail.currentTarget.id);
    if(selectedFavorite === selectedCocktail) {
      cocktail.classList.add('selected');
    } */
  }
  addEventToCocktail();
}

//pintar elementos favoritos
function renderListFavorites(listDataFavorites) {
  listFavorites.innerHTML = 'Favoritos';
  for (const cocktail of listDataFavorites) {
    listFavorites.innerHTML += renderCocktail(cocktail);
  }
}


//pintar un elemento de la lista
function renderCocktail(cocktail) {
  let html =
  `<li class="js-li-cocktails title-drink" id=${cocktail.idDrink} > ${cocktail.strDrink}
    <img src= ${cocktail.strDrinkThumb || 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV'}  alt= "foto cocktail" class= "img-drink"/></li>`;
  return html;
  /* const liElement = document.createElement('li');
  liElement.getAttribute('class', 'js-li-cocktails title-drink');
  liElement.getAttribute('id', cocktail.idDrink);
  const liContent = document.createTextNode(cocktail.strDrink);
  const imgElement = document.createElement('img');
  imgElement.getAttribute('src', "cocktail.strDrinkThumb || 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV'");
  imgElement.getAttribute('alt', 'foto cocktail');
  imgElement.getAttribute('class', 'img-drink');
  liElement.appendChild(liContent);
  liElement.appendChild(imgElement);

  return liElement; */
}

//Botón de reset
function handleResetClick() {
  cocktailsList.innerHTML = 'Resultados';
  listFavorites.innerHTML = 'Favoritos';
  inputText.value = '';
}

//función seleccionar cocktail y añadir a fav
function handleLiClick(ev) {
  ev.currentTarget.classList.toggle('selected');
  const idSelected = ev.currentTarget.id;
  const selectedCocktail = cocktailsDataList.find(cocktail => cocktail.idDrink === idSelected);
  //comprobar si ya existe el fav y sino añadirlo
  const indexCocktail = listDataFavorites.findIndex(cocktail => cocktail.idDrink === idSelected);
  if(indexCocktail === -1) {
    listDataFavorites.push(selectedCocktail);
  } else { //si esta en el listado de favoritos, eliminalo
    listDataFavorites.splice(indexCocktail, 1);
  }
  renderListFavorites(listDataFavorites);
  localStorage.setItem('cocktails', JSON.stringify(listDataFavorites));

  
}

//clickar sobre el cocktail de resultados
function addEventToCocktail() {
  const liElementsList = document.querySelectorAll('.js-li-cocktails');
  for (const li of liElementsList) {
    li.addEventListener('click', handleLiClick);
  }
}

//Busca entre todos los cocktails
function handleSearchClick() {
  const url = `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputText.value}`;

  fetch(url).then((response) => response.json())
    .then((data) => {
      cocktailsDataList = data.drinks;
      renderCocktailList(cocktailsDataList);
    }
    );
}

//función enter
function handleEnterInput(ev) {
  if(ev.key === 'Enter') {
    handleSearchClick();
    ev.preventDefault();
  }
}


btnSearch.addEventListener('click', handleSearchClick);
btnReset.addEventListener('click', handleResetClick);
inputText.addEventListener('keydown', handleEnterInput);
