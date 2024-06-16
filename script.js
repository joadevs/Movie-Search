document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '928e853de232fafe14c834c4fc0281b9';
    const apiReadAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjhlODUzZGUyMzJmYWZlMTRjODM0YzRmYzAyODFiOSIsInN1YiI6IjY2NmQ5ZGZkZjUyOWM2NGM3YWFmYmY5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IUreXT2ldkZR3S4ZMEy0vneXlQNwAh8gJWdtuaW9kdE';

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const movieContainer = document.getElementById('movie-container');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const trailerContainer = document.getElementById('trailer-container');
    const closeModal = document.querySelector('.close');
    const languageSelect = document.getElementById('language-select');

    let currentLanguage = 'en-US';

    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        // Llamar a searchMovies nuevamente cuando cambia el idioma
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query, currentLanguage);
        }
    });

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query, currentLanguage);
        }
    });

    closeModal.addEventListener('click', function() {
        closeModalFunction();
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModalFunction();
        }
    }

    function closeModalFunction() {
        modal.style.display = 'none';
        trailerContainer.innerHTML = ''; // Limpiar el contenedor del trailer al cerrar el modal
    }

    function searchMovies(query, language) {
        const url = `https://api.themoviedb.org/3/search/movie?query=${query}&language=${language}&api_key=${apiKey}`;

        fetch(url, {
            headers: {
                Authorization: `Bearer ${apiReadAccessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
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
                </div>
            `;

            movieElement.addEventListener('click', function() {
                showModal(movie);
            });

            movieContainer.appendChild(movieElement);
        });
    }

    function showModal(movie) {
        modalImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        modalTitle.textContent = movie.title;
        modalDescription.textContent = movie.overview;

        // Llamar función para obtener el trailer
        getMovieTrailer(movie.id);
        
        modal.style.display = 'flex';
    }

    function getMovieTrailer(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=${currentLanguage}`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            const trailers = data.results;
            if (trailers && trailers.length > 0) {
                const trailerKey = trailers[0].key; // Obtener el primer trailer disponible
                displayTrailer(trailerKey);
            } else {
                trailerContainer.innerHTML = '<p>No se encontró trailer disponible.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching trailer:', error);
            trailerContainer.innerHTML = '<p>Error al cargar el trailer.</p>';
        });
    }

    function displayTrailer(trailerKey) {
        trailerContainer.innerHTML = `
            <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/${trailerKey}"
                frameborder="0"
                allowfullscreen
            ></iframe>
        `;
    }
});
        