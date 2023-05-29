//Global Variables
var cityList = [];
var weather = [];
var rSearch = [];

var i = 0;
var inputField;
var $input = $(".searchField");


function citySearch() {
    var historyItem = document.createElement("button");
    var urlgeo;


        console.log($('.searchField').val());
        
        if ($('.searchField').val() === "") {
            inputField = "Miami";
        } else {
            inputField = $('.searchField').val();
        }

        urlgeo = 'http://api.openweathermap.org/geo/1.0/direct?q='+inputField+',US&appid=01c11dcf6124a0d509e5945bd2fe27be';
        

        if (rSearch.find( function (found) {
            return found === inputField;
        })) {
            //Do Nothing
        } else if ($('.searchField').val() !== "") {
            $('.historyItems').last().append(historyItem);
            $(historyItem).attr("type", "button");
            $(historyItem).attr("class", "col btn bg-primary-subtle btnList");
            $(historyItem).attr("id", "opt-"+cityList.length);
            localStorage.setItem("opt-"+cityList.length, $('.searchField').val());
            i = cityList.length;
            $(historyItem).html(inputField);
        } else {
            var x = 0;
            for (var i = 0; i<=10; i++) {
                var historyItem = document.createElement("button");
                var option = "opt-"+i;
                var city = "";
                
                    city = localStorage.getItem(option);
                    if (city !== null) {
                    
                        if (rSearch.find( function (found) {
                            return found === city;
                        })) {
                            //Do Nothing
                        } else {
                        rSearch.push(city);
                        $('.historyItems').last().append(historyItem);
                        $(historyItem).attr("type", "button");
                        $(historyItem).attr("class", "col btn bg-primary-subtle btnList");
                        $(historyItem).attr("id", option);
                        $(historyItem).html(rSearch[x]);
                        cityList.push({city: rSearch[x]});
                        console.log(rSearch[x]);
                        x++;
                        }
               }
            }
        }
            apigeo(urlgeo);
            console.log(cityList);

}

function apigeo() {
    var urlgeo = 'http://api.openweathermap.org/geo/1.0/direct?q='+inputField+'&limit=3&appid=01c11dcf6124a0d509e5945bd2fe27be';
        $.ajax(urlgeo).done(function (response) {
            var array = response;
            cityList.push({
                city: array[0].name,
                lat: array[0].lat,
                lon: array[0].lon
            })
            apiWeather(cityList);
        });
}

function apiWeather(cityList) {
    var i = cityList.length-1;

    console.log(cityList);
    var url = 'https://api.openweathermap.org/data/3.0/onecall?lat='+cityList[i].lat+'&lon='+cityList[i].lon+'&units=imperial&appid=01c11dcf6124a0d509e5945bd2fe27be'
    
    $.ajax(url).done(function (response) {
        weather = response;
        console.log(weather);
        currentWeather();
    });
}

function currentWeather() {
    var i = cityList.length-1;
    var time = new Date(weather.current.dt*1000);
    var tDate = time.getMonth()+1;
    var tMonth = time.getDate()+'/'+time.getFullYear();
    
        $('.cCity').html(cityList[i].city+' '+tDate+'/'+tMonth);
        $('.weather_icon').attr('src', './images/'+weather.current.weather[0].main+'_icon.png');
        $('.cTemp').html('Temperature: '+weather.current.temp+'F');
        $('.cWind').html('Wind Speed: '+weather.current.wind_speed+' MPH');
        $('.cHumid').html('Humidity: '+weather.current.humidity+'%');

        for (var i = 1; i <= 5; i++) {
            var cDate = ".cDate"+i;
            var weather_icon = ".weather_icon"+i;
            var cTemp = ".cTemp"+i;
            var cWind = ".cWind"+i;
            var cHumid = ".cHumid"+i;
            var time = new Date(weather.daily[i].dt*1000);
            var tDate = time.getMonth()+1;
            var tMonth = time.getDate()+'/'+time.getFullYear();

                $(cDate).html(tDate+'/'+tMonth);
                $(weather_icon).attr('src', './images/'+weather.daily[i].weather[0].main+'_icon.png');
                $(cTemp).html('Temperature: '+weather.daily[i].temp.day+' F');
                $(cWind).html('Wind Speed: '+weather.daily[i].wind_speed+' MPH');
                $(cHumid).html('Humidity: '+weather.daily[i].humidity+'%');
        }
}

citySearch();

$(".searchButton").on('click',citySearch);
$(".btnList").on('click', function() {
    $('.searchField').val(localStorage.getItem($(this).attr("id")));
    citySearch();
      });