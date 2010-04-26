/*
    +--------------------------------------------------------------------------------------------+
    |                                                                                            |
    |                 HAVING PROBLEMS? NEED HELP? DOESN'T WORK? WANT TO SAY HELLO?               |
    |                                                                                            |
    |                              WRITE ME, I'M GLAD TO HELP                                    |
    |                                                                                            |
    |                                SVEN@FRANCODACOSTA.COM                                      |
    |                                                                                            |
    +--------------------------------------------------------------------------------------------+
    |   DISCLAIMER - LEGAL NOTICE - LICENCING (GPL V3)                                           |
    +--------------------------------------------------------------------------------------------+
    |                                                                                            |
    |  This program is free software; you can redistribute it and/or modify it under the terms   |
    |  of the GNU General Public License version 3 as published by the Free Software Foundation  |
    |                                                                                            |
    |  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; |
    |  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. |
    |  See the GNU General Public License for more details.                                      |
    |                                                                                            |
    |  You should have received a copy of the GNU General Public License along with this         |
    |  program, if not you can obtain it at http://www.gnu.org/licenses/gpl-3.0.html             |
    |                                                                                            |
    +--------------------------------------------------------------------------------------------+
 */

Ext.namespace('Ext.fc');
/**
 * A nice way to present dates and time
 * 
 * @class 	Ext.fc.fuzzyDate
 * @version    0.3
 * @author     Nuno Costa - sven@francodacosta.com
 * @copyright  Copyright (c) 2009
 * @license    GPL v3 - http://www.gnu.org/licenses/gpl-3.0.html
 * @link       http://francodacosta.com/demos/extjs/fuzzyDate/
 * @since      2009-03-04
 */
Ext.fc.fuzzyDate = function(){
	var defaultConfig = function(){
		return{
			refreshInterval: 60	
			,onErrorWriteTitle: true
			,itemSelector: 'span.fuzzyDate'
			,dateFormats: [
				"Y-m-d H:i:s" //ISO8601Long
				,"Y-m-d" //ISO8601Short
				,"h:i:s" //time
				,"H:i:s" //time
				,"n/j/Y" //ShortDate
				,"l, F d, Y" //LongDate
				,"l, F d, Y g:i:s A" //FullDateTime
				,"F d" //MonthDay
				,"g:i A" //ShortTime
				,"g:i:s A" //LongTime
				,"Y-m-d\\TH:i:s" //SortableDateTime
				,"Y-m-d H:i:sO" //UniversalSortableDateTime
				,"F, Y" //YearMonth
			]
			,translation: {
				prefixAgo		: ''
		        ,prefixFromNow	: ''
		        ,suffixAgo		: "ago"
		        ,suffixFromNow	: "from now"
		        	
		        ,seconds: "less than a minute"
		        ,minute	: "about a minute"
		        ,minutes: "%d minutes"
		        ,hour	: "about an hour"
		        ,hours	: "about %d hours"
		        ,day	: "a day"
		        ,days	: "about %d days"
		        ,month	: "about a month"
		        ,months	: "about %d months"
		        ,year	: "about a year"
		        ,years	: "about %d years"
			}
				
			,offsets: {
				//values are exclusive, they will be evaluated as date < now or date < oneYear
				//number of seconds a date ins considered less than a minute
			    now : 45
			    //number of seconds a date is consedred about a minute
				,minuteOffset : 90
				//number of minutes a date should be represented as x minutes
				,xminutes: 50
				//number of minutes a date should be represented as one hour
				,oneHour: 80
				//number of hours a date should be represented as x hours
				,xHours: 24
				//number of hours a date shuld be respresented as one day
				,oneDay: 48
				//number of days a date should be represented as X days
				,xDays: 30
				//number of days a date should be represented as one month
				,oneMonth: 60
				//number of days a date should be representas as x months
				,xMonths: 365
				//number of years a date should be represented as one year
				,oneYear: 2
			}
			
		}
	}
	
	function sprintf(text, value){
		//I just need %d for one parameter, eheheheh
		return text.replace(/%d/, value);
	}
	
	function parseDate(str, formats){
		var d = null;
		for ( i = 0; i < formats.length; i++){
			d = Date.parseDate ( str, formats[i]);
			if(d) return d
		}
		
		return false;
	}
	
	var dateTimeToString = function (dateObject, options){
		var t = options.translation ; 
		var now = new Date();
		var offset = now.format('U') - dateObject.format('U') ;
		//if < 0 then date is in future

		if( offset < 0 ){
			suffix = t.suffixFromNow ;
			prefix = t.prefixFromNow ;
		}else{
			suffix = t.suffixAgo ;
			prefix = t.prefixAgo ;
		}
		
		var seconds = Math.abs(offset) ;
		var minutes = Math.floor(seconds / 60 );
		var hours 	= Math.floor(minutes / 60 );
		var days 	= Math.floor(hours / 24 );
		var years 	= Math.floor(days / 365 );
		
		var fuzzy = false ||
			seconds < options.offsets.now 			&& sprintf (t.seconds, Math.round(seconds)) 	|| //about 1 minute
	        seconds < options.offsets.minuteOffset 	&& sprintf (t.minute , 1) 						|| //about x minutes
	        minutes < options.offsets.xminutes 		&& sprintf (t.minutes, Math.round(minutes)) 	|| //about 1 hour
	        minutes < options.offsets.oneHour 		&& sprintf (t.hour	 , 1) 						|| //about x hours
	        hours 	< options.offsets.xHours 		&& sprintf (t.hours  , Math.round(hours)) 		|| //about 1 day
	        hours 	< options.offsets.oneDay 		&& sprintf (t.day	 , 1) 						|| //about x days
	        days 	< options.offsets.xDays 		&& sprintf (t.days	 , Math.floor(days))		|| //about 1 month
	        days 	< options.offsets.oneMonth 		&& sprintf (t.month	 , 1) 						|| //about x months
	        days 	< options.offsets.xMonths 		&& sprintf (t.months , Math.floor(days / 30)) 	|| //about 1 year
	        years 	< options.offsets.oneYear 		&& sprintf (t.year	 , 1) 						|| //about x years
	        sprintf(t.years, Math.floor(years));

		return prefix + " " + fuzzy + " " + suffix ;
		
	}
	
	var processOptions = function(config){
	    var o = defaultConfig();
        var options = {};
        Ext.apply(options, config, o);
        
        return options ;
	}
	//public start
	return{
		options: null
		,items: []
		,init : function (config){
			this.options = processOptions(config) ;
			this.refresh();
		}
	
	    ,translate : function(str, options){
	        var d = parseDate(str, options.dateFormats); 
	        if(d){
                return (dateTimeToString( d , options  ));
            }else{
                if (options.onErrorWriteTitle)
                    return (str);
            }
	        return false ;
	    }
	
		,refresh: function(){
			Ext.select(this.options.itemSelector).each(function(el, item, collectionIindex){
			    el.update(this.translate(el.dom.title, this.options));
			}, this);
			
			if(this.options.refreshInterval > 0)
				this.refresh.createDelegate(this).defer(this.options.refreshInterval * 1000)
		}
		
		,applyTo: function (domId, config){
            var options = processOptions(config) ;
            var el = Ext.get(domId);
            el.update(this.translate(el.dom.title, options));
            
            if(options.refreshInterval > 0)
                this.applyTo.createDelegate(this).defer(options.refreshInterval * 1000, this, [domId, config]);
		}
		
	}//public -- end
}