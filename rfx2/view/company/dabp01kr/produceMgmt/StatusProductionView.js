Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.StatusProductionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'defect-rs-mgmt',
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
              modelClass: 'Rfx.model.ProduceStatusByPcs',
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
			           		toolbars: [a]
                         });
                      console_logs('tab_info', this.tab_info);
                 }
                 
//		      	 console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>this.tab_info', this.tab_info);
                //   for(var i=0; i<this.tab_info.length; i++) {
                //          var o = this.tab_info[i];
                //          var code = o['code'];
                //          var name = o['name'];
                //          var title = o['title'];
                //          var pcsToolbars = o['toolbars'];
                //          console_logs('createTabGrid code', code);
                //          console_logs('createTabGrid pcsToolbars', pcsToolbars);
                //   }
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

                //   this.grid.setTitle('전체');
                  var items = [];
                //   items.push(this.grid);

        //tab grid 생성
         var tab = this.createTabGrid('Rfx.model.ProduceStatusByPcs', items, 'big_pcs_code', arr, function(curTab, prevtab) {
                    var multi_grid_id = curTab.multi_grid_id;
                    var title = curTab.title;
                    gm.me().multi_grid_id = multi_grid_id;
                    gm.me().multi_grid_title = title;
                    

                    // for(var i=0; i<tab.items.items.length; i++) {
                    //     var cols = tab.items.items[i];
                        
                    //     Ext.each(cols, function(columnObj, index) {
                    //         console_logs('>>columnObj', columnObj);
                    //         var dataIndex = cols.columns['material_info']['id'];
                    //         switch(dataIndex) {
                    //             case 'material_info':
                    //             columnObj.columns[dataIndex]['align'] = 'center';
                    //             columnObj.columns[dataIndex]['style'] = 'text-align: center';
                    //             break;
                    //             case 'plan_date':
                    //             columnObj.columns[dataIndex]['renderer'] = function(value) {
                    //                 console_logs('> value', value);
                    //                 return value;
                    //             }
                    //             break;
                    //         }
                    //     });
                    // }
                    
                    if(multi_grid_id == undefined) {//Main Grid
//	                    	  store.getProxy().setExtraParam('pcs_code', '');
                    
                    
                    } else {//추가 탭그리드
                        var store = gm.me().store_map[multi_grid_id];
                        store.getProxy().setExtraParam('pcs_code', multi_grid_id);
                        store.load(function(records) {
                            
                        });
                    }
                        
        });
        Ext.apply(this, {
            layout: 'border',
            items: [tab,  this.crudTab]
        });
    };
            
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
      
    var buttonItems = [];

    var printPDFAction = {
        xtype: 'button',
        iconCls: 'af-pdf',
        text: 'PDF 출력',
        tooltip: 'PDF 출력',
        disabled: false,
        handler: function() {
            // var myObj = [];
                
            //     myObj.push({"item_code":"ASS-S2","item_qty":"20","prc_cd":"TOM","ma_cd":"ETOM02","user_cd":"29698872"});
            //     myObj.push({"item_code":"ASS-S3","item_qty":"30","prc_cd":"TOM","ma_cd":"ETOM02","user_cd":"29698872"});
            //     myObj.push({"item_code":"ASS-S4","item_qty":"40","prc_cd":"TOM","ma_cd":"ETOM02","user_cd":"29698872"});
               
            // var jsonData = Ext.util.JSON.encode(myObj)

            // Ext.Ajax.request({
            //     url: CONTEXT_PATH + '/production/popcontroller.do?method=popBuyingRequest',
            //     params:{
            //         pop_pur_info:jsonData
            //     },
            //     success : function(result, request) {
                       
            //     },
            //     failure: extjsUtil.failureMessage
            // });
            var pcs_code = gm.me().multi_grid_id;
            pcs_name = gm.me().multi_grid_title;
            menu_code = this.link;
            console_logs('createPcsToobars code', menu_code);
            selections = gm.me().grid.getSelectionModel().getSelection();
            uids = [];
            
            for(var i=0; i<selections.length; i++) {
                var rec = selections[i];
                uids.push(rec.get('unique_id_long'));
            }
            
            return;
            
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/pdf.do?method=printPs',
                params:{
                    pcsstep_uids: uids,
                    pdfPrint : 'pdfPrint',
                    is_rotate: 'N',
                    pcs_code:pcs_code,
                    pcs_name:pcs_name,
                    menu_code:menu_code
                },
                reader: {
                    pdfPath: 'pdfPath'
                },
                success : function(result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_log(pdfPath);      	        
                        if(pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                            top.location.href=url;	
                        }
                },
                failure: extjsUtil.failureMessage
            });
        }
    };
      
      buttonItems.push(printPDFAction);
      var buttonToolbar1 = Ext.create('widget.toolbar', {
          items: buttonItems
      });
      
      console_logs('createPcsToobars buttonToolbar', buttonToolbar1);
      
      return buttonToolbar1;
  },
   tab_selections: {}

});