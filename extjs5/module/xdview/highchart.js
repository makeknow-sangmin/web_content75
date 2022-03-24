    //$('#container1').hide();

    var  gColumnChartStyle = {
	    	            type: 'column',
	    	            spacingTop: 10,
				        spacingRight: 20,
				        spacingBottom: 20,
				        spacingLeft: 20,
	    	            borderColor: 'transparent',
	    	            backgroundColor: 'transparent',
	    	            borderWidth: 0,  
	    	            borderRadius: '0px'
	    	        };
    
    var  gColumnChartStyleSmall = {
	    	            type: 'column',
	    	            marginTop: 25,
				        spacingRight: 20,
				        spacingBottom: 10,
				        spacingLeft: 20,
	    	            borderColor: 'transparent',
	    	            backgroundColor: 'transparent',
	    	            borderWidth: 0,  
	    	            borderRadius: '0px'
	    	        };
    var gChartTitleStyle  = { 
    		//"color": "#157FCC", 
    		//"fontSize": "15px", 
    		//"fontWeight": "bold",
    		"useHTML": "true"};
    
  Highcharts.theme = {
	 global: {
			useUTC: false
	 }
	 ,colors: ['#B0D698', '#3493DF',  '#084695', '#FFD57E', '#979797', '#AA4643',  '#FF9655', '#FFF263', '#6AF9C4']
	 ,credits: {
            enabled: false
     },
     lang: {
        	thousandsSep: ',',
        	decimalPoint: '.',
        	
     }
  };

// // // Apply the theme
  var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

  highchartsOptions.colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
	    
	    var colorE= '#FFFFFF';
    	switch(color) {
    	case '#B0D698':
    		colorE= '#4D9624';
    		break;
    	case '#3493DF':
    		colorE= '#215989';
    		break;
    	case '#084695':
    		colorE= '#05214F';
    		break;
    	case '#FFD57E':
    		colorE= '#D39324';
    		break;
    	case '#979797':
    		colorE= '#5D5E64';
    		break;
    	case '#AA4643':
    		colorE= '#E05555';
    		break;
   		default:
   			 colorE= '#AAAAAA';
    	}
    	
        return {
			linearGradient :  { x1: 0, y1: 0,  x2: 1, y2: 0 },//[0, 0, 100, 0],
			gradientUnits: 'objectBoundingBox',
            stops: [
                [0, color],
                [1, colorE/*ghcharts.Color(color).brighten(-0.3).get('rgb')*/ ] // darken
            ]
        };
    });
	    
    function gotoChartMain() {
    	
    	//var loc = "/xdview/index.do?method=main" + window.location.hash;
    	//console_logs('loc', loc);
    	//$(window.document.location).attr("href", loc);
    	window.location.reload();//href = loc;
    }