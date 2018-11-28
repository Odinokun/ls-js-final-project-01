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

export {
    loadRepository
}