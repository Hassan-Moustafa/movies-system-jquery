let queryKey= 'id';
let queryValue = null;

const detailsShown = [
    {
      displayText: 'Release Date',
      propName: 'release_date',
      getValue(item) {
        return item.release_date ? item.release_date : '---'
      }
    },
    {
      displayText: 'Vote Average',
      propName: 'vote_average',
      getValue(item) {
        return item.vote_average ? item.vote_average : '---'
      }
    },
    {
      displayText: 'Vote Count',
      propName: 'vote_count',
      getValue(item) {
        return item.vote_count ? item.vote_count : '---'
      }
    },
    {
      displayText: 'Adult',
      propName: 'adult',
      getValue(item) {
        return item.adult ? 'For Adult' : 'For Everyone';
      }
    }
  ];

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
        <div class="col-auto px-0">
            ${rateStars}
        </div>
    `;
}

let checkQueryKeyExistence = () => {
    if(window.location.search) {
        const search = window.location.search;
        let extractedQueryKey = search.split('?')[1].split('=')[0];
        let extractedQueryValue = search.split('?')[1].split('=')[1];
        if(extractedQueryKey === queryKey) {
            queryValue = decodeURI(extractedQueryValue);
            console.log(queryValue);
        } else { // render popular movies
            queryValue = null;
        }
    } else { // render popular movies
        queryValue = null;
    }
}

let generateGenresListElement = (genresList) => {
    let genresListElement = '';
    genresList.forEach(genre => {
        genresListElement += `
            <li>
                ${genre.name}
            </li>
        `;
    });

    return genresListElement;
}

let getMainBannerContent = (movieData) => {

    const moviePosterUrl = movieData.poster_path ? 
                        `${moviePosterBaseUrl}${movieData.poster_path}`: 
                        './resources/images/poster-placeholder.png';
    const movieBackdrop = movieData.backdrop_path ? `
        <img class="movie-bacdrop-image" src="${moviePosterBaseUrl}${movieData.backdrop_path}" alt="">
    ` : '';
    return `
    ${movieBackdrop}
    <div class="banner-content row mx-0 mx-md-5">
        <div class="col-12 col-md-6 col-lg-auto px-0 px-md-4">
            <img class="movie-poster" src="${moviePosterUrl}" alt="">
        </div>
        <div class="col-12 col-md-6 col-lg-6 row mx-0 align-content-start justify-content-center justify-content-md-start mt-4 mt-md-0">
            <div class="movie-title col-12">
                <h2 class="movie-title">
                    ${movieData.title}
                </h2>
            </div>
            <div class="genres-list col-auto">
                <ul>
                    ${generateGenresListElement(movieData.genres)}
                </ul>
            </div>
            <div class="movie-release-data col-auto">
                ${movieData.release_date ? movieData.release_date: ''}
            </div>
            <div class="rating col-12 text-md-left row mx-0 justify-content-center justify-content-md-start">
                <div class="visual-rating col-auto px-0">
                    ${getRatingComponent(movieData.vote_average)}
                </div>
                <span class="mx-2 col-auto">
                    ${movieData.vote_average} / 10
                </span> 
            </div>
        </div>

    </div>
    `
}

let getMovieDetailSummary = (movieData) => {
    let movieDetailSummaryElement = '';

    detailsShown.forEach((item) => {
        movieDetailSummaryElement += `
        <div class="row mx-0 justify-content-between single-info">
            <div class="col-auto px-0 key">${item.displayText}</div>
            <div class="col-auto px-0 value">
                ${item.getValue ? item.getValue(movieData) : movieData[item.propName]}
            </div>
        </div>
        `;
    });

    return movieDetailSummaryElement;
}

let getMovieCastList = (cast) => {
    let movieCastListElement = `
        <div class="col-12">
            <h2 class="cast-title">Cast</h2>
        </div>
    `;

    let castLimitToShow = Math.min(10, cast.length);
    for(let i = 0 ; i < castLimitToShow; i++) {
        let personImage = cast[i].profile_path ? 
                          (moviePosterBaseUrl + cast[i].profile_path) : 
                          './resources/images/person.png';
        movieCastListElement += `
            <div class="col-auto mt-3">
                <div class="col-12">
                    <img 
                        class="person-profile-image" 
                        src="${personImage}" 
                        alt="${cast[i].name}">
                </div>
                <div class="col-12 person-name" >
                    ${cast[i].name}
                </div>
            </div>    
        `;
    }

    return movieCastListElement;
}

let main = async () => {
    
    checkQueryKeyExistence();
    let mainBannerElementContainer = $('#main-banner');
    let storyLineElement = $('#story-line');
    let movieDetailSummaryElement = $('#movie-detail-summary');
    let movieCastListElement = $('#movie-cast-list');

    if(queryValue && queryValue.trim() !== '') {
        try {
            let movieDetail = await getMovieDetailsById(queryValue);
            if(movieDetail) {
                let movieCredits = await getMovieCredits(movieDetail.id);
                mainBannerElementContainer.append(getMainBannerContent(movieDetail));
                storyLineElement.append(movieDetail.overview);
                movieDetailSummaryElement.append(getMovieDetailSummary(movieDetail));
                if(movieCredits && movieCredits.cast && movieCredits.cast.length > 0) {
                    movieCastListElement.append(getMovieCastList(movieCredits.cast));
                }
            }
        } catch(e) {
            window.location.href = 'index.html';
        }
    } else {

    }
}


main();