<?php
/**
 * @package webfonts-subsetting
 * @link    https://github.com/xiaoxq/webfonts-subsetting
 * @author  Aaron Xiao <xiaoxiangquan@gmail.com>
 * @license GNU General Public Licence 3.0
 */

/**
 * Config
 */
// fonts' base path
$FONTS_BASE = __DIR__ . '/../example/fonts';
$FONTS_URL_BASE = '../example/fonts';


use FontLib\Font;
use FontLib\Binary_Stream;

/**
 * Subsetting font file with php-font-lib
 */
function phpfontlibSubsetting( $srcFont, $destFont, $subset ) {
	// php-font-lib may cost 512MB memory
	// ini_set( "memory_limit", "512000000");
	require_once __DIR__ . '/../lib/php-font-lib/src/FontLib/Autoloader.php';
	$font = Font::load( $srcFont );
	$font->parse();

	$font->setSubset( $subset );
	$font->reduce();

	$font->open( $destFont, Binary_Stream::modeWrite );
	$font->encode( array("OS/2") );
	$font->close();
}

function subsetting( $font, $subset ) {
	global $FONTS_BASE, $FONTS_URL_BASE;
	$fontname = str_replace( ' ', '', $font );
	$fontpath = "$FONTS_BASE/$fontname.ttf";

	// no source font
	if ( !file_exists( $fontpath ) ) {
		return null;
	}
	
	$subsetFontPath = "$FONTS_BASE/$fontname";
	if ( !file_exists( $subsetFontPath ) ) {
		mkdir( $subsetFontPath );
	}
	$subsetHash = md5( $subset );
	$subsetFont = "$subsetFontPath/$subsetHash.ttf";
	if ( !file_exists( $subsetFont ) ) {
		phpfontlibSubsetting( $fontpath, $subsetFont, $subset );

		// fix the subsetted ttf with fontforge, it's a bug from php-font-lib
		$tempFile = $subsetFont . ".tmp.ttf";
		ini_set( 'display_errors', 'On' );
		ini_set( 'error_reporting', E_ALL | E_STRICT );
		exec( "./fix_ttf.pe $subsetFont $tempFile 1> fix_ttf.out 2>&1 " );
		exec( "mv $tempFile $subsetFont 1>mv_ttf.out 2>&1" );
	}
	$subsetFontUrl = "$FONTS_URL_BASE/$fontname/$subsetHash.ttf";

	return $subsetFontUrl;
}

function main() {
	if ( !isset( $_POST['subsets'] ) )
		return;

	$subsets = json_decode( $_POST['subsets'] );
	$subsetsUrl = array();
	foreach ( $subsets as $font => $subset ) {
		// change the value from subset to url
		$url = subsetting( $font, $subset );
		if ( $url ) {
			$subsetsUrl[$font] = $url;
		}
	}

	echo json_encode( $subsetsUrl );
}

main();
