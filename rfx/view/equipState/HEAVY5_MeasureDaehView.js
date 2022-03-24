//설비현황
Ext.define('Rfx.view.equipState.HEAVY5_MeasureDaehView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'measure-daeh-view',
    initComponent: function(){
    	
        var location;

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		/*this.addSearchField (
				{
					field_id: 'pcs_code'
					,store: 'ProcessNameStore'
					,displayField: 'system_code'
					,valueField: 'system_code'
					//,width: 120
					,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {codeName}</div>'
				});	*/
/*		this.addSearchField (
				{
					field_id: 'owner_name'
					,store: 'UserStore'
					,displayField: 'user_name'
					,valueField: 'user_name'
					//,width: 120
					,innerTpl	: '<div data-qtip="{user_id}">[{dept_name}] {user_name}</div>'
				});	*/
//		this.setDefComboValue('owner_name', 'valueField', '[영업팀] test01');
		
//		this.addSearchField('pcs_code');
		this.addSearchField('name_ko');
		this.addSearchField('reserved_varchar7');
		this.addSearchField('reserved_varchar8');


		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        this.createStore('Rfx.model.HEAVY5_Measure', [{
	            property: 'name_ko',
	            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        	,['pcsmchn']
	        );
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        var current_win;

        var option = {
        		listeners : {
        			itemdblclick: function(dataview, record, item, index, e) {
        				if(current_win != undefined) {
        					current_win.hide();
        				}
        	        	var rec = record;
        	        	gMain.selPanel.vSELECTED_RECORD = rec;
        	        	if(rec!=undefined && rec!=null) {
        	        		gMain.returnPath(rec.get('unique_id'), gMain.selectedMenuId + 'designFileAttach',
        	        		function(r) {
        	        			location = r;
        	        			var port_no = 0;
        	        			switch(window.location.hostname) {
        	        			case '192.168.1.203':
        	        			case 'localhost':
        	        			case '123.142.42.244':
        	        				port_no = 7080;
        	        				break;
        	        			default:
        	        				port_no = 7080;
        	        				break;
        	        			}
        	        			var win = Ext.create('Ext.window.Window',{
                			        width : 640,
                			        height : 480,
                			        title : '장비 이미지 보기',
                			        html : ['<p style="text-align: center">',
                			        	'<img src="http://' + window.location.hostname + ':' + port_no + '/html/' + location +'" style="max-width: 640px; max-height: 480px;"/>',
                			        	'</p>']
                			    });
                				current_win = win;
                				current_win.show();
        	        		});
        	        	}
        	    	}
        		}
        };
        
        //grid 생성.
        this.createGridCore(arr, option);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        var a = this.link;
        if(this.link == 'EMC1_DS2') {
        	console_logs('==>store', this.store);
        	this.store.getProxy().setExtraParam('state', 'N');
        }

        if(this.link == 'EMC1_DS') {
        	this.store.getProxy().setExtraParam('mchn_type', 'EQ');
        } else {
        	this.store.getProxy().setExtraParam('mchn_type', 'MI');
        }
        
        
        //디폴트 로드
        gMain.setCenterLoading(false);

      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	this.fileNolink = 'false';
        	console_logs('setGridOnCallback selections', selections);
        	var rec = selections[0];
        	gMain.selPanel.vSELECTED_RECORD = rec;
        	if(rec!=undefined && rec!=null) {
        		gMain.loadFileAttach(rec.get('unique_id'), gMain.selectedMenuId + 'designFileAttach');
        	}
        });
        
      //파일첨부 그리드탭 추가
		gMain.addTabFileAttachGridPanel('이미지 및 문서첨부', 'FILE_ATTACH', {NO_INPUT: null}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            } else {
	            	
	            }
	        },
	        gMain.selectedMenuId + 'designFileAttach',
	        {
	        	selectionchange: function(sm, selections) {  
	        		var fileRecord = (selections!=null && selections.length>0) ? selections[0] : null;
	        		console_logs(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
	        		
	        		var delButton = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
	        		if(fileRecord==null) {
	        			gUtil.disable(delButton);
	        		} else {
	        			gUtil.enable(delButton);
	        		}
	        		
	        	}
	        }
		);
		
		this.store.load();
        
    },
    items : []
});
