# Bootcomplete

> A simple angular autocomplete made for bootstrap3

[Demo](http://signalkuppe.github.io/bootcomplete/)

## Features
* Seamless integration with bootstrap3 and font-awesome, no extra css needed
* Zero configuration setup for basic usage
* Highlighted keyword in suggestions
* Configurable label for suggestions
* Close with esc key, blur or tab
* Selection with enter key or click
* No results message
* UI indication during search
* Advanced usage with custom templates

### Requirements

* Bootstrap
* Font awesome

### Basic usage
Simply include the script in your angular application

```js
<script src="path_to_the_library/dist/bootcomplete.min.js"></script>
```

And then add the module as a dependency

```js
var app = angular.module("App", ["bootcomplete"]);
```

Place the autocomplete directive in your view

```html
<bootcomplete    
    btc-minlength="1"
    btc-maxresults="5"
    btc-size="md"
    btc-label="label"
    btc-placeholder="Search for something..."             
    btc-query="queryFunction" 
    btc-callback="callbackFunction"
    btc-noresults="No results!"
    ng-model="modelvariable"></bootcomplete>  
```

Define in your controller the query function (you should return a promise) with the searchstring as a parameter. In this example ENDPOINT is a factory

```js
$scope.queryFunction = function (searchstring) {
    return ENDPOINT.query({ param: searchstring}).$promise;
};
```

Optionally define a callback function that runs after a selection

```js
$scope.callbackFunction = function () {
    console.log('callback fired!');
};
```

### Advanced usage

You can specify a custom template to display the suggestions using the results array. 
Any bootstrap/non-boostrap html is accepted, for example

```html
<div class="media" ng-repeat="result in results">
  <div class="media-left media-middle">
    <a href="#">
      <img class="media-object" src="{{result.image}}">
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">{{result.title}}</h4>
    {{result.text}}
    <p><a href="" class="btc-clickLink" ng-click="select($index)"></a></p>
  </div>
</div>
```

classname "btc-clickLink" id required on any link that fires the selection.
See index.html, src/app.js,  src/forecast.html for an **advanced usage example.**

### Options

#### btc-minlength
Type: `String`
	
The minimum character length needed before triggering autocomplete suggestion (default: 1)

#### btc-maxresults
Type: `String`
	
The max number of items to display

#### btc-size
Type: `String`
	
Boostrap input group size (sm,md,lg)

#### btc-label
Type: `String`
	
The object property to display in the suggestions (ignored when using a custom template)

#### btc-keepselection
Type: `String`
	
Keeps the result label as the value of the input: suggested for an item field

#### btc-placeholder
Type: `String`
	
Input placeholder

#### btc-query
Type: `String`
	
search function

#### btc-callback
Type: `String`
	
callback function fired after the selection: the full result is passed as paramter
    
#### btc-noresults
Type: `String`
	
String to display when the are no results (default: Your search yielded no results, ignored when using a custom template)

#### btc-template
Type: `String`
	
custom template url to display suggestions

