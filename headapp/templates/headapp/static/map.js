ymaps.ready(init);

function init() {

    // Xarita yaratish
    var map = new ymaps.Map("map", {
        center: [41.2995, 69.2401], // Tashkent
        zoom: 10
    });

    // Marker qo'shish
    var placemark = new ymaps.Placemark([41.2995, 69.2401], {
        balloonContent: "Tashkent"
    });

    map.geoObjects.add(placemark);

    // Qo‘shimcha marker misoli
    var placemark2 = new ymaps.Placemark([41.3, 69.25], {
        balloonContent: "Another point"
    });

    map.geoObjects.add(placemark2);

}