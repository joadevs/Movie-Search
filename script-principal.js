document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '928e853de232fafe14c834c4fc0281b9';
    const languageSelect = document.getElementById('language-select');
    const trendingLink = document.getElementById('trending-link');
    const movieContainer = document.getElementById('movie-container');

    let currentLanguage = 'en-US'; // Valor predeterminado

    // Evento para cambiar el idioma seleccionado
    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        // Llamar a la función para cargar películas populares cuando cambie el idioma
        loadPopularMovies();
    });

    // Evento para cargar películas populares al hacer clic en el enlace de tendencias
    trendingLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadPopularMovies();
    });

    // Función para cargar películas populares desde la API de TMDb
    function loadPopularMovies() {
        const url = `https://api.themoviedb.org/3/movie/popular?language=${currentLanguage}&api_key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayMovies(data.results);
            })
            .catch(error => {
                console.error('Error fetching popular movies:', error);
            });
    }

    // Función para mostrar las películas en el contenedor
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

    // Función para mostrar el modal con detalles de la película
    function showModal(movie) {
        // Aquí puedes implementar la lógica para mostrar detalles adicionales
        // como descripción, trailers, etc., según lo que necesites.
        console.log('Mostrar modal:', movie.title);
    }
});
