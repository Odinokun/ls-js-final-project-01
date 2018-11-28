// инклюдим js файлы
import { loadRepository } from './js/load';

import repositoriesFn from './hbs/github-rep.hbs';

// инклюдим scss файл
import './style.scss';

// основная аватарка
const ava = document.getElementById('github-header__ava-img');
// имя юзера
const userName = document.getElementById('github-header__title-name');
// общее кол-во репозиториев
const allRepo = document.getElementById('github-title__title--all');
// левая колонка
const leftColumn = document.getElementById('github-body__left');

loadRepository()
    .then(repositoriesArray => {
        // объявляем основную аватарку
        ava.src = repositoriesArray[0].owner.avatar_url;
        // объявляем логин юзера
        userName.innerText = repositoriesArray[0].owner.login;
        // объявляем общее кол-во репозиториев
        allRepo.innerText = repositoriesArray.length;
        // заполняем через цикл данные каждого репозитория
        leftColumn.innerHTML = repositoriesFn({ repositoriesList: repositoriesArray });
    });
