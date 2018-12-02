// инклюдим js файлы
import { loadRepository, sortArr } from './js/funcs';

import repositoriesFn from './hbs/github-rep.hbs';

// инклюдим scss файл
import './style.scss';

// основная аватарка
const ava = document.getElementById('github-header__ava-img');
// имя юзера
const userName = document.getElementById('github-header__title-name');
// общее кол-во репозиториев
const allRepo = document.getElementById('github-title__title--all');
// левая и правая колонка
const leftColumn = document.getElementById('github-body__left');
const rightColumn = document.getElementById('github-body__right');
// левый и правый фильтр
const leftFilter = document.getElementById('github-filter__left');
const rightFilter = document.getElementById('github-filter__right');
// кнопка сохранения
const saveBtn = document.getElementById('save-btn');

let storage = localStorage;

loadRepository()
    .then(data => {
        // массивы для левой и правой колонки
        let leftArray = data;
        let rightArray = [];

        if (localStorage.getItem('leftArrStorage') !== null) {
            leftArray = JSON.parse(localStorage['leftArrStorage']);
            rightArray = JSON.parse(localStorage['rightArrStorage']);
            newInfo();
        }

        // объявляем основную аватарку
        ava.src = data[0].owner.avatar_url;
        // объявляем логин юзера
        userName.innerText = data[0].owner.login;
        // объявляем общее кол-во репозиториев
        allRepo.innerText = leftArray.length;
        // заполняем через цикл данные каждого репозитория
        leftColumn.innerHTML = repositoriesFn({ repositoriesList: data });

        // обработали клик на левом списке
        leftColumn.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                const tar = e.target.parentElement; // цель клика
                const dataId = Number(tar.getAttribute('data-id')); // data-id клика

                leftToRight(dataId);
                newInfo();
                leftFilterFn();
                rightFilterFn();
            }
        });

        // обработали клик на правом списке
        rightColumn.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                const tar = e.target.parentElement; // цель клика
                const dataId = Number(tar.getAttribute('data-id')); // data-id клика

                rightToLeft(dataId);
                newInfo();
                leftFilterFn();
                rightFilterFn();
            }
        });

        makeDnD([leftColumn, rightColumn]);

        // функция Drag-N-Drop (HTML5 Api)
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
                            newInfo();
                            leftFilterFn();
                            rightFilterFn();
                        }
                        currentDrag = null;
                    }
                });
            })
        }
        // функция перемещения репа по клику
        function leftToRight(id) {
            // идентификация объекта в массиве по data-id
            const index = leftArray.findIndex(obj => obj.id === id);
            // вырезаем объект из массива
            let removed = leftArray.splice(index, 1);

            // Добавляем вырезанный элемент в правый массив
            rightArray = rightArray.concat(removed);
        }
        // функция перемещения репа по клику
        function rightToLeft(id) {
            // идентификация объекта в массиве по data-id
            const index = rightArray.findIndex(obj => obj.id === id);
            // вырезаем объект из массива
            let removed = rightArray.splice(index, 1);

            // Добавляем вырезанный элемент в правый массив
            leftArray = leftArray.concat(removed);
        }

        // функция самой фильтрации
        function isMatching(full, chunk) {
            chunk = new RegExp(chunk, 'i');
            let res = full.match(chunk);

            return res !== null;
        }
        // функция фильтрации левого списка
        function leftFilterFn() {
            let leftFilterVal = leftFilter.value;

            // если поле фильтра наполнено
            if (leftFilterVal.length > 0) {
                // получаем массив отфильтрованных репозиториев
                const filteredReposArr = leftArray.filter((repos) => {
                    return isMatching(repos.name, leftFilterVal);
                });

                // скрываем все элементы в колонке
                for (let i = 0; i < leftColumn.children.length; i++) {
                    leftColumn.children[i].classList.add('hidden');
                }

                // записали отобранный id
                filteredReposArr.forEach(repos => {
                    for (let i = 0; i < leftColumn.children.length; i++) {
                        let dataId = Number(leftColumn.children[i].getAttribute('data-id'));

                        if (repos.id === dataId ) {
                            leftColumn.children[i].classList.remove('hidden');
                        }
                    }
                });
            } else {
                for (let i = 0; i < leftColumn.children.length; i++) {
                    leftColumn.children[i].classList.remove('hidden');
                }
            }
        }
        // функция фильтрации правого списка
        function rightFilterFn() {
            let rightFilterVal = rightFilter.value;

            // если поле фильтра наполнено
            if (rightFilterVal.length > 0) {
                // получаем массив отфильтрованных репозиториев
                const filteredReposArr = rightArray.filter((repos) => {
                    return isMatching(repos.name, rightFilterVal);
                });

                // скрываем все элементы в колонке
                for (let i = 0; i < rightColumn.children.length; i++) {
                    rightColumn.children[i].classList.add('hidden');
                }

                // записали отобранный id
                filteredReposArr.forEach(repos => {
                    for (let i = 0; i < rightColumn.children.length; i++) {
                        let dataId = Number(rightColumn.children[i].getAttribute('data-id'));

                        if (repos.id === dataId ) {
                            rightColumn.children[i].classList.remove('hidden');
                        }
                    }
                });
            } else {
                for (let i = 0; i < rightColumn.children.length; i++) {
                    rightColumn.children[i].classList.remove('hidden');
                }
            }
        }

        leftFilter.addEventListener('keyup', () => {
            leftFilterFn();
        });

        rightFilter.addEventListener('keyup', () => {
            rightFilterFn();
        });

        // обновление информации
        function newInfo() {
            sortArr(leftArray);
            sortArr(rightArray);
            // обновляем общее кол-во репозиториев
            allRepo.innerText = leftArray.length;
            // рендерим оба списка заново
            leftColumn.innerHTML = repositoriesFn({ repositoriesList: leftArray });
            rightColumn.innerHTML = repositoriesFn({ repositoriesList: rightArray });
        }
        
        // сохранение в localStorage
        saveBtn.addEventListener('click', () => {
            localStorage['leftArrStorage'] = JSON.stringify(leftArray);
            localStorage['rightArrStorage'] = JSON.stringify(rightArray);
        })

    });

