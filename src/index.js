// инклюдим js файлы
import { loadRepository } from './js/test';

// инклюдим scss файл
import './style.scss';

// основная аватарка
const ava = document.getElementById('github-header__ava-img');
// имя юзера
const userName = document.getElementById('github-header__title-name');

// запускаем функции
// loadRepository();

loadRepository()
    .then(function (data) {
        ava.src = data[0].owner.avatar_url;
        userName.innerText = data[0].owner.login;
    });