const colorArray = {
	"-50":"#30123b",
	"-49":"#341a4e",
	"-48":"#362160",
	"-47":"#392971",
	"-46":"#3b3081",
	"-45":"#3e3790",
	"-44":"#3f3f9e",
	"-43":"#4146ac",
	"-42":"#424cb7",
	"-41":"#4454c3",
	"-40":"#455bcd",
	"-39":"#4661d7",
	"-38":"#4668df",
	"-37":"#476fe7",
	"-36":"#4776ee",
	"-35":"#477cf3",
	"-34":"#4682f8",
	"-33":"#4589fc",
	"-32":"#448ffe",
	"-31":"#4195ff",
	"-30":"#3e9cfe",
	"-29":"#3aa2fc",
	"-28":"#36a9f9",
	"-27":"#31aff5",
	"-26":"#2db5f1",
	"-25":"#28bceb",
	"-24":"#24c2e5",
	"-23":"#20c7df",
	"-22":"#1dccd9",
	"-21":"#1ad2d2",
	"-20":"#18d7cb",
	"-19":"#18dcc4",
	"-18":"#18e0bd",
	"-17":"#19e3b8",
	"-16":"#1de7b2",
	"-15":"#21ebab",
	"-14":"#27eea4",
	"-13":"#2ef19c",
	"-12":"#36f393",
	"-11":"#3ff68b",
	"-10":"#48f882",
	"-9":"#52fa7a",
	"-8":"#5bfc71",
	"-7":"#65fd69",
	"-6":"#70fe60",
	"-5":"#7afe58",
	"-4":"#83ff51",
	"-3":"#8cff4a",
	"-2":"#96fe44",
	"-1":"#9dfe40",
	"0":"#a4fc3c",
	"1":"#abfb38",
	"2":"#b1f936",
	"3":"#b8f635",
	"4":"#bff434",
	"5":"#c5f034",
	"6":"#cced34",
	"7":"#d2e935",
	"8":"#d8e535",
	"9":"#dde037",
	"10":"#e2dc38",
	"11":"#e7d739",
	"12":"#ecd23a",
	"13":"#f0cc3a",
	"14":"#f4c73a",
	"15":"#f6c23a",
	"16":"#f9bc39",
	"17":"#fbb737",
	"18":"#fcb136",
	"19":"#feaa33",
	"20":"#fea331",
	"21":"#fe9c2d",
	"22":"#fe952b",
	"23":"#fd8d27",
	"24":"#fc8624",
	"25":"#fb7e21",
	"26":"#f9761d",
	"27":"#f76f1a",
	"28":"#f46717",
	"29":"#f25f14",
	"30":"#ef5911",
	"31":"#ec520f",
	"32":"#e84b0c",
	"33":"#e5460b",
	"34":"#e14109",
	"35":"#dc3c07",
	"36":"#d83706",
	"37":"#d33205",
	"38":"#cd2c04",
	"39":"#c82803",
	"40":"#c22403",
	"41":"#bc2002",
	"42":"#b51c01",
	"43":"#af1801",
	"44":"#a81501",
	"45":"#a01201",
	"46":"#990e01",
	"47":"#910b01",
	"48":"#880802",
	"49":"#800602",
	"50":"#7a0403"
  };

var vectorTileStyling = {
	temperatura: {
		weight: 0,
		fillColor: 'white',
		fillOpacity: 0.8,
		fill: true
	},
	temperatura: function(properties, zoom) {
    	var w = properties.celsius;
    	rstyle = {
 	    	color: colorArray[w.toString()],
            weight: 0,
			fillColor: colorArray[w.toString()],
			fillOpacity: 0.8,
			fill: true
    	}
        return(rstyle);
	}
}

var map = L.map('map',
	{ 
		zoomControl: false,
		dragging: true,
		maxZoom: 16,
		minZoom: 5 
	});


var osmAttribution = 'map data © <a href="http://osm.org/copyright">OpenStreetMap contributors</a> under ODbL';

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: osmAttribution,
		//opacity: 1
}).addTo(map);

var ltsUrl = "lts20230814/{z}/{x}/{y}.pbf";

var ltsOps = {
	rendererFactory: L.canvas.tile,
	attribution: 'data elaborated from <a href="https://dati.gov.it">NASA ECOSTREESS</a>',
	vectorTileLayerStyles: vectorTileStyling,
	interactive: true
	};

var ltsLayer = L.vectorGrid.protobuf(ltsUrl, ltsOps).addTo(map);

var popup = new L.popup({
	closeButton: false,
	closeOnClick: false
});

function addPopup(e) {
	temp = -1
	if (e.layer.feature) {
		var prop = e.layer.feature.properties;
		temp = prop.celsius;
	} else {
		var prop = e.layer.properties;
		temp = prop.celsius;
	}
  	var lineColor = colorArray[temp.toString()]; 
  	var coordinates = e.lngLat;
  
	var description = 
	  '<div class="name1">Temperatura</div>' +
	  '<div class="width">' + temp + ' gradi</div>' +
	   '<hr style="border: 3px solid ' + lineColor + ' ;"/>'
	popup.setLatLng(e.latlng)
	popup.setContent(description)
	popup.addTo(map)
}


var lastZoom;
map.on('zoomend', function() {
  var zoom = map.getZoom();
  if (zoom >= 15) {
	ltsLayer.on('mouseover', function(e) {
		addPopup(e);
	});
  } else {
	ltsLayer.on('mouseover', function(e) {
		//popup.remove()
		return;
	});
  }
  lastZoom = zoom;
})



italy  = [46.2312,11.62356]
map.setView(italy, 9);
var hash = new L.Hash(map);
new L.Control.Zoom({ position: 'topright' }).addTo(map);
//AddLayer
const Map_AddLayer = {
    'Land Surface Temperature<br/>18/08/2023': ltsLayer
};

L.control.opacity(Map_AddLayer, {label: 'regola trasparenza',position: 'topleft'}).addTo(map);

