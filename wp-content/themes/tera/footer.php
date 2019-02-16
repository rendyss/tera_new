<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/16/2019
 * Time: 9:56 PM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $tera_template;
echo $tera_template->render( 'footer' );
