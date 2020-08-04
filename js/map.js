var init_center = [-74.07355160507866, 4.6695669333184355];
var init_zoom = 10.8;
var locality_zoom = 12;

mapboxgl.accessToken = 'pk.eyJ1IjoianVhbmhlcjk0IiwiYSI6ImNrYmZlOWd6dTB1c2wyc250NXlzZzVnN2QifQ.5rjKBtByyiPHoTTJru7lmA';
var map = new mapboxgl.Map( {
  container: 'map',
  style: 'mapbox://styles/juanher94/ckby6fx7f0x9n1ilc2sgq30x7',
  center: init_center,
  zoom: init_zoom
} );

map.addControl( new mapboxgl.NavigationControl() );

map.on( 'load', function() {

  var layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style
  var firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
  if (layers[i].type === 'symbol') {
  firstSymbolId = layers[i].id;
  break;
  }
  }

  map.addSource( 'blocks', { 
    type: 'geojson', 
    data: './data/blocks.geojson'
  } );

  map.addLayer( {
    id: 'blocks',
    type: 'fill',
    source: 'blocks',
    layout: {},
    paint: {
      'fill-color': 
        ['match', ['get', 'VULNERABILITY_LEVEL'],
                   0, '#464949',
                   1, '#d13224',
                   2, '#ff9626',
                   3, '#ffe126',
                   4, '#238c23',
                   5, '#165916',
                   '#165916']
      },
      'fill-opacity': 0.8
  },
  firstSymbolId
  );

  map.addLayer( {
    id: 'stratus',
    type: 'fill',
    source: 'blocks',
    layout: {},
    paint: {
      'fill-color': 
        ['match', ['get', 'ESTRATO'],
                   'INHABITADA', '#464949',
                   '1', '#d13224',
                   '2', '#ff9626',
                   '3', '#ffe126',
                   '4', '#238c23',
                   '5', '#165916',
                   '#1d4877']
      },
      'fill-opacity': 0.8
  },
  firstSymbolId
  );

  map.addLayer( {
    id: 'health-problems',
    type: 'fill',
    source: 'blocks',
    layout: {},
    paint: {
      'fill-color': 
        ['match', ['get', 'HEALTH_PHYSICAL_CLUSTER'],
                   0, '#464949',
                   1, '#d13224',
                   2, '#ff9626',
                   3, '#ffe126',
                   4, '#238c23',
                   5, '#165916',
                   '#165916']
      },
      'fill-opacity': 0.8
  },
  firstSymbolId
  );

  map.addLayer( {
    id: 'medicine',
    type: 'fill',
    source: 'blocks',
    layout: {},
    paint: {
      'fill-color': 
        ['match', ['get', 'TRADITIONAL_MEDICINE_CLUSTER'],
                   0, '#464949',
                   1, '#d13224',
                   2, '#ff9626',
                   3, '#ffe126',
                   4, '#238c23',
                   5, '#165916',
                   '#165916']
      },
      'fill-opacity': 0.8
  },
  firstSymbolId
  );


  map.addSource( 'parks', { 
    type: 'geojson', 
    data: './data/urban_parks.geojson'
  } );

  map.addLayer( {
    id: 'parks',
    type: 'fill',
    source: 'parks',
    layout: {},
    paint: {
      'fill-color': '#003626',
      'fill-opacity': 0.8
    }
  },
  firstSymbolId
  );
  
  map.addSource( 'ciclovia', { 
    type: 'geojson', 
    data: './data/ciclovia.geojson'
  } );

  map.addLayer( {
    id: 'ciclovia',
    type: 'line',
    source: 'ciclovia',
    layout: {},
    paint: {
      'line-color': 'red'
    }
  }
  );

  map.addSource( 'drink', { 
    type: 'geojson', 
    data: './data/drinking_places.geojson',
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  } );
  
  map.addLayer( {
    id: 'clusters',
    type: 'circle',
    source: 'drink',
    filter: [ 'has', 'point_count' ],
    paint: {
      'circle-color': [
        'step',
        [ 'get', 'point_count' ],
        '#ffe126',
        10,
        '#ff9626',
        750,
        '#d13224'
      ],
      'circle-radius': [
        'step',
        [ 'get', 'point_count' ],
        20,
        100,
        30,
        750,
        40
      ]
    }
  } );
 
  map.addLayer( {
    id: 'cluster-count',
    type: 'symbol',
    source: 'drink',
    filter: [ 'has', 'point_count' ],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': [ 'DIN Offc Pro Medium', 'Arial Unicode MS Bold' ],
      'text-size': 12
    }
  } );
 
  map.addLayer( {
    id: 'unclustered-point',
    type: 'circle',
    source: 'drink',
    filter: [ '!', [ 'has', 'point_count' ] ],
    paint: {
      'circle-color': '#ffe126',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffe126'
    }
  } );

  map.addSource( 'cases', {
    type: 'geojson',
    data: './data/heat_map.geojson',
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addLayer( {
    id: 'cases-cluster',
    type: 'circle',
    source: 'cases',
    filter: [ 'has', 'point_count' ],
    paint: {
      'circle-color': [
        'step',
        [ 'get', 'point_count' ],
        '#ffe126',
        10000,
        '#ff9626',
        20000,
        '#d13224'
      ],
      'circle-radius': [
        'step',
        [ 'get', 'point_count' ],
        20,
        100,
        30,
        750,
        40
      ]
    }
  } );

  map.addLayer( {
    id: 'cases-count',
    type: 'symbol',
    source: 'cases',
    filter: [ 'has', 'point_count' ],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': [ 'DIN Offc Pro Medium', 'Arial Unicode MS Bold' ],
      'text-size': 12
    }
  } );

  map.on( 'click', 'clusters', function( e ) {
    var features = map.queryRenderedFeatures( e.point, {
      layers: [ 'clusters' ]
    } );
    var clusterId = features[ 0 ].properties.cluster_id;
    map.getSource( 'drink' ).getClusterExpansionZoom(
      clusterId,
      function( err, zoom ) {
      if ( err ) return;
      map.easeTo( {
        center: features[ 0 ].geometry.coordinates,
        zoom: zoom
      } );
      }
    );
  } );


  map.on( 'mouseenter', 'clusters', function() {
    map.getCanvas().style.cursor = 'pointer';
  } );

  map.on( 'mouseleave', 'clusters', function() {
    map.getCanvas().style.cursor = '';
  } );

  map.setLayoutProperty('stratus', 'visibility', 'none');
  map.setLayoutProperty('health-problems', 'visibility', 'none');
  map.setLayoutProperty('medicine', 'visibility', 'none');
  map.setLayoutProperty('clusters', 'visibility', 'none');
  map.setLayoutProperty('cluster-count', 'visibility', 'none');
  map.setLayoutProperty('unclustered-point', 'visibility', 'none');
} 
);



function home() {
  map.flyTo( {
    center: init_center,
    zoom: init_zoom
  } );
}

var geocoder = new google.maps.Geocoder();

document.getElementById('geolocalizer').addEventListener('submit', function() {
  event.preventDefault();
  geocodeAddress(geocoder, map);
});


function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value + 'Bogota';
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.flyTo({ center: [results[0].geometry.location.lng(), results[0].geometry.location.lat() ],
                         speed: 0.4,
                         zoom: 16
                          });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

document.getElementById('blocks-switch').addEventListener('click', function() {
  layerActivation(this, map, layerDict[this.getAttribute('id')]);
});

document.getElementById('stratus-switch').addEventListener('click', function() {
  layerActivation(this, map, layerDict[this.getAttribute('id')]);
});

document.getElementById('medicine-switch').addEventListener('click', function() {
  layerActivation(this, map, layerDict[this.getAttribute('id')]);
});

document.getElementById('health-switch').addEventListener('click', function() {
  layerActivation(this, map, layerDict[this.getAttribute('id')]);
});

document.getElementById('parks-switch').addEventListener('click', function() {
  layerActivation(this, map, layerDict[this.getAttribute('id')]);
});

document.getElementById('drinks-switch').addEventListener('click', function() {
  layerActivation(this, map, layerDict[this.getAttribute('id')]);
});

document.getElementById('ciclovia-switch').addEventListener('click', function() {
  layerActivation(this, map, layerDict[this.getAttribute('id')]);
});

document.getElementById('cases-switch').addEventListener('click', function() {
  layerActivation(this, map, layerDict[this.getAttribute('id')]);
});


function layerActivation(element, map, layerName) {
  if (!element.checked){
    for(var i = 0; i < layerName.length; i++){
      map.setLayoutProperty(layerName[i], 'visibility', 'none');
    }
  }
  else {
    checkControl(element, element.className, map);
    for(var i = 0; i < layerName.length; i++){
      map.setLayoutProperty(layerName[i], 'visibility', 'visible');
    }
  }
}


// Function for going to locality

document.getElementById('locality').addEventListener('click', function() {
  goToLocality(this, map);
});


function goToLocality(element, map) {
  var locality = element.value;
  if (locality == ''){
    map.flyTo({
    center: init_center,
    zoom: init_zoom
    });
  }
  else if (locality == '01'){
    map.flyTo({
    center: [-74.02788208959142, 4.74192856124579],
    zoom: locality_zoom
    });
  }
  else if (locality == '02'){
    map.flyTo({
    center: [-74.03693917775986, 4.64492471805117],
    zoom: locality_zoom
    });
  }
  else if (locality == '03'){
    map.flyTo({
    center: [-74.03621758170057, 4.593972728743956],
    zoom: locality_zoom
    });
  }
  else if (locality == '04'){
    map.flyTo({
    center: [-74.06607256046094, 4.5487490090033385],
    zoom: locality_zoom
    });
  }
  else if (locality == '05'){
    map.flyTo({
    center: [-74.14280649581215, 4.390025128274849],
    zoom: locality_zoom
    });
  }
  else if (locality == '06'){
    map.flyTo({
    center: [-74.1359894514345, 4.5748413983800065],
    zoom: locality_zoom
    });    
  }
  else if (locality == '07'){
    map.flyTo({
    center: [-74.19438893454586, 4.621779959799866],
    zoom: locality_zoom
    });    
  }
  else if (locality == '08'){
    map.flyTo({
    center: [-74.15266762385428, 4.6303473513592195],
    zoom: locality_zoom
    });    
  }
  else if (locality == '09'){
    map.flyTo({
    center: [-74.1401513006095, 4.678182925982081],
    zoom: locality_zoom
    });    
  }
  else if (locality == '10'){
    map.flyTo({
    center: [-74.11318770312107, 4.701125563073614],
    zoom: locality_zoom
    });    
  }
  else if (locality == '11'){
    map.flyTo({
    center: [-74.07584527567741, 4.7632081213663655],
    zoom: locality_zoom
    });    
  }
  else if (locality == '12'){
    map.flyTo({
    center: [-74.07355160507866, 4.6695669333184355],
    zoom: locality_zoom
    });    
  }
  else if (locality == '13'){
    map.flyTo({
    center: [-74.08576901941154, 4.641173586578754],
    zoom: locality_zoom
    });    
  }
  else if (locality == '14'){
    map.flyTo({
    center: [-74.0879478679692, 4.607155935312403],
    zoom: locality_zoom
    });    
  }
  else if (locality == '15'){
    map.flyTo({
    center: [-74.1028424000994, 4.588770674831703],
    zoom: locality_zoom
    });    
  }
  else if (locality == '16'){
    map.flyTo({
    center: [-74.11158023364098, 4.616245470233725],
    zoom: locality_zoom
    });    
  }
  else if (locality == '17'){
    map.flyTo({
    center: [-74.0720707953353, 4.596605075161865],
    zoom: locality_zoom
    });    
  }
  else if (locality == '18'){
    map.flyTo({
    center: [-74.11336318304616, 4.566476900770854],
    zoom: locality_zoom
    });    
  }
  else if (locality == '19'){
    map.flyTo({
    center: [-74.16195890441996, 4.482460265888133],
    zoom: locality_zoom
    });    
  }
  else {
    map.flyTo({
    center: [-74.25697871802528, 4.036568747818626],
    zoom: locality_zoom
    });
  }
}


var layerDict ={
  'stratus-switch': ["stratus"],
  'health-switch': ["health-problems"],
  'medicine-switch': ["medicine"],
  'blocks-switch': ["blocks"],
  'drinks-switch': ["clusters", "cluster-count", "unclustered-point"],
  'cases-switch': ["cases-cluster", "cases-count"],
  'parks-switch': ["parks"],
  'ciclovia-switch': ["ciclovia"]
};

// Function to uncheck undesired layers

function checkControl(input, classDown, map)
    {
      
      var checkboxes = document.getElementsByClassName(classDown);
      
      for(var i = 0; i < checkboxes.length; i++)
      {
        //uncheck all
        if(checkboxes[i].checked == true)
        {
          checkboxes[i].checked = false;
          layerActivation(checkboxes[i], map, layerDict[checkboxes[i].getAttribute('id')]);
        }
      }
      
      //set checked of clicked object
      if(input.checked == true)
      {
        input.checked = false;
      }
      else
      {
        input.checked = true;
      } 
    }