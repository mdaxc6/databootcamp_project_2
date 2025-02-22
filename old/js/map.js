const PREFIX = "https://park-accidents-api.herokuapp.com/"

function init() {
    var states_url = `${PREFIX}/api/v1.0/accident_location_state`
    var city_url = `${PREFIX}/api/v1.0/accident_location_city`
    // Perform a GET request to the query URLs
    d3.json(states_url).then(function (stateData) {
        console.log(stateData);
        d3.json(city_url).then(function(cityData){
            console.log(cityData);
            createFeatures(stateData.features, cityData.features);
        });
    });

}

function createFeatures(stateData, cityData){

    function onEachCityFeature(feature, layer) {
        layer.bindPopup(`
            <h3><strong>${feature.properties.date}</strong></h3>
            <hr>
            <h4>${feature.properties.city}, ${feature.properties.state}</h5>
            <p>Device Type: ${feature.properties.device_type}<br>
            Number Injured: ${feature.properties.num_injured}<br>
            Injury Description: ${feature.properties.injury_desc}<br>
            ${feature.properties.acc_desc}</p>`);

    };

    function onEachStateFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.state}</h3>
            <hr>
            <p><strong>Number of Accidents:</strong> ${feature.properties.num_accidents}</p>`);
        
        layer.bindTooltip(`${feature.properties.num_accidents}`, {
            permanent: true,
            direction: 'center',
            className: 'labelStyle', 
        }).setLatLng(layer.getLatLng());

    };

    raidusScale = d3.scaleLinear()
        .domain([1,99])
        .range([5, 30])


    function chooseColor(bus_type){
        return bus_type == 'Amusement park' ? '#b13e53' :
        bus_type == 'Carnival or rental'  ? '#ef7d57' :
        bus_type == 'Family entertainment center'  ? '#ffcd75' :
        bus_type == 'Water park'  ? '#a7f070' :
        bus_type == 'Pool waterslide'  ? '#38b764' :
        bus_type == 'Zoo or museum' ? '#257179' :
        bus_type == 'Mall, store or restaurant' ? '#29366f' :
        bus_type == 'Sports or recreation facility'? '#3b5dc9' :
        bus_type == 'City or county park' ? '#73eff7' :
                    '#566c86';
    }

    var accidents_state = L.geoJSON(stateData, {
        onEachFeature: onEachStateFeature,
        pointToLayer: function (feature, lnglat){
            return L.circleMarker(lnglat, {
                radius: 20,
                fillColor: "#f54748",
                color: "#000",
                weight: 1,
                opacity: 1, 
                fillOpactiy: 1
            });

        }
    });

    var accidents_city = L.geoJSON(cityData, {
        onEachFeature: onEachCityFeature,
        pointToLayer: function (feature, lnglat){
            try{
                return L.circleMarker(lnglat, {
                    radius: raidusScale(feature.properties.num_injured), 
                    fillColor: chooseColor(feature.properties.bus_type),
                    color: "#000",
                    weight: 1,
                    opacity: 1, 
                    fillOpactiy: 1
                });
            } catch (error){
                console.log("no city geodata")
            }
        }
    });
    
    function filterBusType(bus_type){
        var filteredData = L.geoJSON(cityData, {
            onEachFeature: onEachCityFeature,
            pointToLayer: function (feature, lnglat){
                return L.circleMarker(lnglat, {
                    radius: raidusScale(feature.properties.num_injured),
                    fillColor: chooseColor(feature.properties.bus_type),
                    color: "#000",
                    weight: 1,
                    opacity: 1, 
                    fillOpactiy: 1
                });
    
            },
            filter: function(feature, layer){
                return feature.properties.bus_type == bus_type;
            } 
        })

        return filteredData;
    }

    var filterMaps = {
        "Accidents Statewide": accidents_state,
        "Accidents by City": accidents_city,
        "Amusement Parks": filterBusType('Amusement park'),
        "Carnival or Rentals": filterBusType('Carnival or rental'),
        "Family Centers": filterBusType('Family entertainment center'),
        "Water Park": filterBusType('Water park'),
        "Pool Waterslide": filterBusType('Pool waterslide') ,
        "Zoo or Museum": filterBusType('Zoo or museum'),
        "Retail": filterBusType('Mall, store or restaurant'),
        "Sports & Recreation Facilities": filterBusType('Sports or recreation facility') ,
        "City or County Park": filterBusType('City or county park'),
        "Other": filterBusType('Other'),
        "Unknown": filterBusType('Unknown')
    }


    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Business Types</strong>'],
    categories = ['Amusement park', 'Carnival or rental',
    'Family entertainment center', 'Water park', 'Pool waterslide',
    'Zoo or museum', 'Mall, store or restaurant',
    'Sports or recreation facility', 'City or county park'];

    for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + chooseColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br><br>');
        return div;
    };

    createMap(accidents_state, legend, filterMaps);
}

function createMap(accidents_state, legend, filterMaps) {
    // Define streetmap, darkmap and satellite layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Light Map": streetmap,
        "Dark Map": darkmap,
        "Satellite Map": satellitemap
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [
            37.09, -85.71
        ],
        zoom: 4,
        layers: [streetmap, accidents_state]
    });


    L.control.layers(baseMaps, filterMaps, {
        collapsed: false
    }).addTo(myMap);

    legend.addTo(myMap);
};

window.addEventListener('DOMContentLoaded', init);