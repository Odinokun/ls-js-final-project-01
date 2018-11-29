// инклюдим js файлы
import { loadRepository } from './js/load';
// import { test } from './js/add-remove';

import repositoriesFn from './hbs/github-rep.hbs';

// инклюдим scss файл
import './style.scss';

// основная аватарка
const ava = document.getElementById('github-header__ava-img');
// имя юзера
const userName = document.getElementById('github-header__title-name');
// общее кол-во репозиториев
const allRepo = document.getElementById('github-title__title--all');
// тело репозиториев
const bodyRep = document.getElementById('github-body');
// левая колонка
const leftColumn = document.getElementById('github-body__left');
// правая колонка
const rightColumn = document.getElementById('github-body__right');
// массивы для левой и правой колонки
let leftArray = [];
let rightArray = [];

loadRepository()
    .then(data => {
        // объявляем основную аватарку
        ava.src = data[0].owner.avatar_url;
        // объявляем логин юзера
        userName.innerText = data[0].owner.login;
        // объявляем общее кол-во репозиториев
        allRepo.innerText = data.length;
        // заполняем через цикл данные каждого репозитория
        leftColumn.innerHTML = repositoriesFn({ repositoriesList: data });

        return data;
    })
    .then(data => {

        leftArray = data;

        leftColumn.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                const tar = e.target.parentElement; // цель клика
                const dataId = Number(tar.getAttribute('data-id')); // data-id клика

                // идентификация объекта в массиве по data-id
                const index = leftArray.findIndex(obj => obj.id === dataId);

                // вырезаем объект из массива
                let removed = leftArray.splice(index, 1);

                // Добавляем вырезанный элемент в правый массив
                rightArray = rightArray.concat(removed);

                // рендерим оба списка
                leftColumn.innerHTML = repositoriesFn({ repositoriesList: leftArray });
                rightColumn.innerHTML = repositoriesFn({ repositoriesList: rightArray });
            }
        });

    });