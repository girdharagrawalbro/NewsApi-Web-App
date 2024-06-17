let debounceTimer;
let articles = [];
let currentPage = 1;
const articlesPerPage = 9;

const debounceFetchNews = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = document.getElementById('key').value;
        fetchNews(query);
    }, 500);
}

const fetchNews = async (query = 'india') => {
    var url = `https://newsapi.org/v2/everything?q=${query}&apiKey=97f07031f36d43cb964e88e97522cdee`;
    var data = await fetch(url);
    var parsedData = await data.json();
    articles = parsedData.articles;
    renderArticles();
    renderPagination();
}

const renderArticles = () => {
    let newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const currentArticles = articles.slice(start, end);

    currentArticles.forEach(article => {
        let newsCard = `
            <div class="card mb-3" style="width: 340px;">
                <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.description}</p>
                    <a href="${article.url}" class="btn btn-sm btn-primary" target="_blank">Read More</a>
                </div>
            </div>
        `;
        newsContainer.innerHTML += newsCard;
    });
}

const renderPagination = () => {
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}" id="previous-page">
            <a class="page-link" href="#">Previous</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `;
    }

    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}" id="next-page">
            <a class="page-link" href="#">Next</a>
        </li>
    `;

    document.querySelectorAll('.page-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.id === 'previous-page' && currentPage > 1) {
                currentPage--;
            } else if (item.id === 'next-page' && currentPage < totalPages) {
                currentPage++;
            } else if (!item.classList.contains('disabled') && !item.classList.contains('active')) {
                currentPage = parseInt(item.innerText);
            }
            renderArticles();
            renderPagination();
        });
    });
}

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let query = document.getElementById('key').value || 'india';
    fetchNews(query);
});

fetchNews();
