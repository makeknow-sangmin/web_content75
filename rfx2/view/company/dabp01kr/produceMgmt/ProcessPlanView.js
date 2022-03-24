
Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.ProcessPlanView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'process-plan-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField (
		{
				field_id: 'unique_id'
				,store: 'cloudProjectStore'
				,displayField: 'folder_name'
				,valueField: 'pj_code'
				,innerTpl	: '<div data-qtip="{codeNameEn}">[{pj_code}] {folder_name}</div>'
				//,triggerAction: 'all'
//			    ,listeners: {
//			           select: function (combo, record) {
//		                 	console_logs('@@@@@@@@@@@' + combo.getValue());
//		                 	var pjuid = record[0].get('unique_id');
//		                 	ac_uid = pjuid;
//		                 	var pj_name  = record[0].get('pj_name');
//		                 	var pj_code  = record[0].get('pj_code');
//
//		                 	assy_pj_code ='';
//		                 	selectedAssyCode = '';
//		                 	selectedPjCode = pj_code;
//		                 	selectedPjName = pj_name;
//		                 	selectedPjUid = pjuid;
//		                 	
//		                 	puchaseReqTitle = '[' + pj_code + '] ' + pj_name;
//		            	 
//		                 	srchTreeHandler (pjTreeGrid, cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
//		                 	store.removeAll();
//		                 	unselectAssy();
//		                 	//Default Set
//			 				Ext.Ajax.request({
//			 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
//			 					params:{
//			 						paramName : 'CommonProjectAssy',
//			 						paramValue : pjuid + ';' + '-1'
//			 					},
//			 					
//			 					success : function(result, request) {
//			 						console_log('success defaultSet');
//			 					},
//			   	 				failure: function(result, request){
//			   	 					console_log('fail defaultSet');
//			   	 				}
//			 				});
//			 				
//			 				
//			 				stockStore.getProxy().setExtraParam('ac_uid', selectedPjUid);
//			 				stockStore.load();
//
//		                 }
//		            }
					
		});	
		/*this.addSearchField('pcs_name');
		this.addSearchField('systemCode');
		this.addSearchField('codeName');
		this.addSearchField('codeNameEn');*/

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var pjtComboToolbar = Ext.create('Ext.toolbar.Toolbar', {
    		cls: 'my-x-toolbar-default2',
        	items: [
        	        ]
        	// cls: 'my-x-toolbar-default1'
        });
        
        this.createStore('Rfx.model.ProcessPlan', [{
	            property: 'standard_flag',
	            direction: 'ASC'
	        }],
	        gMain.pageSizepageSize
	        );
        

        
       var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        

        this.createCrudTab( 'process-plan-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

    },
    items : []
});
