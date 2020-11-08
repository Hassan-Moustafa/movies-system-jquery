/**
 * moviesData structure
 * {
    page: Number;
    results: any[];
    total_pages: Number;
    total-results: Number;
    }
 */
let moviesData;

let searchForMovieByQuery = (query, pageNumber = 1) => {
    return new Promise((resolve, reject) => {
        const url = `${baseUrl}/search/movie?${$.param({ 
            api_key: token,
            query,
            page: pageNumber
        })}`;
    
        $.get(url, function(data, status){
            console.dir(data);
            moviesData = data;
            resolve(data);
        });
    })
}


let getPopularMovies = (pageNumber) => {
    return new Promise((resolve, reject) => {
        const url = `${baseUrl}/movie/popular?${$.param({ 
            api_key: token,
            page: pageNumber
        })}`;
    
        $.get(url, function(data, status){
            console.dir(data);
            resolve(data);
        });
    })
}

let getMovieDetailsById = (movieId) => {
    return new Promise((resolve, reject) => {
        const url = `${baseUrl}/movie/${movieId}?${$.param({ 
            api_key: token,
        })}`;
    
        $.get(url, function(data, status){
            console.log(data, status)
            resolve(data);
        }).fail(function(error) {
            console.log(error.responseJSON);
            reject(error.responseJSON)
        });
    })
}

let getMovieCredits = (movieId) => {
    return new Promise((resolve, reject) => {
        const url = `${baseUrl}/movie/${movieId}/credits?${$.param({ 
            api_key: token,
        })}`;
    
        $.get(url, function(data, status){
            console.dir(data);
            resolve(data);
        });
    });
}
