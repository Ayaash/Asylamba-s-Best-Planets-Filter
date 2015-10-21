// ==UserScript==
// @name        Asylamba Best Planets Filter
// @namespace   Asylamba
// @include     http://game.asylamba.com/s8/map/*
// @include 	http://game.asylamba.com/s8/map#
// @include 	http://game.asylamba.com/s8/map
// @version     8.1
// @grant       GM_xmlhttpRequest
// @author		Ayaash & Akulen
// ==/UserScript==

dataurl = 'http://akulen.tk/s8/s8.json';
popurl = 'http://akulen.tk/s8/s8-full-population.json';
resurl = 'http://akulen.tk/s8/s8-full-resources.json';
sciurl = 'http://akulen.tk/s8/s8-full-science.json';



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
var $ = unsafeWindow.jQuery;

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
		if(preprocessed != 3)
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

createIcon();
