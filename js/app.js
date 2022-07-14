const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = wrapper.querySelector('.info-txt'),
inputField = wrapper.querySelector('input');
btnLocation = inputPart.querySelector('button');
apiKey = 'f6c0f8145d65126f9efd759543e4a76f';
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

inputField.addEventListener('keyup', e => {
    if(e.key == "Enter" && inputField.value != "")
    {
        requestApi(inputField.value);
    }
})

btnLocation.addEventListener('click', () => {
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else
    {
        alert('Se bloqueó el acceso a tu ubicación geográfica');
    }
})

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city)
{
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetchData();
}

function fetchData()
{
    infoTxt.innerText = "Cargando...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(data => weatherDetails(data));
}

function weatherDetails(info)
{
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404")
    {
        infoTxt.innerText = `${inputField.value} no existe.`;
    }
    else
    {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = "assets/img/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "assets/img/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "assets/img/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "assets/img/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "assets/img/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "assets/img/rain.svg";
        }

        wrapper.querySelector(".temp .numb").innerText = `${Math.round(temp - 273.15)}`;
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = `${Math.round(feels_like - 273.15)}`;
        wrapper.querySelector(".humidity span").innerText = humidity;

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});