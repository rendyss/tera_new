<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/15/2019
 * Time: 10:20 PM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Class_Tera_Assets_Public' ) ) {
	class Class_Tera_Assets_Public {
		static function init() {
			static $instance = null;
			if ( $instance === null ) {
				$instance = new self();
			}

			return $instance;
		}

		private function __construct() {
			$this->_register_assets();
		}

		private function _register_assets() {
			add_action( 'wp_enqueue_scripts', array( $this, '_register_assets_callback' ) );
		}

		function _register_assets_callback() {
			wp_enqueue_script( 'jquery-validation', get_template_directory_uri() . '/assets/plugins/jquery-validation/dist/jquery.validate.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/assets/plugins/bootstrap-sass/assets/javascripts/bootstrap.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'bootstrap-select', get_template_directory_uri() . '/assets/plugins/bootstrap-select/dist/js/bootstrap-select.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'bootstrap-datepicker', get_template_directory_uri() . '/assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'bootstrap-datepicker-moment', get_template_directory_uri() . '/assets/plugins/bootstrap-datepicker/moment.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'imagesloaded', get_template_directory_uri() . '/assets/plugins/imagesloaded/imagesloaded.pkgd.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'matchHeight', get_template_directory_uri() . '/assets/plugins/matchHeight/dist/jquery.matchHeight-min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'owl-carousel', get_template_directory_uri() . '/assets/plugins/owl.carousel/owl.carousel.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'lity', get_template_directory_uri() . '/assets/plugins/lity/lity.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'timeago', get_template_directory_uri() . '/assets/plugins/timeago/timeago.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'dependson', get_template_directory_uri() . '/assets/plugins/dependsOn/dependsOn.min.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'main', get_template_directory_uri() . '/assets/scripts/main.js', array( 'jquery' ), false, true );
			wp_enqueue_script( 'ajax', get_template_directory_uri() . '/assets/scripts/ajax.js', array( 'jquery' ), false, true );
			wp_localize_script( 'ajax', 'my_ajax_object',
				array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );

			//load the stylesheets
			wp_enqueue_style( 'style', get_stylesheet_uri() );
			wp_enqueue_style( 'bootstrap-select', get_template_directory_uri() . '/assets/plugins/bootstrap-select/dist/css/bootstrap-select.min.css' );
			wp_enqueue_style( 'bootstrap-datepicker', get_template_directory_uri() . '/assets/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css' );
			wp_enqueue_style( 'owl-carousel', get_template_directory_uri() . '/assets/plugins/owl.carousel/assets/owl.carousel.min.css' );
			wp_enqueue_style( 'lity', get_template_directory_uri() . '/assets/plugins/lity/lity.min.css' );
			wp_enqueue_style( 'plugins', get_template_directory_uri() . '/assets/styles/plugins.css' );
			wp_enqueue_style( 'main', get_template_directory_uri() . '/assets/styles/main.css' );
		}
	}
}