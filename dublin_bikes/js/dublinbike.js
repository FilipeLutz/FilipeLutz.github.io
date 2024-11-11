$(document).ready(function () {
    let map, marker;
    let currentStationId = null;

    const toggleButton = document.getElementById("responsiveMenu");
    const navbarLinks = document.getElementById("navbarLinks");
    const menuIcon = document.getElementById("menuIcon");
    const closeIcon = document.getElementById("closeIcon");

    toggleButton.addEventListener("click", () => {
    // Toggle the navbar    
    navbarLinks.classList.toggle("show");

    // Toggle the icons
    if (navbarLinks.classList.contains("show")) {
        menuIcon.style.display = "none";
        closeIcon.style.display = "inline";
    } else {
        menuIcon.style.display = "inline";
        closeIcon.style.display = "none";
    }
    });

    // Load JSON data
    $.getJSON('./json/dublinbike.json')
        .done(data => initializeStations(data))
        .fail(() => alert('Failed to load station data.'));

    // Initialize station list
    function initializeStations(stations) {
        displayStationList(stations);

        $('#searchBox').on('input', function () {
            const query = $(this).val().toLowerCase();
            const filteredStations = stations.filter(station =>
                station.name.toLowerCase().includes(query)
            );
            displayStationList(filteredStations);
            if (!filteredStations.length) $('#map').fadeOut();
        });

        $('#stationList').on('click', '.station', function () {
            const stationId = $(this).data('id');
            if (currentStationId === stationId) return;
            currentStationId = stationId;
            const station = stations.find(s => s.number === stationId);
            displayStationDetail(station);
        });
    }

    // Display station list
    function displayStationList(stations) {
        $('#stationList').empty();
        stations.forEach(station => {
            $('#stationList').append(`<div class="station" data-id="${station.number}">${station.name}</div>`);
        });
    }

    // Display station details
    function displayStationDetail(station) {
        $('#stationDetail').html(`
            <div class="station-detail-card">
                <h3>${station.name}</h3>
                <p><strong>Address:</strong> ${station.address}</p>
                <p><strong>Bikes Available:</strong> ${station.available_bikes}</p>
                <p><strong>Stands Available:</strong> ${station.available_bike_stands}</p>
                <p><strong>Status:</strong> ${station.status}</p>
            </div>
        `);
        $('#map').fadeIn();
        initMap(station.position.lat, station.position.lng);
    }

    // Initialize Google Map
    function initMap(lat, lng) {
        const position = { lat, lng };
        if (!map) {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: position
            });
            marker = new google.maps.Marker({ position, map });
        } else {
            map.setCenter(position);
            marker.setPosition(position);
        }
    }
});