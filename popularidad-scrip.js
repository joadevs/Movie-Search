document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '928e853de232fafe14c834c4fc0281b9';
    const endpoint = 'https://api.themoviedb.org/3/movie/popular';

    const movieContainer = document.getElementById('movie-container');
    const languageSelect = document.getElementById('language-select');

    let currentLanguage = 'en-US';

    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        fetchPopularMovies();
    });

    function fetchPopularMovies() {
        const url = `${endpoint}?api_key=${apiKey}&language=${currentLanguage}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayMovies(data.results);
            })
            .catch(error => {
                console.error('Error fetching popular movies:', error);
            });
    }

    function displayMovies(movies) {
        movieContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <p>Release Date: ${movie.release_date}</p>
                    <p>Popularity: ${movie.popularity}</p>
                </div>
            `;

            movieContainer.appendChild(movieElement);
        });
    }

    // Cargar películas populares al cargar la página
    fetchPopularMovies();
});
