const API_KEY = '257654f35e3dff105574f97fb4b97035';
const BASE_URL = 'https://api.themoviedb.org/3';

function performSearch(query) {
    fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '';

            data.results.forEach(item => {
                if (item.media_type === 'movie' || item.media_type === 'tv') {
                    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'placeholder.jpg';
                    resultsContainer.innerHTML += `
                        <div class="col">
                            <div class="card h-100">
                                <img src="${poster}" class="card-img-top" alt="${item.title || item.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title || item.name}</h5>
                                    <p class="card-text">${item.overview.substring(0, 100)}...</p>
                                    <a href="details.html?id=${item.id}&type=${item.media_type}" class="btn btn-primary">View Details</a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        document.getElementById('search-input').value = query;
        performSearch(query);
    }

    document.getElementById('search-button').addEventListener('click', () => {
        const searchQuery = document.getElementById('search-input').value;
        if (searchQuery) {
            performSearch(searchQuery);
        }
    });

    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchQuery = document.getElementById('search-input').value;
            if (searchQuery) {
                performSearch(searchQuery);
            }
        }
    });
});
