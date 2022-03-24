
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Mplm': CONTEXT_PATH + '/mplm'
    }
});

function popupBoard(unique_id) {
	var url = CONTEXT_PATH +  '/b2bpage.do?viewRange=public&method=page&pageName='
		+ 'viewBoard'
		+ '&unique_id=' + unique_id;
	this.location.href=url;	
}



Ext.onReady(function() {
	
	var boardStoreNotice = Ext.create('Mplm.store.BoardStore', {hasNull: false, boardType: 'I',  pageSize: 14} ); //Notice
	var boardStoreHuman = Ext.create('Mplm.store.BoardStore', {hasNull: false, boardType: 'H',  pageSize: 14} ); //구인/구직
	var boardStoreTech = Ext.create('Mplm.store.BoardStore', {hasNull: false, boardType: 'T',  pageSize: 2} ); //기술정보
	var productStoreProd = Ext.create('Mplm.store.ProductStore', {hasNull: false,   pageSize: 2} ); //상품정보
	boardStoreNotice.load(function(records) {
		var content = '';
		for(var i = 0; i < records.length; i++) {
			content = content +
			'<li><a href="javascript:popupBoard(' + records[i].data.unique_id  + ');">' + records[i].data.board_title_cng + '</a><label>' + records[i].data.create_date.substring(0,10) +'</label></li>';
		}
		document.getElementById('boardI').innerHTML = content;
		boardStoreHuman.load(function(records) {
			var content = '';
			for(var i = 0; i < records.length; i++) {
				content = content +
				'<li><a href="javascript:popupBoard(' + records[i].data.unique_id  + ');">' + records[i].data.board_title_cng + '</a><label>' + records[i].data.create_date.substring(0,10) +'</label></li>';
			}
			document.getElementById('boardH').innerHTML = content;
			
			Ext.get('loading').remove();
			Ext.get('loading-mask').fadeOut({remove:true});
			
		});
	});
	
	boardStoreTech.load(function(records) {
		var content = '';
		for(var i = 0; i < records.length; i++) {
			console_log(records[i].data.board_title);
			console_log(records[i].data.board_name_cng);
			content = content +
			'<li>' + 
			'<div class="photo"><img src="' + '/media/b2b/' + records[i].data.file_name + '" width="90" height="70"></div>' +
			'<span class="tit">' + records[i].data.board_title + '</span>' +'<br>'+
			 records[i].data.board_name_cng + 
			'</li></br>'
			;
		}
		document.getElementById('boardT').innerHTML = content;
	});

	productStoreProd.load(function(records) {
		var content = '';
		for(var i = 0; i < records.length; i++) {
			console_log(records[i].data.maker_name_cng);
			console_log(records[i].data.description_cng);
			content = content +
			'<li>' + 
			'<div class="photo"><img src="' + '/media/b2b/' + records[i].data.image_path + '" width="90" height="70"></div>' +
			'<span class="tit">' + records[i].data.maker_name_cng + '</span>' +'<br>'+
			 records[i].data.specification_cng + 
			'</li></br>'
			;
		}
		document.getElementById('boardP').innerHTML = content;
	});
});

