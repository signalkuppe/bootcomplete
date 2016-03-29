var bootcomplete = angular.module('bootcomplete', []);

bootcomplete.
directive('bootcomplete', ["$compile", "$templateRequest", "$timeout", "$sce", function ($compile, $templateRequest, $timeout, $sce) {
    return {
        restric: 'E',
        transclude: true,
        replace: true,
        scope: {
            btcSize: '@',
            btcTemplate: '@',
            btcMinlength: '@',
            btcLabel: '@',
            btcPlaceholder: '@',
            btcMaxresults: '@',
            btcNoresults: '@',
            btcQuery: '=',
            btcCallback: '='
        },
        template: "<div class='input-group input-group-{{btcSize}}'>\n"+
                  "<input placeholder='{{btcPlaceholder}}' type='text' class='form-control' ng-blur='blur($event)'/>\n"+
                  "<span class='input-group-addon'><i class='fa fa-refresh' ng-class=\"{'fa-spin': loading }\"></i></span>\n"+
                  "</div>",
        link: function (scope, element, attrs, controller) {

            var input = element[0].querySelector('.form-control'),
                suggestionTemplate = "<ul class=\"dropdown-menu\" style=\"position:static;display:block;float:none;}\">\n"+
                                        "<li ng-class=\"{'active':selectedIndex === $index}\" ng-repeat=\"result in results\" ng-show=\"results.length\">\n"+
                                           "<a ng-style=\"{'white-space':'normal'}\" href=\"\" ng-click=\"select($index)\" ng-bind-html=\"result.btclabel\"></a>\n"+
                                        "</li>\n"+
                                        "<li class=\"disabled\" ng-hide=\"results.length\">\n"+
                                          "<a href=\"\">{{noresultsMsg}}</a>\n"+
                                        "</li>\n"+
                                      "</ul>";

            scope.results = [];
            scope.selectedIndex = -1;
            scope.minlength = scope.btcMinlength || 1;
            scope.noresultsMsg = scope.btcNoresults || 'Your search yielded no results';


            // select item
            scope.select = function (index) {
                if (!scope.btcTemplate){
                    delete scope.results[index].btclabel; // delete label from object
                }
                element.controller('ngModel').$setViewValue(scope.results[index]);
                scope.btcCallback.call();
                scope.close();
            };

            // close autocomplete 
            scope.close = function () {
                input.value = '';
                scope.selectedIndex = -1;
                scope.visible = false;
            };

            // close on blur
            scope.blur = function (event) {
                // close only if the blur target is not a suggestion
                if (!event.relatedTarget)
                    scope.close();
            };

            // append element to the DOM
            scope.makeDom = function (html) {
                document.body.appendChild(html);
            };


            input.onkeyup = function (e) {
                scope.search = e.target.value;
                if (scope.search.length >= scope.minlength && e.keyCode !== 40 && e.keyCode !== 38) {
                    scope.loading = true;
                    var promise = scope.btcQuery.call(null, scope.search);
                    promise.then(function (results) {

                        // max result length
                        scope.results = scope.btcMaxresults ? results.slice(0, scope.btcMaxresults) : results;

                        // results label
                        if (!scope.btcTemplate) {
                            scope.results.map(function (result) {
                                result.btclabel = result[scope.btcLabel];
                                result.btclabel = $sce.trustAsHtml(result[scope.btcLabel].replace(new RegExp(scope.search, 'gi'), '<strong>$&</strong>'));
                                return result;
                            });
                        }

                        scope.visible = true;
                        $timeout(function () {
                            scope.loading = false;
                        }, 100);

                    });
                }
                if(!scope.search.length) {
                    scope.close();
                }
            };

            element[0].onkeydown = function (e) {
                //up
                if (e.keyCode === 40) {
                    if (scope.selectedIndex + 1 === scope.results.length) {
                        scope.selectedIndex = 0;
                    } else {
                        scope.selectedIndex++;
                    }
                }
                //down
                if (e.keyCode === 38) {
                    if (scope.selectedIndex === 0) {
                        scope.selectedIndex = scope.results.length - 1;
                    }
                    if (scope.selectedIndex === -1) {
                        scope.selectedIndex = 0;
                    } else scope.selectedIndex--;
                }
                //enter
                if (e.keyCode === 13) {
                    if (scope.selectedIndex != -1)
                        scope.select(scope.selectedIndex);
                }
                //esc
                if (e.keyCode === 27) {
                    scope.close();
                }

                scope.$apply();
            };
    
            var wrapper = "<div ng-show='visible' ng-style=\"{'position':'fixed','z-index':'10000','top':top,'left':left,'width':width}\" >",
                wrapper_closure = "</div>",
                getCords = function (element) {
                    var de = document.documentElement;
                    var box = element.getBoundingClientRect();
                    var top = box.top + window.pageYOffset - de.clientTop;
                    var left = box.left + window.pageXOffset - de.clientLeft;
                    return { top: (top + box.height + 1)+'px', left: left+'px', width: box.width+'px' };
                };

            scope.top = getCords(input).top;
            scope.left = getCords(input).left;
            scope.width = getCords(input).width;

            if (scope.btcTemplate) {

                $templateRequest(scope.btcTemplate).then(function (template) {
                    var output = wrapper + template + wrapper_closure,
                        compiledhtml = $compile(output)(scope)[0];

                    scope.makeDom(compiledhtml);
                });
            } else {

                var output = wrapper + suggestionTemplate + wrapper_closure,
                    compiledhtml = $compile(output)(scope)[0];

                scope.makeDom(compiledhtml);
            }

        }
    };
}]);