const API_KEY = '257654f35e3dff105574f97fb4b97035';
const BASE_URL = 'https://api.themoviedb.org/3';

function fetchMoviesOrSeries(endpoint, containerId) {
    fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(`#${containerId} .slider`);
            data.results.forEach(item => {
                const poster = `https://image.tmdb.org/t/p/w300${item.poster_path}`;
                const type = endpoint.includes('movie') ? 'movie' : 'tv';
                container.innerHTML += `
                    <div class="movie-item">
                        <a href="details.html?id=${item.id}&type=${type}">
                            <img src="${poster}" alt="${item.title || item.name}" class="img-fluid rounded">
                            <div class="movie-info">
                                <h3>${item.title || item.name}</h3>
                                <p>Rating: ${item.vote_average}/10</p>
                            </div>
                        </a>
                    </div>
                `;
            });
            $(`#${containerId} .slider`).slick({
                slidesToShow: 5,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                dots: true,
                arrows: true,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMoviesOrSeries('/movie/popular', 'popular-movies');
    fetchMoviesOrSeries('/movie/now_playing', 'latest-movies');
    fetchMoviesOrSeries('/tv/on_the_air', 'latest-series');
    fetchMoviesOrSeries('/tv/popular', 'popular-series');

    // Animate hero section
    gsap.from('.hero-content', {duration: 1, y: 50, opacity: 0, ease: 'power3.out'});

    // Animate section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top bottom-=100',
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    });
});
