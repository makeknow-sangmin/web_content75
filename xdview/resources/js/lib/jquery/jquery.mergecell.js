/* 
 * 
 * 같은 값이 있는 열을 병합함
 * 
 * 사용법 : $('#테이블 ID').rowspan(0);
 * 
 */   
$.fn.rowspan = function(colIdx, isStats) {       
    return this.each(function(){      
        var that;     
        $('tr', this).each(function(row) {      
            $('td:eq('+colIdx+')', this).filter(':visible').each(function(col) {
                  
                if ($(this).html() == $(that).html()
                    && (!isStats 
                            || isStats && $(this).prev().html() == $(that).prev().html()
                            )
                    ) {            
                    rowspan = $(that).attr("rowspan") || 1;
                    rowspan = Number(rowspan)+1;
  
                    $(that).attr("rowspan",rowspan);
                      
                    // do your action for the colspan cell here            
                    $(this).hide();
                      
                    //$(this).remove(); 
                    // do your action for the old cell here
                      
                } else {            
                    that = this;         
                }          
                  
                // set the that if not already set
                that = (that == null) ? this : that;      
            });     
        });    
    });  
}; 
  
  
/* 
 * 
 * 같은 값이 있는 행을 병합함
 * 
 * 사용법 : $('#테이블 ID').colspan (0);
 * 
 */ 
$.fn.colspan = function(rowIdx) {
    return this.each(function(){
          
        var that;
        $('tr', this).filter(":eq("+rowIdx+")").each(function(row) {
            $(this).find('th').filter(':visible').each(function(col) {
                if ($(this).html() == $(that).html()) {
                    colspan = $(that).attr("colSpan") || 1;
                    colspan = Number(colspan)+1;
                      
                    $(that).attr("colSpan",colspan);
                    $(this).hide(); // .remove();
                } else {
                    that = this;
                }
                  
                // set the that if not already set
                that = (that == null) ? this : that;
                  
            });
        });
    });
}