Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);


Ext.define('Rfx.view.designPlan.DesignBomView_DS', {
    extend: 'Rfx.base.BaseView',
    xtype: 'design-bom-view',
    records: null,
    selectedgrid: null,
    initComponent: function(){
    	this.multiSortHidden = true;
    	
    	this.commonUnitStore = Ext.create('Mplm.store.CommonUnitStore', {hasNull: false} );
    	this.commonCurrencyStore = Ext.create('Mplm.store.CommonCurrencyStore', {hasNull: false} );
    	this.commonModelStore = Ext.create('Mplm.store.CommonModelStore', {hasNull: false} );
    	this.commonDescriptionStore = Ext.create('Mplm.store.CommonDescriptionStore', {hasNull: false} );
    	this.commonStandardStore2  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: false} );
    	this.GubunStore  = Ext.create('Mplm.store.GubunStore', {hasNull: false} );
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();

    	var vPJ_TYPE = '';
    	
    	switch(this.link) {
    	case 'DBM7':
    		vPJ_TYPE = 'S';
    		break;
    	case 'DBM7_DS1':
    		vPJ_TYPE = 'DS';
    	}
    	
    	this.addSearchField({
			type: 'condition',
			width: 140,
			sqlName: 'partLineItemDetail',
			tableName: 'srcahd',
			field_id: 'item_name',     
			fieldName: 'item_name',
			params: {
				pj_type : vPJ_TYPE
			}
		});

    	this.addSearchField({
			type: 'condition',
			width: 140,
			sqlName: 'partLineItemDetail',
			tableName: 'srcahd',
			field_id: 'class_code',     
			fieldName: 'class_code',
			params: {
				pj_type : vPJ_TYPE
			}
		});	
    	
    	this.addSearchField({
			type: 'condition',
			width: 140,
			sqlName: 'partLineItemDetail',
			tableName: 'assymap',
			field_id: 'reserved10',     
			fieldName: 'reserved10',
			params: {
				pj_type : vPJ_TYPE
			}
		});	


		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var commandToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.PartLineDS', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'a.creator',
	        	unique_id: 'a.unique_uid'
	        }
//        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
         	, ['assymap']
	        );

		
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            
            tooltip:'PartList 출력',
            disabled: false,
            
            handler: function(widget, event) {
            	var ac_uid = gMain.selPanel.vSELECTED_PROJECT_UID;
            	var item_code = gMain.selPanel.vSELECTED_PRODUCT_CODE;
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printPl',
            		params:{
            			item_code : item_code,
            			rtgast_uid: gm.me().selectedAssyUid,
            			parent_uid: gm.me().selectedAssyUid,
            			ac_uid : ac_uid,
            			pdfPrint : 'pdfPrint',
            			is_rotate : 'N'
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_logs(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });

        var buttonToolbar1 = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.searchAction,
               // this.editAction,
                this.removeAction,
                '->'
            ]
        });
        
        var buttonToolbar2 = Ext.create('widget.toolbar', {
       	 	 cls: 'my-x-toolbar-default1',
	         style:'color:white;',
	         items: [
	        	 this.createSearchToolbar(),
	                
	                '->'
	         ]
        });
        
        this.importAction = Ext.create('Ext.Action', {
				xtype: 'button',
				iconCls: 'af-check',
				cmpId: 'check_id', //임시
				text: '입고완료처리',
				//big_pcs_code: code,
				//pcs_code: code1,
				disabled: true,
				handler: function() {	

					var date = buttonToolbar3.items.items[0].getValue();
					var year = date.getFullYear();
					var month = (1 + date.getMonth());
					month = month >= 10? month : '0' + month;
					var day = date.getDate();
					day = day >= 10? day : '0' + day;
					date = year + '-' + month + '-' + day;
					
					var selections = records;
					console_logs('selections>>>>>>>>', selections);
					if(selections!=null) {
						var whereValue = [];
						var field = 'reserved_timestamp3';
						for( var i=0; i<selections.length; i++) {
							var o = selections[i];
							o.set(field, date);
							console_logs('o', o);
						
							var assymap_uid = o.get('id');
							whereValue.push(assymap_uid);
						}
						console_logs('createPcsToobars', whereValue);
						gm.editAjax('assymap', 'reserved_timestamp3', date, 'unique_id', whereValue,  {type:''});
						selectedgrid.getStore().load();
					}
				}
		});
        
        this.cancelImportAction = Ext.create('Ext.Action', {
			xtype: 'button',
			iconCls: 'af-remove',
			cmpId: 'check_id', //임시
			text: '입고취소처리',
			//big_pcs_code: code,
			//pcs_code: code1,
			disabled: true,
			handler: function() {	
				var date = null;
				var selections = records;
				console_logs('selections>>>>>>>>', selections);
				if(selections!=null) {
					var whereValue = [];
					var field = 'reserved_timestamp3';
					for( var i = 0; i<selections.length; i++) {
						var o = selections[i];
						o.set(field, date);
						console_logs('o', o);
					
						var assymap_uid = o.get('id');
						whereValue.push(assymap_uid);
					}
					console_logs('createPcsToobars', whereValue);
					gm.editAjax('assymap', 'reserved_timestamp3', '', 'unique_id', whereValue,  {type:''});
					selectedgrid.getStore().load();
				}
			}
		});
        
        var buttonToolbar3 = Ext.create('widget.toolbar', {
      	 	 cls: '.my-x-toolbar-default2',
	         style:'color:white;',
	         items: [
	        	 {   
	        		 name: 'reserved_timestamp3',
	        		 cmpId: 'reserved_timestamp3',
	        		 format: 'Y-m-d',
	        		 fieldStyle: 'background-color: #D6E8F6; background-image: none;',
	        		 submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	        		 dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	        		 allowBlank: true,
	        		 xtype: 'datefield',
	        		 value: new Date(),
	        		 width: 100,
	        		 handler: function(){
	        		 }
	     		},
	     		this.importAction,
	     		this.cancelImportAction
	     		
	         ]
       });

        this.createGrid([buttonToolbar1, buttonToolbar2, buttonToolbar3]);
        
        this.setGridOnCallback(function(selections) {
        	if (selections.length) {
        		rec = selections[0];
        		records = selections;
        		selectedgrid = this.grid;
        		gMain.selPanel.assymapUidbom=rec.get('unique_uid');
        		gMain.selPanel.assymapPcr_div=rec.get('pcr_div');
        		//gMain.selPanel.assymapBmQuan=rec.get('bm_quan');
        		gMain.selPanel.assymapQuan=rec.get('quan');
        		gMain.selPanel.assyId=rec.get('hier_pos');
        		gMain.selPanel.assylevel=rec.get('reserved_integer1');
        		gUtil.enable(gMain.selPanel.addPcsPlanAction);
        		gUtil.enable(gMain.selPanel.bomEditAction);
        		this.importAction.enable();
        		this.cancelImportAction.enable();
        	} else {
        		gUtil.disable(gMain.selPanel.addPcsPlanAction);
        		gUtil.disable(gMain.selPanel.bomEditAction);
        		this.importAction.disable();
        		this.cancelImportAction.disable();
        	}
        	
        	
        });
        /*this.setGridOnCallback(function(selections) {
        	if (selections.length) {
        		gUtil.enable(gMain.selPanel.addPcsPlanAction);
        	} else {
        		gUtil.disable(gMain.selPanel.addPcsPlanAction);
        	}
        });*/
        
    	
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });
    	
        
	    this.commonStandardStore.load(function(records) {
    		for (var i=0; i<records.length; i++){ 
    	       	var obj = records[i];
    	       	//console_logs('commonStandardStore2['+i+']=', obj);
    	       	gMain.selPanel.standard_flag_datas.push(obj);
    		}
    	});
    	
    	this.callParent(arguments);
    	
    },
    setRelationship: function (relationship) {},
    
    createCenter: function() {

    	this.grid.setTitle('BOM');
    	
		this.center =  Ext.widget('tabpanel', {
		    layout:'fit',
		    resizable: true,
	        scroll: true,
	        collapsible: false,
		    border: true,
		    forceFit: true,
		    region: 'center',
		    layoutConfig: {columns: 2, rows:1},
            width: '70%',
		    items: [this.grid]
		});
		
		return this.center;	
    },
    
    //----------------------- END OF CENTER --------------------
    
    createWest: function() {

    	this.productStore = Ext.create('Mplm.store.ProductStoreDS');
    	    
    	var pj_type = '';
    	switch(this.link) {
    	case 'DBM7':
    		pj_type = 'S';
    		break;
    	case 'DBM7_DS1':
    		pj_type = 'DS';
    		break;
    	default:
    		pj_type = 'ES';
    	}
    	
    	var assembly_id = this.link + 'DBM7-Assembly';
    	var grid_id = 'Rfx.view.grid.ProductTableGridHeavy_DS';
    	if(this.link == 'DBM7_DS1') {
    		grid_id = 'Rfx.view.grid.ProductTableGridHeavy_DS2';
    	}
    	
		this.productGrid =
	    	Ext.create(grid_id, {
	    	 id: assembly_id,
			 title: 'Assembly',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
	         store: this.productStore,
	         layout          :'fit',
	         forceFit: true,
	         bbar: Ext.create('Ext.PagingToolbar', {
		            store: this.productStore,
		            displayInfo: true,
		            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
		            emptyMsg: "표시할 항목이 없습니다."
	                ,listeners: {
	                    beforechange: function (page, currentPage) {
	                    }
	                }
		         
		        }),
	            dockedItems: [            
				{
				    dock: 'top',
				    xtype: 'toolbar',
				    style: 'background-color: #133160;',
				    cls: 'my-x-toolbar-default5',
					items: [{
			    		id: this.link+'DBM7-level1',
				    	xtype: 'combo',
				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        mode: 'local',
				        editable:false,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'블록',
				        displayField:   'area_code',
				        valueField:     'area_code',
				        store: Ext.create('Mplm.store.SrcAhdStoreDS', {storeMode: 'A', pj_type: pj_type}),
				        listConfig:{
				            	getInnerTpl: function(){
				            		return '<div data-qtip="{area_code}">{area_code}</div>';
				            	}
				        },
				        listeners: {
					           select: function (combo, record) {
				                 	console_logs('record : ', record);
				                 	var area_code = record.get('area_code');
				                 	var claastlevel2 = Ext.getCmp('DBM7-level2');
				                 	var claastlevel3 = Ext.getCmp('DBM7-level3');
				                 	var claastlevel4 = Ext.getCmp('DBM7-level4');
				                 	var productlist = Ext.getCmp(assembly_id);
				                 	
				                 	/*claastlevel2.clearValue();
				                 	claastlevel2.store.removeAll();
				                 	claastlevel3.clearValue();
				                 	claastlevel3.store.removeAll();
				                 	claastlevel4.clearValue();
				                 	claastlevel4.store.removeAll();
				                 	
				                 	claastlevel2.store.getProxy().setExtraParam('area_code', area_code);
				                 	claastlevel2.store.load();*/
				                 	
				                 	productlist.store.getProxy().setExtraParam('area_code', area_code);
				                 	productlist.store.getProxy().setExtraParam('use_pj_leftjoin', 'Y');
				                 	productlist.store.getProxy().setExtraParam('pj_type', pj_type);
				                 	
				                 	productlist.store.load();
				                 	
					           }
				        }
			    	
			    	}/*,{
			    		id:'DBM7-level2',
				    	xtype: 'combo',
				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        mode: 'local',
				        editable:false,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'소조번호',
				        displayField:   'class_code',
				        valueField:     'class_code',
				        store: Ext.create('Mplm.store.SrcAhdStoreDS', {storeMode:'C'} ),
				        listConfig:{
				            	getInnerTpl: function(){
				            		return '<div data-qtip="{class_code}">{class_code}</div>';
				            	}
				           },
					        listeners: {
						           select: function (combo, record) {
					                 	console_log('Selected Value : ' + combo.getValue());
					                 	console_logs('record : ', record);
					                 	var class_code = record.get('class_code');
					                 	var claastlevel3 = Ext.getCmp('DBM7-level3');
					                 	var claastlevel4 = Ext.getCmp('DBM7-level4');
					                 	var productlist = Ext.getCmp('DBM7-Assembly');
					                 	
					                 	claastlevel3.clearValue();
					                 	claastlevel3.store.removeAll();
					                 	claastlevel4.clearValue();
					                 	claastlevel4.store.removeAll();
					                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
					                 	claastlevel3.store.load();
					                 	
					                 	productlist.store.getProxy().setExtraParam('class_code', class_code);
					                 	productlist.store.load();
					                 	
						           }
					        }
			    	
			    	}*/ /*,{
			    		id:'DBM7-level3',
				    	xtype: 'combo',
				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        mode: 'local',
				        editable:false,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'소분류',
				        displayField:   'class_name',
				        valueField:     'class_code',
				        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 3, identification_code: 'PD'} ),
				        listConfig:{
				            	getInnerTpl: function(){
				            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
				            	}
				           },
					        listeners: {
						           select: function (combo, record) {
					                 	console_log('Selected Value : ' + combo.getValue());
					                 	console_logs('record : ', record);
					                 	var class_code = record.get('class_code');
					                 	var claastlevel4 = Ext.getCmp('DBM7-level4');
					                 	var productlist = Ext.getCmp('DBM7-Assembly');
					                 	
					                 	claastlevel4.clearValue();
					                 	claastlevel4.store.removeAll();
					                 	claastlevel4.store.getProxy().setExtraParam('parent_class_code', class_code);
					                 	claastlevel4.store.load();
					                 	
					                 	productlist.store.getProxy().setExtraParam('class_code', class_code);
					                 	productlist.store.load();
					                 	
						           }
					        }
			    	
			    	},{
			    		id:'DBM7-level4',
				    	xtype: 'combo',
				    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        mode: 'local',
				        editable:false,
				        // allowBlank: false,
				        width: '25%',
				        queryMode: 'remote',
				        emptyText:'상세분류',
				        displayField:   'class_name',
				        valueField:     'class_code',
				        store: Ext.create('Mplm.store.ClaastStorePD', {level1: 4, identification_code: 'PD'} ),
				        listConfig:{
				            	getInnerTpl: function(){
				            		return '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
				            	}
				           },listeners: {
					           select: function (combo, record) {
				                 	console_log('Selected Value : ' + combo.getValue());
				                 	console_logs('record : ', record);
				                 	var class_code = record.get('class_code');
				                 	var productlist = Ext.getCmp('DBM7-Assembly');
				                 	
				                 	productlist.store.getProxy().setExtraParam('class_code', class_code);
				                 	productlist.store.load();
					           }
				        }
			    	
			    	} */  ]
				}
	    	] //dockedItems of End
			
		
		});//productGrid of End
    	
		
        this.productGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {  
        		//gUtil.enable(gMain.selPanel.addAssyAction);
        		gUtil.enable(gMain.selPanel.editAssyAction);
        		try{
        		if(selections!=null){
        			
	        		 var rec = selections[0];
	        		 console_logs('rec>>>>>>>>>>>>>',rec)
	        		 gMain.selPanel.classCode = rec.get('class_code');
	        		 gMain.selPanel.itemCode = rec.get('item_code');
	        		 gMain.selPanel.modelNo = rec.get('model_no');
	        		 gMain.selPanel.description = rec.get('description');
	        		 gMain.selPanel.parent = rec.get('unique_id_long');
	        		 gMain.selPanel.reserved_varchar1 = rec.get('item_code');
	        		 
	        		 gMain.selPanel.store.getProxy().setExtraParam('parent', rec.get('unique_id_long'));
	        		 gMain.selPanel.store.getProxy().setExtraParam('area_code_doosung', rec.get('area_code'));
	        		 gMain.selPanel.store.load();
        	}
        		}catch(e){
    				console_logs('e',e);
    			}
    		}
        });
		
		 this.west =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '40%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.productGrid /*, myFormPanel*/]
			});
    	
    	return this.west;
    },
    cellEditing : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    cellEditing1 : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    cellEditing2 : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    // *****************************GLOBAL VARIABLE**************************/
    grid : null,
    gridMycart : null,
    gridStock : null,
    store : null,
    myCartStore : null,
    stockStore : null,
    gItemGubunType : null,
    itemGubunType : null,
    inpuArea : null,

    sales_price : '',
    quan : '',
    selectedAssyRecord : null,
    lineGap : 35,

    selectedPjUid : '',
    selectedAssyUid : '',

    toPjUidAssy : '',	// parent
    toPjUid : '',	// ac_uid
    selectionLength : 0,

    commonUnitStore : null,
    commonCurrencyStore : null,
    commonModelStore : null,
    commonStandardStore2: null,
    GubunStore: null,

    assy_pj_code:'',
    selectedAssyCode:'',
    selectedPjCode:'',
    selectedPjName:'',
    selectedAssyDepth:0,
    selectedAssyName:'',
    selectedparent:'',
    ac_uid:'',
    selectedPjQuan : 1,
    selectedAssyQuan : 1,
    selectedMakingQuan : 1,

    addpj_code:'',
    is_complished : false,
    routeTitlename : '',
    puchaseReqTitle : '',

    CHECK_DUP : '-copied-',
    gGridMycartSelects: [],
    copyArrayMycartGrid: function(from) {

    	this.gGridMycartSelects = [];
    	if(from!=null && from.length>0) {	
    		for(var i=0; i<from.length; i++) {
    			this.gGridMycartSelects[i] = from[i];
    		}
    	}
    },
    gGridStockSelects:[],
    copyArrayStockGrid: function(from) {

    	this.gGridStockSelects = [];
    	if(from!=null && from.length>0) {	
    		for(var i=0; i<from.length; i++) {
    			this.gGridStockSelects[i] = from[i];
    		}
    	}
    },
    initTableInfo: '',
    INIT_TABLE_HEAD: function(){
    	var a =
    		'<style>'+
    		' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
    		' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
    		' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
    		' </style>' +
    		'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
    	'<colgroup>'+
    		'<col width="80px">' +
    		'<col width="90px">' +
    		'<col width="*">' +
    		
    		'<col width="90px">' +
    		'<col width="90px">' +
    		'<col width="50px">' +
    		'<col width="90px">' +
    		
    		'<col width="60px">' +
    		'<col width="60px">' +
    		'<col width="40px">' +
    		
    		'<col width="110px">' +
    		'<col width="90px">' +
    	'</colgroup>' +
    		'<tbody>' +
    		'<tr  height="30" >' +
    		'	  <td class="xl66" align=center>프로젝트코드</td>' +
    		'	  <td class="xl67" align=center>' + this.selectedPjCode + '</td>' +
    		'	  <td class="xl66" align=center>프로젝트이름</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedPjName + '</td>' +
    		'<td colspan="8" rowspan="2">'+
    		'</td>' +
    		'	 </tr>' + 
    		'<tr  height="30" >' +
    		'	  <td class="xl66" align=center>Assy코드</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedAssyCode + '</td>' +
    		'	  <td class="xl66" align=center>Assy이름</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedAssyName + '</td>' +
    		'	 </tr>' + 
    		'<tr  height="25" >' +
    		'	  <td class="xl66" align=center>품번</td>' +
    		'	  <td class="xl66" align=center>품명</td>' +
    		'	  <td class="xl66" align=center>규격</td>' +
    		
    		'	  <td class="xl66" align=center>재질</td>' +
    		'	  <td class="xl66" align=center>후처리</td>' +
    		'	  <td class="xl66" align=center>열처리</td>' +
    		'	  <td class="xl66" align=center>제조원</td>' +
    		
    		'	  <td class="xl66" align=center>예상가격</td>' +
    		'	  <td class="xl66" align=center>수량</td>' +
    		'	  <td class="xl66" align=center>구분</td>' +
    		'	  <td class="xl66" align=center>품목코드</td>' +
    		'	  <td class="xl66" align=center>UID</td>' +
    	'	 </tr>';
    		
    		return a;
    	},
    	INIT_TABLE_TAIL: 
    		'</tbody></table><br><br>' +
    		'<div style="color:blue;font-size:11px;position:relative; "><ul>'+
    		'<li>Excel Form에서는 엑셀프로그램과 Copy/Paste(복사/붙여넣기)하여 BOM을 생성,수정할 수 있습니다.</li>'+
    		'<li>위 영역의 모든 셀을 선택하여 복사(Ctrl+C)하여 엑셀에 붙여넣기(Ctrl+P) 해보세요.</li>'+
    		'<li>엑셀 작업 후 작업한 내용을 복사 한 후 다시 이곳에 붙여넣기 하고 [디플로이] 버튼을 눌러 저장하세요.</li>'+
    		'</ul></div>',
    	makeInitTable : function() {
    		var initTableLine = 
    			'	 <tr height="25" style="height:12.75pt">' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl67">&nbsp;</td>' +
    			'	  <td class="xl67">&nbsp;</td>' +
    			'	 </tr>';

			this.initTableInfo = INIT_TABLE_HEAD();
			this.initTableInfo = this.initTableInfo + INIT_TABLE_TAIL;
    	},
    	bomTableInfo : '',
    	
    	createLine: function (val, align, background, style) {
    		return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>'+ val + '</td>' ;
    	},

    	setChildQuan : function (n) {
    		var o = Ext.getCmp('childCount-DBM7');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},
    	
    	setAssyQuan : function(n) {
    		var o = Ext.getCmp('assy_quan-DBM7');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},
    	setProjectQuan : function(n) {
    		var o = Ext.getCmp('pj_quan-DBM7');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},

    	setMaking_quan : function(n) {
    		var o = Ext.getCmp('making_quan-DBM7');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    		
    	},

    	createHtml : function(route_type, rqstType, catmapObj) {
    		var htmlItems =
    			'<style>'+
    			' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
    			' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
    			' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
    			' </style><hr />' + '<div style="overflow-y:scroll;overflow-x: hidden;height:140px;">' +
    		'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;width:790px;">' +
    		'<colgroup>'+
    			'<col width="10%">' +
    			'<col width="10%">' +
    			'<col width="10%">' +
    			'<col width="20%">' +
    			'<col width="40%">' +
    		'</colgroup>' +
    			'<tbody>' +
    			'<tr  height="25" >' +
    			'	  <td class="xl67" align=center>품목코드</td>' +
    			'	  <td class="xl67" align=center>필요수량</td>' +
    			'	  <td class="xl67" align=center>' + rqstType + '수량</td>' +
    			'	  <td class="xl67" align=center>품명</td>' +
    			'	  <td class="xl67" align=center>규격</td>' +
    			'	 </tr>' ;
    		for(var i=0; i< catmapObj.length; i++) {
    			var rec = catmapObj[i];//grid.getSelectionModel().getSelection()[i];
    			var item_code = rec.get('item_code');
    			var quan = route_type=='P' ? rec.get('reserved_double1') : rec.get('goodsout_quan');
    			var new_pr_quan = rec.get('new_pr_quan');
    			var item_name = rec.get('item_name');
    			var specification = rec.get('specification');
    			
    			htmlItems = htmlItems + '	 <tr height="20" style="height:12.75pt">';
    			htmlItems = htmlItems + createLine(item_code, 'center', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + createLine(new_pr_quan, 'right', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + createLine(quan, 'right', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + createLine(item_name, 'left', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + createLine(specification, 'left', '#FFFFFF', 'xl65');//품번
    			htmlItems = htmlItems + '</tr>';

    		}
    		htmlItems = htmlItems + '</tbody></table></div>';
    		return htmlItems;
    	},

    	setMakeTable : function(records) {
    		this.bomTableInfo = this.INIT_TABLE_HEAD();
    		if(records==null || records.length==0) {
    			//bomTableInfo = initTableInfo;
    		} else {
    			
    			for( var i=0; i<records.length; i++) {
    	          	var rec = records[i];
    	        	var unique_id =  rec.get('unique_id');
    	        	var unique_uid =  rec.get('unique_uid');
    	        	var item_code =  rec.get('item_code');
    	        	var item_name =  rec.get('item_name');
    	        	var specification =  rec.get('specification');
    	        	var standard_flag =  rec.get('standard_flag');
    	        	var sp_code =  rec.get('sp_code'); //표시는 고객사 선책톧로
    	        	
    	        	var model_no =  rec.get('model_no');	
    	        	var description =  rec.get('description');
    	        	var pl_no =  rec.get('pl_no');
    	        	var comment =  rec.get('comment');
    	        	var maker_name =  rec.get('maker_name');
    	        	var bm_quan =  rec.get('bm_quan');
    	        	var unit_code =  rec.get('unit_code');
    	        	var sales_price =  rec.get('sales_price');
    	        	
    	        	this.bomTableInfo = this.bomTableInfo + '	 <tr height="25" style="height:12.75pt">';
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(pl_no, 'center', '#FFFFFF', 'xl65');//품번
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(item_name, 'left', '#FFFFFF', 'xl65');//품명
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(specification, 'left', '#FFFFFF', 'xl65');//규격
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(model_no, 'left', '#FFFFFF', 'xl65');//재질/모델
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(description, 'left', '#FFFFFF', 'xl65');//후처리
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(comment, 'left', '#FFFFFF', 'xl65');//열처리
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(maker_name, 'left', '#FFFFFF', 'xl65');//제조원
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(sales_price, 'right', '#FFFFFF', 'xl65');//예상가(숫자)
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(bm_quan, 'right', '#FFFFFF', 'xl65');//수량(숫자)
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(sp_code, 'center', '#FFFFFF', 'xl65');//구분기호
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(item_code, 'center', '#F0F0F0', 'xl67');//품목코드
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(unique_uid, 'center', '#F0F0F0', 'xl67');//UID
    	        	this.bomTableInfo = this.bomTableInfo + '	 </tr>';
    			}
    		}
    		this.bomTableInfo = this.bomTableInfo + this.INIT_TABLE_TAIL;
    		var o = Ext.getCmp('bom_content-DBM7');
    		o.setValue(this.bomTableInfo);
    	},

    	insertStockStoreRecord: function(records) {},
    	

    	cloudprojectStore : Ext.create('Mplm.store.cloudProjectStore', {} ),
	    mesProjectTreeStore : Ext.create('Mplm.store.MesProjectTreeStore', {}),
	    routeGubunTypeStore : Ext.create('Mplm.store.RouteGubunTypeStore', {} ),
	    routeGubunTypeStore_W : Ext.create('Mplm.store.RouteGubunTypeStore_W', {} ),
	    commonStandardStore : Ext.create('Mplm.store.CommonStandardStore', {hasNull: true} ),
	    


    	renderCarthistoryPlno : function(value, p, record) {
    		var unique_uid = record.get('unique_uid');
    		
    	    return Ext.String.format(
    	            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
    	           unique_uid, value
    	        );
    	},


    	getPosStandard: function(id){

    		for (var i=0; i<this.standard_flag_datas.length; i++){
    			if(this.standard_flag_datas[i].get('systemCode') == id){
    				return this.standard_flag_datas[i];
    			}
    		}
    		return null;
    	},

    	selectAssy: function(routeTitlename, depth) {
    		console_logs('routeTitlename', routeTitlename);
    		//addAction.enable();
    		this.addAssyAction.enable();
    		this.inpuArea.enable();
    		Ext.getCmp('addPartForm-DBM7').enable();
    		Ext.getCmp('target-routeTitlename-DBM7').update('<b>'+routeTitlename+'</b>'); 
    		if(depth==1) {
    			this.editAssyAction.disable();
    			this.removeAssyAction.disable();
    		} else {
    			this.editAssyAction.enable();
    			this.removeAssyAction.enable();		
    		}


    	},

    	unselectAssy : function() {
    		//this.addAction.disable();
    		this.addAssyAction.disable();
    		this.editAssyAction.disable();
    		this.removeAssyAction.disable();
    		this.inpuArea.disable();
    		Ext.getCmp('bom_content-DBM7').setValue(initTableInfo);
    		Ext.getCmp('addPartForm-DBM7').disable();
    		Ext.getCmp('target-routeTitlename-DBM7').update('Assembly를 선택하세요.'); 
    	},


    	item_code_dash: function(item_code){
    		if(item_code==null || item_code.length<13) {
    			return item_code;
    		}else {
    			return item_code.substring(0,12);
    		}
    	},

    	setReadOnlyName: function(name, readonly) {
    		this.setReadOnly(Ext.getCmp(name), readonly);
    	},

    	setReadOnly: function(o, readonly) {
    		if(o!=undefined && o!=null) {
        	    o.setReadOnly(readonly);
        	    if (readonly) {
        	        o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
        	    } else {
        	        o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
        	    }    			
    		}


    	},

    	getPl_no: function (systemCode) {
    	 	var prefix = systemCode;
    	 	if(systemCode=='S') {
    	 		prefix = 'K';
    	 	} else if(systemCode=='O') {
    	 		prefix = 'A';
    	 	}
    		   Ext.Ajax.request({
    			url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
    			params:{
    				first:prefix,
                    parent: this.selectedparent,
                    parent_uid: this.selectedAssyUid
    			},
    			success : function(result, request) {   
    				var result = result.responseText;
    				var str = result;	// var str = '293';
    				Ext.getCmp('pl_no-DBM7').setValue(str);

    				
    			},
    			failure: extjsUtil.failureMessage
    		});
    	},



    	 fPERM_DISABLING_Complished: function() {
    		// 1. 권한있음.
    		if (fPERM_DISABLING() == false && is_complished == false) {
    			return false;
    		} else { // 2.권한 없음.
    			return true;
    		}
    	},

    	//Define reset Action
    	resetAction : Ext.create('Ext.Action', {
    		 itemId: 'resetButton',
    		 iconCls: 'af-remove',
    		 text: CMD_INIT,
    		 handler: function(widget, event) {
    			 resetPartForm();
    			 Ext.getCmp('addPartForm-DBM7').getForm().reset();
    			 //console_logs('getForm().reset()', 'ok');
    		 }
    	}),
    	
    	pasteAction : Ext.create('Ext.Action', {
    		 itemId: 'pasteActionButton',
    		 iconCls: 'paste_plain',
    		 text: '현재 Assy에 붙여넣기',
    		 disabled: true,
    		 handler: function(widget, event) {
    		    	if(this.selectedparent==null || this.selectedparent=='' || this.selectedPjUid==null || this.selectedPjUid=='') {
    		    		Ext.MessageBox.alert('오류','먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
    		    	} else {

    		    	    var fp = Ext.create('Ext.FormPanel', {
    		    	    	id: 'formPanelSelect-DBM7',
    		    	    	frame:true,
    		    	        border: false,
    		    	        fieldDefaults: {
    		    	            labelWidth: 80
    		    	        },
    		    	        width: 300,
    		    	        height: 220,
    		    	        bodyPadding: 10,
    		    	        items: [
    							{
    								xtype: 'component',
    								html:'복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
    							},
    		    	            {
    				    	        xtype: 'container',
    				    	        layout: 'hbox',
    				    	        margin: '10 10 10',
    				    	        items: [{
    						    	            xtype: 'fieldset',
    						    	            flex: 1,
    						    	            border: false,
    						    	            //title: '복사 수행시 수량을 1로 초기화하거나 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.',
    						    	            defaultType: 'checkbox', // each item will be a checkbox
    						    	            layout: 'anchor',
    						    	            defaults: {
    					    	                anchor: '100%',
    					    	                hideEmptyLabel: false
    					    	            },
    					    	            items: [
    				    	                {
    					    	                fieldLabel: '복사 옵션',
    					    	                boxLabel: '수량을 1로 초기화',
    					    	                name: 'resetQty',
    					    	                checked: true,
    					    	                inputValue: 'true'
    					    	            }, {
    					    	                boxLabel: '품번 재부여',
    					    	                name: 'resetPlno',
    					    	                checked: true,
    					    	                inputValue: 'true'
    					    	            },  new Ext.form.Hidden({
    					        	            name: 'hid_null_value'
    					        		        })]
    				    	        }]
    				    	    }]
    			    	    });
    		    	    
    		    	    w = Ext.create('ModalWindow', {
    			            title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
    			            width: 300,
    			            height: 220,
    			            plain:true,
    			            items: fp,
    			            buttons: [{
    			                text: '복사 실행',
    			                disabled: false,
    			            	handler: function(btn){
    			            		var form = Ext.getCmp('formPanelSelect-DBM7').getForm();
    		            			var val = form.getValues(false);
    		            		    var selections = gridMycart.getSelectionModel().getSelection();
    		            		    if (selections) {
    		            		        	var uids = [];
    		            		        	for(var i=0; i< selections.length; i++) {
    		            		        		var rec = selections[i];
    		            		        		var unique_uid = rec.get('unique_uid');
    		            		        		uids.push(unique_uid);
    		            		        	}
    		            		      	   Ext.Ajax.request({
    		            		      			url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
    		            		      			params:{
    		            		      				project_uid: this.selectedPjUid,
    		            		                    parent: this.selectedparent,
    		            		                    parent_uid: this.selectedAssyUid,
    		            		      				unique_uids: uids,
    		            		      				resetQty: val['resetQty'],
    		            		      				resetPlno: val['resetPlno']
    		            		      			},
    		            		      			success : function(result, request) {   
    		            		            		if(w) {
    		            		            			w.close();
    		            		            		}
    		            		      				var result = result.responseText;
    	            		     					this.myCartStore.load(function() {});
    		            		      				//Ext.MessageBox.alert('결과','총 ' + result + '건을 복사하였습니다.');
    		            		     				store.load( function(records) {
    		            		     					gMain.selPanel.insertStockStoreRecord(records);
    		            		     					gMain.selPanel.setChildQuan(records.length);
    		            			     					
    		            			     			});
    		            		      			},
    		            		      			failure: extjsUtil.failureMessage
    		            		      		});

    		            		    }

    			            	}
    						},{
    			                text: CMD_CANCEL,
    			            	handler: function(){
    			            		if(w) {
    			            			w.close();
    			            		}
    			            	}
    						}]
    			        }); w.show();
    		    		
    		    		
    		    	}
    		 }
    	}),



    	//수정등록
    	modRegAction : Ext.create('Ext.Action', {
    		 itemId: 'modRegAction',
    		 iconCls: 'page_copy',
    		 text: '값 복사',
    		 disabled: true,
    		 handler: function(widget, event) {
    			 gMain.selPanel.unselectForm();
    			 grid.getSelectionModel().deselectAll();
    		 }
    	}),
    	cleanComboStore: function(cmpName)
    	{
    	    var component = Ext.getCmp(cmpName); 
    	    
    	    component.setValue('');
    	    component.setDisabled(false);
    		component.getStore().removeAll();
    		component.setValue(null)
    		component.getStore().commitChanges();
    		component.getStore().totalLength = 0;
    	},

    	resetParam: function() {
    		this.store.getProxy().setExtraParam('unique_id', '');
    		this.store.getProxy().setExtraParam('item_code', '');
    		this.store.getProxy().setExtraParam('item_name', '');
    		this.store.getProxy().setExtraParam('specification', '');
    	},

    	loadTreeAllDef: function(){
    		this.loadTreeAll(this.selectedPjUid);
    	},
    	loadTreeAll: function(pjuid) {
    		//this.pjTreeGrid.setLoading(true);
    		
    		this.mesProjectTreeStore.removeAll(true);
    		this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
    		this.mesProjectTreeStore.load( {		
    			callback: function(records, operation, success) {

    			}
    		});
    	},

    	setBomData: function(id) {

    		this.modRegAction.enable();
    		this.resetPartForm();
    		
    		Ext.Ajax.request({
    			url: CONTEXT_PATH + '/purchase/material.do?method=read',
    			params:{
    				id :id
    			},
    			success : function(result, request) {   
    	       		
    				var jsonData = Ext.decode(result.responseText);
    				//console_logs('jsonData', jsonData);
    				var records = jsonData.datas;
    				//console_logs('records', records);
    				//console_logs('records[0]', records[0]);
    				setPartFormObj(records[0]);
    			},
    			failure: extjsUtil.failureMessage
    		});
    		
    	},
    	
    	setPartFormObj : function(o) {
    		
    		//규격 검색시 standard_flag를 sp_code로 사용하기
    		Ext.Ajax.request({
    			url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
    			success : function(result) {
    				var text = result.responseText;
    				console_logs('text', text);
    				var o2 = JSON.parse(text, function (key, value) {
    						    return value;
    						});
    				
    			   //console_logs('o2', o2);
    	 		   gItemGubunType = o2['itemGubunType'];
    				//console_logs('itemGubun', itemGubunType);
    				//console_logs('itemGubun1', gItemGubunType);

    				
    				var standard_flag = null;
    				if(gItemGubunType=='standard_flag') {
    					standard_flag =  o['standard_flag'];
    				} else {
    					standard_flag =  o['sp_code'];
    				}
    				
    				Ext.getCmp('unique_id-DBM7').setValue( o['unique_id']);
    				Ext.getCmp('unique_uid-DBM7').setValue( o['unique_uid']);
    				Ext.getCmp('item_code-DBM7').setValue( o['item_code']);
    				Ext.getCmp('item_name-DBM7').setValue( o['item_name']);
    				Ext.getCmp('specification-DBM7').setValue( o['specification']);

    				Ext.getCmp('standard_flag-DBM7').setValue(standard_flag);
    				Ext.getCmp('standard_flag_disp-DBM7').select(getPosStandard(standard_flag));
    				Ext.getCmp('model_no-DBM7').setValue( o['model_no']);	
    				Ext.getCmp('description-DBM7').setValue( o['description']);
    				
    				Ext.getCmp('comment-DBM7').setValue( o['comment']);
    				Ext.getCmp('maker_name-DBM7').setValue( o['maker_name']);
    				Ext.getCmp('bm_quan-DBM7').setValue('1');
    				Ext.getCmp('unit_code-DBM7').setValue( o['unit_code']);
    				Ext.getCmp('sales_price-DBM7').setValue( o['sales_price']);
    				
    				
    				gMain.selPanel.getPl_no(standard_flag);
    				
    				var currency =  o['currency'];
    				if(currency==null || currency=='') {
    					currency = 'KRW';
    				}
    				Ext.getCmp('currency-DBM7').setValue(currency);
    				this.readOnlyPartForm(true);
    				
    				
    				
    			},
    			failure: extjsUtil.failureMessage
    		});
    		
    		
    		
    		
    		
    		
    	},
    	
    	setPartForm: function(record) {
    		//console_logs('record:', record);

    		Ext.getCmp('unique_id-DBM7').setValue( record.get('unique_id'));
    		Ext.getCmp('unique_uid-DBM7').setValue( record.get('unique_uid'));
    		Ext.getCmp('item_code-DBM7').setValue( record.get('item_code'));
    		Ext.getCmp('item_name-DBM7').setValue( record.get('item_name'));
    		Ext.getCmp('specification-DBM7').setValue( record.get('specification'));
    		
    		var standard_flag =  record.get('standard_flag');
    		Ext.getCmp('standard_flag-DBM7').setValue(standard_flag);
    		
    		Ext.getCmp('standard_flag_disp-DBM7').select(getPosStandard(standard_flag));
    		Ext.getCmp('model_no-DBM7').setValue( record.get('model_no'));	
    		Ext.getCmp('description-DBM7').setValue( record.get('description'));
    		Ext.getCmp('pl_no-DBM7').setValue( record.get('pl_no'));
    		Ext.getCmp('comment-DBM7').setValue( record.get('comment'));
    		Ext.getCmp('maker_name-DBM7').setValue( record.get('maker_name'));
    		Ext.getCmp('bm_quan-DBM7').setValue( record.get('bm_quan'));
    		Ext.getCmp('unit_code-DBM7').setValue( record.get('unit_code'));
    		Ext.getCmp('sales_price-DBM7').setValue( record.get('sales_price'));
    		
    		
    		var currency =  record.get('currency');
    		if(currency==null || currency=='') {
    			currency = 'KRW';
    		}
    		Ext.getCmp('currency-DBM7').setValue(currency);
    		
    		var ref_quan = record.get('ref_quan');
    		//console_logs('ref_quan', ref_quan);
    		if(ref_quan>1) {
    			this.readOnlyPartForm(true);
    			Ext.getCmp('isUpdateSpec-DBM7').setValue('false');
    		} else {
    			this.readOnlyPartForm(false);
    			this.setReadOnlyName('item_code-DBM7', true);
    			this.setReadOnlyName('standard_flag_disp-DBM7', true);
    			Ext.getCmp('isUpdateSpec-DBM7').setValue('true');
    		}

    	},

    	resetPartForm: function() {

    		Ext.getCmp('unique_id-DBM7').setValue( '');
    		Ext.getCmp('unique_uid-DBM7').setValue( '');
    		Ext.getCmp('item_code-DBM7').setValue( '');
    		Ext.getCmp('item_name-DBM7').setValue( '');
    		Ext.getCmp('specification-DBM7').setValue('');
    		Ext.getCmp('standard_flag-DBM7').setValue('');
    		Ext.getCmp('standard_flag_disp-DBM7').setValue('');

    		Ext.getCmp('model_no-DBM7').setValue('');
    		Ext.getCmp('description-DBM7').setValue('');
    		Ext.getCmp('pl_no-DBM7').setValue('');
    		Ext.getCmp('comment-DBM7').setValue('');
    		Ext.getCmp('maker_name-DBM7').setValue('');
    		Ext.getCmp('bm_quan-DBM7').setValue('1');
    		Ext.getCmp('unit_code-DBM7').setValue('');
    		Ext.getCmp('sales_price-DBM7').setValue( '0');

    		Ext.getCmp('currency-DBM7').setValue('KRW');
    		Ext.getCmp('unit_code-DBM7').setValue('PC');
    		this.readOnlyPartForm(false);
    	},

    	unselectForm: function(){

    		Ext.getCmp('unique_id-DBM7').setValue('');
    		Ext.getCmp('unique_uid-DBM7').setValue('');
    		Ext.getCmp('item_code-DBM7').setValue('');
    		
    		var cur_val = Ext.getCmp('specification-DBM7').getValue();
    		var cur_standard_flag = Ext.getCmp('standard_flag-DBM7').getValue();
    		
    		if(cur_standard_flag!='O') {
    			Ext.getCmp('specification-DBM7').setValue(cur_val + ' ' + this.CHECK_DUP);		
    		}
    		
    		Ext.getCmp('currency-DBM7').setValue('KRW');
    		
    		this.getPl_no(Ext.getCmp('standard_flag-DBM7').getValue());
    		this.readOnlyPartForm(false);
    	},

    	readOnlyPartForm :function(b) {

    		this.setReadOnlyName('item_code-DBM7', b);
    		this.setReadOnlyName('item_name-DBM7', b);
    		this.setReadOnlyName('specification-DBM7', b);
    		this.setReadOnlyName('standard_flag-DBM7', b);
    		this.setReadOnlyName('standard_flag_disp', b);

    		this.setReadOnlyName('model_no-DBM7', b);
    		this.setReadOnlyName('description-DBM7', b);
    		//this.setReadOnlyName('pl_no', b);
    		this.setReadOnlyName('comment-DBM7', b);
    		this.setReadOnlyName('maker_name-DBM7', b);

    		this.setReadOnlyName('currency-DBM7', b);
    		this.setReadOnlyName('unit_code-DBM7', b);
    		
    		Ext.getCmp('search_information-DBM7').setValue('');
    		
    	},

    	addNewAction: function() {

    		var form = Ext.getCmp('addPartForm-DBM7').getForm();
    	    if(form.isValid()) {
    	    	var val = form.getValues(false);
    	    	
    	    	val['parent'] = this.selectedparent;
    	    	val['parent_uid'] = this.selectedAssyUid;
    	    	val['ac_uid'] = this.selectedPjUid;
        	    val['pj_code'] = this.selectedPjCode;
        	    val['coord_key2'] = this.order_com_unique;
            	val['assy_name'] = this.selectedAssyName;
                val['pj_name'] = this.selectedPjName;
    	    	
    	    	
  				 Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=createNew',
					params : val,
				    method: 'POST',
				    success : function() {
           			
           			gMain.selPanel.store.load(function(records){
           				gMain.selPanel.unselectForm();
           				gMain.selPanel.setChildQuan(records.length);
           				gMain.selPanel.resetPartForm();
           			});
           			           			
           		},
	               failure: function (result, op)  {
	            	   var jsonData = Ext.util.JSON.decode(result.responseText);
	                   var resultMessage = jsonData.data.result;
	            	   Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function() {});
	               	
	               }
	        	 });   	

    	    }
    	},

    	searchAction : Ext.create('Ext.Action', {
    		itemId: 'searchButton',
    		iconCls: 'af-search',
    	    text: CMD_SEARCH/*'검색'*/,
    	    disabled: false ,
    	    handler: function ()
    	    {
    	    	gm.me().redrawStore();
    	    }
    	}),


    	Item_code_dash: function(item_code){
    			return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
    					item_code.substring(9, 12);
    	},

    	getColName: function (key) {
    		return gMain.getColNameByField(this.fields, key);
    	},

    	getTextName: function (key) {
    		return gMain.getColNameByField(this.fields, key);
    	},
    	
    	
    	materialClassStore : new Ext.create('Ext.data.Store', {

    		fields:[     
    		        { name: 'class_code', type: "string"  }
    		        ,{ name: 'class_name', type: "string" }
    		        ,{ name: 'level', type: "string"  } 
    	    ],
    		sorters: [{
    	        property: 'display_order',
    	        direction: 'ASC'
    	    }],
    	    proxy: {
    	    	type: 'ajax',
    	    	url: CONTEXT_PATH + '/design/class.do?method=read',
    	    	reader: {
    	    		type:'json',
    	    		root: 'datas',
    	    		totalProperty: 'count',
    	    		successProperty: 'success'
    	    	},
    	    	extraParams : {
    	    		level: '2',
    	    		parent_class_code: ''
    	    	}
    	    	,autoLoad: true
    	    }
    	}),
    	standard_flag_datas : [],
    	pjTreeGrid: null,
    	expandAllTree: function() {
    		if(this.pjTreeGrid!=null) {
    			this.pjTreeGrid.expandAll();
    		}
    	},
    	isExistMyCart: function(inId) {
    		var bEx = false;//Not Exist
    		this.myCartStore.data.each(function(item, index, totalItems) {
    	        console_logs('item', item);
    	        var uid = item.data['unique_uid'];
    	        console_logs('uid', uid);
    	        console_logs('inId', inId);
    	        if(inId == uid) {
    	        	bEx = true;//Found
    	        }
    	    });
    		
    		return bEx;
    	},
        loadStore: function(child) {
        	
        	this.store.getProxy().setExtraParam('child', child);
        	
    	    this.store.load( function(records){
    	     	console_logs('==== storeLoadCallback records', records);
            	console_logs('==== storeLoadCallback store', store);

            });
    	    
        },
        arrAssyInfo: function(o1, o2, o3, o4, o5, o6, o7, o8){
        	gMain.selPanel.mtrlChilds = o1;
        	gMain.selPanel.bmQuans = o2;
        	gMain.selPanel.itemCodes = o3;
        	gMain.selPanel.spCode = o4;
        	gMain.selPanel.ids = o5;
        	gMain.selPanel.levels = o6;
        	gMain.selPanel.bomYNs = o7;
        	gMain.selPanel.pcr_divs= o8;
        },
//        selectedClass1 : '',
//        selectedClass2 : '',
//        selectedClass3 : '',
        selectedClassCode: '',
        materialStore: Ext.create('Mplm.store.MtrlSubStore'),
        productSubStore:Ext.create('Mplm.store.ProductSubStore')
        //makeClassCode : function() {
        //	this.selectedClassCode = this.selectedClass1 + this.selectedClass2 + this.selectedClass3
        //}
        
        
        ,
        
        addMtrlGrid : null,
        addPrdGrid : null,
        deleteConfirm: function (result){
            if(result=='yes') {
    			    var arr = gMain.selPanel.selectionedUids;
    			    //console_logs('deleteConfirm arr', arr);
    			    if(arr.length>0) {
    					 
    			    	var CLASS_ALIAS = gMain.selPanel.deleteClass;
    			    	//console_logs('deleteConfirm CLASS_ALIAS', CLASS_ALIAS);
    			    	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    			    	if(CLASS_ALIAS==null) {
    			    		 CLASS_ALIAS = [];
    		    			for(var i=0; i<gMain.selPanel.fields.length; i++) {
    		    				var tableName = o['tableName']	==undefined ? 'map' : o['tableName'];
    		    				if(tableName!='map') {
    		    					CLASS_ALIAS.push(tableName);
    		    				}
    		    				
    		    			}				    	
    						 CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);			    		
    			    	}
    			    	//console_logs('deleteConfirm CLASS_ALIAS 2', CLASS_ALIAS);
    					 
    					 Ext.Ajax.request({
    							url: CONTEXT_PATH + '/index/generalData.do?method=delete',
    							params : {
    								DELETE_CLASS: CLASS_ALIAS,
    								uids : arr
    							},
    						    method: 'POST',
    							success: function(rec, op) {
    					           		//console_logs('success rec', rec);
    					           		//console_logs('success op', op);
    					    			//gMain.selPanel.redrawStore();
    								gMain.selPanel.store.load()

    			            	},
    			               failure: function (rec, op)  {
    			            	   Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});
    			               	
    			               }
    			        	 });
    			    	
    			    }
    		   }

    	   // }
    	},

});
