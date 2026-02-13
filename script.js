// СМЕНА ТЕМЫ
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

function setTheme(theme) {
    if(theme === "dark") {
        body.classList.add("dark__theme");
        body.classList.remove("light__theme");
        themeToggle.checked = true;
    } else {
        body.classList.remove("dark__theme");
        body.classList.add("light__theme");
        themeToggle.checked = false;
    }

    localStorage.setItem("theme", JSON.stringify(theme));
}

function toggleTheme() {
    const currentTheme = JSON.parse(localStorage.getItem("theme")) || [];
    const newTheme = currentTheme == 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

themeToggle.addEventListener('change', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
    const saveTheme = JSON.parse(localStorage.getItem("theme")) || [];
    setTheme(saveTheme);
})


// ОТКРЫТИЕ МОДАЛЬНОГО ОКНА ДОБАВЛЕНИЯ ФИЛЬМА

const openModalButton = document.querySelector(".nav__add__film__button");
const addFilmModalWrapper = document.querySelector(".add__film__modal__wrapper");
const closeModalButton = document.querySelector(".close__modal__button");
const editFilmModalButton = document.querySelector(".film__edit__modal__button");

openModalButton.addEventListener('click', () => {
    addFilmModalWrapper.classList.add("add__film__modal__wrapper__active");
    const modalTitle = document.querySelector('.modal__title');
     modalTitle.textContent = "Добавить фильм";
    document.querySelector(".film__input__name").value = "";
    document.querySelector(".film__select__type").value = "";
    document.querySelector(".film__input__series").value = "";
    document.querySelector(".film__input__season").value = "";
})

closeModalButton.addEventListener('click', () => {
    addFilmModalWrapper.classList.remove("add__film__modal__wrapper__active");
})

const films = JSON.parse(localStorage.getItem("films")) || [];
let currentFilms = [...films];
const tableBody = document.querySelector(".table__body");

//РЕНДЕР ОШИБОК

function renderError(message) {
    const errorWrapper = document.querySelector('.error__wrapper');
    const errorMessage = document.querySelector('.error__message');
    errorMessage.textContent = message;
    errorWrapper.classList.add("error__wrapper__active");
    setTimeout(() => {
        errorWrapper.classList.remove("error__wrapper__active");
        errorMessage.textContent = "";
    }, 2000)

}

//РЕНДЕР ТАБЛИЦЫ

function renderTable(table) {
    tableBody.innerHTML = "";

    table.forEach((film, index) => {
        const filmItem = document.createElement("tr");
        filmItem.classList.add("table__row");
        filmItem.dataset.index = index;
        if(film.isDone == true) {
            filmItem.classList.add("film__done")
        } else {
            filmItem.classList.remove("film__done")
        }

        if(film.season == "" && film.series == "") {
            film.series = "-";
            film.season = "-";
        }

        filmItem.innerHTML = `
            <td class="film__name">
                ${film.name}
            </td>
            <td class="film__type">
                ${film.type}
            </td>
            <td class="film__season">
                ${film.season}
            </td>
            <td class="film__series">
                ${film.series}
            </td>
            <td class="film__add__date">
                ${new Date(film.timeCreate).toLocaleDateString()}
            </td>
            <td>
                <button class="film__done__button" data-index="${index}">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#141414" viewBox="0 0 24 24" >
                        <path d="M9 15.59 4.71 11.3 3.3 12.71l5 5c.2.2.45.29.71.29s.51-.1.71-.29l11-11-1.41-1.41L9.02 15.59Z"></path>
                    </svg>
                </button>
                <button class="film__delete__button" data-index="${index}">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#141414" viewBox="0 0 24 24" >
                        <path d="m7.76 14.83-2.83 2.83 1.41 1.41 2.83-2.83 2.12-2.12.71-.71.71.71 1.41 1.42 3.54 3.53 1.41-1.41-3.53-3.54-1.42-1.41-.71-.71 5.66-5.66-1.41-1.41L12 10.59 6.34 4.93 4.93 6.34 10.59 12l-.71.71z"></path>
                    </svg>
                </button>
                <button class="film__edit__button" data-index="${index}">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#141414" viewBox="0 0 24 24" >
                        <path d="M5 21h14c1.1 0 2-.9 2-2v-7h-2v7H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2"></path><path d="M7 13v3c0 .55.45 1 1 1h3c.27 0 .52-.11.71-.29l9-9a.996.996 0 0 0 0-1.41l-3-3a.996.996 0 0 0-1.41 0l-9.01 8.99A1 1 0 0 0 7 13m10-7.59L18.59 7 17.5 8.09 15.91 6.5zm-8 8 5.5-5.5 1.59 1.59-5.5 5.5H9z"></path>
                    </svg>
                </button>
        `
        tableBody.appendChild(filmItem);
    });
}

const addFilmButton = document.querySelector('.film__create__button');

// ДОБАВЛЕНИЕ ФИЛЬМА

const filmTypeSelect = document.querySelector('.film__select__type');
const seriesInput = document.querySelector('.film__input__series');
const seasonInput = document.querySelector('.film__input__season');

filmTypeSelect.addEventListener('change', () => {
  if (filmTypeSelect.value === 'Сериал') {
    seriesInput.removeAttribute('disabled'); 
    seasonInput.removeAttribute('disabled');
  } else {
    seriesInput.setAttribute('disabled', 'disabled'); 
    seasonInput.setAttribute('disabled', 'disabled');
  }
});

addFilmButton.addEventListener('click', () => {
    const filmName = document.querySelector('.film__input__name').value.trim();
    const filmType = filmTypeSelect.value;
    const filmSeries = seriesInput.value.trim();
    const filmSeason = seasonInput.value.trim();
    
    if(!filmName) {
        renderError("Введите название!");
        return;
    }

    const filmItem = {
        name: filmName,
        type: filmType,
        series: filmSeries,
        season: filmSeason,
        timeCreate: Date.now(),
        isDone: false,
    };

    films.push(filmItem);
    localStorage.setItem('films', JSON.stringify(films));
    renderTable(films);
    addFilmModalWrapper.classList.remove('add__film__modal__wrapper__active');
});

// УДАЛЕНИЕ ФИЛЬМА

tableBody.addEventListener('click', (e) => {
    const deleteFilmButton = e.target.closest('.film__delete__button');
    if(!deleteFilmButton) return;
    const index = deleteFilmButton.dataset.index;
    films.splice(index, 1);
    localStorage.setItem("films", JSON.stringify(films));
    renderTable(films)
})

// СТАТУС ПРОСМОТРЕННО

tableBody.addEventListener('click', (e) => {
    const filmDoneButton = e.target.closest(".film__done__button");

    if(!filmDoneButton) return;
    const index = filmDoneButton.dataset.index;

    films[index].isDone = !films[index].isDone;
    films[index].timeCreate = Date.now();

    localStorage.setItem("films", JSON.stringify(films));
    renderTable(films);
})

// РЕДАКТИРОВАНИЕ ФИЛЬМА

tableBody.addEventListener('click', (e) => {
    const modalTitle = document.querySelector('.modal__title');
    const editButton = e.target.closest(".film__edit__button");
    if(!editButton) return;
    const index = editButton.dataset.index;
    const currentFilm = films[index];

    console.log(currentFilm);
    addFilmModalWrapper.classList.add("add__film__modal__wrapper__active");
    

    modalTitle.textContent = "Редактирование"
    document.querySelector(".film__input__name").value = currentFilm.name;
    document.querySelector(".film__select__type").value = currentFilm.type;
    document.querySelector(".film__input__series").value = currentFilm.series;
    document.querySelector(".film__input__season").value = currentFilm.season;
    
    window.currentEditIndex = index;
    
})

function saveEditFilms() {

    let filmName = document.querySelector('.film__input__name').value.trim();
    let filmSeries = seriesInput.value.trim();
    let filmType = filmTypeSelect.value;
    let filmSeason = seasonInput.value.trim();


        films[window.currentEditIndex] = {
        ...films[window.currentEditIndex],
        name: filmName,
        type: filmType,
        series: filmSeries,
        season: filmSeason,
    }

    localStorage.setItem("films", JSON.stringify(films));
    renderTable(films);

    addFilmModalWrapper.classList.remove('add__film__modal__wrapper__active');
    window.currentEditIndex = undefined; 
}

editFilmModalButton.addEventListener('click', saveEditFilms);

// ФИЛЬТРАЦИЯ МАССИВА

const selectFilter = document.querySelector('.sort__select');
const searchInput = document.querySelector(".search__film");

function sortNSearch() {
    const type = selectFilter.value;
    let result = [...films];

    if(type === "Просмотренные") {
        result = result.filter(el => el.isDone === true);
    } else {
        switch(type) {
            case "Тип":
                result.sort((a,b) => {
                    return b.type?.toLowerCase()?.localeCompare(a.type?.toLowerCase() || 0)
                }) 
                break
            case "Название":
                result.sort((a,b) => {
                    return a.name?.toLowerCase()?.localeCompare(b.name?.toLowerCase() || 0)
                })
                break
            case "Дата добавления":
                result.sort((a,b) => {
                    return new Date(a.timeCreate).getTime() - new Date(b.timeCreate).getTime()
                })
                break
        }
    }

    const query = document.querySelector(".search__film").value.trim().toLowerCase();

    if (query) {
    result = result.filter(film => 
      film.name?.toLowerCase().includes(query) ||
      film.type?.toLowerCase().includes(query)
    );
  }

    currentFilms = result;
    renderTable(currentFilms);
}

selectFilter.addEventListener('change', sortNSearch);
searchInput.addEventListener('input', sortNSearch);

// ФИНАЛЬНЫЙ РЕНДЕР

renderTable(films);