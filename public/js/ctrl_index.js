var generateQueryString = function (parameters) {

    var queryString = '?';
    for (p in parameters) {
        queryString += parameters[p][0] + '=' + parameters[p][1] + '&';
    }
    queryString = queryString.slice(0, -1);
    return queryString;
};


var geocoder;
var map;
var marker;

var styles = [{"featureType": "administrative", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}
    , {"featureType": "administrative.country", "elementType": "labels.text", "stylers": [{"visibility": "on"}]}
    , {"featureType": "administrative.country", "elementType": "labels.text.stroke", "stylers": [{"visibility": "off"}]}
    , {"featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{"color": "#29b464"}]}
    , {"featureType": "landscape.man_made", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}
    , {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{"visibility": "on"}, {"color": "#48d083"}]
    }
    , {"featureType": "landscape.natural", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}
    , {"featureType": "poi", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}, {"color": "#48d083"}]}
    , {"featureType": "poi", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}
    , {"featureType": "poi", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}
    , {"featureType": "road", "stylers": [{"visibility": "off"}]}
    , {"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "off"}]}
    , {"featureType": "transit", "elementType": "labels.text", "stylers": [{"visibility": "off"}]}
    , {"featureType": "transit", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}
    , {"featureType": "transit.line", "elementType": "geometry", "stylers": [{"visibility": "off"}]}
    , {"featureType": "water", "elementType": "all", "stylers": [{"color": "#29b464"}]}
    , {"featureType": "administrative", "elementType": "geometry", "stylers": [{"color": "#41bb76"}]}];


var point1;
var point2;


app.controller('IndexCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.demoResults = [{"countryCode": "NL", "en": "Netherlands", "ar": "هولندا"}];

    $scope.href = function (url) {
        window.location = url;
    };
    $scope.initedCounter = false;

    function initMap() {
        geocoder = new google.maps.Geocoder();
        var coordinates = new google.maps.LatLng(52.056826, 5.464479);

        var map_properties = {
            center: coordinates,
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        map = new google.maps.Map(document.querySelector('.map'), map_properties);

        map.setOptions({styles: styles});

        google.maps.event.addListener(map, 'idle', function () {
            if (!$scope.initedCounter) {
                initCounter();
                initSearch();
                $scope.initedCounter = true;
            }
        });
    }

    function codeAddress(address) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                var bounds = results[0].geometry.viewport;
                
                for (r in results) {
                    if (results[r].types[0] == 'country') {
                        location = results[r].geometry.location;
                        bounds = results[r].geometry.viewport;
                        break;
                    }
                }

                point1 = bounds.getSouthWest();
                point2 = bounds.getNorthEast();
                $(".lookup-box .dots").hide();
                map.setZoom(7); 
                map.setCenter({lat:location.lat(), lng:location.lng()});
            }
        });
    }

    function initCounter() {
        setTimeout(function () {
            $(".lookup-box .dots").fadeIn();
            return $(".title-number-section .odometer").addClass("odometer-animating-up odometer-animating");
        }, 1000);

        $(".counter-ip").click(function () {
            $(".counter-ip").hide();
            $(".lookup-box .dots").hide();
            $(".lookup-input").focus();
        });

        $(".lookup-input").focus(function() {
            $(".counter-ip").hide();
            $(".lookup-box .dots").hide();
        });

        $(".lookup-input").blur(function () {
            if ($('.lookup-input').val().length < 1) {
                $(".counter-ip").show();
                $(".lookup-box .dots").show();
            }
        });
        setTimeout(function(){
            $('.results-block').fadeIn();
        }, 2800);
    }

    function initSearch() {
        $('.search-btn').click(function () {
            var reg = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
            var IP = $('.lookup-input').val();
            if (reg.test(IP)) {
                submitDemo(IP);
            }
        });
    }

    if (document.querySelector('.map')) {
        google.maps.event.addDomListener(window, 'load', initMap);
    }

    function submitDemo(IP) {
        var queryString = generateQueryString([
            ['ip', IP],
            ['format', 'json']
        ]);

        $http.get('/api/lookup' + queryString)
            .success(function (results) {
                if (results && results.countryCode) {
                    $scope.demoResults = [results];
                    if (geocoder) {
                        codeAddress($scope.demoResults[0].en);
                    }
                } else {
                    $scope.status_message = 'No results';
                    $scope.demoResults = [];
                }
            })
            .error(function (err) {
                $scope.loading = false;
                $scope.status_message = 'Error Connecting!';
                $scope.demoResults = [];
            });
    }
}]);