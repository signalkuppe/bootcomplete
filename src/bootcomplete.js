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
            btcKeepselection: '@',
            btcEmptyonclose:'@',
            btcQuery: '=',
            btcCallback: '=',
            bindModel: '=ngModel'
        },
        template: "<div class='input-group input-group-{{btcSize}}'>\n" +
            "<input placeholder='{{btcPlaceholder}}' type='text' class='form-control' ng-model='bindModel' ng-blur='blur($event)' autocomplete=\"off\"/>\n" +
            "<span class='input-group-addon'><i class='fa fa-refresh' ng-class=\"{'fa-spin': loading }\"></i></span>\n" +
            "</div>",
        link: function (scope, element, attrs, controller) {

            var input = element[0].querySelector('.form-control'),
                suggestionTemplate = "<ul class=\"dropdown-menu\" style=\"position:static;display:block;float:none;}\">\n" +
                "<li ng-class=\"{'active':selectedIndex === $index}\" ng-repeat=\"result in results\" ng-show=\"results.length\">\n" +
                "<a class=\"btc-clickLink\" ng-style=\"{'white-space':'normal'}\" href=\"\" ng-click=\"select($index)\" ng-bind-html=\"result.btclabel\"></a>\n" +
                "</li>\n" +
                "<li class=\"disabled\" ng-hide=\"results.length\">\n" +
                "<a href=\"\">{{noresultsMsg}}</a>\n" +
                "</li>\n" +
                "</ul>",
                _getCords = function () {
                    var box = input.getBoundingClientRect(),
                        top = box.top + window.pageYOffset,
                        left = box.left + window.pageXOffset;

                    scope.top = (top + box.height + 1) + 'px';
                    scope.left = left + 'px';
                    scope.width = box.width + 'px';
                };

            scope.results = [];
            scope.selectedIndex = -1;
            scope.minlength = scope.btcMinlength || 1;
            scope.noresultsMsg = scope.btcNoresults || 'Your search yielded no results';

            scope.$watch("visible", function (newValue, oldValue) {
                if (newValue === false) {
                    return;
                }
                _getCords();
            });

            // select item
            scope.select = function (index) {
                
                if (!scope.btcTemplate)
                    delete scope.results[index].btclabel; // delete label from object
                
                // clear input if we don't want to display the selection
                if (!scope.btcKeepselection) {
                    input.value = '';
                }
                // otherwise update the input with the selected value, and get out of focus
                else {
                    input.value = scope.results[index][scope.btcLabel];
                    input.blur();
                }
                // call the callback with the result as parameter
                if (scope.btcCallback)
                    scope.btcCallback.call(null, scope.results[index]);

                scope.close();
            };

            // close autocomplete 
            scope.close = function () {
                scope.visible = false;
                scope.selectedIndex = -1;
                if(!scope.btcKeepselection)
                    input.value='';
            };

            // close on blur
            scope.blur = function (e) {
                setTimeout(function () {
                    var focused = document.activeElement;
                    if (focused.tagName !== 'A' || focused.className.indexOf('btc-clickLink') === -1) {
                        scope.close();
                        scope.$apply();
                    } // check the elemnt with focus
                }, 1);
            };

            // append element to the DOM
            scope.makeDom = function (html) {
                document.body.appendChild(html);
            };

            input.onkeyup = function (e) {
                scope.search = e.target.value;
                if (scope.search.length >= scope.minlength && e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 27) {
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
                if (scope.search.length === 0) {
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
                //esc or tab
                if (e.keyCode === 27 || e.keyCode === 9) {
                    scope.close();
                }

                scope.$apply();
            };

            var wrapper = "<div ng-show='visible' ng-style=\"{'position':'absolute','z-index':'10000','top':top,'left':left,'width':width}\" >",
                wrapper_closure = "</div>";

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