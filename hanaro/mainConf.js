Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'Mplm':	 vContent_full_path +  '/class/mplm',
		
		'Ext.ux':	vContent_full_path + '/class/extjs5/module/ux',
		'Ext.xdview':	vContent_full_path + '/class/extjs5/module/xdview',
		'Ext.calendar':	vContent_full_path + '/class/rfx/view/calendar/src',
		'Ext.ux.upload':	vContent_full_path + '/class/upload/',

		'Rfx':	 vContent_full_path +  '/class/rfx',
		'Rfx2':	 vContent_full_path +  '/class/rfx2',
		'Rfx3':	 vContent_full_path +  '/class/rfx3',
		'Rfx8':	 vContent_full_path +  '/class/rfx8',
		
		'Hanaro':	vContent_full_path + '/hanaro',
		'DynaHanaro':	vDynamic_full_path + '/hanaro'
	}
});

Ext.require([
	'Ext.grid.*',
	'Ext.data.*',
	'Ext.util.*',
	'Ext.Action',
	'Ext.tab.*',
	'Ext.button.*',
	'Ext.form.*',
	'Ext.tree.*',
	'Ext.Array.*',
	'Ext.layout.container.Card',
	'Ext.layout.container.Border',
	'Ext.ux.ajax.SimManager',
	'Ext.ux.PreviewPlugin',
	'Ext.window.MessageBox',
	'Ext.util.History',
	'Ext.tip.*',
	'Ext.ux.CheckColumn',
	'Rfx.app.Util',
]);