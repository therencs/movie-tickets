let citiesdata = {};

const options = {
  method: 'GET',
  headers: {
  accept: 'application/json',
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmVkZjc5ZTU5NDY1MDYwNDE5Y2M0ZTE0MzJjYmVmNSIsInN1YiI6IjYyOGVjYzE5ZGY4NmE4MzMxYjg5OTE1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Hj_0paiXsbX7tLStVA3iw1I0aJM5KsKiRVnVEcg_izM'
  }
};

let movieGrid = document.querySelector(".contain-movies");

let searchMovies = document.getElementById("movieinput");
let searchCities = document.getElementById("cityinput");

let searchMovieResults= document.querySelector(".movieresults");
let searchCityResults= document.querySelector(".cityresults");

let movieInputVal = ''
let cityInputVal = ''

let movieSuggestions = document.querySelector(".movieresults");
let citySuggestions = document.querySelector(".cityresults");

const allEvents = () =>{
  
  const handleInput = (mode)=>{

    if(mode == "cities"){

      cityInputVal = searchCities.value;

      if(cityInputVal != '' || cityInputVal != undefined ){

        getCities()
        .then(response => extractDataPromises(response, "cities"))
        .then(cities => renderCityResults(cities))

      } else {

        searchMovieResults.innerHTML = ('')

      }
    } else if (mode == "movies"){

      movieInputVal = searchMovies.value;

      if(movieInputVal != '' || movieInputVal != undefined ){

        getMovies()
        .then(response => response.results)
        .then(res => extractDataPromises(res, "movies"))
        .then(titles => renderMovieResults(titles))

      } else {

        searchMovieResults.innerHTML = ('')

      }
    }
  }

  searchMovies.addEventListener('keyup', (e) => {
    handleInput("movies");

  })

  searchMovies.addEventListener('mousedown', (e)=>{
    handleInput("movies");
  })

  searchCities.addEventListener('mousedown', (e) => {
    handleInput("cities");
  })

  searchCities.addEventListener('keyup', (e) => {
    handleInput("cities");
  })
  

  citySuggestions.addEventListener('click', (e)=>{
    if(e.target.nodeName == 'LI' && e.target.id != "searcherror"){
      searchCities.value = e.target.innerHTML;
    }
  })

  movieSuggestions.addEventListener('click', (e)=>{
    if(e.target.nodeName == 'LI' && e.target.id != "searcherror"){
      searchMovies.value = e.target.innerHTML;
    }
  })

  window.addEventListener('click', (e)=> {
    e.preventDefault();
    console.log(e.target.id)
    if(e.target.id != "cityinput"){
      searchCityResults.innerHTML = ('')
      searchMovieResults.innerHTML = ('')
    }
    
  })

}
  
const extractDataPromises = async (data, mode) => {
  let dataPromises = [];

  console.log(data);
  switch(mode){
    case "movies":
      dataPromises = data.map(dataval => dataval.original_title);
      break;
    case "cities":
      dataPromises = data.map(dataval => dataval.name);
      break;
  }
  

  const finalData = await Promise.all(dataPromises);
  console.log(finalData)
  switch(mode){
    case "movies":
      return finalData.filter((item) => {
        return item.toLowerCase().includes(movieInputVal.toLowerCase());
      })
    case "cities":
      return finalData.filter((item) => {
        return item.toLowerCase().includes(cityInputVal.toLowerCase());
      })
  }
  
}

const renderMovieResults = async (results) => {
  searchMovieResults.innerHTML = ('')
  resultPromise = await Promise.all(results);

  if(movieInputVal == ""){
     searchMovieResults.innerHTML = ('')
   } else if(movieInputVal != "" && resultPromise.length == 0){
    searchMovieResults.insertAdjacentHTML("beforeend", `<li> Sorry! We couldn't find what you were looking for. </li>`)
   } else {
    resultPromise.map((index) => searchMovieResults.insertAdjacentHTML("beforeend", `<li id="results">${index}</li>`))
   }

}

const renderCityResults = async (results) => {
  console.log(searchCityResults);

  searchCityResults.innerHTML = ('')
  resultPromise = await Promise.all(results);
  console.log(resultPromise);

   if(cityInputVal != "" && resultPromise.length == 0){
    searchCityResults.insertAdjacentHTML("beforeend", `<li id="searcherror"> Sorry! We couldn't find any cities. </li>`)
   } else {
    resultPromise.map((index) => searchCityResults.insertAdjacentHTML("beforeend", `<li>${index}</li>`))
   }
}

const renderMovie = (data) => {
  if (movieGrid != undefined){
    movieGrid.insertAdjacentHTML("afterbegin", `
    <div class="movie">
       <img src="http://image.tmdb.org/t/p/w500/${data.poster_path}">
     </div>`)
  }
}

const getMovies=()=>{
      return fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
      .then(res => res.json())
      .catch(err => console.error(err));
    }

const getCities=()=>{
      return fetch('./data/cities.json')
      .then(res => res.json())   
}
  
getMovies()
.then(response => 
  response.results.map(result => renderMovie(result)
));

getCities();
allEvents();

console.log(getMovies())
console.log(getCities())

