(function(){

    var ns = Ext.ns('Ext.ux.plugins');
    /**
     * @class Ext.ux.plugins.DefaultButton
     * @extends Object
     *
     * Plugin for Button that will click() the button if the user presses ENTER while
     * a component in the button's form has focus.
     *
     * @author Stephen Friedrich
     * @date 21-JAN-2010
     * @version 0.2
     *
     */
    Ext.ux.plugins.DefaultButton = Ext.extend(Object, {
        init: function(button){
            button.on('afterRender', setupKeyListener, button);
        }
    });
    
    function setupKeyListener(){
        var formPanel = this.findParentBy(function(p, t){
			var re = new RegExp('form');
			if (p.getXTypes().match(re)) {
				return p;
			}
			return null;
		});
		
		if (formPanel) {
	        //noinspection ObjectAllocationIgnored
	        new Ext.KeyMap(formPanel.el, {
	            key: Ext.EventObject.ENTER,
	            shift: false,
	            alt: false,
	            fn: function(keyCode, e){
	                if (this.hidden || e.target.type === 'textarea' && !e.ctrlKey) {
	                    return true;
	                }
	                
	                this.el.select('button').item(0).dom.click();
	                return false;
	            },
	            scope: this
	        });
		}
    }
    
    Ext.ComponentMgr.registerPlugin('defaultButton', ns.DefaultButton);
    
})();