Ext.define('Ext.locale.tr.pivot.Aggregators', {
    override: 'Ext.pivot.Aggregators',

    customText:                 'Custom',
    sumText:                    'Topla',
    avgText:                    'Ort',
    countText:                  'Sayı',
    minText:                    'En Küçük',
    maxText:                    'En Büyük',
    groupSumPercentageText:     'Grup toplam yüzde',
    groupCountPercentageText:   'Grup sayı yüzde',
    varianceText:               'Var',
    variancePText:              'Varp',
    stdDevText:                 'StdDev',
    stdDevPText:                'StdDevp'
});
/**
 * Turkish translation by Deniz Girginer
 *
 */

Ext.define('Ext.locale.tr.pivot.Grid', {
    override: 'Ext.pivot.Grid',

    textTotalTpl:       'Toplam ({name})',
    textGrandTotalTpl:  'Genel toplam',
    total:'Toplam',
    blank:'(boş)'
});
Ext.define('Ext.locale.tr.pivot.plugin.RangeEditor', {
    override: 'Ext.pivot.plugin.RangeEditor',

    textWindowTitle:    'Aralık editor',
    textFieldValue:     'Değer',
    textFieldEdit:      'Alan',
    textFieldType:      'Tip',
    textButtonOk:       'Tamam',
    textButtonCancel:   'İptal',

    updaters: [
        ['percentage', 'Yüzde'],
        ['increment', 'Artış'],
        ['overwrite', 'Üstüneyaz'],
        ['uniform', 'Düzgün']
    ]
});Ext.define('Ext.locale.tr.pivot.plugin.configurator.Column', {
    override: 'Ext.pivot.plugin.configurator.Column',

    sortAscText:                'Sırala A to Z',
    sortDescText:               'Sırala Z to A',
    sortClearText:              'Sıralama iptal',
    clearFilterText:            'Filtre temizle  "{0}"',
    labelFiltersText:           'Etiket sorgula',
    valueFiltersText:           'Value sorgula',
    equalsText:                 'Eşit...',
    doesNotEqualText:           'Eşit değil...',
    beginsWithText:             '... ile başlayan',
    doesNotBeginWithText:       '... ile başlamayan',
    endsWithText:               '... ile biten',
    doesNotEndWithText:         '... ile bitmeyen',
    containsText:               'içinde ... olan',
    doesNotContainText:         'içinde ... olmayan',
    greaterThanText:            '... dan büyük',
    greaterThanOrEqualToText:   '... dan büyük ve eşit',
    lessThanText:               '... den küçük',
    lessThanOrEqualToText:      '... den küçük ve eşit',
    betweenText:                '... arasında ',
    notBetweenText:             '... arasında olmayan',
    top10Text:                  'En yüksek 10 ...',

    equalsLText:                'Eşit',
    doesNotEqualLText:          'Eşit değil',
    beginsWithLText:            'ile başlayan',
    doesNotBeginWithLText:      'ile başlamayan',
    endsWithLText:              'ile biten',
    doesNotEndWithLText:        'ile bitmeyen',
    containsLText:              'içende',
    doesNotContainLText:        'içinde olmayan',
    greaterThanLText:           'dan büyük',
    greaterThanOrEqualToLText:  'den büyük ve eşit',
    lessThanLText:              'den küçük',
    lessThanOrEqualToLText:     'den küçük ve eşit',
    betweenLText:               'arasında',
    notBetweenLText:            'arasında değil',
    top10LText:                 'En yüksek 10...',
    topOrderTopText:            'En yüksek',
    topOrderBottomText:         'Alt',
    topTypeItemsText:           'Öğeler',
    topTypePercentText:         'Yüzde',
    topTypeSumText:             'Toplam'

});Ext.define('Ext.locale.tr.pivot.plugin.configurator.Panel', {
    override: 'Ext.pivot.plugin.configurator.Panel',

    panelAllFieldsText:     'Kullanılmayan alanları buraya sürükleyin',
    panelTopFieldsText:     'Sütun alanları buraya',
    panelLeftFieldsText:    'Satır alanları buraya',
    panelAggFieldsText:     'Hesap alanları buraya',
    panelAllFieldsTitle:    'All fields',
    panelTopFieldsTitle:    'Column labels',
    panelLeftFieldsTitle:   'Row labels',
    panelAggFieldsTitle:    'Values',
    addToText:              'Add to {0}',
    moveToText:             'Move to {0}',
    removeFieldText:        'Remove field',
    moveUpText:             'Move up',
    moveDownText:           'Move down',
    moveBeginText:          'Move to beginning',
    moveEndText:            'Move to end',
    formatText:             'Format as',
    fieldSettingsText:      'Field settings'
});Ext.define('Ext.locale.tr.pivot.plugin.configurator.window.FieldSettings', {
    override: 'Ext.pivot.plugin.configurator.window.FieldSettings',

    title:              'Field settings',
    formatText:         'Format as',
    summarizeByText:    'Summarize by',
    customNameText:     'Custom name',
    sourceNameText:     'Source name',
    alignText:          'Align',
    alignLeftText:      'Left',
    alignCenterText:    'Center',
    alignRightText:     'Right'
});
Ext.define('Ext.locale.tr.pivot.plugin.configurator.window.FilterLabel',{
    override: 'Ext.pivot.plugin.configurator.window.FilterLabel',

    titleText:          'Etiket sorgu ({0})',
    fieldText:          'Öğeleri göster hangi etiket için',
    caseSensitiveText:  'Harfe duyarlı'
});
Ext.define('Ext.locale.tr.pivot.plugin.configurator.window.FilterTop',{
    override: 'Ext.pivot.plugin.configurator.window.FilterTop',

    titleText:      'En yüksek 10 sorgu ({0})',
    fieldText:      'Göster',
    sortResultsText:'Sonuç sırala'
});Ext.define('Ext.locale.tr.pivot.plugin.configurator.window.FilterValue',{
    override: 'Ext.pivot.plugin.configurator.window.FilterValue',

    titleText:      'Değer filtre ({0})',
    fieldText:      'Öğeleri göster'
});