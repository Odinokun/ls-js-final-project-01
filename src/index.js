// инклюдим js файлы
import { loadRepository, sortArr, isMatching } from './js/funcs';

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
// правая колонка
const rightColumn = document.getElementById('github-body__right');
// левый фильтр
const leftFilter = document.getElementById('github-filter__left');
const leftFilterVal = leftFilter.value;
// правый фильтр
const rightFilter = document.getElementById('github-filter__right');
const rightFilterVal = rightFilter.value;

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

        // массивы для левой и правой колонки
        let leftArray = data;
        let rightArray = [];

        // обработали клик на левом списке
        // leftColumn.addEventListener('click', handler.bind(null, left, right));
        leftColumn.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                const tar = e.target.parentElement; // цель клика
                const dataId = Number(tar.getAttribute('data-id')); // data-id клика

                // // идентификация объекта в массиве по data-id
                // const index = leftArray.findIndex(obj => obj.id === dataId);
                // // вырезаем объект из массива
                // let removed = leftArray.splice(index, 1);
                //
                // // Добавляем вырезанный элемент в правый массив
                // rightArray = rightArray.concat(removed);

                // переносим репу вправо
                leftToRight(dataId);
                // обновляем инфу
                newInfo();
            }
        });

        // обработали клик на правом списке
        rightColumn.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                const tar = e.target.parentElement; // цель клика
                const dataId = Number(tar.getAttribute('data-id')); // data-id клика

                // переносим репу влево
                rightToLeft(dataId);
                // обновляем инфу
                newInfo();
            }
        });

        makeDnD([leftColumn, rightColumn]);
        function makeDnD(zones) {
            let currentDrag;

            zones.forEach(zone => {
                zone.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/html', 'dragstart');
                    currentDrag = { source: zone, node: e.target };
                });

                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                zone.addEventListener('drop', (e) => {
                    if (currentDrag) {
                        e.preventDefault();

                        // console.log('event', currentDrag.node);

                        if (currentDrag.source !== zone) {
                            zone.insertBefore(currentDrag.node, zone.lastElementChild);
                            // перетаскиваемый элемент
                            const tar = currentDrag.node;
                            // data-id перетаскиваемого элемента
                            const dataId = Number(tar.getAttribute('data-id'));

                            if (zone.classList.contains('github-body__right')) {
                                leftToRight(dataId);
                            } else if (zone.classList.contains('github-body__left')) {
                                rightToLeft(dataId);
                            }
                            // обновляем инфу
                            newInfo();
                        }
                        currentDrag = null;
                    }
                });
            })
        }

        function leftToRight(id) {
            // идентификация объекта в массиве по data-id
            const index = leftArray.findIndex(obj => obj.id === id);
            // вырезаем объект из массива
            let removed = leftArray.splice(index, 1);

            // Добавляем вырезанный элемент в правый массив
            rightArray = rightArray.concat(removed);
        }

        function rightToLeft(id) {
            // идентификация объекта в массиве по data-id
            const index = rightArray.findIndex(obj => obj.id === id);
            // вырезаем объект из массива
            let removed = rightArray.splice(index, 1);

            // Добавляем вырезанный элемент в правый массив
            leftArray = leftArray.concat(removed);
        }

        function newInfo() {
            sortArr(leftArray);
            sortArr(rightArray);
            // обновляем общее кол-во репозиториев
            allRepo.innerText = leftArray.length;
            // рендерим оба списка заново
            leftColumn.innerHTML = repositoriesFn({ repositoriesList: leftArray });
            rightColumn.innerHTML = repositoriesFn({ repositoriesList: rightArray });
        }
    });

