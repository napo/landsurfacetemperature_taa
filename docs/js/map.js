var vectorTileStyling = {
	temperatura: {
		weight: 0,
		fillColor: 'white',
		fillOpacity: 0.6,
		fill: true
	},
	temperatura: function(properties, zoom) {
    	var w = properties.celsius;
		const colorArray = [
			"#30123b", "#372568", "#3d368e", "#4248b0", "#4559cb", "#4669e1", "#4779f1", "#4589fc", "#4099ff", "#37a9fa",
			"#2bb8ef", "#21c6e0", "#1ad4d0", "#18debf", "#1ee8b1", "#2bf09f", "#3ff68a", "#56fa76", "#6ffe61", "#87ff4f",
			"#9cfe40", "#acfb38", "#bdf534", "#ccec34", "#dbe236", "#e7d739", "#f1ca3a", "#f9bd39", "#fdaf35", "#fe9e2f",
			"#fd8c27", "#f9791e", "#f46717", "#ed5510", "#e5460b", "#db3a07", "#ce2d04", "#c12302", "#9f1101", "#8c0902",
			"##7a0403"
		  ];
    	rstyle = {
 	    	color: colorArray[w-1],
            weight: 0,
			fillColor: colorArray[w-1],
			fillOpacity: 0.6,
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



var cartodbAttribution = 'map data © <a href="http://osm.org/copyright">OpenStreetMap contributors</a> under ODbL';

var positron = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution,
		//opacity: 1
}).addTo(map);

//var sidewalksUrl = "https://tavolare.labmod.org/www/sidewalks/{z}/{x}/{y}.pbf";
var sidewalksUrl = "lts20230814/{z}/{x}/{y}.pbf";

var sidewalksOps = {
	rendererFactory: L.canvas.tile,
	attribution: 'data elaborated from <a href="https://dati.gov.it">NASA ECOSTREESS</a>',
	vectorTileLayerStyles: vectorTileStyling,
	interactive: false
	};
	
var sidewalksLayer = L.vectorGrid.protobuf(sidewalksUrl, sidewalksOps).addTo(map);

var popup = new L.popup({
      closeButton: false,
      closeOnClick: false
});

function addPopup(e) {
	var lineWidth = -1;
	if (e.layer.feature) {
		var prop = e.layer.feature.properties;
		lineWidth = prop.celsius;
	} else {
		var prop = e.layer.properties;
		lineWidth = prop.celsius;
	}
    var lineColor = '#8c0902'; 
    var coordinates = e.lngLat;

    if (lineWidth <= 2  ) {
    	var message = 'Questo tratto è troppo stretto per il distanziamento sociale'
        var lineColor = '#ed4347'  //sys red
    } else if (lineWidth > 2 && lineWidth <= 3) {
        var message = 'Questo tratto è troppo stretto per il distanziamento sociale'
        var lineColor = '#ed4347' //sys red	
	} else if (lineWidth > 3 && lineWidth <= 4) {
        var message = 'Il distanziamento sociale in questo tratto è difficile.'
        var lineColor = '#d6e52e' //'#ff9848' yellow
    } else if (lineWidth > 4 && lineWidth <= 6) {
        var message = 'Il distanziamento sociale è possibile in questo tratto.'
        var lineColor = '#41ce69' //green
	} else {
        var message = 'Il distanziamento sociale dovrebbe essere possibile in questo tratto.'
        var lineColor = '#0875f9'  //blue
      }
	
	  	w = (Math.round(lineWidth * 10) / 10).toString().replace(".", ",");   
     	 var description = 
        '<div class="name1">Larghezza</div>' +
        '<div class="width">' + w + 'm</div>' +
         '<hr style="border: 2px solid ' + lineColor + ' ;"/>' +
        '<div class="message">' + message + '</div>'
		popup.setLatLng(e.latlng)
      	popup.setContent(description)
      	popup.addTo(map)
 }


var lastZoom;
map.on('zoomend', function() {
  var zoom = map.getZoom();
  if (zoom >= 10) {
	sidewalksLayer.on('mouseover', function(e) {
		addPopup(e);
	});
  } else {
	sidewalksLayer.on('mouseover', function(e) {
		//popup.remove()
		return;
	});
  }
  lastZoom = zoom;
})


var redStyle = {
  "color": "c4c4c4",
  "weight": 4,
  "fillOpacity": 0
};
italy  = [46.2312,11.62356]
map.setView(italy, 9);
var hash = new L.Hash(map);
new L.Control.Zoom({ position: 'topright' }).addTo(map);

