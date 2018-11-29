function loadRepository() {
    return new Promise((resolve) => {
        fetch('https://api.github.com/users/odinokun/repos?per_page=100')
            .then(response => {
                if (response.status >= 400) {
                    return Promise.reject();
                }

                return response.json()
            })
            .then(data => {
                resolve(data);
            })
            .catch(() => {
                console.log('ERROR');
            })
    });
}

// сортировка массива
function sortArr(arr) {
    arr.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }

        return 0;
    });
}

// фильтрация
function isMatching(full, chunk) {
    chunk = new RegExp(chunk, 'i');
    let res = full.match(chunk);

    return res !== null;
}

export {
    loadRepository,
    sortArr,
    isMatching
}