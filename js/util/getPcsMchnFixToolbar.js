console_log('loading getSupplierToolbar in util....');
function getPcsMchnFixToolbar() {
	
	var processNameStore = Ext.create('Mplm.store.ProcessNameStore', {} );
	
	var arrPcsMchnFixCombo = [];
	
	arrPcsMchnFixCombo.push(
			{
				id:'fix_mchncombo',
//				name:'fix_mchn',
		        	xtype: 'combo',
		        	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                   mode: 'local',
	                   editable:false,
	                   allowBlank: false,
	                   queryMode: 'remote',
	                   emptyText:'공정코드',
	                   displayField:   'systemCode',
	                   valueField:     'systemCode',
	                   store: processNameStore,
	                   width: 230,
		                listConfig:{
		                	
		                	getInnerTpl: function(){
		                		var obj2 = Ext.getCmp('mchncombo'); 
		                	    obj2.store = 
		                	    	Ext.create('Ext.data.Store', {
		                	        fields : ['unique_id', 'mchn_code'],
		                	        data   : []
		                	    	});
		                		return '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName} / {codeNameEn}</div>';
		                	}			                	
		                },
		               triggerAction: 'all',
	 	               listeners: {
	 	                    select: function (combo, record) {
	 	                    	
	 	                    	console_log('Selected Value : ' + combo.getValue());
	 	                    	var systemCode = record[0].get('systemCode');
	 	                    	var codeNameEn  = record[0].get('codeNameEn');
	 	                    	var codeName  = record[0].get('codeName');
	 	                    	console_log('systemCode : ' + systemCode 
	 	                    			+ ', codeNameEn=' + codeNameEn
	 	                    			+ ', codeName=' + codeName	);
	 	     
	 	        				mchnStore.proxy.extraParams.pcs_code = systemCode;
	 	        				
	 	        				var fix_mchn=combo.getValue();
			                   	store.getProxy().setExtraParam('fix_mchn',fix_mchn);
	 	        				
			                   	mchnStore.load( function(records) {
	 	        					
	 	        					console_log(records); 
	 	        					if(records != undefined ) {
	 	        					
		   	   	                	  var obj2 = Ext.getCmp('mchncombo');
		   	   	                	  obj2.clearValue();
		   	   	                	  obj2.store.removeAll();
				   	   	                for (var i=0; i<records.length; i++){ 
				   	   	                	
				   	   	                	var mchnObj = records[i];
				   	   	                	var mchn_code = mchnObj.get('mchn_code');
				   	   	                	var unique_id = mchnObj.get('unique_id');

//				   	   	                	
//				   	   	                	
				   	   	                	

				   	   	                	
				   	   	                	obj2.store.add( //mchnObj
				   	   	                			
				   	   	                			{
				   	   	                				mchn_code: mchn_code,
				   	   	                				unique_id: unique_id				   	   	                		
				   	   	                			});
				   	   	              console_log('mchn_code : ' + mchn_code 
		     	                    			+ ', unique_id=' + unique_id		     	                				   	   	              
		     	                    			);
				   	   	              
				   	   	              
				   	   	                	
				   	   	                }
				   	   	          
	 	        					}
		   	   	                	  
		   	   	                  });
	 	                    	
	 	                    }
	 	               }
		            }
	);
	if(vCUR_MENU_CODE !='VMF7'){
		arrPcsMchnFixCombo.push(
				{
					id :'mchncombo',
					//          name : 'mchn_uid',
					xtype: 'combo',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					mode: 'local',
					editable:false,
					//store:obj2,
					emptyText:'설비코드',
					allowBlank: true,
					queryMode: 'local',
					displayField:   'mchn_code',
					valueField:     'unique_id',
					
					//store: mchnStore,
					//              listConfig:{
					//              	getInnerTpl: function(){
					//              		return '<div data-qtip="{mchn_code}">[{unique_id}] {mchn_code}</div>';
					//              	}			                	
					//              },
					triggerAction: 'all',
					listeners: {
						select: function (combo, record) {
							console_log('Selected Value : ' + combo.getValue());
							//Mchn_code = Ext.getCmp('mchn_uid').getValue();
							
							var unique_id = record[0].get('unique_id');
							mchn_code_combo  = record[0].get('mchn_code')
							
							var mchn_uid=Ext.getCmp('mchncombo').getValue();
							store.getProxy().setExtraParam('mchn_uid',mchn_uid);
							
							//                  	searchHandler();
							//                   	Ext.getCmp('name_en').setValue(codeNameEn);
							
						}
					}
				}
		);
	}
	
	return arrPcsMchnFixCombo;
}