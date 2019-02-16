<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/15/2019
 * Time: 10:15 PM
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

//Include the main class
require_once get_template_directory() . '/includes/class.tera.php';
$class_tera = Class_Tera::init();

//Load template helper globally
global $tera_template;
$tera_template = new Class_Tera_Template( get_template_directory() . '/templates' );