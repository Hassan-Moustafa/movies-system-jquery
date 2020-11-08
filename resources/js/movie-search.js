let mainTitle = '';
let queryKey= 'movieName';
let queryValue = null;
let isLoading = false;
let currentPage = 1;
let totalRecords = 0;
let totalPages = 0;
let currentTurn = 0;
let paginationMaxSize = 5;
let fallBackContent = $('#fall-back-content');
let searchValue = '';

$('body').prepend(spinnerComponent);
$('#search-movie-input').on('input', (e) => {
    searchValue = e.target.value;
});

$("#search-movie-input").keyup(function(event) { 
    if (event.keyCode === 13) { 
        searchForMovie();    
    } 
});

let checkQueryKeyExistence = () => {
    if(window.location.search) {
        const search = window.location.search;
        let extractedQueryKey = search.split('?')[1].split('=')[0];
        let extractedQueryValue = search.split('?')[1].split('=')[1];
        if(extractedQueryKey === queryKey) {
            queryValue = decodeURI(extractedQueryValue);
            $('#main-page-title').text(`Search results for: ${queryValue}`);
        } else { // render popular movies
            queryValue = null;
            $('#main-page-title').text('Popular Movies');
        }
    } else { // render popular movies
        queryValue = null;
        $('#main-page-title').text('Popular Movies');
    }
}

let handleRetrievedMovie = (movieResponse) => {
    const moviePosterUrl = movieResponse.poster_path ? 
                        `${moviePosterBaseUrl}${movieResponse.poster_path}` : 
                        './resources/images/poster-placeholder.png';
    return {
        id: movieResponse.id,
        image: moviePosterUrl,
        mainTitle: movieResponse.title,
        subTitle: movieResponse.release_date,
        rating: movieResponse.vote_average.toString(),
    }
}

let getRatingComponent = (rateValue = 0) => {
    let rateStars = '';
    for(let i = 0 ; i < 10; i++) {
        if(i < rateValue) {
            rateStars +=  '<span class="icon-star checked"></span>'
        } else {
            rateStars +=  '<span class="icon-star"></span>'
        }
    }

    return `
        <div class="col-auto">
            ${rateStars}
        </div>
    `;
}

let getMovieCard = (movieData) => {
    return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 my-2 px-2" onclick="loadMovieDetail(${movieData.id})">
        <div id="movie-card-container" class="card-container col-12 px-0"
            style="background-image: url('${movieData.image}')">

            <div class="card-info-container">
                <div class="mainTitle">
                    ${movieData.mainTitle}
                </div>
                <div class="subTitle">
                    ${movieData.subTitle}
                </div>
                <div class="rating">
                    ${movieData.rating} / 10
                </div>
                <div class="details-btn col-auto">
                    More
                </div>
                <div class="visual-rating">
                    ${getRatingComponent(movieData.rating)}
                </div>
            </div>
        </div>
    </div>
    `;
}

let loadMovieDetail = (movieId) => {
    window.location.href = `movie-detail.html?id=${movieId}`
}

let goForward = () => {
    if(currentPage < totalPages) {
        currentPage++;
        paginate(currentPage);
    }
}

let goBack = () => {
    if(currentPage > 1) {
        currentPage--;
        paginate(currentPage);
    }
}

let renderPaginationComponent = () => {

    let paginationPagesNumbersListElement = $('#pagination-pages-numbers-list');
    paginationPagesNumbersListElement.empty();

    let listItems = ``;
    let listItemsCount = Math.min(paginationMaxSize, totalPages);
    if(currentPage > (listItemsCount + currentTurn)) {
        currentTurn += listItemsCount;
        
    } else if(currentPage < (1 + currentTurn)) {
        currentTurn -= listItemsCount;
    }
    for(let i = 1; i <= listItemsCount ; i++) {
        listItems += `
            <li class="page-item ${(i + currentTurn) === currentPage ? 'active': ''}" onclick="paginate(${i + currentTurn})">
                <a class="page-link"> ${i + currentTurn} </a>
            </li>
        `;
    }
    paginationPagesNumbersListElement.append(listItems);

    // let maxTurns = totalPages / Math.min(paginationMaxSize, totalPages);
    // if(currentTurn === 0) {
    //     paginationPagesNumbersListElement.append(`
    //         <li class="page-item align-self-center">...</li>
    //         <li class="page-item ${(totalPages) === currentPage ? 'active': ''}" onclick="paginate(${totalPages})">
    //             <a class="page-link"> ${totalPages} </a>
    //         </li>
    //     `)
    // } else if(currentTurn === maxTurns) {
    //     paginationPagesNumbersListElement.prepend(`
    //         <li class="page-item ${(1) === currentPage ? 'active': ''}" onclick="paginate(${1})">
    //             <a class="page-link"> ${1} </a>
    //         </li>
    //         <li class="page-item align-self-center">...</li>
    //     `)
    // } 
    // else {
    //     $('#pagination-pages-numbers-list li:first-child').after(`
    //         <li class="page-item align-self-center">...</li>
    //     `)

    //     $('#pagination-pages-numbers-list li:last-child')[0].before(`
    //         <li class="page-item align-self-center">...</li>
    //     `)
    // }
}

let paginate = (pageNumber) => {
    main(pageNumber);
}

let searchForMovie = () => {
    if(searchValue && searchValue.trim() !== '') {
        window.location.href = `./movies-search.html?movieName=${encodeURI(searchValue)}`
    }
}

let main = async (pageNumber = 1) => {
    fallBackContent.hide();
    checkQueryKeyExistence();
    let moviesListElement = $('#movies-list');
    let moviesData = null;
    moviesListElement.empty();

    $('#spinner-component').show();
    
    
    if(queryValue && queryValue.trim() !== '') {
        moviesData = await searchForMovieByQuery(queryValue, pageNumber);
        $('#search-input-container').show();
        $('#search-movie-input').val(queryValue);
    } else {
        moviesData = await getPopularMovies(pageNumber);
        $('#search-input-container').hide();
    }

    currentPage = moviesData.page;
    totalRecords = moviesData.total_results;
    totalPages = moviesData.total_pages;
    renderPaginationComponent();


    $('#spinner-component').hide();

    if(moviesData.results && moviesData.results.length > 0) {
        moviesData.results.forEach(movie => {
            moviesListElement.append(getMovieCard(handleRetrievedMovie(movie)));
        });
    } else {
        fallBackContent.show();
    }

}

main();
