
Ext.define('Hanaro.view.equipState.EquipRepairHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'eqiprepair-view',
    initComponent: function(){
    	
    	this.setDefValue('occ_date', new Date());
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('fix_date', next7);
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField (
				{
					field_id: 'mchn_uid'
					,store: 'PcsMchnStore'
					,displayField: 'name_ko'
					,valueField: 'unique_id'
					,width: 260
					,innerTpl	: '<div data-qtip="{mchn_code}">[{mchn_code}] {name_ko}</div>'
				});	
		
		is_rotate = 'N';
		
		// //PDF 파일 출력기능
        // this.printPDFAction = Ext.create('Ext.Action',{
        //     iconCls: 'af-pdf',
        //     /*text: '제작',*/
        //     text: 'PDF',
        //     tooltip:'제작지시서 출력',
        //     disabled: true,
            
        //     handler: function(widget, event) {
        //         var rec = gm.me().selectedRecord;
        //         if(rec==null) {
        //             Ext.MessageBox.alert('Error','선택한 정보를 찾을 수 없습니다.');
        //             return;
        //         }
        //         console_logs('rec', rec);
        //         var rtgast_uid = rec.get('unique_id_long');
        //         console_logs('rtgast_uid', rtgast_uid);

        //     	Ext.Ajax.request({
        //     		url: CONTEXT_PATH + '/pdf.do?method=printWo',
        //     		params:{
        //     			rtgast_uid : rtgast_uid,
        //     			ac_uid : -1,
        //     			is_heavy : 'Y',	 //중공업:Y  기타:N
        //     			is_rotate : 'Y', //가로양식:Y 세로양식:N
        //     			wo_type : 'P',
        //     			pdfPrint : 'pdfPrint'
        //     		},
        //     		reader: {
        //     			pdfPath: 'pdfPath'
        //     		},
        //     		success : function(result, request) {
        //         	        var jsonData = Ext.JSON.decode(result.responseText);
        //         	        var pdfPath = jsonData.pdfPath;
        //         	        console_logs(pdfPath);      	        
        //         	    	if(pdfPath.length > 0) {
        //         	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
        //         	    		top.location.href=url;	
        //         	    	}
        //     		},
        //     		failure: extjsUtil.failureMessage
        //     	});
            	
            	
        //     }
        // });
        
        
		

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // // PDF
        // buttonToolbar.insert(2, this.printPDFAction); 
        
        switch(vCompanyReserved4){

        case 'DOOS01KR':
	        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1/*||index==2*/  ||index==3 /*||index==4 */ /* ||index==5 */) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        break;
        default :
        	
        break;
    }

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.Repair', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        	,['pcsmcfix']
	        );
        
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
        this.setGridOnCallback(function(selections) {
        	if(selections.length) {
                var rec = selections[0];
                gm.me().selectedRecord = rec;
        		//gm.me().printPDFAction.enable();
        	} else {
                gm.me().selectedRecord = null;
        		//gm.me().printPDFAction.disable();
        	}
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    selectedRecord : null,
    items : []
});
