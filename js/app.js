const form = document.querySelector('form')
const input = document.querySelector('.input-api');
const dropdown = document.querySelector('.dropdown');
const containerRepositores = document.querySelector('.render-repositores');

function debounce(fn, debounceTime) {
    let timer = 0;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, debounceTime);
    };
}

async function getRepositories() {
    const query = input.value.trim();

    if (query.length === 0) {
        dropdown.style.display = 'none';
        return;
    };

    try {
        const res = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
        const data = await res.json();
        const response = data.items;

        dropdown.innerHTML = '';
        
        response.forEach(element => {
            const li = document.createElement('li');
            li.textContent = element.name;
            li.addEventListener('click', function(e) {
                input.value = '';
                dropdown.style.display = 'none';
            })
            dropdown.appendChild(li);
        });
        dropdown.style.display = 'block';   
    }
    catch (error) {
        console.error('Произошла ошибка:', error);
    }
};

function renderRepositoryForm(repoName) {
    const item = document.createElement('div');
    item.className = 'repository-item';

    const repository = document.createElement('div');
    repository.textContent = `Name: ${repoName}\nOwner: ${repoName}\nStarsr: ${123}`;

    const img = document.createElement('img');
    img.src = './img/delete.png';
    img.addEventListener('click', () => {
        item.remove(); 
    });

    item.appendChild(repository);
    item.appendChild(img);
    containerRepositores.appendChild(item);
    containerRepositores.style.display = 'flex';
}


const debouncedFetch = debounce(getRepositories, 300);

form.addEventListener('input', function (e) {
    e.preventDefault();
    debouncedFetch();
});

dropdown.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        const repoName = e.target.textContent;
        input.value = '';
        dropdown.style.display = 'none';
        renderRepositoryForm(repoName);
    }
});
