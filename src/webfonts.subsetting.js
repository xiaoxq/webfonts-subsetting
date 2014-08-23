( function ( $ ) {

	/**
	 * Configs: YOU SHOULD CUSTOMIZE HERE
	 */
	// fonts' names that need subsetting
	var TARGET_FONTS = {
		'WenQuanYi Micro Hei' : 1,
		'UnifrakturMaguntia' : 1
	};

	/**
	 * Constants
	 */
	var ELEMENT_TYPE = 1,
		TEXT_TYPE = 3,
		SUBSETTING_URL = "../src/webfonts_subsetting.php";

	/**
	 * Globals
	 */
	// { fontName: charsToBeSubsetted, ... }
	var gSubsets = {};

	/*
	 * Traverse the DOM tree and process all text nodes
	 */
	function traverseTextNode( element, processFunc ) {
		for ( var i in element.childNodes ) {
			var node = element.childNodes[i];
			switch ( node.nodeType ) {
			case ELEMENT_TYPE:
				traverseTextNode( node, processFunc );
				break;
			case TEXT_TYPE:
				processFunc( node );
				break;
			}
		}
	}

	/*
	 * Collect subsettings to the gSubsets
	 */
	function collectSubsets( textNode ) {
		var parent = textNode.parentNode,
			text = textNode.nodeValue;

		var fontFamilyStr = getComputedStyle( parent, null ).getPropertyValue('font-family');
		var fontFamilyArray = fontFamilyStr.split( ',' );

		for ( var i in fontFamilyArray ) {
			// remove leading and trailing quotes and spaces
			var font = fontFamilyArray[i].replace( /'|"/g, "" ).replace( /(^\s*)|(\s*$)/g, '' );
			// not the fonts we concern
			if ( !TARGET_FONTS.hasOwnProperty( font ) ) {
				continue;
			}

			gSubsets[font] = gSubsets[font] || {};
			// add every char to the container
			for ( var j in text ) {
				gSubsets[font][ text[j] ] = 1;
			}
		}
	}

	/**
	 * Generate css according to the urls returned, and apply to the page
	 */
	function applyWebfonts( fontUrls ) {
		var cssStr = '';

		for ( var font in fontUrls ) {
			cssStr += '\
				@font-face {\
					font-family: "' + font + '";\
					src: url( "' + fontUrls[ font ] + '" );\
				}' + "\n";
		}

		// append css to head
		$( '<style>' )
			.text( cssStr )
			.appendTo( $( 'head' ) );
	}

	/**
	 * Send the subsets wanted to server
	 */
	function requestSubsets() {
		$.isPlainObject(gSubsets);
		$.ajax( {
			url : SUBSETTING_URL,
			type : 'POST',
			data : gSubsets,
			dataType : 'json',

			success : function( data, status, xhr ) {
				if ( status !== 'success' ) {
					return;
				}
				// data is something like { font:url, ... }
				applyWebfonts( data );
			},

			// handle errors
			Error : function( xhr, error, exception ) {
				alert(exception.toString());
			}
	    });
	}

	$( document ).ready( function() {
		traverseTextNode( document.body, collectSubsets );
		for ( var font in gSubsets ) {
			var subset = '';
			for ( var ch in gSubsets[font] ) {
				subset += ch;
			}
			// note that the uniq chars has been sorted
			gSubsets[font] = subset;
		}

		requestSubsets();
	} );

}( jQuery ) );
