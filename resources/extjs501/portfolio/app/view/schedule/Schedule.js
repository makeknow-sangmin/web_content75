Ext.require('Ext.chart.series.Bar');
Ext.require('Ext.chart.series.Radar');
Ext.require('Ext.data.JsonStore');

	
var projectStore = null;
var SELECTED_PJ_UID = null;
var PROJECTLIST_DATA = [];
var EVENT_DATA = [];
var MACHINE_DATA = [];
function string2date(str) {
    
    var arr =str.split('/');
    var date = new Date();
 	
 	date.setFullYear(		parseInt(arr[0])	);
	date.setMonth(			parseInt(arr[1])-1	);
	date.setDate(			parseInt(arr[2])	);
	
    return date;              
}

function callGantt(ac_uid) {
	setLink(CONTEXT_PATH +   "/statistics/task.do?method=ganttMain&pj_uid=" + ac_uid);
}
function setLink(link) {
	
   var panelId = 'tempport';
   setThisLoading(panelId);	
		//console_log(link);
	var iframeId =  'iframeGantt';
	try {
	var fr =Ext.getCmp(iframeId);
	if(fr!=null) {
		var the_iframe = fr.getEl().dom;
		//console_log(the_iframe);
		the_iframe.src = link;
	}
	} catch(e){}
}
function setThisLoading() {
	var tempportPnl = Ext.getCmp('tempport');
	if(tempportPnl!=null) {
		tempportPnl.setLoading(true);
	}
}		


Ext.require([
    'Ext.ProgressBar'
]);
/**
 * This view is the primary, SCHEDULE (Key Performance Indicators) view.
 */
Ext.define('ExecDashboard.view.schedule.Schedule', {
    extend: 'Ext.panel.Panel',
    xtype: 'schedule',
    
    itemId: 'schedule', // for setActiveTab(id)

    cls: 'kpi-main',

    requires: [
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Area',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.interactions.Rotate'
    ],

    config: {
        activeState: null,
        defaultActiveState: 'clicks'
    },

    controller: 'schedule',
    
    initView : function() {
    	
    	
    	projectStore = Ext.create('Ext.data.JsonStore', {
            fields: [{name: 'region'}, {name: 'id'}]
			,proxy: {
			        type: 'ajax',
			        url: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread&menu_code=EPJ2',//'resources/data/full_data.json',
			        reader: {
			        	type: 'json',
			        	rootProperty: 'datas'
			        }//endofreader
			    }//endofproxy
		
    	});


		//설비정보 정의
    	Ext.define('PcsMchn', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'name_cn',text:'설비명(CN)'}
				, {name: 'name_ko',text:'설비명(KO)'}
				, {name: 'name_en',text:'설비명(EN)'}
				, {name: 'mchn_code',text:'설비코드'}
				, {name: 'state',text:'상태'}
				, {name: 'unique_id',text:'설비ID'}
			],
			proxy: {
				type : 'ajax',
				api : {
					read : CONTEXT_PATH + '/production/machine.do?method=read'
				},
				reader : {
					type : 'json',
					rootProperty : 'datas',
					totalProperty: 'count',
					successProperty : 'success'
				}
			}
		});

		// PcsMchn Store 정의
		var mchnStore = new Ext.data.Store({
			model : 'PcsMchn',
			sorters : [ {
				property : 'unique_id',
				direction : 'DESC'
			} ]
		});
		
		mchnStore.load(function(records) { 
			     for(var i=0; i<records.length; i++) {
        			console_log(records[i]);
        			MACHINE_DATA.push(records[i]);
        		}
		});
		
		//projectStore.load(function(records) { treatRecord(records)});
	    	
	    	
    	 var arr_done = [11,80,13,99,60,87,20,10,80,70];
    	function treatRecord(records) {
	         if (records && records[0]) {
                PROJECTLIST_DATA.splice(0,PROJECTLIST_DATA.length);
                EVENT_DATA.splice(0,EVENT_DATA.length);
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
//			  EVENT_DATA.push( {"Id" :1, "Name": "aaa", "ResourceId" : 'r1', "PercentAllocated" : 60, "StartDate" : new Date(2014, 9, 1), "EndDate" : new Date(2015, 0, 1)} );
//              EVENT_DATA.push( {"Id" :2, "Name": "bbb", "ResourceId" : 'r2', "PercentAllocated" : 20, "StartDate" : new Date(2015, 0, 1), "EndDate" : new Date(2015, 6, 1)} );
//              EVENT_DATA.push( {"Id" :3, "Name": "ccc", "ResourceId" : 'r3', "PercentAllocated" : 80, "StartDate" : new Date(2015, 3, 1), "EndDate" : new Date(2015, 9, 1)} );
//              EVENT_DATA.push( {"Id" :6, "Name": "ddd", "ResourceId" : 'r6', "PercentAllocated" : 100, "StartDate" : new Date(2015, 6, 1), "EndDate" : new Date(2015, 9, 1)} );
            }//endofif
    	}
    	
    	projectStore.load(function(records) { treatRecord(records)});
    	
	function threecomma(value) {
        	return Ext.util.Format.number(value, '0,00/i');
        }
    function perc(v) {
            return v + '%';
        }
        
        
        
//	var progressRenderer = (function () {
//        var b = new Ext.ProgressBar({height: 15});
//        return function(progress) {
//            b.updateProgress(progress);
//            return Ext.DomHelper.markup(b.getRenderTree());
//        };
//    })();
        
    function extjsRenderer(value) {
			var id = Ext.id();
			
			
			Ext.defer(function () {

					var bar = new Ext.ProgressBar({
						height: 15,
						renderTo: id,
						value: (value / 100)
					});

                     }, 50);
                     

                     var ret =  Ext.String.format('<div id="{0}"></div>', id);
                     //console_log(ret);

			return ret;
		}

	var overallGrid = Ext.create('Ext.grid.Panel', {
    	title: '전체일정',
        id: 'overall-sechedule',
        flex: 6,

        forceFit: true,
        defaults: {
            sortable: true
        },
        viewConfig:{
		 	   markDirty:false
		},
        //margin: '1px 1px 1px 1px',
        columns: [
            {
                text: '프로젝트<BR>고객사',
                //locked   : true,
                width: 260,
                dataIndex: 'full_desc'//'full_desc'
            },
			{
                text: '계획<BR>완료',
                dataIndex: 'progress',//'regist_date',
                align: 'center'//,
            }
            ,{
                text: '수주금액<BR>수량',
                dataIndex: 'selling_price_quan', // 'selling_price',
                align: 'right'//,
            },
			{
                text: '수주일<BR>계약납기',
                dataIndex: 'regist_delivry',//'regist_date',
                
                align: 'center'//,
                , menuDisabled:true, sortable : false
            },
			{
                text: '설계예정<BR>설계완료',
                dataIndex: 'regist_delivry',//'regist_date',
                align: 'center'//,
                , menuDisabled:true, sortable : false
            },
			{
                text: '검사예정<BR>검사완료',
                dataIndex: 'regist_delivry',//'regist_date',
                align: 'center'//,
                , menuDisabled:true, sortable : false
            },
			{
                text: '요청납기<BR>납품완료',
                dataIndex: 'regist_delivry',//'regist_date',
                align: 'center'//,
                , menuDisabled:true, sortable : false
            },
			{
                text: '설치예정<BR>설치완료',
                dataIndex: 'regist_delivry',//'regist_date',
                align: 'center'//,
                , menuDisabled:true, sortable : false
            },
			{
                text: 'PM<BR>PL',
                dataIndex: 'pm_pl',//'regist_date',
                align: 'center'//,
            }
            

            
//            ]}
            
        ],
        
        store: projectStore
        ,selModel: {  allowDeselect: true }  
        ,
        listeners: {
            selectionchange: function(model, records, v1, v2) {
            	//console_log(model);
            	//console_log(records);
            	//console_log(v1);
            	//console_log(v2);
                if (records[0]) {
                    record = records[0];
                    console_log('selectionchange');
                    console_log(record);
					Ext.getCmp('sechdule-table-panel').setActiveTab(1);
					
					SELECTED_PJ_UID = record.get('id');
					var rowIndex = projectStore.indexOfId(SELECTED_PJ_UID);
					//overallGrid.getSelectionModel().clearSelections();
					detailGrid.getSelectionModel().select(rowIndex, true);
                }
            },
		    itemdblclick: function(dv, record, item, index, e) {

//                    console_log('itemdblclick');
//                    console_log(record);
//                    Ext.getCmp('sechdule-table-panel').setActiveTab(1);
//					var id = record.get('id');
//					callGantt(''+id);
		    		


		    }
        }
    });

//
//	var completeGrid = Ext.create('Ext.grid.Panel', {
//    	title: '완료율',
//        id: 'complete-sechedule',
//        //flex: 6,
//        //store: ds,
//        forceFit: true,
//        defaults: {
//            sortable: true
//        },
//        viewConfig:{
//		 	   markDirty:false
//		},
//        //margin: '1px 1px 1px 1px',
//        columns: [
//            {
//                text: '프로젝트<BR>고객사',
//                width: 140,
//                locked   : true,
//                dataIndex: 'full_desc'//'full_desc'
//            }        
//            ,{ align: 'center', dataIndex: 'c5', text: '<small>5%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c10',text: '<small>10%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c15',text: '<small>15%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c20',text: '<small>20%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c25',text: '<small>25%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c30',text: '<small>30%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c35',text: '<small>35%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c40',text: '<small>40%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c45',text: '<small>45%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c50',text: '<small>50%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c55',text: '<small>55%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c60',text: '<small>60%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c65',text: '<small>65%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c70',text: '<small>70%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c75',text: '<small>75%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c80',text: '<small>80%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c85',text: '<small>85%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c90',text: '<small>90%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex: 'c95',text: '<small>95%</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,{ align: 'center', dataIndex:'c100',text: '<small>100</small>',  width: 60, sortable : false, menuDisabled:true}
//            ,
//			{
//                text: 'PM<BR>PL',
//                flex:1,
//                dataIndex: 'pm_pl',//'regist_date',
//                align: 'center'//,
//            }
//        ],
//        
//        store: projectStore
//        ,
//        listeners: {
//            selectionchange: function(model, records) {
//                if (records[0]) {
//                    selectedRec = records[0];
//                    console_log(selectedRec);
//                }
//            },
//		    itemdblclick: function(dv, record, item, index, e) {
//		        alert('working');
//		    }
//        }
//    });
    
	detailGrid = Ext.create('Ext.grid.Panel', {
		store: projectStore,
		id: 'detail-grid',
        margin: '0px 0px 0px 0px',
        width: 160,
		xtype: 'grid',
		columns: [
         {
            text: '프로젝트<BR>고객사',
            flex     : 1,
            sortable : true,
            dataIndex: 'full_desc'
        }]
        ,viewConfig:{
		 	   markDirty:false
		}
        ,store: projectStore
       	,listeners: {
        selectionchange: function(model, records) {
        	if (records[0]) {
                selectedRec = records[0];
    			console_log(selectedRec);
                SELECTED_PJ_UID = selectedRec.get('id');
                callGantt(''+SELECTED_PJ_UID);
            }
        }//endofselchange
    }//endoflistener
	});
    
    
    	var detailSch = 
			    {
	        //height: 230,
	    	flex: 1,
	        cls: 'kpi-meta-charts',
	        id: 'detail-schedule',
	        title: '상세 일정',
	
	        layout: {
	            type: 'hbox',
	            align: 'stretch'
	        },
			margin: '0px 0px 0px 0px',
	        items: [detailGrid
		        ,{
		            xtype : "component",
		            bodyCls: 'statistics-body',
		            margin: '0px 0px 0 0',
		            flex: 1,
		            //border: true,
		            //title: 'STATISTICS',
		            id: "iframeGantt",
		            autoEl : {
		 			            tag : "iframe",
		 			            height: 300,
		 			    	    background: "#EAEAEA",
		 			    	    border: 0,
		 			    	    scrolling: 'no',
		 				        frameBorder: 0,
		 				        src: CONTEXT_PATH + '/statistics/task.do?method=ganttMain&pj_uid=-1'
		 				        //,onLoad: "clearThisLoading()"
		 				     }
		        }//endofstatistics
	        
	        ]
	    	}//endofhbox
	    ;
    	
    	var progressView = 
		        {
	            xtype : "component",
	            bodyCls: 'statistics-body',
	            margin: '0px 0px 0 0',
	            flex: 1,
	            title: '공정 진행률',
	            border: false,
	            //title: 'STATISTICS',
	            id: "iframeProgress",
	            autoEl : {
	 			            tag : "iframe",
	 			            height: 300,
	 			    	    background: "#EAEAEA",
	 			    	    border: 0,
	 			    	    scrolling: 'no',
	 				        frameBorder: 0,
	 				        src: CONTEXT_PATH + '/view/scheduler2225/overall/overallprocess.do?method=view'
	 				       
	 				        //,onLoad: "clearThisLoading()"
	 				     }
	        }//endofstatistics

	    ;
	    
		var machineProcess = 
		        {
	            xtype : "component",
	            bodyCls: 'statistics-body',
	            margin: '0px 0px 0 0',
	            flex: 1,
	            title: '제작 공정',
	            border: false,
	            //title: 'STATISTICS',
	            id: "iframeMc",
	            autoEl : {
	 			            tag : "iframe",
	 			            height: 300,
	 			    	    background: "#EAEAEA",
	 			    	    border: 0,
	 			    	    scrolling: 'no',
	 				        frameBorder: 0,
							src: CONTEXT_PATH + '/view/scheduler2225/process/machineProcess.do?method=view'
	 				        //,onLoad: "clearThisLoading()"
	 				     }
	        }//endofstatistics

	    ;
	    
	    
       Ext.define('CardTabs1', {
		    extend: 'Ext.tab.Panel',
		    requires: [
		        'Ext.layout.container.Card'
		    ],
		    xtype: 'layout-cardtabs1',
		
		    style: 'background-color:#dfe8f6; ',
             cls: 'quarterly-chart',
	        flex: 1,
	        
	        insetPadding: '40px 40px 20px 30px',
	        margin: '0px 20px 20px 20px',
		    defaults: {
		        bodyPadding: 0
		    },
		
		    items:[	overallGrid, /*completeGrid,*/ detailSch, progressView, machineProcess    ]
		    ,listeners: {
                'tabchange': function(tabPanel, tab){
                	//console_log(tab);
                   // console_log(tabPanel.id + ' ' + tab.id);
                    if(tab.id == 'overall-sechedule'){
                    	  if(SELECTED_PJ_UID!=null) {
								var rowIndex = projectStore.indexOfId(SELECTED_PJ_UID);
								overallGrid.getSelectionModel().select(rowIndex, true);
                    	  }
                    }
                }
            }

		});
		
		
		
		var tabView = Ext.create('CardTabs1', {
			id: 'sechdule-table-panel'
		});
        
		this.add(tabView);
		
    },
    viewModel: {
        type: 'schedule'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    overflowY: 'auto',
    minWidth: 600,
	
    items: [
    		{
        xtype: 'component',
        cls: 'kpi-tiles',
        height: 100,

        tpl: [
            '<div class="kpi-meta">',
                '<tpl for=".">',
                    '<span>',
                        '<div>{statistic}</div> {description}',
                    '</span>',
                '</tpl>',
            '</div>'
        ],

        data: [{
            description: '가수주 건수',
            statistic: '3'
        },{
            description: '수주 건수',
            statistic: '15'
        },{
            description: '수주 금액(백만 원)',
            statistic: '6,200'
        },{
            description: '매출액(백만 원)',
            statistic: '90,200'
        },{
            description: '매출이익률',
            statistic: '62.3%'
        }]

    }//endofheadercomponent

 
    ],//endofpanelitems:vbox

    validStates: {
        clicks: 1,
        redemption: 1,
        sales: 1,
        goalsmet: 1
    },

    isValidState: function (state) {
        return state in this.validStates;
    }
});
