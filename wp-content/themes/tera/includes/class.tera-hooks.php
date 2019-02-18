<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/18/2019
 * Time: 6:44 PM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Class_Tera_Hooks' ) ) {
	class Class_Tera_Hooks {
		static function init() {
			static $instance = null;
			if ( $instance === null ) {
				$instance = new self();
			}

			return $instance;
		}

		private function __construct() {
			$this->_add_theme_support();
		}

		private function _add_theme_support() {
			add_theme_support( 'title-tag' );
		}
	}
}