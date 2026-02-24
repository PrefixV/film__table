// ======================
// ТЕМА
// ======================

const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const lightIcon = document.querySelector('.light-icon');
const darkIcon = document.querySelector('.dark-icon');

function setTheme(theme) {
    if (theme === "dark") {
        body.classList.add("dark__theme");
        body.classList.remove("light__theme");
        darkIcon.classList.add("icon-active");
        lightIcon.classList.remove("icon-active");
        themeToggle.checked = true;
    } else {
        body.classList.remove("dark__theme");
        body.classList.add("light__theme");
        darkIcon.classList.remove("icon-active");
        lightIcon.classList.add("icon-active");
        themeToggle.checked = false;
    }
    localStorage.setItem("theme", JSON.stringify(theme));
}

themeToggle.addEventListener("change", () => {
    const currentTheme = JSON.parse(localStorage.getItem("theme")) || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
});

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = JSON.parse(localStorage.getItem("theme")) || "light";
    setTheme(savedTheme);
});

// ======================
// ДАННЫЕ
// ======================

let films = JSON.parse(localStorage.getItem("films")) || [];
let currentFilms = [...films];

const tableBody = document.querySelector(".table__body");

// ======================
// ПАГИНАЦИЯ
// ======================

let currentPage = 1;
const maxItemsPerPage = 10;

function getPaginatedData(data) {
    const startIndex = (currentPage - 1) * maxItemsPerPage;
    return data.slice(startIndex, startIndex + maxItemsPerPage);
}

function renderPagination(data) {
    const currentPageWrapper = document.querySelector(".current__page__wrapper");
    const prevBtn = document.querySelector(".prev__page__button");
    const nextBtn = document.querySelector(".next__page__wrapper");

    currentPageWrapper.innerHTML = "";

    const totalPages = Math.ceil(data.length / maxItemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.add("page__button");

        if (i === currentPage) {
            btn.classList.add("active__page");
        }

        btn.addEventListener("click", () => {
            currentPage = i;
            renderTable(currentFilms);
        });

        currentPageWrapper.appendChild(btn);
    }

    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(currentFilms);
        }
    };

    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable(currentFilms);
        }
    };
}

// ======================
// РЕНДЕР ТАБЛИЦЫ
// ======================

function renderTable(data) {
    tableBody.innerHTML = "";
    const paginatedData = getPaginatedData(data);
    const totalWatchMoviesWrapper = document.querySelector(".total__watch__movies");
    const totalWatch = films.filter(el => el.isDone == true);
    totalWatchMoviesWrapper.textContent = `Просмотренных: ${totalWatch.length}`;

    paginatedData.forEach((film) => {
        const tr = document.createElement("tr");
        tr.classList.add("table__row");
        tr.dataset.id = film.id;

        if (film.isDone) {
            tr.classList.add("film__done");
        }

        tr.innerHTML = `
            <td>${film.name}</td>
            <td>${film.type}</td>
            <td>${film.season || "-"}</td>
            <td>${film.series || "-"}</td>
            <td>${new Date(film.timeCreate).toLocaleDateString()}</td>
            <td>
                <button class="film__done__button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19L21 7l-1.4-1.4z"/></svg></button>
                <button class="film__delete__button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/></svg></button>
                <button class="film__edit__button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3.995 17.207V19.5a.5.5 0 0 0 .5.5h2.298a.5.5 0 0 0 .353-.146l9.448-9.448l-3-3l-9.452 9.448a.5.5 0 0 0-.147.353m10.837-11.04l3 3l1.46-1.46a1 1 0 0 0 0-1.414l-1.585-1.586a1 1 0 0 0-1.414 0z"/></svg></button>
            </td>
        `;

        tableBody.appendChild(tr);
    });

    renderPagination(data);
}

// ======================
// ДОБАВЛЕНИЕ
// ======================

const addFilmButton = document.querySelector('.film__create__button');
const openModalButton = document.querySelector(".nav__add__film__button");
const modalWrapper = document.querySelector(".add__film__modal__wrapper");
const closeModalButton = document.querySelector(".close__modal__button");

const filmTypeSelect = document.querySelector('.film__select__type');
const seriesInput = document.querySelector('.film__input__series');
const seasonInput = document.querySelector('.film__input__season');

openModalButton.addEventListener("click", () => {
    modalWrapper.classList.add("add__film__modal__wrapper__active");
});

closeModalButton.addEventListener("click", () => {
    modalWrapper.classList.remove("add__film__modal__wrapper__active");
});

filmTypeSelect.addEventListener("change", () => {
    if (filmTypeSelect.value === "Сериал") {
        seriesInput.disabled = false;
        seasonInput.disabled = false;
    } else {
        seriesInput.disabled = true;
        seasonInput.disabled = true;
    }
});

addFilmButton.addEventListener("click", () => {
    const name = document.querySelector('.film__input__name').value.trim();
    if (!name) return alert("Введите название");

    const newFilm = {
        id: Date.now().toString(),
        name,
        type: filmTypeSelect.value,
        series: seriesInput.value.trim(),
        season: seasonInput.value.trim(),
        timeCreate: Date.now(),
        isDone: false,
    };

    films.push(newFilm);
    localStorage.setItem("films", JSON.stringify(films));

    currentFilms = [...films];
    currentPage = 1;
    renderTable(currentFilms);

    modalWrapper.classList.remove("add__film__modal__wrapper__active");
});

// ======================
// УДАЛЕНИЕ / DONE / EDIT
// ======================

tableBody.addEventListener("click", (e) => {
    const row = e.target.closest(".table__row");
    if (!row) return;

    const id = row.dataset.id;
    const index = films.findIndex(f => f.id === id);
    if (index === -1) return;

    if (e.target.closest(".film__delete__button")) {
        films.splice(index, 1);
    }

    if (e.target.closest(".film__done__button")) {
        films[index].isDone = !films[index].isDone;
    }

    localStorage.setItem("films", JSON.stringify(films));
    sortNSearch();
});

// ======================
// СОРТИРОВКА И ПОИСК
// ======================

const selectFilter = document.querySelector('.sort__select');
const searchInput = document.querySelector(".search__film");

function sortNSearch() {
    const type = selectFilter.value;
    let result = [...films];

    if (type === "Просмотренные") {
        result = result.filter(f => f.isDone);
    }

    if (type === "Название") {
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (type === "Дата добавления") {
        result.sort((a, b) => b.timeCreate - a.timeCreate);
    }

    const query = searchInput.value.trim().toLowerCase();

    if (query) {
        result = result.filter(f =>
            f.name.toLowerCase().includes(query) ||
            f.type.toLowerCase().includes(query)
        );
    }

    currentFilms = result;
    currentPage = 1;
    renderTable(currentFilms);
}

selectFilter.addEventListener("change", sortNSearch);
searchInput.addEventListener("input", sortNSearch);

// ======================
// СТАРТ
// ======================

renderTable(currentFilms);