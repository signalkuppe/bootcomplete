var app = angular.module('app', ["ngResource", "bootcomplete"]);

app
    .factory('ENDPOINT', function ($resource) {
        return $resource('', {}, {
            city: {
                url: 'http://maps.googleapis.com/maps/api/geocode/json',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    var results = angular.fromJson(data);
                    return results.results;
                }
            },
            forecast: {
                url: 'http://api.openweathermap.org/data/2.5/forecast',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    var results = angular.fromJson(data);
                    return _.map(results.list, function (l) {
                        l.city = results.city;
                        return l;
                    });
                }
            }
        });
    });

app
    .controller('autocomplete', function ($scope, ENDPOINT) {

        $scope.citySearch = function (searchstring) {
            return ENDPOINT.city({
                address: searchstring,
                sensor: false
            }).$promise;
        };

        $scope.cityCallback = function (value) {
            $scope.selected_city = value.formatted_address;
        };

        $scope.forecastSearch = function (searchstring) {
            return ENDPOINT.forecast({
                q: searchstring,
                mode: 'json',
                units: 'metric',
                appid: '1e62cfec5b84b3ee912eae38fd6cc073'
            }).$promise;
        };

        $scope.forecastCallback = function (value) {
            $scope.forecast_detail = value;
        };
    
        $scope.cityCallback2 = function (value) {
            $scope.selected_city2 = value.formatted_address;
        };
    });