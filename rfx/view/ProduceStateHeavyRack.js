Ext.define('Rfx.view.ProduceStateHeavyRack', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.produceState',
    frame: false,
    border: false,
    split: true,

    layoutConfig: {
        columns: 1,
        rows: 2
    },
    defaults: {
        collapsible: false,
        split: true,
        cmargins: '2 0 0 0',
        margins: '0 0 0 0'
    },
    bodyPadding: 10,

    // orgSearchTypeStore: null,
    ocProduceStateCenterEast: null,
    ocProduceStateCenterCenter: null,
    selectedO1: null,
    SERIES_BUFFER_ORG_MAP: null,

    storeLotTable1: null,
    gridLotTable1: null,
    storeProduceTable: null,
    produceGrids: [],
    produceStores: [],
    groupingFeature: [],
    
    defineColumns:  function(){

        
       this.columns =  [
            			//{
            			//text: '공정구분',
            			//cls:'rfx-grid-header', 
            			//dataIndex: 'po_code',
            			//resizable: true,
            			//autoSizeColumn : true,
            			//style: 'text-align:center',     
            			//align:'center'
            			//},
            			//{
            			//dataIndex: 'lot_disp', 
            			//text: '수주 | 제품번호',
            			//style: 'text-align:center', 
            			//align: 'center'
            			//},
            			{
            			text: 'LOT번호',
            			cls:'rfx-grid-header', 
            			dataIndex: 'lot_no',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',
            			width : 150,
            			align:'center'
            			}/*, {
            			text: '제품',
            			cls:'rfx-grid-header', 
            			dataIndex: 'item_disp',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center'
            			}*/, 
            			// {
            			// text: '중량',
            			// cls:'rfx-grid-header', 
            			// dataIndex: 'reserved_double4',
            			// resizable: true,
            			// autoSizeColumn : true,
            			// style: 'text-align:center',     
            			// align:'center'
            			// },
            			
            			{
            			text: '수량',
            			cls:'rfx-grid-header', 
            			dataIndex: 'item_quan',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center'
            			}
            		];
       this.columns2 = [
    	   {
    		text: '이름',
   			cls:'rfx-grid-header', 
   			dataIndex: 'user_name',
   			resizable: true,
   			width: 150,
   			autoSizeColumn : false,
   			style: 'text-align:center',     
   			align:'center'
    	   },
    	   {
    		   text: '부서명',
    		   cls:'rfx-grid-header', 
    		   dataIndex: 'dept_name',
    		   resizable: true,
    		   width: 150,
      			autoSizeColumn : false,
    		   style: 'text-align:center',     
    		   align:'center'
    	   },
    	   {
    		   text: '직급',
    		   cls:'rfx-grid-header', 
    		   dataIndex: 'position',
    		   resizable: true,
    		   width: 150,
      			autoSizeColumn : false,
    		   style: 'text-align:center',     
    		   align:'center'
    	   },
    	   {
    		   text: '근태',
    		   cls:'rfx-grid-header', 
    		   dataIndex: 'ep_suborg_code',
    		   resizable: true,
    		   width: 150,
      			autoSizeColumn : false,
    		   style: 'text-align:center',     
    		   align:'center'
    	   },
       ];
            			
//            			{
//            			text: '커팅',
//            			cls:'rfx-grid-header', 
//            			dataIndex: 'RATIO_01',
//            			resizable: true,
//            			autoSizeColumn : true,
//            			style: 'text-align:center',     
//            			style: {background:'orange'},
//            			align:'center'
//            			},
//            			
//            			{
//            			text: '용접',
//            			cls:'rfx-grid-header', 
//            			dataIndex: 'RATIO_02',
//            			resizable: true,
//            			autoSizeColumn : true,
//            			style: 'text-align:center',
//            			style: {background:'red'},
//            			align:'center'
//            			},
//            			
//            			{
//            			text: '사상',
//            			cls:'rfx-grid-header', 
//            			dataIndex: 'RATIO_03',
//            			resizable: true,
//            			autoSizeColumn : true,
//            			style: 'text-align:center',  
//            			style: {background:'blue'},
//            			align:'center'
//            			},
//            			
//            			{
//            			text: '후공정',
//            			cls:'rfx-grid-header', 
//            			dataIndex: 'RATIO_04',
//            			resizable: true,
//            			autoSizeColumn : true,
//            			style: 'text-align:center',     
//            			style: {background:'purple'},
//            			align:'center'
//            			},
//            			
//            			{
//            			text: '조립',
//            			cls:'rfx-grid-header', 
//            			dataIndex: 'RATIO_05',
//            			resizable: true,
//            			autoSizeColumn : true,
//            			style: 'text-align:center',   
//            			style: {background:'brown'},
//            			align:'center'
//            			},
            			
                    
                    for(var i=0 ; i<gUtil.mesStdProcess.length; i++) {
                    	var o = gUtil.mesStdProcess[i];
                    	
                    	var dataIndex = (i+1) + '';
                    	console_logs('====> dataIndex', dataIndex);
                    	if(dataIndex.length==1) {
                    		console_logs('in ====> dataIndex', dataIndex);
                    		dataIndex = '0' + dataIndex;
                    		console_logs('after ====> dataIndex', dataIndex);
                    		
                    	}
                    	dataIndex = 'RATIO_' + dataIndex;
                    	
                    	console_logs('dataIndex', dataIndex);
                    	console_logs('=== std process name o', o);
                    	
                    	this.columns.push({
            				text: o['name'],
            				cls:'rfx-grid-header', 
            				dataIndex: dataIndex,
            				resizable: true,
            				autoSizeColumn : true,
            				style: 'text-align:center',   
            				style: {background:'orange'},
            				align:'center'
            			});
                    }
                    
                    
                    this.columns.push({
            			text: '작업조',
            			cls:'rfx-grid-header', 
            			dataIndex: 'dept_name',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center',
            			field: {
            			    xtype: 'textfield'
            			}
            			});
            			//}, {
            			//text: '설명',
            			//cls:'rfx-grid-header', 
            			//dataIndex: 'description',
            			//resizable: true,
            			//autoSizeColumn : true,
            			//style: 'text-align:center',     
            			//align:'center',
            			//field: {
            			//    xtype: 'textfield'
            			//}
            			//}, {
            			//text: gm.getMC('CMD_Wearing','입고'),
            			//cls:'rfx-grid-header', 
            			//dataIndex: 'gr_date_supplier',
            			//resizable: true,
            			//autoSizeColumn : true,
            			//style: 'text-align:center',     
            			//align:'center',
            			//field: {
            			//    xtype: 'textfield'
            			//}
                    this.columns.push({
            			text: '상태', 
            			cls:'rfx-grid-header', 
            			dataIndex: 'state',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center'
                    });

                    
                    
                    
                    
                    
                    this.columns.push({
            			text: '검사예정일',
            			cls:'rfx-grid-header', 
            			dataIndex: 'reserved_timestamp1',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center'
                    });
                    this.columns.push({
            			text: '검사완료일', 
            			cls:'rfx-grid-header', 
            			dataIndex: 'reserved_timestamp2',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center'
                    });
//                    this.columns.push({
//            			//text: 'BOM수량', 
//            			//cls:'rfx-grid-header', 
//            			//dataIndex: 'item_quan',
//            			//resizable: true,
//            			//autoSizeColumn : true,
//            			//style: 'text-align:right',     
//            			//align:'right'
//            			//}, 
//                    });
                    this.columns.push({
            			
            			text: '대기수량', 
            			cls:'rfx-grid-header', 
            			dataIndex: 'countP',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:right',     
            			align:'right'
                    });
                    this.columns.push({
            			text: '작업수량', 
            			cls:'rfx-grid-header', 
            			dataIndex: 'countW',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:right',     
            			align:'right'
                    });
                    this.columns.push({
            			text: '완료수량', 
            			cls:'rfx-grid-header', 
            			dataIndex: 'countY',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:right',     
            			align:'right'
                    });
                    this.columns.push({
            			text: '작업자', dataIndex: 'pcs060',
            			cls:'rfx-grid-header', 
            			dataIndex: 'worker_name',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center'
                    });
                    this.columns.push({
            			text: '작업지시일',
            			cls:'rfx-grid-header', 
            			dataIndex: 'aprv_date',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center',
            			field: {
            			    xtype: 'textfield'
            			}
                    });
                    this.columns.push({
            			text: '제작완료일',
            			cls:'rfx-grid-header', 
            			dataIndex: 'end_date',
            			resizable: true,
            			autoSizeColumn : true,
            			style: 'text-align:center',     
            			align:'center'
            			
                		});
                    
                    console_logs('this.columns', this.columns);
    },

    initComponent: function() {
        console_logs('=====this', 'Rfx.view.ProduceStateHeavy');
        //this.dockedItems = [this.createToolbar()];

        this.SERIES_BUFFER_ORG_MAP = new Ext.util.HashMap();

//        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
//            groupHeaderTpl: '<b><font color=#003471>{name}</b></font> ({rows.length} 종)'
//        });
        

//        this.defineColumns();
        
        var produceModel = Ext.create('Rfx.model.TotalStateDoos', {});
        
        console_logs('gUtil.mesTplProcessBig', gUtil.mesTplProcessBig );
        
        var processes = null;
        if(gUtil.mesTplProcessBig!=null && gUtil.mesTplProcessBig.length>0) {
        	processes = gUtil.mesTplProcessBig;
        } else {
        	processes = [{
        		code: 'PRD',
        		name: '생산현황'
        	}] ;
        }
        console_logs('====gUtil.mesTplProcessBig22',gUtil.mesTplProcessBig);

        for(var i=0; i<processes.length; i++) {
        	var o = processes[i];
        	var big_pcs_code = o['code'];
        	var title = '[' + o['code'] + ']' + o['name'];
        	console_logs('===title', title);
        	this.defineColumns(big_pcs_code);
        	
            //produceStores
            this.produceStores[i] = new Ext.data.Store({
                pageSize: 50,
                groupField: 'reserved5',
                sorters: ['reserved5', 'reserved2'],
                model: produceModel
            });
            var innerTable = '';
            
            switch(vCompanyReserved4){
        		case 'SWON01KR':
        			break;
        		default:
	            	for(var j = 0; j < gUtil.mesTplProcessAll[big_pcs_code].length; j++) {
	                	innerTable += '<td style="width: 100px; height: 25x; background-color: #F5AB35; text-align:center; color: white; box-shadow: 0px 0px 5px #aaaaaa;">';
	                	var o = gUtil.mesTplProcessAll[big_pcs_code][j];    
	                	innerTable += o['name'] + '</td>';
	                	innerTable += '<td style="width: 110px; height: 25px; text-align:center; box-shadow: 0px 0px 5px #aaaaaa;">{[this.calPercentTest(values, ' + (j+1) + ')]}</td>';
	                	innerTable += '<td style="width: 20px; height: 25px;"></td>';
	                }
            	console_logs('====****o', o);           	
        	}

            
            this.groupingFeature[i] = Ext.create('Ext.grid.feature.Grouping', {
            	groupHeaderTpl: Ext.create('Ext.XTemplate', 
            		'<div><span style="color:red;"><b>{name}</b></span> (완료 {[this.calComplete(values)]} 종 / 전체 {rows.length} 종 ──────────── {[this.calPercent(values)]}% 진행율)</div>',
            		'<div>',
            			'<table style="border-collapse: collapse; margin-top: 10px">',
            				'<tr>',
            					innerTable,
    	    				'</tr>',
            			'</table>',
            		'</div>',
            		{
            			calPercentTest: function(val, proc_order) {
            				var count = 0;
            				for(var m = 0; m < val.rows.length; m++) {
            					switch(proc_order) {
            					case 1:
            						if(val.rows[m].data.status_1 != "대기" && val.rows[m].data.status_1 != "생산중") {
                						count++;
                					}
            						break;
            					case 2:
            						if(val.rows[m].data.status_2 != "대기" && val.rows[m].data.status_2 != "생산중") {
                						count++;
                					}
            						break;
            					case 3:
            						if(val.rows[m].data.status_3 != "대기" && val.rows[m].data.status_3 != "생산중") {
                						count++;
                					}
            						break;
            					case 4:
            						if(val.rows[m].data.status_4 != "대기" && val.rows[m].data.status_4 != "생산중") {
                						count++;
                					}
            						break;
            					case 5:
            						if(val.rows[m].data.status_5 != "대기" && val.rows[m].data.status_5 != "생산중") {
                						count++;
                					}
            						break;
            					}	
            				}
            				if(count == 0) {
            					return '0% (0 / ' + val.rows.length + '종)';
            				}
            				
            				return ((count / val.rows.length) * 100).toFixed(2) + '% (' + count + ' / ' + val.rows.length + '종)';
            			},
            			calPercent: function(val) {
            				var percent = 0;
            				var count = 0;
            				for(var m = 0; m < val.rows.length ; m++) {
            					if(val.rows[m].data.end_date != null && val.rows[m].data.end_date != undefined && 
            							val.rows[m].data.end_date != "") {
            						count++;
            					}
            				}
            				
            				if (count == 0) {
            					return 0;
            				}
            				percent = ((count / val.rows.length) * 100).toFixed(2);
            				
            				return percent;
            			},
            			calComplete: function(val) {
            				var count = 0;
            				for(var m = 0; m < val.rows.length ; m++) {
            					if(val.rows[m].data.end_date != null && val.rows[m].data.end_date != undefined && 
            							val.rows[m].data.end_date != "") {
            						count++;
            					}
            				}

            				return count;
            			}
            		}
            	),
            });
        	
            this.produceGrids[i] = Ext.create('Rfx.view.grid.ProduceTableGridHeavy', {
                title: title,
                store: this.produceStores[i],
                scroll: true,
                frame: true,
                columnLines: true,
                columns : this.columns,
                bbar: getPageToolbar(this.produceStores[i], true, null, function() {
                        Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                    })
                    //features: [groupingFeature]
            });
            
            //this.loadProduce(this.produceStores[i], big_pcs_code);
        }
        this.produceGrids[i] = Ext.create('Rfx.view.grid.ProduceTableGridHeavy', {
            title: '입력근태현황',
            store: this.produceStores[i],
            scroll: true,
            frame: true,
            columnLines: true,
            columns : this.columns2,
            bbar: getPageToolbar(this.produceStores[i], true, null, function() {
                    Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                })
                //features: [groupingFeature]
        });
        var tabItems = this.produceGrids;

        var list = gUtil.rack_list0;

        if (list != null) {
            console_logs('list', list);

            var rackItems = [];

            for (var i = 0; i < list.length; i++) {
                var class_code = list[i]['class_code'];
                var class_name = list[i]['class_name'];
                var stockPanel = this.createStockPanel(class_code, class_name);
                rackItems.push(stockPanel);
            }

            var rackTab = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
                layout: 'border',
                title: 'Rack 재고현황',
                border: true,
                minWidth: 200,
                height: "100%",
                region: 'south',
                border: true,
                resizable: true,
                scroll: true,

                collapsible: false,
                items: rackItems
            });
            switch(vCompanyReserved4){
            case 'SWON01KR':
            case 'PNLC01KR':
            	break;
            case 'SHNH01KR':
           	 tabItems = [];
           	 tabItems.push(rackTab);
           	 	break;
            default:
            	 tabItems.push(rackTab);
            break;
            }
           

        }

        var south = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            minWidth: 200,
            height: "100%",
            region: 'south',
            border: true,
            resizable: true,
            scroll: true,

            collapsible: false,
            items: tabItems
        });
        
        Ext.apply(this, {
            layout: 'border',
            items: [south]
        });

        //this.relayEvents(this.produceGrid, ['rowdblclick']);
        this.callParent(arguments);
        this.redrawProduceAll();

    },

    redrawProduceAll: function() {
    	
        var processes = null;
        if(gUtil.mesTplProcessBig!=null && gUtil.mesTplProcessBig.length>0) {
        	processes = gUtil.mesTplProcessBig;
        } else {
        	processes = [{
        		code: 'PRD',
        		name: '생산현황'
        	}] ;
        }
    	
        for(var i=0; i<processes.length; i++) {
        	var o = processes[i];
        	var big_pcs_code = o['code'];
            this.loadProduce(this.produceStores[i], big_pcs_code);
        }
        
        //redrawProduceChart1();
        //this.redrawProduceChart2('RESEARCH', '연구');
        //redrawProduceTable('RESEARCH', null);
        Ext.getBody().unmask();
    },

    redrawProduceTable: function(o1, name_in) { //RESEARCH, 201502, 2015년 02월

    },
    /**
     * Loads a feed.
     * @param {String} url
     */
    loadFeed: function(url) {
        //this.grid.loadFeed(url);
        // this.display.loadFeed(url);
    },

    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
        console_logs('onSelect', rec);
        // this.display.setActive(rec);
    },


    /**
     * Reacts to the open all being clicked
     * @private
     */
    onOpenAllClick: function() {
        // this.fireEvent('openall', this);
    },

    loadProduce: function(store, big_pcs_code) {

    	store.getProxy().setExtraParam('comast_uid', vCOMAST_UID);
    	store.getProxy().setExtraParam('big_pcs_code', big_pcs_code);

        store.load(function(records) {
            console_logs('==== storeLoadCallback records', records);

        });

    },
    
    makeRackObject: function(items) {
    	var o = {
                xtype: 'panel',
                cls: 'split',
                flex: 2,
                margin: '0 2 0 2',
                padding: 0,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    xtype: 'taskcolumn',
                    flex: 1,
                    iconCls: '',
                    header: {
                        height: 18,
                        padding:  '0 0 0 0'
                    }
                },
                items: items
            };
    		
    	return o;
    	 
    },

    makeRackList : function(segmentCode) {

        var myRackList2 = gUtil.getMyList2(segmentCode);
        console_logs('myRackList2', myRackList2);
        
        var segmentItems = [];
        

        for(var j=0; j<myRackList2.length; j++) {
        	
        	var items = [];
        	
        	var o1 = myRackList2[j];
        	var state = ((j+1)<10) ? '0'+(j+1) : ''+(j+1);
        	var target = {
    	            state: state,
    	            title: o1['class_code'],
    	            cls: 'stock-rack-panel',
    	            border: false,
    	            bodyStyle: 'border-right:1px dashed #aaa !important'
    	        };
        	items.push(target); j++;
        	
        	if(j<myRackList2.length) {
            	o1 = myRackList2[j];
            	 state = ((j+1)<10) ? '0'+(j+1) : ''+(j+1);
            	target = {
        	            state: state,
        				title: o1['class_code'],
        	            cls: 'stock-rack-panel',
        	            border: false
        	        };
        		items.push(target);
        	}
        	
        	var o = this.makeRackObject(items);

        	segmentItems.push(o);
        }
        
        console_logs('------------------- segmentItems', segmentItems);
        
        return segmentItems;
    },
    store_map: {},
    createStockPanel: function(class_code, class_name) {


        var resourceStore = new Kanban.data.ResourceStore({
            //sorters: 'floor',
            autoLoad: true,
            proxy: {
                type: 'ajax',

                api: {
                    read: 'http://hosu.io/web_content75' + '/taskboard-2.0.9/taskboard/examples/configurations/users.js',
                    update: undefined,
                    destroy: undefined,
                    create: undefined
                }
            }
        });


        var model = Ext.create('Rfx.model.StockRackTask', {});


        var stockItems = [];
        
//        var pendingStore = new Kanban.data.TaskStore({
//            model: model
//        });
//        
//        var rackUnitList = gUtil.getRackunitList3(segmentCode);
//        pendingStore.add(rackUnitList);
//        
//        stockItems.push({
//            xtype: 'component',
//            html: '<div style="padding-left:3px;margin:5px;font-weight:bold;width:500px;text-align:left;">' + '미 적치 파레트' +  '</div>'
//        },{
//        	xtype: 'taskcolumn',
//            flex      : null,
//            height: 100,
//            zoomLevel : 'small',
//            state     : 'pending',
//            taskStore: pendingStore
//        });

        var myRackList1 = gUtil.getMyList1(class_code);
        
        console_logs('class_code', class_code);
        console_logs('myRackList1', myRackList1);

        for (var i = 0; i < myRackList1.length; i++) {
            var o = myRackList1[i]
            
           // o['color'] = 'red';

            var segmentCode = o['class_code'];
            
            var taskStore = new Kanban.data.TaskStore({
                model: model
            });
            taskStore.sort('floor', 'DESC');
//           this.store_map[o['calss_code']] = taskStore;
            
            console_logs('segmentCode', segmentCode);
            var rackUnitList = gUtil.getRackunitList3(segmentCode);
            taskStore.add(rackUnitList);

            console_logs('rackUnitList', rackUnitList);

            var segmentItems = this.makeRackList(segmentCode);
            var segentColumn =  [{
                region: 'center',
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: 5,
                    flex: 1,
                    xtype: 'taskcolumn'
                },
                items: segmentItems
                
            }


        ];

            stockItems.push({
                    xtype: 'component',
                    html: '<div style="padding-left:3px;margin:5px;font-weight:bold;width:500px;text-align:left;">' + segmentCode + ' : ' + o['class_name'] 
            				+'  '+'<span style="background:blue;color:#fff;">적치</span>'+ 
            				'<span style="background: yellow">불출3일내</span>'+ 
            				'<span style="background: red;color:#fff;">불출요청일</span>'+ 
            				'<span style="background: orange;color:#fff;">불출일초과</span>'+ 
            				'<span style="background: green;color:#fff;">적치60일초과</span>'+ 
            				'</div>'
                }, {
                    height: 210,
                    margin: '0 0 2 0',
                    resourceStore: resourceStore,
                    userMenu: null/* {
                        xtype: 'kanban_usermenu',
                        resourceStore: resourceStore
                    }*/,
                    taskMenu: null,
                    xtype: 'taskboard',
                    layout: 'border',
                    cls: 'panel-3',
                    readOnly : true,
                    taskStore: taskStore,
//                    editor : {
//                    	store: taskStore,
//                        xtype : 'taskeditor'
//                    },
//                    editor : {
//                        xtype: 'kanban_simpleeditor',
//                        dataIndex: 'Name'
//                    },
                    columnConfigs : {
                        all : {
                            iconCls : 'sch-header-icon'
                        }
                    },
                    viewConfig: {

                        taskToolTpl: '<div class="sch-tool-ct">' +
	                        '<div class="sch-tool sch-tool-edit"></div>' +
	                        '<tpl if="NbrComments"><div class="sch-tool sch-tool-comment">&nbsp;</div><span class="sch-tool-text">{NbrComments}</span></tpl>' +
	                        '<tpl if="Attachments"><div class="sch-tool sch-tool-attachment">&nbsp;</div><span class="sch-tool-text">{Attachments}</span></tpl>' +
	                        '</div>',
	                        
                        taskRenderer: function(task, renderData) {
                        	console_logs('task', task);
                        	var state = task.get('Name');
                        	var color = task.get('color');
                        	switch(color){
                        		case 'orange':
                        		case 'yellow':
                        			renderData.style = 'background:' + color  +';color:black';
                        			break;
                        		default:
                        			renderData.style = 'background:' + color  +';color:#fff';
                        	}
                        	
                        	
                            if (task.getName() === 'Uninstall IE5') {
                                renderData.style = 'background:red;color:#fff';
                            }
                        },
                        taskBodyTpl: '{N} {Name}',
                        onUpdate: function(store, record, operation, modifiedFieldNames) {
                        	console_logs('onUpdate record', record);
                        	console_logs('onUpdate modifiedFieldNames', modifiedFieldNames);
                        	
                        	//record.data.N = gUtil.floorDisp(record.data.Floor);
                            var fragment = document.createElement('div');
                            var currentNode = this.getNode(record);
                            var selModel = this.getSelectionModel();

                            this.tpl.overwrite(fragment, this.collectData([record]));
                            Ext.fly(currentNode).syncContent(fragment.firstChild);

                            selModel.onUpdate(record);
                            if (selModel.isSelected(record)) {
                                this.onItemSelect(record);
                            }
                            
                        	var name = record.getName();
                        	var id = record.getId();    	
                        	var rtgast_uid = record.data.rtgast_uid;
                        	
                        	
                    		Ext.Ajax.request({
                    			url: CONTEXT_PATH + '/admin/stdClass.do?method=updateEgcicode',
                    			params:{
                    				unique_id: id,
                    				egci_code: name,
                    				exUidRtgAst: rtgast_uid
                    			},
                    			success : function(result, request) {
                        	        var jsonData = Ext.JSON.decode(result.responseText);
                        	        console_logs('jsonData.result', jsonData.result);
                        	        record.data.rtgast_uid = jsonData.result;
                    			}
                    		});
                    		
                        }
                    },
                    columns: segentColumn,
                    listeners : {
                        select: function ( o , record, eOpts ) {
                        	console_logs('select record', record);
                        },
                        taskdblclick: function ( view, task, taskNode, event, eOpts ) {
                        	gUtil.editRackRecord(task);
                        },
                        
                        taskdrop: function( drop, tasks, eOpts ) {
                        	console_logs('aftertaskdrop tasks', tasks);
                        	
                        	for(var i=0; i < tasks.length; i++) {
                        		console_logs('tasks[' + i + '] = ', tasks[i]);
                        		//gUtil.editRackRecord(tasks[i]);
                        	}
	                    	
	                    }
                    }
                    
                }

            );
        }

        return Ext.create('Ext.panel.Panel', {
            title: class_name,
            border: true,
            resizable: true,
            autoScroll: true,
            collapsible: false,
            items: stockItems
        });



    },
    createSouth: function() {

    }
});