//Ext.onReady(function() {  fDEF_CONTENT(); });


//global var.
var grid = null;
var store = null;

searchField = 
	[
	'unique_id',
	'moldno',
	'custom',
	'machinetype',
	'testdate'
	];



var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			Moldtest.load(unique_id ,{
        				 success: function(moldtest) {
        					 	var unique_id = moldtest.get('unique_id');
        						var moldno = moldtest.get('moldno');
        						var custom = moldtest.get('custom');
        						var machinetype = moldtest.get('machinetype');
        						var productname = moldtest.get('productname');
        						var moldtype = moldtest.get('moldtype'  );
        						var material = moldtest.get('material' );
        						var materialweight = moldtest.get('materialweight' );
        						var colornum = moldtest.get('colornum' );
        						var matercode = moldtest.get('matercode' );
        						var trynum = moldtest.get('trynum' );
        						var tonnage = moldtest.get('tonnage' );
        						var testman = moldtest.get('testman' );
        						var duedate = moldtest.get('duedate' );
        						var tryreason = moldtest.get('tryreason' );
        						var moldnum = moldtest.get('moldnum' );
        						var projectnum = moldtest.get('projectnum' );
        						var moldqcnum = moldtest.get('moldqcnum' );
        						var moldmanufactor = moldtest.get('moldmanufactor' );
        						var okspantime= moldtest.get('okspantime' );
        						var resultcomfirm= moldtest.get('resultcomfirm' );
        						var cabinettype= moldtest.get('cabinettype' );
        						var projecttel= moldtest.get('projecttel' );
        						var require= moldtest.get('require' );
        						var improveitem= moldtest.get('improveitem' );
        						var unusualremark= moldtest.get('unusualremark' );
        						var testdate = moldtest.get('testdate' );
        				        
        						var lineGap = 30;
        				    	var form = Ext.create('Ext.form.Panel', {
        				    		id: 'formPanel',
        				            layout: 'absolute',
        				            url: 'save-form.php',
        				            defaultType: 'displayfield',
        				            border: false,
        				            bodyPadding: 15,
        				            defaults: {
        				                anchor: '100%',
        				                allowBlank: false,
        				                msgTarget: 'side',
        				                labelWidth: 100
        				            },
        				            items: [{
							fieldLabel: getColName('unique_id'),
							value: unique_id,
							x: 5,
							y: 0 + 1*lineGap,
							name: 'unique_id',
							anchor: '-5'  // anchor width by percentage
							},{
								fieldLabel: getColName('moldno'),
								value: moldno,
								x: 5,
								y: 0 + 2*lineGap,
								name: 'moldno',
								anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('custom'),
        				    	value: custom,
        				    	x: 5,
        				    	y: 0 + 3*lineGap,
        				    	name: 'custom',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('machinetype'),
        				    	value: machinetype,
        				    	x: 5,
        				    	y: 0 + 4*lineGap,
        				    	name: 'machinetype',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('productname'),
        				    	value: productname,
        				    	x: 5,
        				    	y: 0 + 5*lineGap,
        				    	name: 'productname',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('moldtype'),
        				    	value: moldtype,
        				    	x: 5,
        				    	y: 0 + 6*lineGap,
        				    	name: 'moldtype',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('material'),
        				    	value: material,
        				    	x: 5,
        				    	y: 0 + 7*lineGap,
        				    	name: 'material',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('materialweight'),
        				    	value: materialweight,
        				    	x: 5,
        				    	y: 0 + 8*lineGap,
        				    	name: 'materialweight',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('colornum'),
        				    	value: colornum,
        				    	x: 5,
        				    	y: 0 + 9*lineGap,
        				    	name: 'colornum',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('matercode'),
        				    	value: matercode,
        				    	//xtype: 'numberfield',
        		            	 //minValue: 0,
        				    	x: 5,
        				    	y: 0 + 10*lineGap,
        				    	name: 'matercode',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('trynum'),
        				    	//xtype: 'numberfield',
        		            	// minValue: 0,
        				    	value: trynum,
        				    	x: 5,
        				    	y: 0 + 11*lineGap,
        				    	name: 'trynum',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('tonnage'),
        				    	value: tonnage,
        				    	x: 5,
        				    	y: 0 + 12*lineGap,
        				    	name: 'tonnage',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('testman'),
        				    	value: testman,
        				    	x: 5,
        				    	y: 0 + 13*lineGap,
        				    	name: 'testman',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('duedate'),        				    	
        				    	name: 'duedate',
        				    	value: duedate ,
        				    	//value: date(duedate) ,
        				    	//value: new Date(),
        				    	//xtype: 'datefield',
        				    	//format: 'Y-m-d',
        				    	//submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
        	 			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'         	 			    	
        				    	x: 5,
        				    	y: 0 + 14*lineGap,        				    	
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('tryreason'),
        				    	value: tryreason,
        				    	x: 5,
        				    	y: 0 + 15*lineGap,
        				    	name: 'tryreason',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('moldnum'),
        				    	//xtype: 'numberfield',
        		            	// minValue: 0,
        				    	value: moldnum,
        				    	x: 5,
        				    	y: 0 + 16*lineGap,
        				    	name: 'moldnum',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('projectnum'),
        				    	//xtype: 'numberfield',
        		            	// minValue: 0,
        				    	value: projectnum,
        				    	x: 5,
        				    	y: 0 + 17*lineGap,
        				    	name: 'projectnum',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('moldqcnum'),
        				    	//xtype: 'numberfield',
        		            	// minValue: 0,
        				    	value: moldqcnum,
        				    	x: 5,
        				    	y: 0 + 18*lineGap,
        				    	name: 'moldqcnum',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('moldmanufactor'),
        				    	//xtype: 'numberfield',
        		            	// minValue: 0,
        				    	value: moldmanufactor,
        				    	x: 5,
        				    	y: 0 + 19*lineGap,
        				    	name: 'moldmanufactor',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('okspantime'),
        				    	value: okspantime,
        				    	x: 5,
        				    	y: 0 + 20*lineGap,
        				    	name: 'okspantime',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('resultcomfirm'),
        				    	value: resultcomfirm,
        				    	x: 5,
        				    	y: 0 + 21*lineGap,
        				    	name: 'resultcomfirm',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('cabinettype'),
        				    	value: cabinettype,
        				    	x: 5,
        				    	y: 0 + 22*lineGap,
        				    	name: 'cabinettype',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('projecttel'),
        				    	//xtype: 'numberfield',
        				    	//minValue: 0,
        				    	value: projecttel,
        				    	x: 5,
        				    	y: 0 + 23*lineGap,
        				    	name: 'projecttel',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('require'),
        				    	value: require,
        				    	x: 5,
        				    	y: 0 + 24*lineGap,
        				    	name: 'require',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('improveitem'),
        				    	value: improveitem,
        				    	x: 5,
        				    	y: 0 + 25*lineGap,
        				    	name: 'improveitem',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('unusualremark'),
        				    	value: unusualremark,
        				    	x: 5,
        				    	y: 0 + 26*lineGap,
        				    	name: 'unusualremark',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('testdate'),
        				    	name: 'testdate',
        				    	value: testdate,
        				    	/*
        				    	value: date(testdate),
        				    	xtype: 'datefield',
        				    	format: 'Y-m-d',
        				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
        	 			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'   
        	 			    	*/
        				    	x: 5,
        				    	y: 0 + 27*lineGap,        				    	
        				    	anchor: '-5'  // anchor width by percentage
        				    }
        				    ]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
        				            width: 700,
        				            height: 900,
        				            minWidth: 250,
        				            minHeight: 180,
        				            layout: 'fit',
        				            plain:true,
        				            items: form,
        				            buttons: [{
        				                text: CMD_OK,
        				            	handler: function(){
        				                       	if(win) 
        				                       	{
        				                       		win.close();
        				                       	} 
        				                  }
        				            }]
        				        });
        				        //store.load(function() {});
        				        win.show();
        						//endofwin
        				 }//endofsuccess
        			 });//emdofload
        	
        };

var editHandler = function() {
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			Moldtest.load(unique_id ,{
                				 success: function(moldtest) {
                					 var unique_id = moldtest.get('unique_id');
             						var moldno = moldtest.get('moldno');
             						var custom = moldtest.get('custom');
             						var machinetype = moldtest.get('machinetype');
             						var productname = moldtest.get('productname');
             						var moldtype = moldtest.get('moldtype'  );
             						var material = moldtest.get('material' );
             						var materialweight = moldtest.get('materialweight' );
             						var colornum = moldtest.get('colornum' );
             						var matercode = moldtest.get('matercode' );
             						var trynum = moldtest.get('trynum' );
             						var tonnage = moldtest.get('tonnage' );
             						var testman = moldtest.get('testman' );
             						var duedate = moldtest.get('duedate' );
             						var tryreason = moldtest.get('tryreason' );
             						var moldnum = moldtest.get('moldnum' );
             						var projectnum = moldtest.get('projectnum' );
             						var moldqcnum = moldtest.get('moldqcnum' );
             						var moldmanufactor = moldtest.get('moldmanufactor' );
             						var okspantime= moldtest.get('okspantime' );
             						var resultcomfirm= moldtest.get('resultcomfirm' );
             						var cabinettype= moldtest.get('cabinettype' );
             						var projecttel= moldtest.get('projecttel' );
             						var require= moldtest.get('require' );
             						var improveitem= moldtest.get('improveitem' );
             						var unusualremark= moldtest.get('unusualremark' );
             						var testdate = moldtest.get('testdate' );
                				        
                						var lineGap = 30;
                						
                						
                				    	var form = Ext.create('Ext.form.Panel', {
                				    		id: 'formPanel',
                				            layout: 'absolute',
                				            url: 'save-form.php',
                				            defaultType:  'textfield',
                				            border: false,
                				            bodyPadding: 15,
                				            defaults: {
                				                anchor: '100%',
                				                allowBlank: false,
                				                msgTarget: 'side',
                				                labelWidth: 100
                				            },
                				            items: [ 
											{
										fieldLabel: getColName('unique_id'),
										value: unique_id,
										x: 5,
										y: 0 + 1*lineGap,
										name: 'unique_id',
										anchor: '-5'  // anchor width by percentage
										},{
											fieldLabel: getColName('moldno'),
											value: moldno,
											x: 5,
											y: 0 + 2*lineGap,
											name: 'moldno',
											anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('custom'),
			        				    	value: custom,
			        				    	x: 5,
			        				    	y: 0 + 3*lineGap,
			        				    	name: 'custom',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('machinetype'),
			        				    	value: machinetype,
			        				    	x: 5,
			        				    	y: 0 + 4*lineGap,
			        				    	name: 'machinetype',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('productname'),
			        				    	value: productname,
			        				    	x: 5,
			        				    	y: 0 + 5*lineGap,
			        				    	name: 'productname',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('moldtype'),			        				    	
			        				    	value: moldtype,			        				    	
			        				    	xtype:  'combo',
			        				    	displayField:'value',
			        				    	valueField:     'value',			        				    	
			        				    	x: 5,
			        				    	y: 0 + 6*lineGap,
			        				    	name: 'moldtype',
			        				    	anchor: '-5'  ,// anchor width by percentage
			        				    		store: Ext.create('Ext.data.Store', {
			        		                        fields : ['value'],
			        		                        data   : [
			        		                            {value: '本司制作'},
			        		                            {value: '委外制作'},
			        		                            {value: '量产模具'},
			        		                            {value: '外来模具'}
			        		                        ]
			        		                    })	
			        				    		
			        				    },{
			        				    	fieldLabel: getColName('material'),
			        				    	value: material,
			        				    	x: 5,
			        				    	y: 0 + 7*lineGap,
			        				    	name: 'material',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('materialweight'),
			        				    	value: materialweight,
			        				    	x: 5,
			        				    	y: 0 + 8*lineGap,
			        				    	name: 'materialweight',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('colornum'),
			        				    	value: colornum,
			        				    	x: 5,
			        				    	y: 0 + 9*lineGap,
			        				    	name: 'colornum',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('matercode'),
			        				    	xtype: 'numberfield',
			        		            	 minValue: 0,
			        				    	value: matercode,
			        				    	x: 5,
			        				    	y: 0 + 10*lineGap,
			        				    	name: 'matercode',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('trynum'),
			        				    	xtype: 'numberfield',
			        		            	 minValue: 0,
			        				    	value: trynum,
			        				    	x: 5,
			        				    	y: 0 + 11*lineGap,
			        				    	name: 'trynum',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('tonnage'),
			        				    	value: tonnage,
			        				    	x: 5,
			        				    	y: 0 + 12*lineGap,
			        				    	name: 'tonnage',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('testman'),
			        				    	value: testman,
			        				    	x: 5,
			        				    	y: 0 + 13*lineGap,
			        				    	name: 'testman',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('duedate'),
			        				    	name: 'duedate',
			        				    	value: duedate,
			        				    	
			        				    	//value: date(duedate),
			        				    	//xtype: 'datefield',
			        				    	//format: 'Y-m-d',
			        				    	//submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			        	 			    	//dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'  
			        	 			    	
			        				    	x: 5,
			        				    	y: 0 + 14*lineGap,			        				    	
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('tryreason'),
			        				    	value: tryreason,
			        				    	xtype:  'combo',
			        				    	displayField:'value',
			        				    	valueField:     'value',
			        				    	x: 5,
			        				    	y: 0 + 15*lineGap,
			        				    	name: 'tryreason',
			        				    	anchor: '-5' , // anchor width by percentage
			        				    	store: Ext.create('Ext.data.Store', {
		        		                        fields : ['value'],
		        		                        data   : [
		        		                            {value: '新模首试'},
		        		                            {value: '修模改善'},
		        		                            {value: '客户设变'},
		        		                            {value: '项目打样'}
		        		                        ]
		        		                    })	
			        				    },{
			        				    	fieldLabel: getColName('moldnum'),
			        				    	xtype: 'numberfield',
			        		            	 minValue: 0,
			        				    	value: moldnum,
			        				    	x: 5,
			        				    	y: 0 + 16*lineGap,
			        				    	name: 'moldnum',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('projectnum'),
			        				    	xtype: 'numberfield',
			        		            	 minValue: 0,
			        				    	value: projectnum,
			        				    	x: 5,
			        				    	y: 0 + 17*lineGap,
			        				    	name: 'projectnum',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('moldqcnum'),
			        				    	xtype: 'numberfield',
			        		            	 minValue: 0,
			        		            	 allowBlank: true,
			        				    	value: moldqcnum,
			        				    	x: 5,
			        				    	y: 0 + 18*lineGap,
			        				    	name: 'moldqcnum',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('moldmanufactor'),
			        				    	xtype: 'numberfield',
			        		            	 minValue: 0,
			        				    	value: moldmanufactor,
			        				    	allowBlank: true,
			        				    	x: 5,
			        				    	y: 0 + 19*lineGap,
			        				    	name: 'moldmanufactor',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('okspantime'),
			        				    	value: okspantime,
			        				    	x: 5,
			        				    	y: 0 + 20*lineGap,
			        				    	name: 'okspantime',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('resultcomfirm'),
			        				    	value: resultcomfirm,
			        				    	x: 5,
			        				    	y: 0 + 21*lineGap,
			        				    	name: 'resultcomfirm',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('cabinettype'),
			        				    	value: cabinettype,
			        				    	xtype:  'combo',
			        				    	displayField:'value',
			        				    	valueField:     'value',			        				    	
			        				    	x: 5,
			        				    	y: 0 + 22*lineGap,
			        				    	name: 'cabinettype',
			        				    	anchor: '-5',  // anchor width by percentage
			        				    	store: Ext.create('Ext.data.Store', {
		        		                        fields : ['value'],
		        		                        data   : [
		        		                            {value: '卧式机台'},
		        		                            {value: '立式机台'},
		        		                            {value: '双色机台'}
		        		                        ]
		        		                    })	
			        				    },{
			        				    	fieldLabel: getColName('projecttel'),
			        				    	xtype: 'numberfield',
			        				    	minValue: 0,
			        				    	value: projecttel,
			        				    	x: 5,
			        				    	y: 0 + 23*lineGap,
			        				    	name: 'projecttel',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('require'),
			        				    	value: require,
			        				    	x: 5,
			        				    	allowBlank: true,
			        				    	y: 0 + 24*lineGap,
			        				    	name: 'require',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('improveitem'),
			        				    	value: improveitem,
			        				    	x: 5,
			        				    	y: 0 + 25*lineGap,
			        				    	allowBlank: true,
			        				    	name: 'improveitem',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('unusualremark'),
			        				    	value: unusualremark,
			        				    	x: 5,
			        				    	allowBlank: true,
			        				    	y: 0 + 26*lineGap,
			        				    	name: 'unusualremark',
			        				    	anchor: '-5'  // anchor width by percentage
			        				    },{
			        				    	fieldLabel: getColName('testdate'),
			        				    	name: 'testdate',
			        				    	value: testdate,
			        				    	/*
			        				    	value: date(testdate),
			        				    	xtype: 'datefield',
			        				    	format: 'Y-m-d',
			        				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			        	 			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'  
			        	 			    	*/
			        				    	x: 5,
			        				    	y: 0 + 27*lineGap,			        				    	
			        				    	anchor: '-5'  // anchor width by percentage
			        				    }
			                			]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
                				            width: 700,
                				            height: 900,
                				            minWidth: 250,
                				            minHeight: 180,
                				            layout: 'fit',
                				            plain:true,
                				            items: form,
                				            buttons: [{
                				                text: CMD_OK,
                				            	handler: function(){
                				                    var form = Ext.getCmp('formPanel').getForm();
                				                    if(form.isValid())
                				                    {
                				                	var val = form.getValues(false);
                				                	var moldtest = Ext.ModelManager.create(val, 'Moldtest');
                				                	
                				            		//저장 수정
                				                	moldtest.save({
                				                		success : function() {
                				                			//console_log('updated');
                				                           	if(win) 
                				                           	{
                				                           		win.close();
                				                           		store.load(function() {});
                				                           	} 
                				                		} 
                				                	 });
                				                	
                				                       	if(win) 
                				                       	{
                				                       		win.close();
                				                       	} 
                				                    } else {
                				                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                				                    }
                				                    


                				                  }
                				            },{
                				                text: CMD_CANCEL,
                				            	handler: function(){
                				            		if(win) {win.close();} }
                				            }]
                				        });
                				        win.show();
                						//endofwin
                				 }//endofsuccess
                			 });//emdofload
                	
                };

//writer define
Ext.define('Moldtest.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	//console_info(data);
    	//console_info(data[0]);
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});



function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	 var moldtest = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Moldtest');
        		
	           	moldtest.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
        }

    }
};

//Define Remove Action
var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

//Define Add Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {

		var lineGap = 30;
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            url: 'save-form.php',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ 
            {
				fieldLabel: getColName('moldno'),
				//value: moldno,
				x: 5,
				y: 0 + 1*lineGap,
				name: 'moldno',
				anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('custom'),
		    	//value: custom,
		    	x: 5,
		    	y: 0 + 2*lineGap,
		    	name: 'custom',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('machinetype'),
		    	//value: machinetype,
		    	x: 5,
		    	y: 0 + 3*lineGap,
		    	name: 'machinetype',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('productname'),
		    	//value: productname,
		    	x: 5,
		    	y: 0 + 4*lineGap,
		    	name: 'productname',
		    	anchor: '-5'  // anchor width by percentage
		    },{   
		    	fieldLabel: getColName('moldtype'),
		    	//value: moldtype,	
		    	xtype:  'combo',
		    	displayField:'value',
		    	valueField:     'value',
		    	x: 5,
		    	y: 0 + 5*lineGap,
		    	name: 'moldtype',
		    	anchor: '-5'  ,// anchor width by percentage
		    	store: Ext.create('Ext.data.Store', {
                        fields : ['value'],
                        data   : [
                            {value: '本司制作'},
                            {value: '委外制作'},
                            {value: '量产模具'},
                            {value: '外来模具'}
                        ]
                    })	
		    		
		    		
		    },{
		    	fieldLabel: getColName('material'),
		    	//value: material,
		    	x: 5,
		    	y: 0 + 6*lineGap,
		    	name: 'material',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('materialweight'),
		    	//: materialweight,
		    	x: 5,
		    	y: 0 + 7*lineGap,
		    	name: 'materialweight',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('colornum'),
		    	//value: colornum,
		    	x: 5,
		    	y: 0 + 8*lineGap,
		    	name: 'colornum',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('matercode'),
		    	xtype: 'numberfield',
           	 minValue: 0,
		    	//value: matercode,
		    	x: 5,
		    	y: 0 + 9*lineGap,
		    	name: 'matercode',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('trynum'),
		    	xtype: 'numberfield',
           	 minValue: 0,
		    	//value: trynum,
		    	x: 5,
		    	y: 0 + 10*lineGap,
		    	name: 'trynum',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('tonnage'),
		    	//value: tonnage,
		    	x: 5,
		    	y: 0 + 11*lineGap,
		    	name: 'tonnage',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('testman'),
		    	//value: testman,
		    	x: 5,
		    	y: 0 + 12*lineGap,
		    	name: 'testman',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('duedate'),
		    	name: 'duedate',
		    	format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		    	value : new Date(),  //value: Ext.Date.add (new Date(),Ext.Date.DAY,15),
		    	xtype: 'datefield'  ,   		
		    	//value: duedate,
		    	/*
		    	value: date(duedate),
		    	xtype: 'datefield',
		    	format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'  
			    	*/
		    	x: 5,
		    	y: 0 + 13*lineGap,		    	
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('tryreason'),
		    	//value: tryreason,
		    	xtype:  'combo',
		    	displayField:'value',
		    	valueField:     'value',
		    	x: 5,
		    	y: 0 + 14*lineGap,
		    	name: 'tryreason',
		    	anchor: '-5' , // anchor width by percentage
		    		store: Ext.create('Ext.data.Store', {
                        fields : ['value'],
                        data   : [
                            {value: '新模首试'},
                            {value: '修模改善'},
                            {value: '客户设变'},
                            {value: '项目打样'}
                        ]
                    })	
		    },{
		    	fieldLabel: getColName('moldnum'),
		    	xtype: 'numberfield',
           	 minValue: 0,
		    	//value: moldnum,
		    	x: 5,
		    	y: 0 + 15*lineGap,
		    	name: 'moldnum',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('projectnum'),
		    	xtype: 'numberfield',
		    	minValue: 0,
		    	//value: projectnum,
		    	x: 5,
		    	y: 0 + 16*lineGap,
		    	name: 'projectnum',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('moldqcnum'),
		    	xtype: 'numberfield',
           	 minValue: 0,
           	allowBlank: true,
		    	//value: moldqcnum,
		    	x: 5,
		    	y: 0 + 17*lineGap,
		    	name: 'moldqcnum',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('moldmanufactor'),
		    	xtype: 'numberfield',
           	 minValue: 0,
           	allowBlank: true,
		    	//value: moldmanufactor,
		    	x: 5,
		    	y: 0 + 18*lineGap,
		    	name: 'moldmanufactor',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('okspantime'),
		    	//value: okspantime,
		    	x: 5,
		    	y: 0 + 19*lineGap,
		    	name: 'okspantime',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('resultcomfirm'),
		    	//value: resultcomfirm,
		    	x: 5,
		    	y: 0 + 20*lineGap,
		    	name: 'resultcomfirm',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('cabinettype'),
		    	//value: cabinettype,
		    	xtype:  'combo',
		    	displayField:'value',
		    	valueField:     'value',
		    	x: 5,
		    	y: 0 + 21*lineGap,
		    	name: 'cabinettype',
		    	anchor: '-5' , // anchor width by percentage
		    		store: Ext.create('Ext.data.Store', {
                        fields : ['value'],
                        data   : [
                            {value: '卧式机台'},
                            {value: '立式机台'},
                            {value: '双色机台'}
                        ]
                    })	
		    },{
		    	fieldLabel: getColName('projecttel'),
		    	xtype: 'numberfield',
		    	minValue: 0,
		    	//value: projecttel,
		    	x: 5,
		    	y: 0 + 22*lineGap,
		    	name: 'projecttel',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('require'),
		    	//value: require,
		    	x: 5,
		    	allowBlank: true,
		    	y: 0 + 23*lineGap,
		    	name: 'require',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('improveitem'),
		    	//value: improveitem,
		    	x: 5,
		    	allowBlank: true,
		    	y: 0 + 24*lineGap,
		    	name: 'improveitem',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('unusualremark'),
		    	//value: unusualremark,
		    	x: 5,
		    	allowBlank: true,
		    	y: 0 + 25*lineGap,
		    	name: 'unusualremark',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('testdate'),
		    	name: 'testdate',
		    	format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		    	value : new Date(),  //value: Ext.Date.add (new Date(),Ext.Date.DAY,15),
		    	xtype: 'datefield'  , 
		    	//value: testdate,
		    	/*
		    	value: date(testdate),
		    	xtype: 'datefield',
		    	format: 'Y-m-d',
		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s' 
			    	*/
		    	x: 5,
		    	y: 0 + 26*lineGap,		    	
		    	anchor: '-5'  // anchor width by percentage
		    }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Sales',
            width: 700,
            height: 900,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
                   	 var moldtest = Ext.ModelManager.create(val, 'Moldtest');
            		//저장 수정
                   	moldtest.save({
                		success : function() {
                			//console_log('updated');
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {});
                           	}   	
                		} 
                	 });
                	 
                       	if(win) 
                       	{
                       		win.close();
                       	} 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
		    //button.dom.disabled = false;
		});
     }
});

//Define Edit Action
var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

/******** move to handler**********
var printExcel = Ext.create('Ext.Action', {
	itemId: 'printExcelButton',
    iconCls: 'MSExcelX',
    text: 'Excel Print',
    disabled: false ,
    handler: printExcelHandler
});
**********************************/

//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction, editAction, removeAction  ]
});



Ext.onReady(function() {  
	//alert("ok");
	console_log('now starting...');

	makeSrchToolbar(searchField);
	
	

	Ext.define('Moldtest', {
	    	 extend: 'Ext.data.Model',
	    	 fields: /*(G)*/vCENTER_FIELDS,
	    	    proxy: {
					type: 'ajax',
			        api: {
			            read: CONTEXT_PATH + '/quality/moldtest.do?method=read', /*1recoed, search by cond, search */
			            create: CONTEXT_PATH + '/quality/moldtest.do?method=create', /*create record, update*/
			            update: CONTEXT_PATH + '/quality/moldtest.do?method=update',
			            destroy: CONTEXT_PATH + '/quality/moldtest.do?method=destroy' /*delete*/
			        },
					reader: {
						type: 'json',
						root: 'datas',
						totalProperty: 'count',
						successProperty: 'success',
						excelPath: 'excelPath'					
					},
					writer: {
			            type: 'singlepost',
			            writeAllFields: false,
			            root: 'datas'
			        } 
				}
	});
	
	
	 //ComBst Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'Moldtest',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});

 	store.load(function() {
 		//Ext.get('MAIN_DIV_TARGET').update('');
		/*if(store.getCount()==0) {
			//alert('count==0');
			//Ext.MessageBox.alert("Check!!!!", "Check your login state. (로그인 했나요?)");
		} else {*/
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			/*var selModel = Ext.create('Ext.selection.CheckboxModel', {
			    listeners: {
			        selectionchange: function(sm, selections) {
			        	grid.down('#removeButton').setDisabled(selections.length == 0);
			        }
			    }
			});*/
			
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        ///COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        //layout: 'fit',
			        height: getCenterPanelHeight(), 
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  addAction,  '-', removeAction,
	      				        '->'
//			                    ,printExcel
			                    ,
	      				            {
	      				                iconCls: 'tasks-show-all',
	      				                tooltip: 'All',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-active',
	      				                tooltip: 'Current',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-complete',
	      				                tooltip: 'Past',
	      				                toggleGroup: 'status'
	      				            }
	      				          
	      				          ]
			        },
			        {
			            xtype: 'toolbar',
			            items: /*(G)*/vSRCH_TOOLBAR
			        }
			        
			        ],
			        /*
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  addAction,  '-', removeAction,
	      				        '->', 
	      				            {
	      				                iconCls: 'tasks-show-all',
	      				                tooltip: 'All',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-active',
	      				                tooltip: 'Current',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-complete',
	      				                tooltip: 'Past',
	      				                toggleGroup: 'status'
	      				            }
	      				          
	      				          ]
			        },
			        {
			            xtype: 'toolbar',
			            items: [
								{
			                        xtype: 'triggerfield',
			                        emptyText: 'unique_id',
			                        id: 'srchUnique_id',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchUnique_id', 'unique_id', false);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchUnique_id').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchUnique_id', 'unique_id', false);
			                    	}
								},
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'item_code',
			                        id: 'srchItem_code',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchItem_code', 'item_code', true);
				    	            		}
				    	            	} 
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchItem_code').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchItem_code', 'item_code', true);
			                    	}
			                    },
			                    '-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'item_name',
			                        id: 'srchItem_name',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchItem_name', 'item_name', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchItem_name').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchItem_name', 'item_name', true);
			                    	}
			                    	
			                    },
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'specification',
			                        id: 'srchSpecification',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchSpecification', 'specification', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchSpecification').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchSpecification', 'specification', true);
			                    	}
			                    }
			                    
			                    ,
			                    '->', 

			                    {
			                        text: 'First Division',
			                        iconCls: 'number01',
			                        menu: {
			                            items: [
			                                {
			                                    text: 'First Division',
			                                    iconCls: 'number01'
			                                },
			                                {
			                                    text:  'Second Division',
			                                    iconCls: 'number02'
			                                },
			                                {
			                                    text:  'Third Division',
			                                   iconCls: 'number03'
			                                },
			                                {
			                                    text:  'Fourth Division',
			                                   iconCls: 'number04'
			                                }
			                            ]
			                        }
			                    }

			                 ]
			        }
			        
			        ],
			        */
			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            getRowClass: function(record) { 
	   			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
			            } ,
			            listeners: {
			            	'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
								elments.each(function(el) {
												//el.setStyle("color", 'black');
												//el.setStyle("background", '#ff0000');
												//el.setStyle("font-size", '12px');
												//el.setStyle("font-weight", 'bold');
						
											}, this);
									
								}
			            		,
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: viewHandler /* function(dv, record, item, index, e) {
			                    alert('working');
			                }*/

			            }
			        },
			        title: getMenuTitle()//,
			        //renderTo: 'MAIN_DIV_TARGET'
			    });
			fLAYOUT_CONTENT(grid);
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
		            	
						//grid info 켜기
						displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	editAction.disable();
						}else{
							removeAction.enable();
			            	editAction.enable();
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		removeAction.disable();
			            	editAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		    
		//}//endof else
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	 	
});	//OnReady
     
