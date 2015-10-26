// ==UserScript==
// @name        Asylamba Best Planets Filter
// @namespace   Asylamba
// @include     http://game.asylamba.com/s8/map/*
// @include 	http://game.asylamba.com/s8/map#
// @include 	http://game.asylamba.com/s8/map
// @updateURL	https://github.com/Ayaash/AsylambaBestPlanetsFilter/raw/master/best_planets_filter.user.js 
// @version     8.2
// @grant       GM_xmlhttpRequest
// @author	Ayaash & Akulen
// ==/UserScript==

var $ = unsafeWindow.jQuery;

var dataurl = 'http://akulen.tk/s8/s8.json';
var reservationUrl = 'https://docs.google.com/spreadsheets/d/1iovT7v5UZNy5aTGGxyfHIBab2QdPdoM2AIsUxC4Y7L0/pub?gid=1560046076&single=true&output=csv';
var popurl = 'http://akulen.tk/s8/s8-full-population.json';
var resurl = 'http://akulen.tk/s8/s8-full-resources.json';
var sciurl = 'http://akulen.tk/s8/s8-full-science.json';
var planetList;
var reservationList = [];


function showAll()
{
	$('.loadSystem').show();
}

function hideAll()
{
  $('.loadSystem').hide();
}
  
function show(id)
{
  $('[data-system-id='+id+']').show();
}

var population_pic = "http://game.asylamba.com/s8/public/media/resources/population.png";
var resource_pic = "http://game.asylamba.com/s8/public/media/resources/resource.png";
var science_pic = "http://game.asylamba.com/s8/public/media/resources/science.png";
var populationBool = false;
var resourceBool = false;
var scienceBool = false;
var preprocessed = 0;

function addCss(newCss)
{
	if(!$('#custom-css').length)
	{
		$("head").append('<style id="custom-css" type="text/css"></style>');
	}
	$('#custom-css').append(newCss);
}

function createIcon()
{
	
	addCss("#map-option{ max-width: 186px; background-repeat: initial; height:70px; }");
	addCss("#map-option::before{ height: 76px; }");
	addCss("#map-option::after{ height: 76px; }");
	addCss("#map-option a{ margin-top: 2px; }");
	addCss("#map-content{ top: 135px; }");
	//Options
	$('#map-option > a.sh.hb.lb.moveTo.switch-class').after('<a id="fivePopulationSelector" class="sh hb lb" href="#" title="Afficher les planètes ayant 5 de population"><img src="'+population_pic+'" alt="minimap"></a>');       
	document.getElementById('fivePopulationSelector').addEventListener('click', togglePopulation, false);

	$('#fivePopulationSelector').after('<a id="fiveResourcesSelector" class="sh hb lb" href="#" title="Afficher les planètes ayant 5 en coefficient ressource"><img src="'+resource_pic+'" alt="minimap"></a>');     
	document.getElementById('fiveResourcesSelector').addEventListener('click', toggleResource, false);

	$('#fiveResourcesSelector').after('<a id="fiveScienceSelector" class="sh hb lb" href="#" title="Afficher les planètes ayant 5 en science" ><img src="'+science_pic+'" alt="minimap"></a>');      
	document.getElementById('fiveScienceSelector').addEventListener('click', toggleScience, false);
}

function togglePopulation()
{
	populationBool = !populationBool;
	process();
}

function toggleResource()
{
	resourceBool = !resourceBool;
	process();
}

function toggleScience()
{
	scienceBool = !scienceBool;
	process();
}

function process()
{
	if(resourceBool || scienceBool || populationBool)
	{
		preprocess();
		if(preprocessed != 5)
			setTimeout(function() { process(); }, 1000);
		else
			refresh();
	}
	else
	{
		refresh();
		showAll();
	}
}

function refresh()
{
	hideAll();
	if(resourceBool)
	{
		$('[class*=topResource]').show();
		$("#fiveResourcesSelector").addClass("active");
	}
	else
	{
		$("#fiveResourcesSelector").removeClass("active");
	}
	if(populationBool)
	{
		$('[class*=topPopulation]').show();
		$("#fivePopulationSelector").addClass("active");
	}
	else
	{
		$("#fivePopulationSelector").removeClass("active");
	}
	if(scienceBool)
	{
		$('[class*=topScience]').show();
		$("#fiveScienceSelector").addClass("active");
	}
	else
	{
		$("#fiveScienceSelector").removeClass("active");
	}
}

function preprocess()
{
	if(!preprocessed)
	{
		GM_xmlhttpRequest({
			method: "GET",
			url: reservationUrl,
			onload: function(response) {
      	var i = true;
      	var lines = response.responseText.split("\n");
      	for each (var res in lines) {
      	  if(i) {
      	    i = false;
      	  }
      	  else {
      	    var cur = res.split(",");
      	    if(parseInt(cur[0]) > 0) {
      	      reservationList[parseInt(cur[0])] = [cur[1]];
      	    }
      	  }
      	}
				preprocessed += 1;
			}
		});
		GM_xmlhttpRequest({
			method: "GET",
			url: dataurl,
			onload: function(response)
			{
				planetList = JSON.parse(response.responseText);
				preprocessed += 1;
			}
		});
		GM_xmlhttpRequest({
			method: "GET",
			url: popurl,
			onload: function(response)
			{
				planets = JSON.parse(response.responseText);
				for each(var planet in planets.systems)
				{
					$("[data-system-id="+planet.system+"]").addClass("topPopulation");
				}
				preprocessed += 1;
			}
		});
		GM_xmlhttpRequest({
			method: "GET",
			url: resurl,
			onload: function(response)
			{
				planets = JSON.parse(response.responseText);
				for each(var planet in planets.systems)
				{
					$("[data-system-id="+planet.system+"]").addClass("topResource");
				}
				preprocessed += 1;
			}
		});
		GM_xmlhttpRequest({
			method: "GET",
			url: sciurl,
			onload: function(response)
			{
				planets = JSON.parse(response.responseText);
				for each(var planet in planets.systems)
				{
					$("[data-system-id="+planet.system+"]").addClass("topScience");
				}
				preprocessed += 1;
			}
		});
	}
}

function setOpacity(relId, opa) {
	document.getElementById("action-box").querySelector('a.openplace[data-target="' + relId + '"]').getElementsByTagName("img")[0].style.opacity = opa;
}

function find(id) {
	var i = 0;
	while(i < planetList.systems.length && planetList.systems[i].planetid != id) {
		++i;
	}
	return i;
}

function topPlanete(planete) {
	var link = planete.querySelector('a[data-url*="placeid-"]');
	if(link != null) {
		var id = find(parseInt(planete.querySelector('a[data-url*="placeid-"]').getAttribute("data-url").match(/placeid\-([0-9]+)/)[1]));
		if(populationBool && planetList.systems[id].population == 5)
			return true;
		if(resourceBool && planetList.systems[id].resources == 5)
			return true;
		if(scienceBool && planetList.systems[id].science == 5)
			return true;
	}
	return false;
}

function libre(planete) {
	if(planete.getAttribute("class").match(/color([0-9]+)/)[1] == 12)
		return false;
	var link = planete.querySelector('a[data-url*="placeid-"]');
	if(link != null) {
		var id = parseInt(planete.querySelector('a[data-url*="placeid-"]').getAttribute("data-url").match(/placeid\-([0-9]+)/)[1]);
		return (!reservationList[id]);
	}
	return true;
}

createIcon();
document.getElementById("action-box").addEventListener("DOMNodeInserted", function(evt) {
  if(populationBool || resourceBool || scienceBool) {
		var planetes = document.getElementById("action-box").querySelectorAll('[id*=place-]');
    var i;
    for (i = 0; i < planetes.length; ++i) {
			var planete = planetes[i];
			var idRel = planete.getAttribute('id').match(/place\-([0-9]+)/)[1];
			if(!topPlanete(planete))
				setOpacity(idRel, 0);
			else if(!libre(planete))
				setOpacity(idRel, 0.25);
			else
				setOpacity(idRel, 1);
		}
	}
}, false);
