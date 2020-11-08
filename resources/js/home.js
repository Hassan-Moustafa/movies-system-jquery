
let searchValue = '';
let pageNumber = 1;
let searchForMovie = () => {
    window.location.href = `./movies-search.html?movieName=${encodeURI(searchValue)}`
}


$('#search-movie-input').on('input', (e) => {
    searchValue = e.target.value;
});

$("#search-movie-input").keyup(function(event) { 
    if (event.keyCode === 13) { 
        searchForMovie();    
    } 
});



let main = () => {
    setTimeout(() => {
        searchValue = $('#search-movie-input')[0].value;
    }, 0);
}

main();