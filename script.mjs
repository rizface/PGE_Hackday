let locations = []
let forecast = []
let minDate = null
let disasterAlert = {
    edited: false
};
let locationBasedDisaster = {
    edited: false
}


const dateContainer = document.getElementById("minDate")
const tbody = document.querySelector('tbody')
const citySelect = document.getElementById("citySelect")
const alertContainer = document.getElementById("alertContainer")
const publicDate = document.getElementById("publicDate")

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

    data.forEach(d => {
        d.forecast.forEach(f => {
            f.location = d.location_name.split("_").join(" ")

            if (location && location == d.location_name && location != "all") {
                if (f.alert_daily) {
                    locationBasedDisaster.area = f.location
                    locationBasedDisaster.kec = d.kecamatan
                    locationBasedDisaster.kab = d.kabupaten
                    locationBasedDisaster.prov =  d.provinsi
                    locationBasedDisaster.msg = f.alert_daily
                    locationBasedDisaster.edited = true
                    locationBasedDisaster.date = f.time_utc
                }
                
                locationBased.push(f)
            } else {
                if (f.alert_daily && !locationBasedDisaster.edited && location == "all") {
                    disasterAlert.area = f.location
                    disasterAlert.kec = d.kecamatan
                    disasterAlert.kab = d.kabupaten
                    disasterAlert.prov =  d.provinsi
                    disasterAlert.msg = f.alert_daily
                    disasterAlert.edited = true
                    disasterAlert.date = f.time_utc
                }

                forecast.push(f)
            }
        })
    })

    if (locationBased.length > 0) {
        forecast = locationBased
    }
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

function generateAlert(disasterAlert) {
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

    const p = document.createElement("p")
    p.classList.add("card-text")
    p.textContent = `${disasterAlert.msg} di ${disasterAlert.area} ${disasterAlert.prov}, ${disasterAlert.kab}, ${disasterAlert.kec} pada ${disasterAlert.date}`
    
    div2.appendChild(h5)
    div2.appendChild(p)
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
    publicDate.textContent = `Tanggal Publikasi: ${minDate}`

    alertContainer.innerHTML = ""

    if (locationBasedDisaster.edited) {
        alertContainer.appendChild(generateAlert(locationBasedDisaster))
    } else if (disasterAlert.edited) {
        alertContainer.appendChild(generateAlert(disasterAlert))
    }
    
    disasterAlert.edited = false
    locationBasedDisaster.edited = false
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
    alertContainer.innerHTML = ""

    await fetchData(minDate, e.value.split(" ").join("_"))

    generateUI()
}

async function resetDate() {
    await fetchData(null, citySelect.value.split(" ").join("_"))

    tbody.innerHTML = ""

    generateUI()
}

( async() => {
    await fetchData(null, null)
    generateUI()
    generateCity()
})()