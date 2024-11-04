$(document).ready(function () {
    let map, marker;

    // Load the JSON file
    $.getJSON('./json/dublinbike.json', function (data) {
        let stations = data;

        // Display the station list
        function displayStationList(stations) {
            $('#stationList').empty();
            stations.forEach(station => {
                $('#stationList').append(`<div class="station" data-id="${station.number}">
                    ${station.name}
                </div>`);
            });
        }

        // Show station details and map when clicked
        function displayStationDetail(station) {
            $('#stationDetail').html(`
                <div class="station-detail-card">
                    <h3>${station.name}</h3>
                    <p><strong>Address:</strong> ${station.address}</p>
                    <p><strong>Bikes Available:</strong> ${station.available_bikes}</p>
                    <p><strong>Stands Available:</strong> ${station.available_bike_stands}</p>
                    <p><strong>Status:</strong> ${station.status}</p>
                    <p><strong>Location:</strong> (${station.position.lat}, ${station.position.lng})</p>
                </div>
            `);
            initMap(station.position.lat, station.position.lng);
        }

        // Initialize the map with the given coordinates
        function initMap(lat, lng) {
            const stationLocation = { lat: lat, lng: lng };

            // Create map if it doesn't exist
            if (!map) {
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 15,
                    center: stationLocation
                });
                marker = new google.maps.Marker({
                    position: stationLocation,
                    map: map
                });
            } else {
                // Update map center and marker position
                map.setCenter(stationLocation);
                marker.setPosition(stationLocation);
            }
        }

        // Filter stations by name
        $('#searchBox').on('input', function () {
            const query = $(this).val().toLowerCase();
            const filteredStations = stations.filter(station => station.name.toLowerCase().includes(query));
            displayStationList(filteredStations);
        });

        // Handle station clicks
        $('#stationList').on('click', '.station', function () {
            const stationId = $(this).data('id');
            const station = stations.find(s => s.number === stationId);
            displayStationDetail(station);
        });

        // Initial display
        displayStationList(stations);
    });
});