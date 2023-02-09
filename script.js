let city = "";
let searchCity = $("#search-city");
let searchButton = $("#search-button");
let currentCity = $("#current-city");
let currentTemperature = $("#temperature");
let currentHumidity = $("#humidity");
let currentWindSpeed = $("#wind-speed");
let currentUvIndex =$("#uv-index");
let sCity =[];
function find (a){
for(let i=0;i<sCity.length;i++){
    if(a.toUpperCase()===sCity[i]){
        return  -1;
    }    
}
return 1;
}
let APPKey = "a0aca8a89948154a4182dcecc780b513";
function displayWeather (event){
event.preventDefault();
if(searchCity.val().trim()!==""){
    city=searchCity.val().trim();
    currentWeather(city);
}
}
function currentWeather(city){
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APPKey;
$.ajax({
    url:queryURL,
    method:"GET",
    
}).then(function(response){
    console.log(response);
    let weatherIcon = response.weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    let date = new Date(response.dt*1000).toLocaleDateString();
    $(currentCity).html(response.name + "(" + date + ")" + "<img src="+ iconUrl+">")
    let temp = (response.main.temp-273.15)*1.8+22
    $(currentTemperature).html((temp*9/5-32).toFixed(2) + "\xB0C.");
    $(currentHumidity).html(response.main.humidity + "%");
    let ws= response.wind.speed
    let windSpeedPh = (ws*2.237).toFixed(1)
    $(currentWindSpeed).html(windSpeedPh+"mph") 
    Uvindex(response.coord.lon,response.coord.lat)
    forecast(response.id)
    if(response.cod===200){
        sCity=JSON.parse(localStorage.getItem("cityName"))     
        if(sCity===null){
            sCity=[]
            sCity.push(city.toUpperCase())
            localStorage.setItem("cityName",JSON.stringify(sCity))
            addToList(city)
        }  else{
            if(find(city)>0){
sCity.push(city.toUpperCase())
localStorage.setItem("cityName",JSON.stringify(sCity))
addToList(city)
            }
        } 
    }
    
})
}
function Uvindex (ln,lt){
    let uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid="+ APPKey+"&lat="+lt+"&lon="+ln
    $.ajax({
        url:uvUrl,
        method:"GET",
            }).then(function(response){
$(currentUvIndex).html(response.value)
            })
}
function forecast(cityId){
let dayOver = false;
let queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&appid="+APPKey;
$.ajax({
    url:queryforcastURL,
    method:"GET",

}).then(function(response){
for(let i =0;i<5;i++){
   let date= new Date(response.list[(i+1)*8-1].dt*1000).toLocaleDateString()
   let iconCode = response.list[(i+1)*8-1].weather[0].icon;
   let iconUrl = "https://openweathermap.org/img/wn/"+iconCode+".png"
   let tempK = response.list[(i+1)*8-1].main.temp
   let tempF = ((tempK-273.5)*9/5+4).toFixed(2)
   let humidity =response.list[(i+1)*8-1].main.humidity;
$("#fDate"+i).html(date)
$("#fImg"+i).html("<img src="+iconUrl+">");
$("#fTemp"+i).html(tempF+"\xB0C.");
$("#fHumidity"+i).html(humidity +"%");
}
})
}
function addToList (c){
let listEl = $("<li>"+c.toUpperCase()+"</li>")
$(listEl).attr("class","list-group-item");
$(listEl).attr("data-value",c.toUpperCase());
$(".list-group").append(listEl);
}
function invokePastSearch(event){
let liEl = event.target
if(event.target.matches("li")){
city=liEl.textContent.trim()
currentWeather(city)
}
}

function loadLastCity(){
    $("ul").empty()
    let sCity = JSON.parse(localStorage.getItem("cityName"))
    if(sCity !==null ){
        sCity= JSON.parse(localStorage.getItem("cityName"))
        for(let i=0;i<sCity.length;i++){
            addToList(sCity[i])
          city=sCity[i-1]  
        }
        
        currentWeather(city)
    }
}
function clearHistory(event){
event.preventDefault()
sCity=[];
localStorage.removeItem("cityName")
document.location.reload()
}
$("#search-button").on("click",displayWeather)
$(document).on("click",invokePastSearch)
$(window).on("load",loadLastCity)
$("#clear-history").on("click",clearHistory)
