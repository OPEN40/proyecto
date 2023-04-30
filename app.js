
window.onload=inicio;
function inicio(){

    var basemapOSM=new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    
	var relleno = new ol.style.Fill({
        color:[255,0,0,0.6]
    })

    var borde = new ol.style.Stroke({
        color:[0,0,0,1],
        width:2,
        lineDash:[3,5]
    })
	
 
    var estilovia=new ol.style.Stroke({
        color:[255,0,0,1],
        width:3
    }) 
	
	 var estilopunto=new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color:[0,0,255,0.5]
        }),
        points:3,
        radius:10,
        stroke: new ol.style.Stroke({
            color:[0,0,0,1],
            width:2
        }),
        scale:1
    })
	var iconoparque=new ol.style.Icon({
        src:'data/icon/paving.png',
        scale:0.09
    })
    
	
	var quitogeojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'data/quito.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible:true,
        title:'Usos',
		style: new ol.style.Style({
            fill:relleno,
            stroke:borde
        })
    })
	
	var puntosgeojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'data/puntos.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible:true,
        title:'Sitios de interés',
        style: new ol.style.Style({
            image:iconoparque
        })
    })
	
    var viassgeojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'data/vias.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible:true,
        title:'Callejero',
        style: new ol.style.Style({
            stroke: estilovia
        })
    })   
	
    var vistaMapa=new ol.View({
        center:[-78.45397264057699,-0.15775210026896527],// longitud, latitud
        zoom:18,
        projection:'EPSG:4326'//Datum: WGS84 Geográficas:4326
    });

    const map = new ol.Map({
        view: vistaMapa,
        layers:[basemapOSM,quitogeojson,puntosgeojson,viassgeojson],
        target:"mapa"
    })

    var pantallaCompleta = new ol.control.FullScreen();
    map.addControl(pantallaCompleta);

    var barraEscala = new ol.control.ScaleLine({
        bar:true,
        text:true
    });
    map.addControl(barraEscala);

    var overviewMap = new ol.control.OverviewMap({
        layers:[
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        collapsed:true
    });
    map.addControl(overviewMap);

    var mostrarCoordenadas = new ol.control.MousePosition({
        projection:'EPSG:4326',
        coordinateFormat: function(coordenada){
            return ol.coordinate.format(coordenada, '{y}, {x}', 6)
        }
    });
    map.addControl(mostrarCoordenadas);

    var controlCapas=new ol.control.LayerSwitcher({
        tipLabel:"Leyenda"
    });
    map.addControl(controlCapas);
	
	var ventanaTitulo = document.getElementById('popup-title');
    var ventanaContenido = document.getElementById('popup-content');
    var ventanaContenedor = document.getElementById('popup-container');
    var overlay = new ol.Overlay({
        element:ventanaContenedor
    })

    map.on('click',function(e){
        overlay.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature,layer){
            var usomanzana = feature.get('uso');
            map.addOverlay(overlay);
            ventanaTitulo.innerHTML='Manzanas <br>';
            ventanaContenido.innerHTML = 'USO: ' + usomanzana;
            overlay.setPosition(e.coordinate);
        })
    })

}
   

    