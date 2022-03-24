Ext.define('Rfx.view.produceMgmt.ProduceAdjustPcsMultiView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produceadjustpcsmulti-view',
    initComponent: function(){

      	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField ('pj_code');	
		this.addSearchField('buyer_name');
		this.addSearchField('item_name');
		this.addSearchField (
		{
				field_id: 'pcs_name'
				,store: "CommonCodeStore"
				,displayField: 'codeName'
				,valueField: 'systemCode'
				,params: {parentCode:'STD_PROCESS_NAME', hasNull:true}	
				,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
		});	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStoreSimple({
        		modelClass: 'Rfx.model.ProduceAdjustPcs',
		        pageSize: gMain.pageSize,/*pageSize*/
		        sorters: [{
		        	property: 'pcs_name',
		        	direction: 'asc'
		        }],
		        byReplacer: {
		        	'item_code': 'srcahd.item_code',
		        	'step': 'step.pcs_code'
		        },
		        deleteClass: ['pcsstep']
			        
		    }, {
		    	groupField: 'pcs_name'
        });
        
	        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==2||index==5||index==3||index==4) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        
        
        
        //grid 생성.
    	this.createGrid();


        this.createCrudTab();

        //multiTabGrid 생성
        var processList = null;
		
//		if(gUtil.checkUsePcstpl()==true) {
//			processList = gUtil.mesTplProcessBig;
//		} else {
			processList = [];
			console_logs('gUtil.mesStdProcess',gUtil.mesStdProcess);
			for(var i=0; i<gUtil.mesStdProcess.length; i++) {
				var o = gUtil.mesStdProcess[i];
				console_logs('processList', o);
//				if(o['code']!='CUT'&&o['code']!='CTP'&&o['code']!='ETC') {
					var o1 = {
							pcsTemplate: o['code'],
							code: o['code'],
							process_price:0,
							name: o['name']
					};
					console_logs('o1',o1);
					processList.push(o1);
//				}
			}
			
//		}
        
		 //프로세스정보 읽기
	       // if(gUtil.checkUsePcstpl()==true) {
	        	this.tab_info = []; 
	        	for(var i=0; i<processList.length; i++) {
			           	var o = processList[i];
			           	var code = o['code'];
			           	var name = o['name'];
			           	var title = name;
			           	var a = this.createPcsToobars(code);
			            console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>processList', o);
			           	this.tab_info.push({
			           		code: code,
			           		name: name,
			           		title: title,
//			           		toolbars: [a]
			           	});
			            console_logs('tab_info', this.tab_info);
		      	 }
		      	 
//		      	 console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>this.tab_info', this.tab_info);
			        for(var i=0; i<this.tab_info.length; i++) {
			           	var o = this.tab_info[i];
			           	var code = o['code'];
			           	var name = o['name'];
			           	var title = o['title'];
			           	var pcsToolbars = o['toolbars'];
			           	console_logs('createTabGrid code', code);
			           	console_logs('createTabGrid pcsToolbars', pcsToolbars);
			        }
		    //} 
	        	
	           	var ti = this.tab_info;
	            for(var i=0; i<ti.length; i++) {
	            //그리드에 컬럼 추가할때 이걸로 만듬.
//	            	var tab = ti[i];
//	            	console_logs('this.tab',tab);
//	            	console_logs('this.columns_map',this.columns_map);
//	            	
//	            	var tab_code = tab['code'];
//	            	var myColumn = this.columns_map[tab_code];
//	            	var myField =  this.fields_map[tab_code];
//	            	var pos = tab_code=='STL'? 6:5;
//	            	this.addExtraColumnBypcscode(myColumn, myField, tab_code, 'end_date', true, pos);
	         	
	            }
	            
	            console_logs('tab_info', this.tab_info);
	    		
	    	//Tab을 만들지 않는 경우.
	    	if(this.tab_info.length==0/* || vCompanyReserved4=='SHNH01KR' || vCompanyReserved4=='DDNG01KR'*/) {
	                
	    	    	Ext.apply(this, {
	                    layout: 'border',
	                    items: [this.grid,  this.crudTab]
	                });
	    	        this.callParent(arguments);
	    	        //디폴트 로드
	    	        gMain.setCenterLoading(false);
	    	        this.storeLoad(function(records){
//	    	        	console_logs('디폴트 데이터',  main);
//	    	     	   for(var i=0; i < records.length; i++){
//	    	     		   var specunit = records[i].get('specification');
//	    	     		   gm.me().spec.push(specunit);
//	    	     		 
//	    	     		   
//	    	     	   }
	    	        });
	                 
	    	    } else { //Tab그리드를 사용하는 경우.

	    	    	this.grid.setTitle('전체');
	    	    	var items = [];
	    	        items.push(this.grid);

	      //tab grid 생성
	       var tab = this.createTabGrid('Rfx.model.ProduceAdjustPcs', items, 'big_pcs_code', arr, function(curTab, prevtab) {
	                      var multi_grid_id = curTab.multi_grid_id;
	                    gm.me().multi_grid_id = multi_grid_id;
	                    
	                      console_logs('multi_grid_id: ',  multi_grid_id);
	                      if(multi_grid_id == undefined) {//Main Grid
//	                    	  store.getProxy().setExtraParam('pcs_code', '');
	                      
	                      
	                      } else {//추가 탭그리드
	                        var store = gm.me().store_map[multi_grid_id];
	                        store.getProxy().setExtraParam('pcs_code', multi_grid_id);
	    	                store.load(function(records) {
//	                        	console_logs('records',records);
	                        });
	                      }
	                      
	              });
	    	    }          
        Ext.apply(this, {
            layout: 'border',
            items: [tab,  this.crudTab]
        });
	    	  
        this.callParent(arguments);
        
    	this.store.getProxy().setExtraParam('orderBy', "pcs_code");
    	this.store.getProxy().setExtraParam('ascDesc', "ASC");  
        //디폴트 로드
    	gMain.setCenterLoading(false);
        this.store.load(function(records){
        	console_logs('ProduceAdjustView records', records);
        });
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
       	var smallPcs = null;//gUtil.mesTplProcessAll[code];
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
	 tab_selections: {}

});
