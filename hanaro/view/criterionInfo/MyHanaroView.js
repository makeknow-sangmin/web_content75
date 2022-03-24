Ext.define('Hanaro.view.criterionInfo.MyHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'my-view',
    //items: [{html: 'Rfx2.view.company.dabp01kr.criterionInfo.CompanyView'}],
    initComponent: function(){
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        
        //console_logs('this.fields', this.fields);
        var loadUrl = CONTEXT_PATH + '/userMgmt/user.do?method=readMyinfo';
        console_logs('loadUrl', loadUrl);
        
        
        
        // remove the items
       (buttonToolbar.items).each(function(item,index,length){
     	  if(index==0||index==1||index==3||index==4||index==5) {
           	buttonToolbar.items.remove(item);
     	  }
       });
           
        this.store = new Ext.data.Store({
            pageSize: 100,
            fields: this.fields,
            proxy: {
                type: 'ajax',
                url: loadUrl,
                reader : {
    				type : 'json',
    				root : 'datas',
    				successProperty : 'success'
    			},
                autoLoad: false
            }
            
        });
        
        //grid 생성.
        this.createGrid(buttonToolbar);
        
        this.createCrudTab('my-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        this.callParent(arguments);
        
        
		this.preCreateCallback = function() {
			console_logs('this.crudMode;', this.crudMode);

			//공정복사
			if(this.crudMode == 'EDIT') {
				var cur_passwordT = gMain.selPanel.getInputTarget('cur_password');
				var new_passwordT = gMain.selPanel.getInputTarget('new_password');
				var new_password2T = gMain.selPanel.getInputTarget('new_password2');


		    	var new_pass = new_passwordT.getValue(); 
				var con_password = new_password2T.getValue();	
				var check_pass = cur_passwordT.getValue();

				var check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,16}$/;



				
				if(vCompanyReserved4 != 'ULVC01KR') {
					if(new_pass.length < 8 || new_pass.length > 16) {
						Ext.MessageBox.alert('알림','비밀번호는 8 ~ 16 자리로 입력해주세요.');
						new_passwordT.setValue('');
						new_password2T.setValue('');
						return;
					}

					if(!check.test(new_pass)) {
						Ext.MessageBox.alert('알림','비밀번호는 문자, 숫자, 특수문자의 조합으로 입력해주세요.');
						new_passwordT.setValue('');
						new_password2T.setValue('');
						return;
					}
				} else {
					if(new_pass.length < 6 || new_pass.length > 16) {
						Ext.MessageBox.alert('알림','비밀번호는 6 ~ 16 자리로 입력해주세요.');
						new_passwordT.setValue('');
						new_password2T.setValue('');
						return;
					}
				}


				
				
				var str = new_pass.length;
				var strp = con_password.length;
				
				if(new_pass==con_password && str==strp){
					Ext.Ajax.request({
						url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',				
						params:{
							check_pass : check_pass,
							new_pass : new_pass,
							con_pass : con_password
						},
						
						success : function(result, request) {
							var result = result.responseText;
							console_logs('result:', result);
							if(result == 'false'){
								Ext.MessageBox.alert('오류','종전 암호가 정확하지 않습니다.');
							}else{ //true...
								gm.me().doCreateCore();
								new_passwordT.setValue('');
								new_password2T.setValue('');
								cur_passwordT.setValue('');
								Ext.MessageBox.show({
									title:'결과',
						            msg: '수정되었습니다.',
						            buttons: Ext.MessageBox.YES
								 });
							}
						},
						failure: extjsUtil.failureMessage
					});
					
				}else{
					Ext.MessageBox.alert('안내','입력한 암호가 일치하지 않습니다.');
				}


				
								
//				Ext.Msg.alert('안내', '복사등록을 위한 공정복사를 진행합니다.',  function() {
//					Ext.Ajax.request({
//						url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
//						params:{
//							fromUid: gMain.selPanel.vSELECTED_UNIQUE_ID ,
//							toUid: vCUR_USER_UID*(-100)
//						},
//						
//						success : function(result, request) { 
//							gMain.selPanel.doCreateCore();
//					          
//							
//						},//endofsuccess
//						failure: extjsUtil.failureMessage
//					});//endofajax
//					return false;
//				});
				
				
				return false;
			} else {
				gm.me().doCreateCore();
				return true;
			}

		}
        
        
        

        gMain.setCenterLoading(false);
        this.store.load(function(records){
        	if(records!=null && records.length>0) {
        		var rec = records[0];
        		gMain.selPanel.grid.getSelectionModel().select(  rec );
        		//gMain.selPanel.setActiveCrudPanel('EDIT');
        	}
        });
    },
 /*   editRedord: function(field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
        	case 'tel_no':
	        case 'email':
	        case 'address_1':
	        case 'hp_no':
                this.updateDesinComment(rec);
                break;
        }
    },
    updateDesinComment: function(rec) {
    	
    	var child = rec.get('child');
    	console_logs('child>>>', child);
        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = rec.get('req_date');
        var cart_currency = rec.get('cart_currency');
        var unique_id = rec.get('unique_uid');
        console_logs('====> unique_id', unique_id);
        
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateUsrast',
            params: {
            	quan: quan,
            	child:child,
                static_sales_price: static_sales_price,
                cart_currency:cart_currency,
                req_date: req_date,
                unique_id: unique_id
            },
            success: function(result, request) {

                var result = result.responseText;
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    } ,*/
    items : []
});