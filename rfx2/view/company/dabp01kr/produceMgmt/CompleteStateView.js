Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.CompleteStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'completestate-view',
    initComponent: function(){

		for(var i=0; i<23; i++) {
			var text = (i+1)*10 +'';
			if(text.length==2) {
				text = "0" + text;
			}
			var o = {
					useYn: true,
					align :	"center",
					dataIndex	:	'pcs' + text,
					sortable	:	false,
					style		:	"text-align:center",
					text		:	text,
					width		:	120
					/*
					,
					renderer: function (v, m, r, rowIndex, columnIndex, view) {
						console_logs('renderer v', v);
						return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); }
						*/
			};
			this.columns.push(o);
//			var o = {
//					useYn: true,
//					align :	"center",
//					dataIndex	:	'ratio' + text,
//					sortable	:	false,
//					style		:	"text-align:center",
//					text		:	text,
//					width		:	50
//					/*
//					,
//					renderer: function (v, m, r, rowIndex, columnIndex, view) {
//						console_logs('renderer v', v);
//						return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); }
//						*/
//			};
//			this.columns.push(o);
		}
//		Ext.each(this.columns, function(o, index) { //Editable
//			console_logs('this.columns index', index);
//			console_logs('this.columns o', o);
//		});		
		for(var i=0; i<23; i++) {
			var text = (i+1)*10 +'';
			if(text.length==2) {
				text = "0" + text;
			}
			var o = {

					name	:	'pcs' + text,
					type	:	"string"
			};
			this.fields.push(o);
			var oRatio = {
					name	:	'ratio' + text
			};
			this.fields.push(oRatio);
		}
	
		
//		Ext.each(this.fields, function(o, index) { //Editable
//			console_logs('this.fields index', index);
//			console_logs('this.fields o', o);
//		});
		
      	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField ('pj_code');	
		this.addSearchField (
				{
						field_id: 'pj_code'
						,store: "ProjectStore"
	    			    ,displayField:   'pj_name'
	    			    ,valueField:   'unique_id'
	    			    ,value: vCUR_USER_NAME
						,innerTpl	: '<div data-qtip="{unique_id}">{pj_name}</div>'
				});	
		this.addSearchField('item_code');
		
		this.addSearchField('buyer_name');

		this.addSearchField (
				{
						field_id: 'status'
						,store: "RecevedStateStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
//		this.addSearchField('wa_code');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStoreSimple({
	    		modelClass: 'Rfx.model.CompleteState',
	    		sorters: [{
		        	property: 'item_code',
		        	direction: 'ASC'
		        }],
		        pageSize: gMain.pageSize,/*pageSize*/
		        byReplacer: {
		        	'item_code': 'srcahd.item_code',
		        	'step': 'step.pcs_code'
		        },
		        deleteClass: ['pcsstep']
			        
		    }/*, {
		    	groupField: 'item_code_lot'
        }*/);
        
        this.removeAction.setText('작업취소');
	        // remove the items
	        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==3||index==4) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        
        
//		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
//	        groupHeaderTpl: '<div><b><font color=#003471>{name}</b></font> :: {[values.rows[0].data.buyer_name]} ({[values.rows[0].data.pj_code]}) ({rows.length} 공정)</div>'
//		}); 
//        
//		var option = {
//				//features: [groupingFeature]
//				progressRenderer: function (v, m, r, rowIndex, columnIndex, view) {
//
//			    	var id = Ext.id();
//			    	
//			    	console_logs('id', id);
//					console_logs('v', v);
//					console_logs('m', m);
//					console_logs('r', r);
//					console_logs('rowIndex', rowIndex);
//					console_logs('columnIndex', columnIndex);
//					console_logs('view', view);
//			    	
//			    	
//			    	if(columnIndex<6) {
//			    		return '';
//			    	}
////			    	if(v==null || v==undefined) {
////			    		return '';
////			    	}
//			    	
//
//
//			    	
//			    	var pos = columnIndex-6;
//			    	var poss = ''+pos;
//			    	if(poss.length==1) {
//			    		poss = '0' + poss;
//			    	}
//			      
//			    	//console_logs('poss', poss);
//			    	
//			        Ext.defer(function () {
//			        	try {
//			                Ext.widget('progressbar', {
//			                    renderTo: id,
//			                    value: r.get(poss + 'Ratio'),
//			                    width: 100
//			                });	
//			        	} catch(e){}
//			        }, 50);
//
//			        var pcs_name =  r.get(poss + 'Name' )==undefined?'': r.get('pcs' + poss);			    	
//			        var supplier_name = r.get(poss + 'Supplier');
//			    	console_logs('supplier_name', supplier_name);
//			    	
//			    	var s = null;
//			    	if(supplier_name=='<사내>') {
//			    		s = Ext.String.format('<div id="{0}">{1}</div>', id, pcs_name);
//			    	} else {
//			    		s = Ext.String.format('<div id="{0}">{1}:<font color=#B50000><b>{2}</b></font></div>', id, pcs_name, supplier_name);
//			    	}
////
//////			    	if(pcs_name==undefined || pcs_name==null || pcs_sup==undefined || pcs_sup==null ) {
//////			    		return '';
//////			    	}
//////			    	var s = '';
////			    	
////			    	if(pcs_sup!='' && supplier_name == pcs_sup ) {
////			    		s = Ext.String.format('<div id="{0}">{1}:<font color=#B50000><b>{2}</b></font></div>', id, pcs_name, supplier_name);
////			    	} else {
////			        	s = Ext.String.format('<div id="{0}">{1}:{2}</div>', id, pcs_name, pcs_sup);    		
////			    	}
//
//			    	//console_logs('s', s);
//			        return s;	
//
//			    }
//		};
        
        //grid 생성.
        this.createGridCore(arr/*, option*/);

        this.storeLoadCallback = function(records,store) {
        	console_logs('==== storeLoadCallback records', records);
        	console_logs('==== storeLoadCallback store', store);
        	
        	
        	var arr = [];
        	var prev_pj_code = null;
        	var prev_rec = null;
        	for(var i=0; i< records.length; i++) {
        		var cur = records[i];
        		
        		var pj_code = cur.get('pj_code');
        		if(pj_code!=prev_pj_code) {
        			prev_rec = {};
        			for (var key in cur['data']) { 
        				prev_rec[key] = cur.get(key); 
        			}
        			arr.push(prev_rec);
        		}
        		var ratio =   cur.get('process_qty')==0 ? 0 : cur.get('outpcs_qty') / cur.get('process_qty');
        		var supplier_name = cur.get('supplier_name');
        		if(supplier_name!='<사내>') {
        			supplier_name = '<font color=#003471><b>' + supplier_name + '</b></font>'
        		}
        		
        		var progress = Ext.util.Format.number(ratio*100, '0,00.0') + '%';
        		if(ratio>0) {
        			progress = '<font color=#C1493B>' + progress + '</font>'
        		}
        		prev_rec['ratio' + cur.get('pcs_no')] =ratio;        		
        		prev_rec['pcs' + cur.get('pcs_no')] = cur.get('pcs_name') + ' : ' + supplier_name +
        														'<br/>' + progress;
        		prev_pj_code = pj_code;
        		
        		//prev_rec[cur.get('pcs_no')+'Name'] = cur.get('pcs_name');
        		//prev_rec[cur.get('pcs_no')+'Supplier'] = cur.get('supplier_name');
        		
        	}
        	//records = arr;
        	console_logs('==== storeLoadCallback arr', arr);
        	
        	store.removeAll();
        	store.add(arr);
        	
//        	store.getProxy().
//        	store.data.clear();
//        	store.sync();
        	
        }

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
		
        this.callParent(arguments);
        
    	this.store.getProxy().setExtraParam('orderBy', "item_code");
    	this.store.getProxy().setExtraParam('ascDesc', "ASC");
        //디폴트 로드
    	gMain.setCenterLoading(false);
        this.store.load(function(records){
        	//console_logs('ProduceAdjustView records', records);
        });
    },
    items : []
});
