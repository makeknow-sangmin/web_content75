if(consoleCheck()==false) {
	console = window.console || {log:function() {}}; // IE8이하일경우
	//alert('console checked');
}

function console_log(s) {
	  try { console.log(s); } catch (e) { /*alert(s)*/ }
}
function console_info(s) {
	  try { console.info(s); } catch (e) { /*alert(s)*/ }
}


Ext.Loader.setConfig({
    enabled: true,
    paths: {
    	'Ext.ux': CONTEXT_PATH + '/extjs/ux/'        
    }
});


var findName = null;


function getValueSafe(name) {
	var val = '';
	try {
		var obj = document.getElementById(name);
		if(obj !=null) {
			var type = obj['type'];
			//console_log(type);
			if(type=='text' || type=='password' || type=='hidden' || type=='select-one' || type=='textarea' || type=='radio') {
				val = obj.value;
			}else {
				val = obj.innerHTML;
			}
		}
	} catch(e) {
		return '';
	}
	//console_log(name + ' value is ' + val);
	return val;
	
}

function setValueSafe(name, val) {
		console_log (name + '=' + val);
	
		var obj = null;
		try {
			var obj = document.getElementById(name);
		} catch(e) {
			console_log('exception at setValueSafe for ' + name + ' ' +   e);
		}
	
		if(obj !=null) {
			var type = obj['type'];
			//console_log('obj type: ' + type);
			if(type=='text' || type=='password' || type=='hidden') {
				obj.value = val;
			}else {
				obj.innerHTML = val;
			}
			
		}else{
			console_log('obj is null at setValueSafe for ' + name);
		}

	
}

function savePass() {
	var pass1 = getValueSafe('password11');
	var pass2 = getValueSafe('password21');
	if(pass1.length<6) {
		alert('설정한 비밀번호의 길이가 짧습니다.');
		return;
	}  else if(pass1!=pass2) {
		alert('확인 비밀번호가 일치하지 않습니다.');
		return;
	}
	
	setValueSafe('password1', pass1);
	
	var url = '${pageContext.request.contextPath}/newUserMgmt/newUser.do?method=changeConfirmpass';
	document.GeneralBaseForm1.action=url;
	document.GeneralBaseForm1.submit();
}


function goToMain(btn) {
    if(btn == 'yes') {
		this.location.href= CONTEXT_PATH;
    }
}

Ext.onReady(function() {
    if(findType=='ID') {
    	findName = 'ID 찾기';    	
    }else if(findType=='PASS') {
    	findName = '비밀번호 찾기';
    }

	var form = Ext.create('Ext.form.Panel', {
		id: 'window',
        renderTo: 'floatDiv',
        title: '아이디/비밀번호 찾기',
		//componentCls: 'myBorder',
        style : 'border-left: 1px solid #99BBE8;' +
		        'border-right: 1px solid #99BBE8;' +
		    	'border-top: 1px solid #99BBE8;' +
		    	'border-bottom: 1px solid #99BBE8;' +
		    	'background: #D8E4F4;' +
		    	'padding-bottom: 7px;',
        width: 600,
        height: 300,

        layout: {
            type: 'hbox',
            align: 'stretch'
        },

        items: [
            {
                xtype: 'dataview',
                border: false,
                width: 0,//160,
                style: 'background-color: #eee',
                itemTpl: '{title}',
                store: Ext.create('Ext.data.ArrayStore', { fields: ['title'] }),

                trackOver: true,

                listeners: {
                    itemclick: function(view, record, item, index) {
                   
                    },
                    render: function() {
                        var pages = [];
                        this.ownerCt.down('panel').items.each(function(item) {
                            pages.push([item.title]);
                        });
                        this.store.loadData(pages);
                    },
                    viewready: function() {
                        this.ownerCt.navigate(0, true);
                    }
                }
            },
            {
                xtype: 'panel',
                border: false,
                flex: 5,
                layout: 'card',
                style: 'background-color: #fff',
                defaults: {
                    bodyPadding: '10',
                    preventHeader: true
                },
                items: [
                        {
                            title: '<small>1.</small> 비밀번호 설정',
                            contentEl: 'findType' + findType
                        }
                ]
            }
         ],
         fbar: [
                {
                    id: 'btnPrev',
                    html: '<font color="#3480F3"><b>'  + findName + '</b></font>',
                    scale: 'medium',
                    handler: function(btn) {
                    	savePass();

                    }
                },
                {
                    id: 'btnClose',
                    text: '<font color="#3480F3"><b>취소</b></font>',
                    scale: 'medium',
                    cls: 'middle-btn',
                    disabled: false,
                    handler: function(btn) {
                    	Ext.MessageBox.confirm('Confirm', 'Are you sure you want to quit finding ID/Password process?', goToMain);
                    }
                }
                
                
                ],
        navigate: function(to, v) {

            dv = this.down('dataview');
            var myLayout = this.down('panel').getLayout();
            var items = myLayout.getLayoutItems();
           
	        	console_log('myLayout number' + to);
                myLayout.setActiveItem(to);
            
            CUR_POS = Ext.Array.indexOf(items, myLayout.getActiveItem());

            dv.select(CUR_POS);
            
            

        }
    });
	
	 form.navigate(0, true);
});

