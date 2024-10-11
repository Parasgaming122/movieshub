const API_KEY = '257654f35e3dff105574f97fb4b97035';
const BASE_URL = 'https://api.themoviedb.org/3';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type');

function createVideoPlayer(id, season = null, episode = null) {
    const videoPlayer = document.getElementById('video-player');
    let embedUrl = '';

    if (type === 'movie') {
        embedUrl = `https://vidbinge.dev/embed/movie/${id}`;
    } else if (type === 'tv' && season && episode) {
        embedUrl = `https://vidbinge.dev/embed/tv/${id}/${season}/${episode}`;
    } else {
        console.error('Invalid parameters for video player');
        return;
    }

    videoPlayer.innerHTML = `
        <iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
    `;
}

function fetchDetails() {
    fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            document.title = `Cinematic Hub - ${data.title || data.name}`;
            document.getElementById('title').textContent = data.title || data.name;
            document.getElementById('tagline').textContent = data.tagline;
            document.getElementById('overview').textContent = data.overview;
            document.getElementById('poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
            document.getElementById('details-hero').style.backgroundImage = `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;

            if (type === 'movie') {
                document.getElementById('release-date').textContent = data.release_date;
                document.getElementById('runtime').textContent = `${data.runtime} minutes`;
                document.getElementById('tv-details').style.display = 'none';
            } else {
                document.getElementById('first-air-date').textContent = data.first_air_date;
                document.getElementById('number-of-seasons').textContent = data.number_of_seasons;
                document.getElementById('number-of-episodes').textContent = data.number_of_episodes;
                document.getElementById('movie-details').style.display = 'none';
                fetchSeasons(data.number_of_seasons);
            }

            document.getElementById('genres').textContent = data.genres.map(genre => genre.name).join(', ');

            document.getElementById('play-button').addEventListener('click', () => {
                if (type === 'movie') {
                    createVideoPlayer(id);
                } else {
                    // For TV shows, play the first episode of the first season by default
                    createVideoPlayer(id, 1, 1);
                }
            });

            fetchSimilar();
        })
        .catch(error => console.error('Error:', error));
}

function fetchSeasons(numberOfSeasons) {
    const seasonsDropdown = document.getElementById('seasons-dropdown');
    seasonsDropdown.innerHTML = `
        <select class="form-select" id="season-select">
            ${Array.from({length: numberOfSeasons}, (_, i) => `<option value="${i+1}">Season ${i+1}</option>`).join('')}
        </select>
    `;

    document.getElementById('season-select').addEventListener('change', (e) => {
        fetchEpisodes(e.target.value);
    });

    fetchEpisodes(1);
}

function fetchEpisodes(seasonNumber) {
    fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const episodesList = document.getElementById('episodes-list');
            episodesList.innerHTML = data.episodes.map(episode => `
                <div class="col">
                    <div class="card h-100">
                        <img src="https://image.tmdb.org/t/p/w300${episode.still_path}" class="card-img-top" alt="${episode.name}">
                        <div class="card-body">
                            <h5 class="card-title">${episode.episode_number}. ${episode.name}</h5>
                            <p class="card-text">${episode.overview}</p>
                            <button class="btn btn-primary play-episode" data-season="${seasonNumber}" data-episode="${episode.episode_number}">Play Episode</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add event listeners to play episode buttons
            document.querySelectorAll('.play-episode').forEach(button => {
                button.addEventListener('click', (e) => {
                    const season = e.target.dataset.season;
                    const episode = e.target.dataset.episode;
                    createVideoPlayer(id, season, episode);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchSimilar() {
    fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('#similar .slider');
            data.results.forEach(item => {
                const poster = `https://image.tmdb.org/t/p/w300${item.poster_path}`;
                container.innerHTML += `
                    <div class="movie-item">
                        <a href="details.html?id=${item.id}&type=${type}">
                            <img src="${poster}" alt="${item.title || item.name}" class="img-fluid rounded">
                        </a>
                        <div class="movie-info">
                            <h3>${item.title || item.name}</h3>
                            <p>Rating: ${item.vote_average}/10</p>
                        </div>
                    </div>
                `;
            });
            $('#similar .slider').slick({
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
    fetchDetails();

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
