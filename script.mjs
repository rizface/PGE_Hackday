let locations = []
let forecast = []
let minDate = null
let disasterAlert = false;

const dateContainer = document.getElementById("minDate")
const tbody = document.querySelector('tbody')
const citySelect = document.getElementById("citySelect")
const alertContainer = document.getElementById("alertContainer")

function extractLocations(data) {
    locations = data.map(d => {
        return {
            name: d.location_name.split("_").join(" "),
            kec: d.kecamatan,
            kab: d.kabupaten,
            prov: d.provinsi,
            lat: d.lat,
            lon: d.lon
        }
    })

}

function extractForecast(data, location = null) {
    // check alert for the first time for each date
    let locationBased = [];
    let checkAlert = false
    data.forEach(d => {
        d.forecast.forEach(f => {
            if (!checkAlert) {
                checkAlert = (f.alert_daily == true) || (f.alert_all == true) 
            }

            f.location = d.location_name.split("_").join(" ")

            if (location && location == d.location_name && location != "all") {
                locationBased.push(f)
            } else {
                forecast.push(f)
            }
        })
    })

    if (locationBased.length > 0) {
        forecast = locationBased
    }

    disasterAlert = checkAlert
}

function generateTr() {
    const tr = document.createElement("tr")

    return tr
}

function generateTD() {
    const td = document.createElement("td")

    return td
}

function generateOption(value) {
    const option = document.createElement("option")
    option.value = value
    option.textContent = value

    return option
}

function appenddTD(tr, value) {
    const td = generateTD()
    td.textContent = value

    tr.appendChild(td)  
}

async function fetchData(date = null, city = null) {
    let url = 'https://office.pge.world/pgehack/'

    if (date) {
        url = `${url}?tgl=${date}`
    }

    const resp = await axios({
        method: 'get',
        url: url,
    })  

    // since the api never added a location, we will only process the data if the locations array is empty
    if (locations.length == 0 )  {
        extractLocations(resp.data)
    }

    if (resp.data) {
        forecast = [];

        extractForecast(resp.data, city)

        minDate = forecast[0].time_utc
        
        return
    }

    alert("No data found")
}


function generateCity() {
    locations.forEach(l => {
        const option = generateOption(l.name)
        citySelect.appendChild(option)
    })
}

function generateAlert() {
    const div = document.createElement("div")
    div.classList.add("card")
    div.classList.add("mt-4")
    div.classList.add("bg-primary")
    div.classList.add("text-white")

    const div2 = document.createElement("div")
    div2.className = "card-body"

    const h5 = document.createElement("h5")
    h5.className = "card-title"
    h5.textContent = "⚠️ Peringatan Dini Cuaca Ekstrem"

    div2.appendChild(h5)
    div.appendChild(div2)

    return div
}

function generateUI() {
    forecast.forEach(f => {
        const tr = generateTr()
        
        appenddTD(tr, f.time_utc)
        appenddTD(tr, f.location)
        appenddTD(tr, f.weather)
        appenddTD(tr, f.temp_max)
        appenddTD(tr, f.rh_max)
        appenddTD(tr, f.windir24h)
        appenddTD(tr, f.windspd24h)
        appenddTD(tr, f.vis24)
        appenddTD(tr, f.prec24h)
        appenddTD(tr, f.dur24h)

        tbody.appendChild(tr)
    })

    dateContainer.textContent = minDate

    if (disasterAlert) {
        alertContainer.appendChild(generateAlert())
    }
}

async function move(next) {
    const date = new Date(minDate)
    let plus = 1

    if (!next) {
        plus = -1   
    }

    date.setDate(date.getDate() + plus)

    await fetchData(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`, citySelect.value.split(" ").join("_"))

    tbody.innerHTML = ""

    generateUI()
}

async function select(e) {
    tbody.innerHTML = ""

    await fetchData(minDate, e.value.split(" ").join("_"))

    generateUI()
}

( async() => {
    await fetchData(null, null)
    generateUI()
    generateCity()
})()