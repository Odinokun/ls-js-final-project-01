// инклюдим js файлы
import { loadRepository } from './js/test';

import repositoriesFn from './hbs/github-rep.hbs';

// инклюдим scss файл
import './style.scss';

// основная аватарка
const ava = document.getElementById('github-header__ava-img');
// имя юзера
const userName = document.getElementById('github-header__title-name');
// бщее кол-во репозиториев
const allRepo = document.getElementById('github-title__title--all');
// левая колонка
const leftColumn = document.getElementById('github-body__left');

loadRepository()
    .then(function (repositoriesArray) {
        ava.src = repositoriesArray[0].owner.avatar_url;
        userName.innerText = repositoriesArray[0].owner.login;
        allRepo.innerText = repositoriesArray.length;

        const repositoriesHTML = repositoriesFn({repositoriesList: repositoriesArray});

        leftColumn.innerHTML = repositoriesHTML;

    });
