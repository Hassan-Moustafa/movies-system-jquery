const siteName = 'Movies System';
let isNavBarOpened = false;
let toggleNavBar = () => {
    if(isNavBarOpened) {
        $('.main-header-container').removeClass('opened');
        isNavBarOpened = false;
    } else {
        isNavBarOpened = true;
        $('.main-header-container').addClass('opened');
    }
}
const navBarElement = `
    <header class="main-header-container">
        <nav class="navbar navbar-expand-lg navbar-light row mx-0 justify-content-between">
            <a class="navbar-brand row mx-0 align-items-center col-auto" href="index.html">
                <span class="icon-video-player col-auto px-0"></span>
                <span class="site-name col-auto">
                    ${siteName}
                </span>
            </a>
            <button 
                class="navbar-toggler" 
                type="button" 
                data-toggle="collapse" 
                data-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
                onclick="toggleNavBar()">
                <span class="icon-menu"></span>
            </button>
            <div class="collapse navbar-collapse col-auto" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">
                        Home
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="movies-search.html">
                        Popular Movies
                    </a>
                </li>
            </ul>
            </div>
        </nav>
    </header>`;

$('body').prepend(navBarElement);