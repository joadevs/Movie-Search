document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '928e853de232fafe14c834c4fc0281b9';
    const apiReadAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjhlODUzZGUyMzJmYWZlMTRjODM0YzRmYzAyODFiOSIsInN1YiI6IjY2NmQ5ZGZkZjUyOWM2NGM3YWFmYmY5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IUreXT2ldkZR3S4ZMEy0vneXlQNwAh8gJWdtuaW9kdE';

    const movieContainer = document.getElementById('movie-container');
    const languageSelect = document.getElementById('language-select');
    const advancedSearchForm = document.getElementById('advanced-search-form');
    const genreSelect = document.getElementById('genre-select');
    const yearInput = document.getElementById('year-input');
    const popularityInput = document.getElementById('popularity-input');

    let currentLanguage = 'en-US';

    const translations = {
        'en-US': {
            'advancedSearchTitle': 'Advanced Search',
            'genreLabel': 'Genre:',
            'yearLabel': 'Year:',
            'popularityLabel': 'Popularity:',
            'searchButton': 'Search',
            'default': 'Title not available in English'
        },
        'es-ES': {
            'advancedSearchTitle': 'Búsqueda Avanzada',
            'genreLabel': 'Género:',
            'yearLabel': 'Año:',
            'popularityLabel': 'Popularidad:',
            'searchButton': 'Buscar',
            'default': 'Título no disponible en Español'
        },
        'pt-BR': {
            'advancedSearchTitle': 'Pesquisa Avançada',
            'genreLabel': 'Gênero:',
            'yearLabel': 'Ano:',
            'popularityLabel': 'Popularidade:',
            'searchButton': 'Pesquisar',
            'default': 'Título não disponível em Português'
        }
    };

    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        translatePage(currentLanguage);
        loadGenres(); // Recargar géneros cuando cambia el idioma
    });

    advancedSearchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchMovies();
    });

    function translatePage(language) {
        document.getElementById('advanced-search-title').textContent = translations[language].advancedSearchTitle;
        document.getElementById('genre-label').textContent = translations[language].genreLabel;
        document.getElementById('year-label').textContent = translations[language].yearLabel;
        document.getElementById('popularity-label').textContent = translations[language].popularityLabel;
        document.getElementById('search-button').textContent = translations[language].searchButton;
    }

    function loadGenres() {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${currentLanguage}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                genreSelect.innerHTML = '<option value="">Select Genre</option>'; // Limpiar el select y agregar una opción por defecto
                data.genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching genres:', error);
            });
    }

    function searchMovies() {
        const genre = genreSelect.value;
        const year = yearInput.value;
        const popularity = popularityInput.value;

        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&primary_release_year=${year}&sort_by=popularity.desc&language=${currentLanguage}`;

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
                console.error('Error fetching movies:', error);
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
                    <p>${movie.release_date}</p>
                    <p>${movie.popularity}</p>
                </div>
            `;

            movieElement.addEventListener('click', () => showMovieDetails(movie));
            movieContainer.appendChild(movieElement);
        });
    }

    function showMovieDetails(movie) {
        // Traducir la descripción de la película
        const url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=${currentLanguage}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const modal = document.getElementById('movie-modal');
                modal.style.display = 'flex';

                document.getElementById('modal-title').textContent = data.title;
                document.getElementById('modal-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
                document.getElementById('modal-release-date').textContent = `Release Date: ${data.release_date}`;
                document.getElementById('modal-popularity').textContent = `Popularity: ${data.popularity}`;
                document.getElementById('modal-overview').textContent = data.overview;
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
            });

        const closeModal = document.querySelector('.close');
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('movie-modal');
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            const modal = document.getElementById('movie-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Inicializar página con las traducciones iniciales y cargar géneros
    translatePage(currentLanguage);
    loadGenres();
});
