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
      'fill-color': '#165916',
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
        '#f2ee05',
        100,
        '#f7900a',
        750,
        '#f0071e'
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
      'circle-color': '#f2ee05',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#f2ee05'
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

} 
);



function home() {
  map.flyTo( {
    center: init_center,
    zoom: init_zoom
  } );
}

async function get_prediction(event){
  const form_element = document.getElementById('diagnosis-form');
  event.preventDefault();
  const respuesta = await fetch('http://127.0.0.1:5000/api/ckd-diagnosis/read', {
                            method: 'POST',
                            headers: {
                            "Access-Control-Allow-Origin": '*'
                            },
                            body: new FormData(form_element),
                          });
  const data  = await respuesta.json();
  
  map.flyTo({
    center: [data['lng'], data['lat']],
    zoom: 16
    });

  map.setPaintProperty('parks', 'fill-color', ['match', ['get', 'OBJECTID'],
                   data['park_id'], '#940000',
                   '#165916']);
  let formRes = document.getElementById('form-results');
  document.getElementById('form-container').remove();
  return_results(data, formRes)
}

var foodList ={
  'protein': 'Proteinas',
  'legumes': 'Leguminosas',
  'fats': 'Grasas',
  'meal': 'Harinas',
  'sugars': 'Azúcares',
  'dairy': 'Lácteos',
  'vegetables': 'Verduras',
  'fruits': 'Frutas',
  'alcohol': 'Alcohol'
};

function return_results(answer, element){
  var CKDprob = answer['probability'];
  var title = document.createElement('h3');
  var textnode = document.createTextNode("Resultados");
  title.appendChild(textnode);
  title.className = "vulnerability-title";
  element.appendChild(title);
  var probability = document.createElement('h4');
  var textnode = document.createTextNode("Probabilidad");
  probability.appendChild(textnode);
  element.appendChild(probability);
  var probParagraph = document.createElement('p');
  var textnode = document.createTextNode("Teniendo en cuenta sus antecedentes médicos, usted tiene una probabilidad de " + CKDprob + "% de desarrollar ERC");
  probParagraph.appendChild(textnode);
  element.appendChild(probParagraph);
  var diet = document.createElement('h4');
  var textnode = document.createTextNode("Dieta sugerida");
  diet.appendChild(textnode);
  element.appendChild(diet);
  var protein = document.createElement('h5');
  var textnode = document.createTextNode("Proteinas");
  protein.appendChild(textnode);
  element.appendChild(protein);
  var proteinParagraph = document.createElement('p');
  proteinParagraph.className = "diet-paragraph";
  var textnode = document.createTextNode(answer['protein']);
  proteinParagraph.appendChild(textnode);
  element.appendChild(proteinParagraph);
  var fats = document.createElement('h5');
  var textnode = document.createTextNode("Grasas");
  fats.appendChild(textnode);
  element.appendChild(fats);
  var fatsParagraph = document.createElement('p');
  fatsParagraph.className = "diet-paragraph";
  var textnode = document.createTextNode(answer['fats']);
  fatsParagraph.appendChild(textnode);
  element.appendChild(fatsParagraph);
  var meal = document.createElement('h5');
  var textnode = document.createTextNode("Harinas");
  meal.appendChild(textnode);
  element.appendChild(meal);
  var mealParagraph = document.createElement('p');
  mealParagraph.className = "diet-paragraph";
  var textnode = document.createTextNode(answer['meals']);
  mealParagraph.appendChild(textnode);
  element.appendChild(mealParagraph);
  var sugars = document.createElement('h5');
  var textnode = document.createTextNode("Azúcares");
  sugars.appendChild(textnode);
  element.appendChild(sugars);
  var sugarsParagraph = document.createElement('p');
  sugarsParagraph.className = "diet-paragraph";
  var textnode = document.createTextNode(answer['sugars']);
  sugarsParagraph.appendChild(textnode);
  element.appendChild(sugarsParagraph);
  var alcohol = document.createElement('h5');
  var textnode = document.createTextNode("Alcohol");
  alcohol.appendChild(textnode);
  element.appendChild(alcohol);
  var alcoholParagraph = document.createElement('p');
  alcoholParagraph.className = "diet-paragraph";
  var textnode = document.createTextNode(answer['alcohol']);
  alcoholParagraph.appendChild(textnode);
  element.appendChild(alcoholParagraph);
}

console.log(Object.keys(foodList)[0]);

document.getElementById('diagnosis-form').addEventListener('submit', get_prediction);