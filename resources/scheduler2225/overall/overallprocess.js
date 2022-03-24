Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);

function string2date(str) {
    
    var arr =str.split('/');
    var date = new Date();
 	
 	date.setFullYear(		parseInt(arr[0])	);
	date.setMonth(			parseInt(arr[1])-1	);
	date.setDate(			parseInt(arr[2])	);
	
    return date;              
}

var resourceStore = null;
var eventStore = null;
Ext.onReady(function () {
	
      Sch.preset.Manager.registerPreset("dayNightShift", {
        timeColumnWidth   : 35,
        rowHeight         : 32,
        displayDateFormat : 'G:i',
        shiftIncrement    : 1,
        shiftUnit         : "DAY",
        timeResolution    : {
            unit      : "MINUTE",
            increment : 15
        },
        defaultSpan       : 24,
        headerConfig      : {
            bottom : {
                unit       : "HOUR",
                increment  : 1,
                dateFormat : 'G'
            },
            middle : {
                unit      : "HOUR",
                increment : 12,
                renderer  : function (startDate, endDate, headerConfig, cellIdx) {
                    // Setting align on the header config object
                    headerConfig.align = 'center';

                    if (startDate.getHours() === 0) {
                        // Setting a custom CSS on the header cell element
                        headerConfig.headerCls = 'nightShift';
                        return Ext.Date.format(startDate, 'M d') + ' Night Shift';
                    }
                    else {
                        // Setting a custom CSS on the header cell element
                        headerConfig.headerCls = 'dayShift';
                        return Ext.Date.format(startDate, 'M d') + ' Day Shift';
                    }
                }
            },
            top    : {
                unit       : "DAY",
                increment  : 1,
                dateFormat : 'Y M d'
            }
        }
    });
      
      Ext.define('MyResource', {
          extend : 'Sch.model.Resource',
          fields : ['pj_code', 'pj_name', 'region', 'wa_name']
      });
      
		resourceStore = Ext.create('Sch.data.ResourceStore', {
			model : 'MyResource'
      });

      Ext.define('MyEvent', {
          extend : 'Sch.model.Event',
          fields : ['PercentAllocated']
      });

      // Store holding all the events
      eventStore = Ext.create('Sch.data.EventStore', {
          model : 'MyEvent'//,
//          data  : [
//              {ResourceId : 'r1', PercentAllocated : 60, StartDate : new Date(2014, 9, 1), EndDate : new Date(2015, 0, 1)},
//              {ResourceId : 'r2', PercentAllocated : 20, StartDate : new Date(2015, 0, 1), EndDate : new Date(2015, 6, 1)},
//              {ResourceId : 'r3', PercentAllocated : 80, StartDate : new Date(2015, 3, 1), EndDate : new Date(2015, 9, 1)},
//              {ResourceId : 'r6', PercentAllocated : 100, StartDate : new Date(2015, 6, 1), EndDate : new Date(2015, 9, 1)}
//          ]
      });
      
      
      if(parent!=null && parent.PROJECTLIST_DATA!=null) { //Parent에서 로드했으면...
    	  
  
          resourceStore.loadData(parent.PROJECTLIST_DATA);
          for(var i=0; i<parent.EVENT_DATA.length; i++) {
          	var o = {};
          	o['Id'] = (parent.EVENT_DATA[i])['Id'];
          	o['ResourceId'] = (parent.EVENT_DATA[i])['ResourceId'];
          	o['PercentAllocated'] = (parent.EVENT_DATA[i])['PercentAllocated'];
          	o['StartDate'] = string2date((parent.EVENT_DATA[i])['StartDate']);
          	o['EndDate'] = string2date((parent.EVENT_DATA[i])['EndDate']);
          	//console_log(o);
    			eventStore.add(o);
          }
          
          App.Scheduler.init();  
      } else {//Parent가 없으면 로드한다.
    	  
    	  var PROJECTLIST_DATA = [];
  		  var EVENT_DATA = [];
  		
  		function threecomma(value) {
          	return Ext.util.Format.number(value, '0,00/i');
          }
  		
      	var arr_done = [11,80,13,99,60,87,20,10,80,70];
       	function treatRecord(records) {
   	         if (records && records[0]) {
//                   PROJECTLIST_DATA.splice(0,PROJECTLIST_DATA.length);
//                   EVENT_DATA.splice(0,EVENT_DATA.length);
                   
                   for(var i=0; i<records.length; i++) {
                   	var id = records[i].get('id');
   	                var region = records[i].get('region');
   	                var wa_name = records[i].get('wa_name');
   	                var pm_name = records[i].get('pm_name');
   	                var pl_name = records[i].get('pl_name');
   	                var pj_code = records[i].get('pj_code');
   	                var pj_name = records[i].get('pj_name');
   	                var selling_price =  records[i].get('selling_price');
   	                var regist_date = records[i].get('regist_date');
   	                var quan = records[i].get('quan');
   	                if(regist_date!=null) {
   	                	regist_date = regist_date.substring(0,10);
   	                }
   	                var delivery_plan =  records[i].get('delivery_plan');
   	                if(delivery_plan!=null){
   	                	delivery_plan = delivery_plan.substring(0,10);
   	                }
   	                var full_desc =  region + '<br />' + wa_name;
   	                
   	                regist_delivry = regist_date + '<br />';
   	                if(delivery_plan!=null) {
   	                	regist_delivry = regist_delivry +  delivery_plan;
   	                }	                
   	               
   	                
   	                records[i].set('full_desc', full_desc);
   	                records[i].set('regist_delivry', regist_delivry);

   	                records[i].set('selling_price_quan', threecomma(selling_price) + '<br />' + quan);
   	                records[i].set('pm_pl', pm_name + '<br />' + pl_name);
   	                records[i].set('progress', (i+1)*10 + '%<br/>' + (i*10) + '%');
   	                
   	                var chartId = 'r' + (i+1);
   	                
   	                PROJECTLIST_DATA.push(
   	                	{Id : id, Name : full_desc, pj_code : pj_code, pj_name : pj_name, wa_name : wa_name }
   	                );
   	              
   	                if(regist_date!=null && delivery_plan!=null) {
   		                EVENT_DATA.push(
   		                	{id: (i+1), ResourceId : id, PercentAllocated : arr_done[i], StartDate : regist_date, EndDate : delivery_plan}
   		                );
   	                }
     	         }//endof for
                   
       			resourceStore.loadData(PROJECTLIST_DATA);
      	        
      	        for(var i=0; i<EVENT_DATA.length; i++) {
      	        	var o = {};
      	        	o['Id'] = (EVENT_DATA[i])['Id'];
      	        	o['ResourceId'] = (EVENT_DATA[i])['ResourceId'];
      	        	o['PercentAllocated'] = (EVENT_DATA[i])['PercentAllocated'];
      	        	o['StartDate'] = string2date((EVENT_DATA[i])['StartDate']);
      	        	o['EndDate'] = string2date((EVENT_DATA[i])['EndDate']);
      	        	//console_log(o);
      				eventStore.add(o);
      	        }//endoffor
      	        
   	         }//endoftif
       	}//endoftreat
       	
       	
      	(Ext.create('Ext.data.JsonStore', {
            fields: [
                     {name: 'region'}, 
                     {name: 'id'}, 
                     {name: 'wa_name'}, 
                     {name: 'pm_name' },
                     {name: 'pl_name' },
                     {name: 'pj_code' },
                     {name: 'regist_date' },
                     {name: 'delivery_plan'}
                     
                    ]
  			,proxy: {
  			        type: 'ajax',
  			        url: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread&menu_code=EPJ2',//'resources/data/full_data.json',
  			        reader: {
  			        	type: 'json',
  			        	root: 'datas'
  			        }//endofreader
  			    }//endofproxy
  		
    	}) ).load(function(records) { 
    		//console.log('records', records);
    		treatRecord(records)
    		
    		//Loading된 후 init한다.
    		App.Scheduler.init();
    	
    	});
       	
       	
       	
       	
       	
       	
      }//endof noparent
    
    
});

App.Scheduler = {

    // Initialize application
    init : function () {

		var sched = Ext.create("Sch.panel.SchedulerGrid", {
			align       : 'center',
			id: 'sched-panel',
	        border            : false,
	        rowHeight         : 35,
	        eventBodyTemplate : new Ext.XTemplate(
	            '<div class="sch-percent-allocated-bar" style="height:{PercentAllocated}%"></div><span class="sch-percent-allocated-text">{[values.PercentAllocated||0]}%</span>'
	        ).compile(),
	
	        // Define static columns
	        columns           : [
	            {header : '프로젝트<br/>고객사', width : 160, dataIndex : 'Name'}
	        ]
	        ,		
	        region    : 'center',
            border            : false,
	        startDate         : new Date(2014, 9, 1),
	        endDate           : new Date(2015, 9, 1),
	        resourceStore : resourceStore,
	        eventStore    : eventStore,
			tbar : [
	        /*
                {
                    text         : 'Seconds',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('secondAndMinute', new Date(2014, 0, 1, 8), new Date(2014, 0, 1, 9));
                    }
                },
                {
                    text         : 'Minutes',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('minuteAndHour', new Date(2014, 0, 1, 8), new Date(2014, 0, 1, 10));
                    }
                },
                {
                    text         : 'Hours',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    pressed      : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('hourAndDay', new Date(2014, 0, 1, 8), new Date(2014, 0, 1, 18));
                    }
                },
                
                {
                    text         : 'Days',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('weekAndDay', new Date(2014, 0, 1), new Date(2014, 0, 21));
                    }
                },
                {
                    text         : 'Weeks',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('weekAndMonth');
                    }
                },
                */
                {
                    text         : '주간',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('weekAndDayLetter', new Date(2014, 9, 1), new Date(2015, 9, 1));
                    }
                },
                {
                    text         : '주별',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('weekDateAndMonth', new Date(2014, 9, 1), new Date(2015, 9, 1));
                    }
                },
                {
                    text        : '월별',
                    toggleGroup : 'presets',
                    iconCls     : 'icon-calendar',
                    handler     : function () {
                        sched.switchViewPreset('monthAndYear', new Date(2014, 9, 1), new Date(2015, 9, 1));
                    }
                },
                {
                    text         : '분기별',
                    enableToggle : true,
                    toggleGroup  : 'presets',
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('year', new Date(2014, 0, 1), new Date(2016, 0, 1));
                    }
                },
//                {
//                    text         : '1년',
//                    enableToggle : true,
//                    toggleGroup  : 'presets',
//                    iconCls      : 'icon-calendar',
//                    handler      : function () {
//                        sched.switchViewPreset('manyYears', new Date(2014, 0, 1), new Date(2016, 0, 1));
//                    }
//                },
                '->',
                /*
                {
                    text         : 'Day and night shift (custom)',
                    enableToggle : true,
                    toggleGroup  : 'presets',
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('dayNightShift', new Date(2014, 0, 1), new Date(2014, 0, 2));
                    }
                },
                */
                {
                    text    : '확대',
                    scale   : 'medium',
                    iconCls : 'zoomIn',
                    handler : function () {
                        sched.zoomIn();
                    }
                },
                {
                    text    : '축소',
                    scale   : 'medium',
                    iconCls : 'zoomOut',
                    handler : function () {
                        sched.zoomOut();
                    }
                }
            ]
		});
		sched.switchViewPreset('year', new Date(2014, 0, 1), new Date(2016, 0, 1));
		//sched.switchViewPreset('weekDateAndMonth');
//		var panel = Ext.getCmp('sched-panel');
//		console_log(panel);
//		var tool = panel.getTopToolbar();
//		console_log(tool);
//		tool.getEl().dom.style.background = '#ECEDEE';
		
        //
		var vp = new Ext.Viewport({
	        layout : 'border',
	        items  : [sched]
		});
	   	return vp.down('schedulergrid');    	 

    }//endof init
};



