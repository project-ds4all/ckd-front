// THIS IS THE RANGE SLIDER LOGIC DO NOT CHANGE !!
var ZBRangeSlider = function(id) { 
  var self = this;
  var startX = 0, x = 0;

  // retrieve touch button
  var slider     = document.getElementById(id)
  var touchLeft  = slider.querySelector('.slider-touch-left');
  var touchRight = slider.querySelector('.slider-touch-right');
  var lineSpan   = slider.querySelector('.slider-line span');
  
  // get some properties
  var min   = parseFloat(slider.getAttribute('se-min'));
  var max   = parseFloat(slider.getAttribute('se-max'));
  
  // retrieve default values
  var defaultMinValue = min;
  if(slider.hasAttribute('se-min-value'))
  {
    defaultMinValue = parseFloat(slider.getAttribute('se-min-value'));  
  }
  var defaultMaxValue = max;
  
  if(slider.hasAttribute('se-max-value'))
  {
    defaultMaxValue = parseFloat(slider.getAttribute('se-max-value'));  
  }
  
  // check values are correct
  if(defaultMinValue < min)
  {
    defaultMinValue = min;
  }
  
  if(defaultMaxValue > max)
  {
    defaultMaxValue = max;
  }
  
  if(defaultMinValue > defaultMaxValue)
  {
    defaultMinValue = defaultMaxValue;
  }
  
  var step  = 0.0;
  
  if (slider.getAttribute('se-step'))
  {
    step  = Math.abs(parseFloat(slider.getAttribute('se-step')));
  }
  
  // normalize flag
  var normalizeFact = 26;
  
  self.slider = slider;
  self.reset = function() {
    touchLeft.style.left = '0px';
    touchRight.style.left = (slider.offsetWidth - touchLeft.offsetWidth) + 'px';
    lineSpan.style.marginLeft = '0px';
    lineSpan.style.width = (slider.offsetWidth - touchLeft.offsetWidth) + 'px';
    startX = 0;
    x = 0;
  };
  
  self.setMinValue = function(minValue)
  {
    var ratio = ((minValue - min) / (max - min));
    touchLeft.style.left = Math.ceil(ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact))) + 'px';
    lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
    lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px';
    slider.setAttribute('se-min-value', minValue);
  }
  
  self.setMaxValue = function(maxValue)
  {
    var ratio = ((maxValue - min) / (max - min));
    touchRight.style.left = Math.ceil(ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact)) + normalizeFact) + 'px';
    lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
    lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px';
    slider.setAttribute('se-max-value', maxValue);
  }
  
  // initial reset
  self.reset();
  
  // usefull values, min, max, normalize fact is the width of both touch buttons
  var maxX = slider.offsetWidth - touchRight.offsetWidth;
  var selectedTouch = null;
  var initialValue = (lineSpan.offsetWidth - normalizeFact);

  // set defualt values
  self.setMinValue(defaultMinValue);
  self.setMaxValue(defaultMaxValue);
  
  // setup touch/click events
  function onStart(event) {
    
    // Prevent default dragging of selected content
    event.preventDefault();
    var eventTouch = event;

    if (event.touches)
    {
      eventTouch = event.touches[0];
    }
    
    if(this === touchLeft)
    {
      x = touchLeft.offsetLeft;
    }
    else
    {
      x = touchRight.offsetLeft;
    }

    startX = eventTouch.pageX - x;
    selectedTouch = this;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onStop);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onStop);
    

  }
  
  function onMove(event) {
    var eventTouch = event;

    if (event.touches)
    {
      eventTouch = event.touches[0];
    }

    x = eventTouch.pageX - startX;
    
    if (selectedTouch === touchLeft)
    {
      if(x > (touchRight.offsetLeft - selectedTouch.offsetWidth + 10))
      {
        x = (touchRight.offsetLeft - selectedTouch.offsetWidth + 10)
      }
      else if(x < 0)
      {
        x = 0;
      }
      
      selectedTouch.style.left = x + 'px';
    }
    else if (selectedTouch === touchRight)
    {
      if(x < (touchLeft.offsetLeft + touchLeft.offsetWidth - 10))
      {
        x = (touchLeft.offsetLeft + touchLeft.offsetWidth - 10)
      }
      else if(x > maxX)
      {
        x = maxX;
      }
      selectedTouch.style.left = x + 'px';
    }
    
    // update line span
    lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
    lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px';
    
    // write new value
    calculateValue();
    
    // call on change
    if(slider.getAttribute('on-change'))
    {
      var fn = new Function('min, max', slider.getAttribute('on-change'));
      fn(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }
    
    if(self.onChange)
    {
      self.onChange(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }
    
  }
  
  function onStop(event) {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onStop);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onStop);
    
    selectedTouch = null;

    // write new value
    calculateValue();
    
    // call did changed
    if(slider.getAttribute('did-changed'))
    {
      var fn = new Function('min, max', slider.getAttribute('did-changed'));
      fn(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }
    
    if(self.didChanged)
    {
      self.didChanged(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }
  }
  
  function calculateValue() {
    var newValue = (lineSpan.offsetWidth - normalizeFact) / initialValue;
    var minValue = lineSpan.offsetLeft / initialValue;
    var maxValue = minValue + newValue;

    var minValue = minValue * (max - min) + min;
    var maxValue = maxValue * (max - min) + min;
    
    if (step !== 0.0)
    {
      var multi = Math.floor((minValue / step));
      minValue = step * multi;
      
      multi = Math.floor((maxValue / step));
      maxValue = step * multi;
    }
    
    slider.setAttribute('se-min-value', minValue);
    slider.setAttribute('se-max-value', maxValue);
  }
  
  // link events
  touchLeft.addEventListener('mousedown', onStart);
  touchRight.addEventListener('mousedown', onStart);
  touchLeft.addEventListener('touchstart', onStart);
  touchRight.addEventListener('touchstart', onStart);
};

// -------------------
// How to use? 
var newRangeSlider = new ZBRangeSlider('my-slider');

newRangeSlider.onChange = function(min, max)
{
  document.getElementById('result').innerHTML = 'Año inicio: ' + min + '  Año fin: ' + max;
}

newRangeSlider.didChanged = function(min, max)
{
  document.getElementById('result').innerHTML = 'Año inicio: ' + min + '  Año fin: ' + max;
  graphsUpdate();
}


//map plot creation


async function makeplotMap(genders, years, group, indicator) {
  if(indicator == 'Prevalencia'){
    var value = 'Número de Personas Atendidas';
  }
  else{
    var value = 'Condicion Final_Muerto';
  }
  request_json ={
                  genders:  genders,
                  years: years,
                  values: value,
                  indexes: "Departamento",
                  columns: "",
                  group: group
                };
  const respuesta = await fetch('https://ckd-diagnosis.herokuapp.com/api/ckd-diagnosis/info', {
                            method: 'POST',
                            headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(request_json),
                          });
  const data  = await respuesta.json();
  makePlotlyMap(data['Departamento'], data[value], indicator)
};

function makePlotlyMap(locts, values, indicator){
  if (indicator == 'Prevalencia'){
    var data = [{
     type: "choroplethmapbox",  
     geojson: "./data/colombia_departamentos.json",
     locations: locts,
     z: values,
     colorbar: {y: 0, yanchor: "bottom", title: {text: "Prevalencia", side: "top"}}}
     ];

     var title = 'Prevalencia ERC en colombia';

  }
  else {
    var data = [{
     type: "choroplethmapbox",  
     geojson: "./data/colombia_departamentos.json",
     locations: locts,
     z: values,
     colorbar: {y: 0, yanchor: "bottom", title: {text: "Muertes", side: "top"}}}
     ]; 

     var title = 'Muertes ERC en colombia';

  }

  var layout = {mapbox: {style: "carto-positron", center: {lon: -74.2973328, lat: 4.570868}, zoom: 3.7}, margin: {t: 0, b: 0, l: 0}};

  var config = {mapboxAccessToken: "pk.eyJ1IjoianVhbmhlcjk0IiwiYSI6ImNrYmZlOWd6dTB1c2wyc250NXlzZzVnN2QifQ.5rjKBtByyiPHoTTJru7lmA",
                responsive: true};

  var d3 = Plotly.d3;

  var HEIGHT_IN_PERCENT_OF_PARENT = 90;
  var WIDTH_IN_PERCENT_OF_PARENT = 100;

  var gd3 = d3.select('#colombia-map').append('div').style({
                 height: HEIGHT_IN_PERCENT_OF_PARENT + '%',
                 width: WIDTH_IN_PERCENT_OF_PARENT + '%'
            }).text(title);

  var gd = gd3.node();
  Plotly.newPlot(gd, data, layout, config);
  window.onresize = function() {
      Plotly.Plots.resize(gd);
  };

};

makeplotMap('Hombre,Mujer', '2017,2018,2019', 'sum' ,'Prevalencia');

// Cost bar plot
async function makeplotCost(genders, years, group) {
  request_json ={
                  genders:  genders,
                  years: years,
                  values: "Costo Total",
                  indexes: "Año",
                  columns: "Tipo",
                  group: group
                };
  const respuesta = await fetch('https://ckd-diagnosis.herokuapp.com/api/ckd-diagnosis/info', {
                            method: 'POST',
                            headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(request_json),
                          });
  const data  = await respuesta.json();
  makePlotlyCost(data['Año'], data['Aguda'], data['Crónica'])

};

function makePlotlyCost( x, y1, y2){
  var trace1 = {
    x: x,
    y: y1,
    name: 'Aguda',
    type: 'bar',
    marker: {
      color: 'lightsalmon'
    }
  };

  var trace2 = {
    x: x,
    y: y2,
    name: 'Crónica',
    type: 'bar',
    marker: {
      color: 'indianred'
    }
  };

  var data = [trace1, trace2];

  var layout = {barmode: 'group',
                yaxis: {
                  title: 'COP',
                  titlefont_size: 16,
                  tickfont_size: 14
                },
                legend: {
                  x: 1,
                  y: 1
                },
                bargap: 0.15,
                bargroupgap: 0.1,
                margin: {
                  t: 10,
                  b: 25,
                  l: 50,
                  r: 30
                }
                };
  var config = {responsive: true};
  var d3 = Plotly.d3;

  var HEIGHT_IN_PERCENT_OF_PARENT = 90;
  var WIDTH_IN_PERCENT_OF_PARENT = 100;

  var gd3 = d3.select('#cost-bars').append('div').style({
                 height: HEIGHT_IN_PERCENT_OF_PARENT + '%',
                 width: WIDTH_IN_PERCENT_OF_PARENT + '%'
            }).text('Costo ERC en Colombia');

  var gd = gd3.node();
  Plotly.plot(gd, data, layout, config);
  window.onresize = function() {
      Plotly.Plots.resize(gd);
  };
};

makeplotCost('Hombre,Mujer', '2017,2018,2019', 'sum');

// Prevalence bar plot

async function makeplotStates(genders, years, indicator) {
  if(indicator == 'Prevalencia'){
    var value = 'Número de Personas Atendidas';
  }
  else{
    var value = 'Condicion Final_Muerto';
  }
  request_json ={
                  genders:  genders,
                  years: years,
                  values: value,
                  indexes: "Departamento",
                  columns: "Año",
                  group: "sum"
                };
  const respuesta = await fetch('https://ckd-diagnosis.herokuapp.com/api/ckd-diagnosis/info', {
                            method: 'POST',
                            headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(request_json),
                          });
  const data  = await respuesta.json();
  makePlotlyStates(data, indicator);
};


function makePlotlyStates( jsonData, indicator){
  if (indicator == 'Prevalencia') {
    var title = "Prevalencia ERC por Departamento";
  }
  else {
    var title = "Muertes ERC por Departamento";
  }

  var colorList = {
    '2015': 'rgb(252,146,114)',
    '2016': 'rgb(251,106,74)',
    '2017': 'rgb(239,59,44)',
    '2018': 'rgb(203,24,29)',
    '2019': 'rgb(103,0,13)',
  }

  var data = [];
  Object.keys(jsonData).forEach(function(key) {
    if (key != 'Departamento'){
      var trace = {
        x: jsonData['Departamento'],
        y: jsonData[key],
        name: key,
        type: 'bar',
        marker: {
        color: colorList[key]
      }
      }
      data.push(trace);
    } 
  });

  var layout = {barmode: 'group',
                legend: {
                  x: 1,
                  y: 1
                },
                margin: {
                  r: 0,
                  t: 10
                }
                };

  var config = {responsive: true};
  var d3 = Plotly.d3;

  var HEIGHT_IN_PERCENT_OF_PARENT = 90;
  var WIDTH_IN_PERCENT_OF_PARENT = 100;

  var gd3 = d3.select('#prevalence-bars').append('div').style({
                 height: HEIGHT_IN_PERCENT_OF_PARENT + '%',
                 width: WIDTH_IN_PERCENT_OF_PARENT + '%'
            }).text(title);

  var gd = gd3.node();
  Plotly.plot(gd, data, layout, config);
  window.onresize = function() {
      Plotly.Plots.resize(gd);
  };
};

makeplotStates('Hombre,Mujer', '2017,2018,2019','Prevalencia');

// Diseases treemap

function makeplotDiseases() {
  Plotly.d3.csv("./data/disease_counts.csv", function(data){ processDataDiseases(data) } );

};

function processDataDiseases(allRows) {

  var counts = [], description = [], parents = [];

  for (var i=0; i<allRows.length; i++) {
    row = allRows[i];
    counts.push( row['count'] );
    description.push( row['Descripcion'] );
    parents.push( row['parent']);
  }
  makePlotlyDiseases( counts, description, parents);
}

function makePlotlyDiseases( counts, description, parents){

  var data = [{
  type: 'treemap',
  values: counts,
  labels: description,
  parents: parents,
  marker: {
    colors: [
      'maroon','firebrick','salmon','salmon','lightsalmon',
      'lightsalmon','mistyrose','mistyrose','lavenderblush',
      'lavenderblush','lavenderblush'
    ]
  }
  }]

  var layout = {
    margin: {
      t: 0,
      b: 0,
      r: 0,
      l: 0
    }
  };

  var config = {responsive: true};

  var d3 = Plotly.d3;

  var HEIGHT_IN_PERCENT_OF_PARENT = 90;
  var WIDTH_IN_PERCENT_OF_PARENT = 100;

  var gd3 = d3.select('#diseases-treemap').append('div').style({
                 height: HEIGHT_IN_PERCENT_OF_PARENT + '%',
                 width: WIDTH_IN_PERCENT_OF_PARENT + '%'
            }).text('Enfermedades relacionadas con ERC en Colombia');

  var gd = gd3.node();
  Plotly.plot(gd, data, layout, config);
  window.onresize = function() {
      Plotly.Plots.resize(gd);
  };
};

makeplotDiseases();

// Gender bars

async function makeplotGender(genders, years, group, indicator) {
  if(indicator == 'Prevalencia'){
    var value = 'Número de Personas Atendidas';
  }
  else{
    var value = 'Condicion Final_Muerto';
  }
  request_json ={
                  genders:  genders,
                  years: years,
                  values: value,
                  indexes: "Grupo Edad",
                  columns: "Sexo",
                  group: group
                };
  const respuesta = await fetch('https://ckd-diagnosis.herokuapp.com/api/ckd-diagnosis/info', {
                            method: 'POST',
                            headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(request_json),
                          });
  const data  = await respuesta.json();


  makePlotlyGender(data, indicator);
}

function makePlotlyGender(jsonData, indicator){
  if (indicator == 'Prevalencia') {
    var title = "Prevalencia ERC por Género y Edad";
  }
  else {
    var title = "Muertes ERC por Género y Edad";
  }

  var colorList = {
    'Hombre': 'indianred',
    'Mujer': 'lightsalmon'
  }

  var data = [];
  Object.keys(jsonData).forEach(function(key) {
    if (key != 'Grupo Edad'){
      var trace = {
        y: jsonData['Grupo Edad'],
        x: jsonData[key],
        name: key,
        type: 'bar',
        orientation: 'h',
        marker: {
        color: colorList[key]
      }
      }
      data.push(trace);
    } 
  });

  var layout = {barmode: 'group',
                legend: {
                  x: 1,
                  y: 1
                },
                margin: {
                  r: 0,
                  t: 12,
                  b: 0
                }
                };
 
  var config = {responsive: true};

  var d3 = Plotly.d3;

  var HEIGHT_IN_PERCENT_OF_PARENT = 90;
  var WIDTH_IN_PERCENT_OF_PARENT = 100;

  var gd3 = d3.select('#gender-bars').append('div').style({
                 height: HEIGHT_IN_PERCENT_OF_PARENT + '%',
                 width: WIDTH_IN_PERCENT_OF_PARENT + '%'
            }).text(title);

  var gd = gd3.node();
  Plotly.plot(gd, data, layout, config);
  window.onresize = function() {
      Plotly.Plots.resize(gd);
  };
};

makeplotGender('Hombre,Mujer', '2017,2018,2019', 'sum' ,'Prevalencia');

// Update map plot

document.getElementById('info-type').addEventListener('change', function() {
  graphsUpdate();
});

document.getElementById('genders').addEventListener('change', function() {
  graphsUpdate();
});

document.getElementById('group-operation').addEventListener('change', function() {
  graphsUpdate();
});

function updateplotMap(genders, years, group, indicator){
  let map = document.getElementById('colombia-map');
  map.removeChild(map.firstChild);
  makeplotMap(genders, years, group, indicator);
}

function updateplotCost(genders, years, group){
  let cost = document.getElementById('cost-bars');
  cost.removeChild(cost.firstChild);
  makeplotCost(genders, years, group);
}

function updateplotStates(genders, years, indicator){
  let states = document.getElementById('prevalence-bars');
  states.removeChild(states.firstChild);
  makeplotStates(genders, years, indicator);
}

function updateplotGender(genders, years, group, indicator){
  let gendersPlot = document.getElementById('gender-bars');
  gendersPlot.removeChild(gendersPlot.firstChild);
  makeplotGender(genders, years, group, indicator);
}

function graphsUpdate() {
  var indicator = document.getElementById('info-type').value;
  var genders =  document.getElementById('genders').value;
  var group = document.getElementById('group-operation').value;
  var dateInit = document.getElementById('my-slider').getAttribute('se-min-value');
  var dateEnd = document.getElementById('my-slider').getAttribute('se-max-value');
  updateplotMap(genders, range(dateInit,dateEnd), group, indicator);
  updateplotCost(genders, range(dateInit,dateEnd), group);
  updateplotStates(genders, range(dateInit,dateEnd), indicator);
  updateplotGender(genders, range(dateInit,dateEnd), group, indicator);
}

function range(init, end){
  var answer = [];
  if (init == end){
    answer.push(init);
  }
  else{
    for (var i=init; i<=end; i++) {
      answer.push(i);
    }
  }
  return answer.join();
}
