/**
 * Ext.ux.FillSlider
 *
 * @author  Abdul Rehman Talat (artalat.obspk.com)
 * @version 1.02
 * @date    8 December 2009
 *
 * @license Ext.ux.FileUploader is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */


Ext.ns("Ext.ux");

Ext.ux.FillSlider = (function(){

    return {

        init: function(f) {
            f.onRender = f.onRender.createSequence(this.onRender);
            f.afterRender = f.afterRender.createSequence(this.afterRender);
			f.onClickChange = f.onClickChange.createSequence(this.onClickChange);
            f.moveThumb = f.moveThumb.createSequence(this.moveThumb);
        },

        onRender : function(){	
			this.fill = this.innerEl.insertFirst({cls:'x-slider-bg'});
			
			// For IE
			this.fill.insertHtml("afterBegin", "&nbsp;");
		},
		
		afterRender : function()
		{
			if(this.vertical==true)			
			{
				var height = (this.translateValue(this.value)+(this.thumb.getHeight()/2)).constrain(0,this.innerEl.getHeight());
				this.fill.setHeight(height, true);
				this.fill.setWidth(this.innerEl.getWidth());
			}
			else
			{
				this.fill.setWidth(this.thumb.getRight(true)-(this.thumb.getWidth()/2));	
				this.fill.setHeight(this.innerEl.getHeight());
			}
			
		},		
		
		onClickChange : function(local)	
		{
			if(this.vertical==true)			
			{				
				if(local.left > this.clickRange[0] && local.left < this.clickRange[1]){
					var height = (this.translateValue(this.value)+(this.thumb.getHeight()/2)).constrain(0,this.innerEl.getHeight());
					this.fill.setHeight(height, true);
				}
			}
			else
			{
				if(local.top > this.clickRange[0] && local.top < this.clickRange[1]){
					var width = (this.translateValue(this.value)+(this.thumb.getWidth()/2)).constrain(0,this.innerEl.getWidth()) ;			
					this.fill.setWidth(width, true);
				}
			}
		},		
		
		moveThumb: function(v, animate)
		{	
			if(this.vertical==true)		
				this.fill.setHeight(this.translateValue(this.value)+(this.thumb.getHeight()/2), animate);

			else
				this.fill.setWidth(this.translateValue(this.value)+(this.thumb.getWidth()/2), animate);
		}
		
    };
})();