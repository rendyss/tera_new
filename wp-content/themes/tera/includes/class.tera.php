<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/15/2019
 * Time: 10:16 PM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Class_Tera' ) ) {
	class Class_Tera {
		static function init() {
			static $instance = null;
			if ( $instance === null ) {
				$instance = new self();
			}

			return $instance;
		}

		private function __construct() {
			$this->_load_assets_public();
			$this->_load_cpt();
			$this->_load_metabox();
			$this->_load_cf();
			$this->_load_template();
		}

		private function _load_assets_public() {
			require_once get_template_directory() . '/includes/class.tera-assets-public.php';
			Class_Tera_Assets_Public::init();
		}

		private function _load_cpt() {
			require_once get_template_directory() . '/includes/class.tera-cpt.php';
			Class_Tera_CPT::init();
		}

		private function _load_metabox() {
			require_once get_template_directory() . '/includes/meta-box/inc/loader.php';
			$rwmb_loader = new RWMB_Loader();
			$rwmb_loader->init();
		}

		private function _load_cf() {
			require_once get_template_directory() . '/includes/class.tera-cf.php';
			Class_Tera_CF::init();
		}

		private function _load_template() {
			require_once get_template_directory() . '/includes/class.tera-template.php';
		}
	}
}