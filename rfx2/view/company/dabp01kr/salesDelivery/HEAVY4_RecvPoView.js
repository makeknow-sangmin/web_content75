//수주관리 메뉴
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.HEAVY4_RecvPoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'receved-mgmt-view',
    /*requires: [
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.form.field.Number',
		'Ext.form.field.Date',
		'Ext.tip.QuickTipManager'
	     	],*/
    
  //File첨부 폼
   // attachform: null,
   // Heavy_attachform: null,
    vFILE_ITEM_CODE: null,
    
    inputBuyer : null,
    initComponent: function(){
	
		    	
    	this.gridSumArr.push(
    			{
    				xtype:'component',
    				text: 'BOM 총 수량 : 0', 
    				id:gu.id('targetSumbom1') 
    				
    			});
    	this.gridSumArr.push(
    			{
    				xtype:'component',
    				text: 'BOM 총 중량 : 0', 
    				id:gu.id('targetSumbom2') 
    				
    			});
    	this.gridSumArr.push(
    			{
    				xtype:'component',
    				text: 'PO 총 수량 : 0', 
    				id:gu.id('targetSumPo1') 
    				
    			});
    	this.gridSumArr.push(
    			{
    				xtype:'component',
    				text: 'PO 총 중량 : 0', 
    				id:gu.id('targetSumPo2') 
    				
    			});
    	

    	//order by 에서 자동 테이블명 붙이기 끄기. 
    	this.orderbyAutoTable = false;
    	
    	this.setDefValue('regist_date', new Date());

    	//삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('delivery_plan', next7);
    	
    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	this.setDefComboValue('pj_type', 'valueField', 'P');
    	this.setDefComboValue('newmodcont', 'valueField', 'N');
    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');//세트여부
    	this.setDefComboValue('previouscont', 'valueField', 'C');//목형유형
    	this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');//목형유형
    	
    	//this.setDefValue('pj_code', 'test');
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	switch(vCompanyReserved4){
		case "HAEW01KR":
		this.addSearchField ({
			type: 'dateRange',
			field_id: 'regist_date',
			text: "W/O",
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});
		break;
		default :
			this.addSearchField ({
				type: 'dateRange',
				field_id: 'regist_date',
				text: gm.getMC('CMD_Order_Date', '등록일자'),
				sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
				edate: new Date()
			});
		break;
    	}
		
		switch(vCompanyReserved4){
		case "DDNG01KR":
		case "SHNH01KR":
			break;
		default :
			this.addSearchField (
				{
					type: 'combo',
					field_id: 'status'
					,store: "RecevedStateStore"
					,displayField: 'codeName'
					,valueField: 'systemCode'
					,emptyText: '진행상태'
					,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
				});	
				
				this.addSearchField (
				{
					type: 'combo'
					,width:175
					,field_id: 'wa_code'
					,store: "BuyerStoreSRO5"
					,displayField: 'wa_name'
					,valueField: 'wa_code'
					,emptyText: '고객사'
					,params:{groupBy:'wa_code'}
					,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
				});
		}
		
		switch(vCompanyReserved4){
		case "SWON01KR":
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
			this.addSearchField('reserved2');
			this.addSearchField('pj_reserved_varchar2');
			break;
		case "PNLC01KR":
			this.addSearchField (
			{
				type: 'area'
				,field_id: 'tag_no'
				,emptyText: 'TAG NO'
			});
			this.addSearchField (
			{
				type: 'area'
				,field_id: 'pj_code'
				,emptyText: 'SPOOL NO'
			});
			break;
		case "DDNG01KR":
			this.addSearchField('pj_code');//P/O번호
			this.addSearchField('area_code');//블록
			this.addSearchField('h_reserved44');//ACTIVITY	
			this.addSearchField('reserved1');//도장외부스펙1
			this.addSearchField('h_reserved9');  // 제작메모2
			this.addSearchField('comment');   //자재내역1
			
			break;
		case "SHNH01KR":
			this.addSearchField('pj_name');    // 프로젝트
			//this.addSearchField('area_code');  // 블럭
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'srcahd', //Table 명
				field_id: 'area_code',       // js에서의 필드 명
				fieldName: 'area_code' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'srcahd', //Table 명
				field_id: 'description',       // js에서의 필드 명
				fieldName: 'description' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'assymap', //Table 명
				field_id: 'reserved1',       // js에서의 필드 명
				fieldName: 'reserved1' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'assymap', //Table 명
				field_id: 'reserved2',       // js에서의 필드 명
				fieldName: 'reserved2' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'itemdetail', //Table 명
				field_id: 'h_reserved60',       // js에서의 필드 명
				fieldName: 'h_reserved60' //실재 Table Field Name
			});
			this.addSearchField({
				type: 'distinct',
				width: 140,
				tableName: 'project', //Table 명
				field_id: 'pj_code',       // js에서의 필드 명
				fieldName: 'pj_code' //실재 Table Field Name
			});
			break;
		default :
		
			this.addSearchField('area_code');
			this.addSearchField('h_reserved44');	
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
			
		}
		
		//Function Callback 정의
        //redirect
    	this.refreshActiveCrudPanel = function(source, selectOn, unique_id, record) {
    		if(selectOn==true) {
    			this.propertyPane.setSource(source); // Now load data
    			this.selectedUid = unique_id;
    			gUtil.enable(this.removeAction);
    			gUtil.enable(this.editAction);
    			gUtil.enable(this.copyAction);
    			gUtil.enable(this.viewAction);
    			gUtil.disable(this.registAction);
    			
    		} else {//not selected
            	this.propertyPane.setSource(source);
            	this.selectedUid = '-1';
            	gUtil.disable(this.removeAction);
            	gUtil.disable(this.editAction);
            	gUtil.disable(this.copyAction);
            	gUtil.disable(this.viewAction);
            	gUtil.enable(this.registAction);
            	this.crudTab.collapse();
    		}

    		console_logs('this.crudMode', this.crudMode);
    		this.setActiveCrudPanel(this.crudMode);
    	};

        switch(vCompanyReserved4){
	        case 'SWON01KR':
//			{
//				id:'productcombo-DBM7',
//			    	xtype: 'combo',
//			    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//			           mode: 'local',
//			           editable:false,
//			           // allowBlank: false,
//			           width: '100%',
//			           queryMode: 'remote',
//			           emptyText:'제품을 선택하세요.',
//			           displayField:   'item_code',
//			           valueField:     'unique_id',
//			           store: Ext.create('',{}),
//			           listConfig:{
//			            	getInnerTpl: function(){
//			            		return '<div data-qtip="{standard_flag}">[{standard_flag}] <small><font color=blue>{item_code}</font></small></div>';
//			            	}			                	
//			           },
//			           triggerAction: 'all',
//			           listeners: {
//			           select: function (combo, record) {
//		                 	console_log('Selected Value : ' + combo.getValue());
//		                 	console_logs('record : ', record);
//		                 	var srcahd_uid = record.get('unique_id');
//
//
//		                 }
//		            }
//	    }
	       this.addFormWidget('품목코드', {
	            	   tabTitle:"품목코드", 
	            	   	id:	'SRO5_SEW_ITEMCD',
	                   xtype: 'combo',
	                   text: '품목코드',
	                   name: 'product_code',
	                   storeClass: 'ProductStore',
	                   emptyText:'제품을 선택하세요.',
	                   displayField: "item_code",
	                   valueField: "item_code", 
	                   innerTpl:  '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{item_code}/상세:{comment}</font></small></div>', 
	                   listeners: {
		 		           select: function (combo, record) {
		 	                 	console_log('Selected Value : ' + combo.getValue());
		 	                 	console_logs('record : ', record);
		 	                 	var item_code = record.get('item_code');
		 	                 	//gMain.selPanel.reflashClassCode(class_code);
		 	                 	
		 	                 	var target_item_name = gMain.selPanel.getInputTarget('item_code');
		 	                	target_item_name.setValue(item_code);
		 		           }
		 	        },
	                   canCreate:   true,
	                   canEdit:     true,
	                   canView:     true,
	                   position: 'center'
	        });
	       
	        this.addFormWidget('품목코드', {
	      	   tabTitle:"품목코드", 
	      	   	id:	'SRO5_SEW_LV1',
	             xtype: 'combo',
	             text: '대분류',
	             name: 'level1',
	             storeClass: 'ClaastStorePD',
	             params:{level1: 1, identification_code: "PD"},
	             displayField: "class_name",
	             valueField: "class_code", 
	             innerTpl: "<div>[{class_code}] {class_name}</div>", 
	             listeners: {
	 		           select: function (combo, record) {
	 	                 	console_log('Selected Value : ' + combo.getValue());
	 	                 	console_logs('record : ', record);
	 	                 	var class_code = record.get('class_code');
	 	                 	var claastlevel2 = Ext.getCmp('SRO5_SEW_LV2');
	 	                 	var claastlevel3 = Ext.getCmp('SRO5_SEW_LV3');
	 	                 	var claastlevel4 = Ext.getCmp('SRO5_SEW_LV4');
	 	                 	var item_code = Ext.getCmp('SRO5_SEW_ITEMCD');
	 	                 	item_code.clearValue();
	 	                 	item_code.store.removeAll();
	 	                 	
	 	                 	item_code.store.getProxy().setExtraParam('class_code', class_code);
	 	                 	item_code.store.load();
	 	                 	
	 	                 	claastlevel2.clearValue();
	 	                 	claastlevel2.store.removeAll();
	 	                 	claastlevel3.clearValue();
	 	                 	claastlevel3.store.removeAll();
	 	                 	claastlevel4.clearValue();
	 	                 	claastlevel4.store.removeAll();
	 	                 	
	 	                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
	 	                 	claastlevel2.store.load();
	 	                 	//gMain.selPanel.reflashClassCode(class_code);
	 	                 	
	 		           }
	 	        },
	             canCreate:   true,
	             canEdit:     true,
	             canView:     true,
	             position: 'center'
	         }); 
	         
	         this.addFormWidget('품목코드', {
	       	   tabTitle:"품목코드", 
	       	   	id:	'SRO5_SEW_LV2',
	              xtype: 'combo',
	              text: '중분류',
	              name: 'level2',
	              storeClass: 'ClaastStorePD',
	              params:{level1: 2, identification_code: "PD"},
	              displayField: "class_name",
	              valueField: "class_code", 
	              innerTpl: "<div>[{class_code}] {class_name}</div>", 
	              listeners: {
	 		           select: function (combo, record) {
	 	                 	console_log('Selected Value : ' + combo.getValue());
	 	                 	console_logs('record : ', record);
	 	                 	var class_code = record.get('class_code');
	 	                 	var claastlevel3 = Ext.getCmp('SRO5_SEW_LV3');
	 	                 	var claastlevel4 = Ext.getCmp('SRO5_SEW_LV4');
	 	                 	var item_code = Ext.getCmp('SRO5_SEW_ITEMCD');
	 	                 	item_code.clearValue();
	 	                 	item_code.store.removeAll();
	 	                 	
	 	                 	item_code.store.getProxy().setExtraParam('class_code', class_code);
	 	                 	item_code.store.load();
	 	                 	
	 	                 	claastlevel3.clearValue();
	 	                 	claastlevel3.store.removeAll();
	 	                 	claastlevel4.clearValue();
	 	                 	claastlevel4.store.removeAll();
	 	                 	
	 	                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
	 	                 	claastlevel3.store.load();
	 	                 	
	 	                 	//gMain.selPanel.reflashClassCode(class_code);
	 	                 	
	 		           }
	 	        },
	              canCreate:   true,
	              canEdit:     true,
	              canView:     true,
	              position: 'center'
	             	 
	          });        
	         this.addFormWidget('품목코드', {
	       	   tabTitle:"품목코드", 
	       	   	id:	'SRO5_SEW_LV3',
	              xtype: 'combo',
	              text: '소분류',
	              name: 'level3',
	              storeClass: 'ClaastStorePD',
	              params:{level1: 3, identification_code: "PD"},
	              displayField: "class_name",
	              valueField: "class_code", 
	              innerTpl: "<div>[{class_code}] {class_name}</div>",
	              listeners: {
	 		           select: function (combo, record) {
	 	                 	console_log('Selected Value : ' + combo.getValue());
	 	                 	console_logs('record : ', record);
	 	                 	var class_code = record.get('class_code');
	 	                 	var claastlevel4 = Ext.getCmp('SRO5_SEW_LV4');
	 	                 	var item_code = Ext.getCmp('SRO5_SEW_ITEMCD');
	 	                 	item_code.clearValue();
	 	                 	item_code.store.removeAll();
	 	                 	
	 	                 	item_code.store.getProxy().setExtraParam('class_code', class_code);
	 	                 	item_code.store.load();
	 	                 	
	 	                 	claastlevel4.clearValue();
	 	                 	claastlevel4.store.removeAll();
	 	                 	
	 	                 	claastlevel4.store.getProxy().setExtraParam('parent_class_code', class_code);
	 	                 	claastlevel4.store.load();
	 	                 	
	 	                 	//gMain.selPanel.reflashClassCode(class_code);
	 	                 	
	 		           }
	 	        },
	              canCreate:   true,
	              canEdit:     true,
	              canView:     true,
	              position: 'center'
	          });        
	         this.addFormWidget('품목코드', {
	       	   tabTitle:"품목코드",
	       	   	id:	'SRO5_SEW_LV4',
	              xtype: 'combo',
	              text: '상세분류',
	              name: 'level4',
	              storeClass: 'ClaastStorePD',
	              params:{level1: 4, identification_code: "PD"},
	              displayField: "class_name",
	              valueField: "class_code", 
	              innerTpl: "<div>[{class_code}] {class_name}</div>", 
	              canCreate:   true,
	              canEdit:     true,
	              canView:     true,
	              position: 'center',
	              listeners: {
	 		           select: function (combo, record) {
	 	                 	console_log('Selected Value : ' + combo.getValue());
	 	                 	console_logs('record : ', record);
	 	                 	var class_code = record.get('class_code');
	 	                 	var item_code = Ext.getCmp('SRO5_SEW_ITEMCD');
	 	                 	item_code.clearValue();
	 	                 	item_code.store.removeAll();
	 	                 	
	 	                 	item_code.store.getProxy().setExtraParam('class_code', class_code);
	 	                 	item_code.store.load();
	 	                 	
	 	                 	//gMain.selPanel.reflashClassCode(class_code);
	 	                 	
	 		           }
	 	        }
	          });
	         break;
	         default:
        }
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		console_logs('searchToolbar', searchToolbar);
		
		
		
		switch(vCompanyReserved4){
		
		case "SHNH01KR":
			var buttonToolbar = this.createCommandToolbar({
        		REMOVE_BUTTONS : [
        		        	        'REGIST','COPY'
        			]		
        });
			break;
			default:
				  var buttonToolbar = this.createCommandToolbar({
		        		REMOVE_BUTTONS : [
		        		        	        /*'REGIST',*/'COPY'
		        			]		
		        });
		}
		//명령툴바 생성
      
        
        

 
        switch(vCompanyReserved4){
        case "DDNG01KR":
        	this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4RecvPoViewModel',
    	        pageSize: 100,//gMain.pageSize,
    	        sorters: [{
    	        	property: 'wa_name, assymap.unique_id',
    	            direction: 'DESC'
    	        }]
    	        
    	    }, {
    	    	groupField: 'wa_name'
        });
        	break;
     	
        case 'PNLC01KR':
        	this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4RecvPoViewModel',
    	        pageSize: 100,//gMain.pageSize,
    	        sorters: [{
     	            property: 'specification',//TAG NO
     	            direction: 'asc'
    	        }], 
    	        deleteClass: 'assymap'
    	        
    	    }, {
    	    	groupField: 'specification'
        });
        	break;
        case 'SWON01KR':
       	 this.createStore('Rfx.model.HEAVY4RecvPoViewModel', [{
	            property: 'num',
	            direction: 'asc'
	        }],
	        //gMain.pageSize
	        [100]  //pageSize
	        , this.sortBy
	        //삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
	        , ['assymap']
	        );
            break;
        default:
        	 this.createStore('Rfx.model.HEAVY4RecvPoViewModel', [{
 	            property: 'specification',
 	            direction: 'asc'
 	        }],
 	        //gMain.pageSize
 	        [100]  //pageSize
 	        , this.sortBy
         	//삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
         	, ['assymap']
 	        );
        	break;
        }
       
              
        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
            //console_logs('tabpanel newTab', newTab);
            //console_logs('tabpanel newTab newTab.title', newTab.title);

            switch(newTab.title) {
            case '구매요청':
                gMain.selPanel.refreshBladeInfoAll();
                break;
//            case '공정설계':
//            	gMain.selPanel.refreshProcess();
//            	break;
            }
            
            
        };
        

        
        this.setRowClass(function(record, index) {
        	
        	// console_logs('record', record);
            var c = record.get('status');
            // console_logs('c', c);
            switch(c) {
                case 'CR':
                	return 'yellow-row';
                	break;
                case 'P':
                	return 'orange-row';
                	break;
                case 'DE':
                	return 'red-row';
                	break;
                case 'BM':
                	break;
                default:
                	return 'green-row';
            }

        });
        
        for(var i=0; i< this.columns.length; i++) {
        	
        	var o = this.columns[i];
        	//console_logs('this.columns' + i, o);
        	
        	var dataIndex = o['dataIndex'];
        	
        	switch(dataIndex) {
        	case 'mass':
        	case 'reserved_double1':
        		o['summaryType'] = 'sum';
        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                	value = Ext.util.Format.number(value, '0,00.000/i');
                	
                	value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'(KG)</font></div>'
                	return value;
                };
        		break;
        	case 'reserved_double2':
        	case 'reserved_double3':
        	case 'quan':
        	case 'bm_quan':
        		o['summaryType'] = 'sum';
        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
                	return value;
                };
        		break;
        	case 'h_reserved9':
        		o['summaryType'] = 'count';
        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:15pt; color:blue;">합계</font></div>'
                	return value;
                };
        		
        		default:
        		/*o['summaryType'] = 'count';
          		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
          			console_logs('value', value);
          			console_logs('summaryData', summaryData);
          			console_logs('dataIndex', dataIndex);
                    return ((value === 0 || value > 1) ? '(' + value + ' 개)' : '(1 개)');
                };*/
        	}
        	
        }
        /*for(var i=0; i< this.columns.length; i++) {
        	var o = this.columns[i];
        	//console_logs('this.columns' + i, o);
        }*/
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
      //grid 생성.
        switch(vCompanyReserved4){
        case "DDNG01KR":
    		var option = {
				features: [{
		            //id: 'group',
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '<div><font color=#003471>{name}</font></div>',
		            hideGroupedHeader: true,
		            /*enableGroupingMenu: false*/
		        }]
					
			};
        	this.createGridCore(arr, option);
        	break;
        case "PNLC01KR":
    		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
    	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
    	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> ({rows.length} 항목)</div>'
    		}); 
    		var option = {
    				features: [groupingFeature]
    		};
        	this.createGridCore(arr, option);
        	break;
    		var option = {
				features: [{
		            //id: 'group',
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '<div><font color=#003471>{name}</font></div>',
		            hideGroupedHeader: true,
		            /*enableGroupingMenu: false*/
		        }]
					
			};
        	this.createGridCore(arr, option);
        	break;
        	
        case "SHNH01KR":
        	this.createGrid();
        	break;
        default:
        	this.createGrid(searchToolbar, buttonToolbar);
        break;
        }
       
		//this.createGridCore(arr, option);
        
        
        this.setRowClass(function(record, index) {
        	
        	console_logs('record', record);
            var c = record.get('status');
            console_logs('c', c);
            switch(c) {
                case 'CR':
                	return 'yellow-row';
                	break;
                case 'P':
                	return 'orange-row';
                	break;
                case 'DE':
                	return 'red-row';
                	break;
                case 'BM':
                	break;
                default:
                	return 'green-row';
            }

        }	);
        
        
        //this.createGrid(arr);
        
        //작업지시 Action 생성
        this.requestAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '생산 요청',
			 tooltip: '생산 요청',
			 disabled: true,
			 
			 handler: function() {
				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
				 if (selections) {
				 
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '생산 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.doRequest();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
				 } else {
					 Ext.MessageBox.alert('알림','선택한 자재가 없습니다.');
				 }
			    	
			    	
			 }
		});
        
      //제작생산요청 Action 생성 --신화용
        this.requestProduceAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '제작생산요청',
			 tooltip: '제작생산요청',
			 disabled: true,
			 
			 handler: function() {
				 
				 gMain.selPanel.pcstype = 'D';
				 gMain.selPanel.reserved_varchar3 = 'PRD';
 	        	gMain.selPanel.doRequestProduce();
			    	
			 }
		});
        
      //도장작업지시 Action 생성 --신화용
        this.requestPaintAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '도장생산요청',
			 tooltip: '도장생산요청',
			 disabled: true,
			 
			 handler: function() {
				 gMain.selPanel.pcstype = 'P';
				 gMain.selPanel.reserved_varchar3 = 'PND';
 	        	gMain.selPanel.doRequestProduce();
				 //gMain.selPanel.doRequest();
			    	
			    	
			 }
		});
        
      //moldid Action 생성
        this.moldidAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '물성 입력',
			 tooltip: '물성 입력',
			 disabled: true,
			 
			 handler: function() {
				 gMain.selPanel.moldidInput();
			 }
		});
        
      //group Action 생성
        this.minLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '소그룹구성',
			 tooltip: '소그룹구성',
			 disabled: true,
			 
			 handler: function() {
				 
				 Ext.Ajax.request({
					 url: CONTEXT_PATH + '/index/process.do?method=bringdrawingnum',
					 params:{
					 		},
         			success : function(response, request) {
         				var rec = Ext.JSON.decode(response.responseText);
         				
         				//console_logs('maxnumber>>>>>>>>>>>>>', rec);
         				//Ext.getCmp('alter_item_code').setValue(rec);
         				//gMain.selPanel.maxnum = rec.get('datas');
         				gMain.selPanel.maxnum = rec['datas'];
         				//console_logs('gMain.selPanel.maxnum>>>>>>>>>>>>>', gMain.selPanel.maxnum);
         				gMain.selPanel.mingroupInput();
         			},
         			failure: function(val, action){
       				 alert('ajax실패');
         			}
				 });
				 
				 
			 }
		});
        //버튼 추가.
        switch(vCompanyReserved4){
        case 'DDNG01KR' :
        	buttonToolbar.insert(5, this.minLotAction);
        	buttonToolbar.insert(5, this.moldidAction);
        	buttonToolbar.insert(5, '-');
        	break;
        case 'SHNH01KR' :
        	buttonToolbar.insert(4, this.requestPaintAction);
        	buttonToolbar.insert(4, this.requestProduceAction);
            buttonToolbar.insert(4, '-');
            break;
        default :
           	buttonToolbar.insert(5, this.requestAction);
            buttonToolbar.insert(5, '-');
            break;
        }

      
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
//        	console_logs('tab_selections>>>>>>>>>>>>>>>>>>>',selections)
//        var code = gm.me().selected_tab;
//        	
//        	if(code!=undefined) {
//            	gm.me().tab_selections[code] = selections;
//        	}
//        	
//        	
//        	var toolbar = null;
//        	var items = null;
//        	if(code!=undefined) {
//        		var infos = gm.me().tab_info;
//        		console_logs('infos', infos);
//        		if(infos!=null) {
//        			for(var i=0; i<infos.length; i++) {
//        				var o = infos[i];
//        				if(o['code'] == code) {
//        					var toolbars = o['toolbars'];
//        					toolbar = toolbars[0];
//        					items = toolbar.items.items;
//        				}
//            			
//        			}
//        		}
//        		
//        	}
//        	
//        	console_logs('toolbar', toolbar);
//        	console_logs('toolbar items', items);
        	console_logs('gm.me().selected_tab', gm.me().selected_tab);
        	console_logs('selections', selections);
        	var code = gm.me().selected_tab;
        	if(code!=undefined) {
            	gm.me().tab_selections[code] = selections;
        	}
        	
            if (selections.length) {
            	
            	var rec = selections[0];
            	var status = rec.get('status');
            	var prd_fin_date = rec.get('h_reserved73'); 
            	
            	
            	if(prd_fin_date!=null&&prd_fin_date!=''){
            		gUtil.enable(gMain.selPanel.requestPaintAction);
            		
            	}else{
            		gUtil.enable(gMain.selPanel.requestProduceAction);
            	}
            	
				console_logs('prd_fin_date>>>>>>>>>>>>>>>', prd_fin_date);
				console_logs('==========>>>>sta', status);
            	if(status=='BM'){
            		gUtil.enable(gMain.selPanel.removeAction);
            		gUtil.enable(gMain.selPanel.requestAction);
            	}else{
            		gUtil.disable(gMain.selPanel.removeAction);
            		gUtil.disable(gMain.selPanel.requestAction);
            	}
				gUtil.enable(gMain.selPanel.editAction);    
				
				gUtil.enable(gMain.selPanel.moldidAction);
				gUtil.enable(gMain.selPanel.minLotAction);
				
				
				gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid'); 
				gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code'); 
				gMain.selPanel.vSELECTED_PJ_CODE = gUtil.stripHighlight(gMain.selPanel.vSELECTED_PJ_CODE); 
				var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
				gMain.selPanel.pj_code = gMain.selPanel.vSELECTED_PJ_CODE+"-" ;
				var str = rec.get('h_reserved44');
				var o = str.substring(str.length-3, str.length-2);
				if(o<4){
					gMain.selPanel.vSELECTED_ACTIVITY = "선행";
				}else{
					gMain.selPanel.vSELECTED_ACTIVITY = "후행";
				}
				console_logs('activite', gMain.selPanel.vSELECTED_ACTIVITY);
				
            } else {
				gUtil.disable(gMain.selPanel.removeAction);
				gUtil.disable(gMain.selPanel.editAction);   
				gUtil.disable(gMain.selPanel.requestAction);
				gUtil.disable(gMain.selPanel.moldidAction);
				gUtil.disable(gMain.selPanel.minLotAction);
				gUtil.disable(gMain.selPanel.requestProduceAction);
				gUtil.disable(gMain.selPanel.requestPaintAction);
            }

        });
        

        
        this.createCrudTab();

		var processList = null;
		
		if(gUtil.checkUsePcstpl()==true) {
			processList = gUtil.mesTplProcessBig;
		} else {
			processList = [];
			for(var i=0; i<gUtil.mesStdProcess.length; i++) {
				var o = gUtil.mesStdProcess[i];
				console_logs('processList', o);
				if(o['parent']==o['code']) {
					var o1 = {
							pcsTemplate: o['code'],
							code: o['code'],
							process_price:0,
							name: o['name']
					};
					console_logs('o1',o1);
					processList.push(o1);
				}
			}
			
		}
		
	    //프로세스정보 읽기
       // if(gUtil.checkUsePcstpl()==true) {
        	this.tab_info = []; 
        	for(var i=0; i<processList.length; i++) {
		           	var o = processList[i];
		           	var code = o['code'];
		           	var name = o['name'];
		           	var title = name;
		           	var a = this.createPcsToobars(code);
//		            console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>buttonToolbar', a);
		           	this.tab_info.push({
		           		code: code,
		           		name: name,
		           		title: title,
//		           		toolbars: [a]
		           	});
	      	 }
	      	 
//	      	 console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>this.tab_info', this.tab_info);
//		        for(var i=0; i<this.tab_info.length; i++) {
//		           	var o = this.tab_info[i];
//		           	var code = o['code'];
//		           	var name = o['name'];
//		           	var title = o['title'];
//		           	var pcsToolbars = o['toolbars'];
//		           	console_logs('createTabGrid code', code);
//		           	console_logs('createTabGrid pcsToolbars', pcsToolbars);
//		        }
	    //} 
    	var ti = this.tab_info;
        for(var i=0; i<ti.length; i++) {
        //그리드에 컬럼 추가할때 이걸로 만듬.
//        	var tab = ti[i];
//        	console_logs('this.tab',tab);
//        	console_logs('this.columns_map',this.columns_map);
//        	
//        	var tab_code = tab['code'];
//        	var myColumn = this.columns_map[tab_code];
//        	var myField =  this.fields_map[tab_code];
//        	var pos = tab_code=='STL'? 6:5;
//        	this.addExtraColumnBypcscode(myColumn, myField, tab_code, 'end_date', true, pos);
     	
        }
        
        console_logs('tab_info', this.tab_info);
		
	    //Tab을 만들지 않는 경우.
	    if(this.tab_info.length==0 || vCompanyReserved4=='KWLM01KR' /*|| vCompanyReserved4=='DDNG01KR'*/) {
            
	    	Ext.apply(this, {
                layout: 'border',
                items: [this.grid,  this.crudTab]
            });
	        this.callParent(arguments);
	        //디폴트 로드
	        gMain.setCenterLoading(false);
	        this.storeLoad(function(records){
	        	
	        	switch(vCompanyReserved4) {
                    case 'SHNH01KR':
                        for(var i=0; i < records.length; i++){
//		 	     		   var specunit = records[i].get('specification');
                            var targetSumbom1 = targetSumbom1+records[i].get('bm_quan');
                            var targetSumbom2 = targetSumbom2+ records[i].get('reserved_double1');
                            var targetSumPo1 = targetSumPo1 +records[i].get('quan');
                            var targetSumPo2 = targetSumPo2 +records[i].get('mass');
                        }
                        break;
                }
	        	
	        });
             
	    } else { //Tab그리드를 사용한는 경우.

		    	this.grid.setTitle('전체');
	    	var items = [];
	        items.push(this.grid);

      //tab grid 생성
        var tab = this.createTabGrid('Rfx.model.HEAVY4RecvPoViewModel', items, 'big_pcs_code', arr, function(curTab, prevtab) {
                  var multi_grid_id = curTab.multi_grid_id;
                gm.me().multi_grid_id = multi_grid_id;
                
                  console_logs('multi_grid_id: ',  multi_grid_id);
                  if(multi_grid_id == undefined) { //Main grid
//                    gm.me().store.getProxy().setExtraParam('status', "BM");
                	  gm.me().store.getProxy().setExtraParam('pnt_status', null);
                    gm.me().store.getProxy().setExtraParam('h_reserved73', null);
//                    gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
                    if(vCompanyReserved4=='SHNH01KR'){
                    	gm.me().store.getProxy().setExtraParam('h_reserved43', '미제작');
                    	gm.me().store.getProxy().setExtraParam('orderBy', 'unique_id');
                    	gm.me().store.getProxy().setExtraParam('ascDesc', 'ASC');
                    }
                    gm.me().storeLoad(function(records){
                         console_logs('디폴트 데이터', multi_grid_id);
                      });
                  } else {//추가 탭그리드
                    var store = gm.me().store_map[multi_grid_id];
	        		switch(multi_grid_id) {
	        		case 'PRD':
	        			if(vCompanyReserved4=='SHNH01KR') {
	        				store.getProxy().setExtraParam('orderBy', 'unique_id');
	        		        store.getProxy().setExtraParam('ascDesc', 'ASC');
	    					store.getProxy().setExtraParam('h_reserved73','is_null');
	    					store.getProxy().setExtraParam('h_reserved43', '미제작');
	    				}
	        			break;
	        		case 'PNT':
	        			if(vCompanyReserved4=='SHNH01KR') {
	        				//store.getProxy().setExtraParam('status', null);
//	        				store.getProxy().setExtraParam('pnt_status', "T");
	        				store.getProxy().setExtraParam('orderBy', 'unique_id');
	        		        store.getProxy().setExtraParam('ascDesc', 'ASC');
	    					store.getProxy().setExtraParam('h_reserved73','is_notnull');
	    					store.getProxy().setExtraParam('h_reserved43', '미제작');
	    				}
	        			break;
	        		}
                    store.load(function(records) {
                    	console_logs('records',records);
                    });
                  }
                  
                });
        
      switch(vCompanyReserved4){
      	case 'SHNH01KR':
	      Ext.apply(this, {
	          layout: 'border',
	          items: [tab,  this.crudTab]
	       });
        break;
      	default:
            Ext.apply(this, {
               layout: 'border',
               items: [this.grid,  this.crudTab]
            });       			
      	}
    }
		this.preCreateCallback = function() {
			console_logs('this.crudMode;', this.crudMode);

			//공정복사
			if(this.crudMode == 'COPY') {
				Ext.Msg.alert('안내', '복사등록을 위한 공정복사를 진행합니다.',  function() {
					Ext.Ajax.request({
						url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
						params:{
							fromUid: gMain.selPanel.vSELECTED_UNIQUE_ID ,
							toUid: vCUR_USER_UID*(-100)
						},
						
						success : function(result, request) { 
							gm.me().doCreateCore();
					          
							
						},//endofsuccess
						failure: extjsUtil.failureMessage
					});//endofajax
					return false;
				});
				
			} else {
				gm.me().doCreateCore();
				return true;
			}

		}
			        

        this.callParent(arguments);

      
        switch(this.link){
        case "SRO5_DDG" :
        	this.store.getProxy().setExtraParam('order_com_unique',  79070000300);
        	this.store.getProxy().setExtraParam('status',  "BM");
        break;
        case "SRO5_DDG_H" :
        	this.store.getProxy().setExtraParam('order_com_unique',  79070000259);
        	this.store.getProxy().setExtraParam('status',  "BM");
        break;
        case "SRO5_HAEW1" :
        	this.store.getProxy().setExtraParam('pj_type',  "SPL");
        	this.store.getProxy().setExtraParam('status',  "BM");
        break;
        case "SRO5_HAEW2" :
        	this.store.getProxy().setExtraParam('pj_type',  "STL");
        	this.store.getProxy().setExtraParam('status',  "BM");
        break;
        case "SRO5_SEW" :
            this.store.getProxy().setExtraParam('orderBy', "num");
        	this.store.getProxy().setExtraParam('ascDesc', "ASC");  
        break;

        default : 
        	this.store.getProxy().setExtraParam('order_com_unique',  -1);
    	    this.store.getProxy().setExtraParam('status',  "BM");
        	switch(vCompanyReserved4){
	        case 'SHNH01KR' :
	        	this.store.getProxy().setExtraParam('orderBy', "specification");
	            this.store.getProxy().setExtraParam('ascDesc', "ASC");
	        }
        
        	break;
        }
        //디폴트 로드
        gMain.setCenterLoading(false);
        
//        this.storeLoad();
       
        
    },
   
    
    
    selectPcsRecord: null,
    items : [],
    pj_code: null,
//    assymap_uids : [],
    computeProduceQty: function(cur) {
		//console_logs('computeProduceQty cur', cur);
		var target_stock_qty_useful = this.getInputTarget('stock_qty_useful');
		var target_bm_quan = this.getInputTarget('bm_quan');
		
		var val = cur - target_stock_qty_useful.getValue();
		if(val<0) {
			val = 0;
		}
		target_bm_quan.setValue(val);
    },

    refreshBladeInfo: function() {
		var val = gMain.getBladeInfo();
		var target = this.getInputTarget('blade_size_info');
		target.setValue(val);
    },
    
    refreshBladeInfoAll: function() {
    	var val1 = gMain.getBladeInfoAll();
    	var target1 = this.getInputTarget('blade_size_info1');
    	target1.setValue(val1);
    },
    //원지/원단 수량 설정
    refreshBmquan: function(cur) {
		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
		target_bm_quan1.setValue(cur);
		
		var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
		target_bm_quan2.setValue(cur);
    },
    refreshProcess: function() {
    	
		var target_bm_quan = this.getInputTarget('bm_quan');
		var bm_quan = target_bm_quan.getValue();
		
		var o = Ext.getCmp(	this.link + '-'+ 'grid-top-spoQty' ).setText('생산수량: ' + bm_quan);
		
    	
//		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
//		var bm_quan1 = target_bm_quan1.getValue();
//		Ext.getCmp(	this.link + '-'+ 'grid-top-paperQty' ).setText('원지수량: ' + bm_quan1);

		
		var val = gMain.getBladeInfo();
		Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo' ).setText(val);
		

    },
//    reflashClassCode : function(o){
//    	this.selectedClassCode = o;
//    	var target_class_code = gMain.selPanel.getInputTarget('class_code');
//    	var target_item_code = gMain.selPanel.getInputTarget('item_code');
//    	target_class_code.setValue(o);
//    	target_item_code.setValue(o);
//    	
//    },
    
    
    tab_selections: {},
    //구매/제작요청
    doRequest: function() {
    	
    	var assymap_uids = [];
    	var ac_uids = [];
    	var childs = [];
    	var bm_quans = [];
    	var selections = this.grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];

    		var ac_uid =  rec.get('ac_uid');
    		var child =  rec.get('child');
    		var uid =  rec.get('unique_id');
    		var bm_quan =  rec.get('bm_quan');
    		assymap_uids.push(uid);
    		ac_uids.push(ac_uid);
    		childs.push(child);
    		bm_quans.push(bm_quan)
		}
		
		this.grid.setLoading(true);

	    Ext.Ajax.request({		
			url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
			params:{
				
				assymap_uids: assymap_uids,
				childs: childs,
				project_uids: ac_uids,
				ac_uids:ac_uids,
				bm_quans:bm_quans,
				parent_code: this.link
			},
			
			success : function(result, request) { 
				var jsonData = Ext.util.JSON.decode(result.responseText);
				// var data = jsonData.datas[0] == undefined ? jsonData.datas : jsonData.datas[0];
		
				if(jsonData.datas == null || jsonData.datas[0] == null) {
					gMain.selPanel.store.load(function() {
						gm.me().grid.setLoading(false);
					});
					Ext.Msg.alert('안내', 'BOM을 작성해주세요.', function() {});
				} else {
					gMain.selPanel.store.load(function() {
						gm.me().grid.setLoading(false);
					});
					Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				}
			},//endofsuccess
			
			failure: extjsUtil.failureMessage
		});//endofajax	

    },
    
    
  //제작생산요청 - 신화
    doRequestProduce: function() {
    	
    	var assymap_uids = [];
    	
    	
    	if(gm.me().multi_grid_id==undefined){
    		var selections = gm.me().grid.getSelectionModel().getSelection();
    	}else{
    		var multi_grid_id = this.link+ '#' + gm.me().multi_grid_id;
    		console_logs('multi_grid1',multi_grid_id);
//    		multi_grid = gu.getCmp(multi_grid_id);
    		multi_grid = this.getTabGrid(multi_grid_id);
    		console_logs('this.grid',this.grid);
    		console_logs('multi_grid',multi_grid);
    		var selections = multi_grid.getSelectionModel().getSelection();
    		console_logs('selections',selections);
    	}
    	
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		var uid =  rec.get('unique_id');
    		assymap_uids.push(uid);
    		console_logs('assymap_uids',assymap_uids);
    	}
    	
    	var form = null;
		//var checkname = false;
		 form = Ext.create('Ext.form.Panel', {
	    		id: gu.id('formPanel'),
	    		xtype: 'form',
	    		frame: false ,
	    		border: false,
	    		bodyPadding: '3 3 0',
	    		region: 'center',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                anchor: '100%',
	                //labelWidth: 60,
	                //margins: 10,
	            },
	            items   : [
	            {
	                xtype: 'fieldset',
	                title: '입력',
	                collapsible: true,
	                defaults: {
	                    labelWidth: 40,
	                    anchor: '100%',
	                    layout: {
	                        type: 'hbox',
	                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                    }
	                },
	            items   : [
	                       {
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '구분자',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true,
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id : 'po_no',
	                                   name      : 'po_no',
	                                   fieldLabel: '구분자',
	                                   margin: '0 5 0 0',
	                                   width: 300,
	                                   allowBlank: false,
	                                   value : gMain.selPanel.lotname,
	                                   maxlength: '1',
//	                                   emptyText: '영문대문자와 숫자만 입력',
//	                                   validator: function(v) {
//	                                       if (/[^A-Z0-9_-]/g.test(v)) {
//	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
//	                                       }
//	                                	  /* if(/^[ㄱ-ㅎ|가-힣\ ]/g.test(v)){
//	                                		   console_logs('입력 제한 >>>>', v);
//	                                		   v = v.replace(/^[ㄱ-ㅎ|가-힣\ ]/g,'');
//	                                	   }*/
//	                                       this.setValue(v);
//	                                       return true;
//	                                   }
	                               },
	                               {
	                            	   id: 'dupCheckButton',
	                                   xtype:'button',
	                                   style: 'margin-left: 3px;',
	                                   width : 50,
	                                   text: '중복'+CMD_CONFIRM,
	                                   //style : "width : 50px;",
	                                   handler : function(){
	                                	   
	                                	   var po_no = Ext.getCmp('po_no').getValue();
	                                      	
	                                       //중복 코드 체크
	                                       	Ext.Ajax.request({
	                                			url: CONTEXT_PATH + '/index/process.do?method=checkName',				
	                                			params:{
	                                				po_no : po_no
	                                			},
	                                			
	                                			success : function(result, request) {
	                                				var resultText = result.responseText;
	                                				if(resultText=='0') {
	                                					Ext.MessageBox.alert('정상', '사용가능합니다.');
	                                					gMain.selPanel.checkname = true;
	                                					//alert('사용가능합니다.');
	                                				}else {
	                                					Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
	                                					//alert('코드를 확인하세요.');
	                                				}
	                                				
	                                				console_log('resultText', gMain.selPanel.checkname);
	                        
	                                			},//Ajax success
	                                			failure: extjsUtil.failureMessage
	                                		}); 
	                                	   
	                                	   
	                   						
	                                   }//endofhandler
	                                }
	                           ]
	                       },
	            
	                               
	                           ]
	            }
	                   ]
			
	                    });//Panel end...
			myHeight = 120;
			myWidth = 390;
			
			
				prwin = gMain.selPanel.prwinrequest(form);
		
    

    },
	createPcsToobars : function(code) {
		console_logs('createPcsToobars code', code);
		var buttonItems = [];
		
		buttonItems.push(
		{   name: code + 'finish_date',
            cmpId: code + 'finish_date',
             format: 'Y-m-d',
              fieldStyle: 'background-color: #D6E8F6; background-image: none;',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			    	allowBlank: true,
			    	xtype: 'datefield',
			    	value: new Date() ,
			    	width: 100,
				handler: function(){
				}
			});
       	var smallPcs = gUtil.mesTplProcessAll[code];
       	console_logs('-------------->  smallPcs', smallPcs);
       	if(smallPcs!=null && smallPcs.length>0) {
       	for(var i=0; i <smallPcs.length; i++) {
       		var o1 = smallPcs[i];
       		var code1  = o1['code'];
       		var name1 = o1['name'];
       		console_logs('createPcsToobars code1', code1);
       		console_logs('createPcsToobars name1', name1);
       		
			var action = {
					xtype: 'button',
					iconCls: 'af-check',
					cmpId: code+code1,
					text: name1 + ' 완료',
					big_pcs_code: code,
					pcs_code: code1,
					disabled: true,
					handler: function() {
						console_logs('createPcsToobars', this.cmpId + ' clicked');
						console_logs('big_pcs_code', this.big_pcs_code);
						console_logs('pcs_code', this.pcs_code);
						
						var text = gm.me().findToolbarCal(this.big_pcs_code);
						console_logs('text', text);
						if(text==null) {
							Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function() {});
						} else {
							var date = text.getValue();
							console_logs('val', date);
							var selections = gm.me().tab_selections[this.big_pcs_code];
							console_logs('selections', selections);
							if(selections!=null) {
								var whereValue = [];
								var field = this.pcs_code + '|' + 'end_date';
								for( var i=0; i<selections.length; i++) {
									var o = selections[i];
									o.set(field, date);
									console_logs('o', o);
									var step_uid = o.get(this.pcs_code + '|' + 'step_uid');
									whereValue.push(step_uid);
								}
								console_logs('createPcsToobars', whereValue);
								gm.editAjax('pcsstep', 'end_date', date, 'unique_id', whereValue,  {type:'update_pcsstep'});
						    	
							}
							
						}
						
					}
			};
			buttonItems.push(action);
       	}//endoffor
       	}//endofif
       	
       	console_logs('createPcsToobars buttonItems', buttonItems);
        var buttonToolbar1 = Ext.create('widget.toolbar', {
    		items: buttonItems
    	});
        
        console_logs('createPcsToobars buttonToolbar', buttonToolbar1);
        
        return buttonToolbar1;
	},
	   addExtraColumnBypcscode: function(myColumn, myField, big_pcs_code, step_field, editable,pos) {
	    	console_logs('big_pcs_code', big_pcs_code);
	    	var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
	    	if(smallPcs==undefined || smallPcs.length==0) {
	    		return;
	    	}
	    	console_logs('smallPcs', smallPcs);
	    	//복사대상
	    	var c  = myColumn[0];
	    	var f = myField[0];
	    	for(var j=0; j<smallPcs.length; j++) {
	    		var o = smallPcs[j];
	    		
	    		var new_c = {};
	    		for(var key in c) {
	    			switch(key) {
	    			case 'dataIndex':
	    				new_c[key] = o['code']+'|' + step_field;
	    				break;
	    			case 'text':
	    				new_c[key] = o['name'];
	    				
	    				switch(vCompanyReserved4) {
	    				case 'HAEW01KR':
	    					this.changeFieldNameHaewon(big_pcs_code, o['name'], new_c, key);
	    					break;
	    				case 'DOOS01KR':
	    					this.changeFieldNameDoosung(big_pcs_code, o['name'], new_c, key);
	    					break;
	    				}
	    				break;
					default:
						new_c[key] = c[key];
	    				
	    			}
	    		}
	    		var new_f = {};
	    		console_logs('smallPcs o', o);
	    		for(var key in f) {
	    			switch(key) {
	    			case 'text':
	    				new_f[key] = o['name'];
	    				break;
	    			case 'name':
	    				new_f[key] = o['code']+'|' + step_field;
	    				break;
					default:
						new_f[key] = f[key];
	    				
	    			}
	    		}
	    		new_c['canEdit'] = editable;
	    		new_c['dataType'] = 'sdate';
	    		new_c['important'] = true;
	    		new_f['tableName'] = 'pcsstep';
	    		new_f['type'] = 'date';
	    		new_f['useYn'] = 'Y';
	    		
	        	console_logs('-----------new_c', new_c);
	        	console_logs('--------------new_f', new_f);
	    		myColumn.splice(pos+j, 0, new_c);
	        	myField.splice(pos+j, 0, new_f);

	    	}
	    	console_logs('-----------myColumn', myColumn);
	    	console_logs('--------------myField', myField);
	    },
    prwinrequest: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: 'LOT 명',
        width: myWidth,
        
        //height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(){
        		//console_logs('중복 확인>>>>>>',gMain.selPanel.checkname);
        		if(gMain.selPanel.checkname == false){
    				Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
    			}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	var assymap_uids =[];
                    	var po_quan = 0;
                    	var reserved_double4 = 0;
                    	
                    	if(gm.me().multi_grid_id==undefined){
                    		var selections = gm.me().grid.getSelectionModel().getSelection();
                    	}else{
//                    		var multi_grid_id = gm.me().link+ '#' + gm.me().multi_grid_id;
                    		var selections = gm.me().tab_selections[gm.me().multi_grid_id];
                    		console_logs('selections!!!!!!!!!!!@@@@@@@@@@@@###########',selections);
                    	}
                    	
                    	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		console_logs('rec', rec);
                    		var uid =  rec.get('id');  //assymap unique_id
                    		console_logs('uid', uid);
                    		assymap_uids.push(uid);
                    		var po_quan_unit = rec.get('bm_quan');  //BOM 수량
                    		
                    		console_logs('unit 수량', po_quan_unit);
                    		po_quan = po_quan + po_quan_unit;
                    		console_logs('po_quan 수량', po_quan);
                    		var tmp_weight = rec.get('reserved_double1');   //  BOM 중량
                    		reserved_double4 = reserved_double4 + tmp_weight;
                    		console_logs('중량', reserved_double4);
                    	}
                    	console_logs('assymap_uids', assymap_uids);
                    	//var cartmaparr = gMain.selPanel.cartmap_uids;
                    	var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                    	
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addPrdPntLotHeavy',
                             params:{
                            	 				assymap_uids: assymap_uids,
                                				ac_uid: ac_uid,
                                				pcsType : gMain.selPanel.pcstype,
                                				reserved_varchar3 : gMain.selPanel.reserved_varchar3,
                                				po_quan: po_quan,
                                				reserved_double4 : reserved_double4,
                                				join_type : 'srcahd'
                               				},
                                			success: function(val, action){
                                				prWin.close();
                                				if(gm.me().multi_grid_id==undefined){
                                					gMain.selPanel.store.load(function(){});
                                            	}else{
                                            		var store = gm.me().store_map[gm.me().multi_grid_id];
                                            		store.load();
                                            	}
                                				
                                			},
                                			failure: function(val, action){
                                				 prWin.close();
                                			}
                    		}); 
    			}// checkname of end
        	
        	}//btn handler
		},{
            text: CMD_CANCEL,
        	handler: function(){
        		if(prWin) {
        			
        			prWin.close();
        			
        		}
        	}
		}]
    });
	  prWin.show();
    },
  //도장생산요청 - 신화
   /* doRequestPaint: function() {
    	
    	var assymap_uids = [];
    	var selections = this.grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		var uid =  rec.get('unique_id');
    		assymap_uids.push(uid);
    	}
    	
	    Ext.Ajax.request({		
			url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
			params:{
				assymap_uids: assymap_uids,
				parent_code: this.link
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			
			failure: extjsUtil.failureMessage
		});//endofajax	

    },*/
    
    savePcsstdHandler: function() {
		 var gridPcsStd = Ext.getCmp('recvPoPcsGrid');
		 //console_logs('gridPcsStd', gridPcsStd);
		 
	    	var modifiend =[];
	    	
	    	var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan', '1');
	    	
	    	  var prevQty = Number(target_bm_quan.getValue());
	    	  //var tomCheck = false;
	    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
	    	  {
	    	        var record = gridPcsStd.store.data.items [i];
	           		var pcs_no =  record.get('pcs_no');
	           		var pcs_code = record.get('pcs_code');
	           		var serial_no = Number(pcs_no) / 10;
	           		var plan_qty = record.get('plan_qty');
	           		
	    	        if (record.dirty) {
	    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
	    	           	console_log(record);
	    	           	var pcs_code = record.get('pcs_code').toUpperCase();
	    	           	var pcs_name = record.get('pcs_name');
	    	           	if(gMain.checkPcsName(pcs_code) && pcs_name!='<공정없음>') {
	    	           		
	    	           		var plan_date = record.get('plan_date');
	    	           		var yyyymmdd ='';
	    	           		if(plan_date!=null) {
	    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
	    	           		}

	    	           		if(plan_qty==0) {
	    	           			plan_qty = prevQty;
	    	           		}
	    	           		
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	obj['pcs_code'] = record.get('pcs_code');
	    		           	obj['pcs_name'] = record.get('pcs_name');

	    		           	obj['description'] = record.get('description');
	    		           	obj['comment'] = record.get('comment');
	    		           	obj['machine_uid'] = record.get('machine_uid');
	    		           	obj['seller_uid'] = record.get('seller_uid');

	    		           	obj['std_mh'] = record.get('std_mh');
	    		           	obj['plan_date'] = yyyymmdd;
	    		           	obj['plan_qty'] = plan_qty;
	    		           	
	    		           	modifiend.push(obj);
	    	           	} else {
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	
	    		           	obj['pcs_code'] = '';
	    		           	obj['pcs_name'] = '';

	    		           	obj['description'] = '';
	    		           	obj['comment'] = '';
	    		           	obj['machine_uid'] = '-1';
	    		           	obj['seller_uid'] = '-1';

	    		           	obj['std_mh'] = '0';
	    		           	obj['plan_date'] = '';
	    		           	obj['plan_qty'] = '0';
	    		           	modifiend.push(obj);
	    	           	}

	    	        }
	    	        prevQty = plan_qty;
	    	  }
	    	  
	    	  if(modifiend.length>0) {
	    		
	    		  console_log(modifiend);
	    		  var str =  Ext.encode(modifiend);
	    		  console_log(str);
	    		  console_log('modify>>>>>>>>');
	    		    Ext.Ajax.request({
	    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
	    				params:{
	    					modifyIno: str,
	    					srcahd_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
	    				},
	    				success : function(result, request) {   
	    					gridPcsStd.store.load(function() {
	    						//alert('come');
	    	       				//var idxGrid = storePcsStd.getTotalCount() -1;
	    	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
	    						
	    					});
	    				}
	    		    });
	    	  }
	 },
    
    moldidInput: function(){
    	var form = null;
		//var checkname = false;
		 form = Ext.create('Ext.form.Panel', {
	    		id: gu.id('formPanel'),
	    		xtype: 'form',
	    		frame: false ,
	    		border: false,
	    		bodyPadding: '3 3 0',
	    		region: 'center',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                anchor: '100%',
	                margins: 10,
	            },
	            items   : [
	            {
	                xtype: 'fieldset',
	                title: '입력',
	                collapsible: true,
	                defaults: {
	                    anchor: '100%',
	                    layout: {
	                        type: 'hbox',
	                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                    }
	                },
	            items   : [
	                       {
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '도장외부스펙1',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id : 'reserved1',
	                                   name      : 'reserved1',
	                                   margin: '0 5 0 0',
	                                   width: 150,
	                                   allowBlank: false
	                               }
	                              
	                           ]
	                       }/*,{
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '제작메모2',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id : 'h_reserved9',
	                                   name      : 'h_reserved9',
	                                   margin: '0 5 0 0',
	                                   width: 150,
	                                   allowBlank: false
	                               }
	                              
	                           ]
	                       }*/
	            
	                               
	                           ]
	            }
	                   ]
			
	                    });//Panel end...
			myHeight = 120;
			myWidth = 390;
			
			
				prwin = gMain.selPanel.prwinopen(form);
		
    },
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
		modal : true,
        title: 'Information Insert',
        width: myWidth,
        
        //height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(){
               	var form = gu.getCmp('formPanel').getForm();
               	var assymap_uids = [];
            	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
            	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var uid =  rec.get('unique_id');
            		assymap_uids.push(uid);
            	}
                    	
  					form.submit({
                    url : CONTEXT_PATH + '/index/process.do?method=updatePntspec',
                         params:{
                     	 			assymap_uids: assymap_uids
                         				},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.store.load(function(){});
                                			},
                                			failure: function(val, action){
                                				 prWin.close();
                                			}
                    		}); 
    		
        	
        	}//btn handler
		},{
            text: CMD_CANCEL,
        	handler: function(){
        		if(prWin) {
        			
        			prWin.close();
        			
        		}
        	}
		}]
    });
	  prWin.show();
    },
    
    //소그룹 입력 폼
    mingroupInput: function(rec){
    	var form_ = null;
		//var checkname = false;
    	console_logs('from rec>>>>>>>>>', rec);
		 form = Ext.create('Ext.form.Panel', {
	    		id: 'formPanelMini',
	    		xtype: 'form',
	    		frame: false ,
	    		border: false,
	    		bodyPadding: '3 3 0',
	    		region: 'center',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                anchor: '100%',
	                margins: 10,
	            },
	            items   : [
	            {
	                xtype: 'fieldset',
	                title: '소그룹 속성 입력',
	                collapsible: true,
	                defaults: {
	                    anchor: '100%',
	                    layout: {
	                        type: 'hbox',
	                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                    }
	                },
	            items   : [
	                       {
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '소그룹명',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id : 'item_code',
	                                   name      : 'item_code',
	                                   margin: '0 5 0 0',
	                                   //width: 250,
	                                   allowBlank: false,
	                                   value : gMain.selPanel.pj_code 
	                               },{
	                                   xtype     : 'button',
	                                   id : 'itemcodeChk',
	                                   name      : 'itemcodeChk',
	                                   margin: '0 5 0 0',
	                                   text : '중복'+CMD_CONFIRM,
	                                   //width: 150,
	                                   allowBlank: false,
	                                   handler : function(){
	                                	   alert('중복 확인 하기');
	                                   }
	                               }
	                              
	                           ]
	                       },{
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '제작완료요청일',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'datefield',
	                                   id : 'reserved7',
	                                   name      : 'reserved7',
	                                   margin: '0 5 0 0',
	                                   width: 150,
	                                   allowBlank: false,
	                                   format: 'Y-m-d',
	           	    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	           	    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                               }
	                              
	                           ]
	                       },{
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '후공정',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'combo',
	                                   id : 'description',
	                                   name      : 'description',
	                                   mode: 'local',
	                                   store: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'POST_PROCESS'}),
	                                   displayField:   'code_name_kr',
	                                   value: '도장',
	                                   //sortInfo: { field: 'create_date', direction: 'DESC' },
	                                   margin: '0 5 0 0',
	                                   width: 150,
	                                   allowBlank: false
	                               }
	                              
	                           ]
	                       },{
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '특기사항',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'combo',
	                                   id : 'comment',
	                                   name      : 'comment',
	                                   mode: 'local',
	                                   store: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PRE_POST_WORK'}),
	                                   value: gMain.selPanel.vSELECTED_ACTIVITY, 
	                                   displayField:   'code_name_kr',
	                                   
	                                   margin: '0 5 0 0',
	                                   width: 150,
	                                   allowBlank: false
	                               }
	                              
	                           ]
	                       },{
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '전달사항',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id : 'request_comment',
	                                   name      : 'request_comment',
	                                   margin: '0 5 0 0',
	                                   width: 150
	                                   
	                               }
	                              
	                           ]
	                       },{
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '제작도관리번호',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id : 'alter_item_code',
	                                   name      : 'alter_item_code',
	                                   margin: '0 5 0 0',
	                                   value : gMain.selPanel.maxnum,
	                                   width: 150,
	                                   allowBlank: false
	                               }
	                              
	                           ]
	                       }
	            
	                               
	                           ]
	            }
	                   ]
			
	                    });//Panel end...
			myHeight = 120;
			myWidth = 390;
			
			
				prwin = gMain.selPanel.propen(form);
		
    },
    propen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
		modal : true,
        title: 'Information Insert',
        width: myWidth,
        
        //height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(){
               	var form = Ext.getCmp('formPanelMini').getForm();
               	var assymap_uids = [];
               	var mass = 0;   //po 중량
               	var quan = 0;  //po 수량
               	var sales_price = 0;
            	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
            	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var uid =  rec.get('unique_id');
            		var mass_unit = rec.get('mass');
            		mass = mass+ mass_unit;
            		assymap_uids.push(uid);
            		var quan_unit = rec.get('quan');
            		console_logs('quan_unit', quan_unit);
            		quan = quan + quan_unit;
            		sales_price = selections[0].get('sales_price');
            		console_logs('reserved_double2', quan);
            	}
            	
            	var ac_uid = selections[0].get('ac_uid');
            	var area_code = selections[0].get('area_code');
            	
            	area_code = gUtil.stripHighlight(area_code);  //하이라이트 삭제 
            	
  					form.submit({
                    url : CONTEXT_PATH + '/index/process.do?method=addCombineSubLot',
                         params:{
                     	 			assymap_uids: assymap_uids,
                     	 			ac_uid : ac_uid,
                     	 			totalmass : mass,
                     	 			reserved_double2 : quan,
                     	 			sales_price : sales_price,
                     	 			area_code : area_code
                         				},
                                			success: function(val, action){
                                				prWin.close();
                                				gMain.selPanel.store.load(function(){});
                                			},
                                			failure: function(val, action){
                                				 //prWin.close();
                                				// alert('소그룹명 중복');
                                			}
                    		}); 
    		
        	
        	}//btn handler
		},{
            text: CMD_CANCEL,
        	handler: function(){
        		if(prWin) {
        			
        			prWin.close();
        			
        		}
        	}
		}]
    });
	  prWin.show();
    },
    
});
