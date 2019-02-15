<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/15/2019
 * Time: 10:31 PM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Class_Tera_CPT' ) ) {
	class Class_Tera_CPT {
		static function init() {
			static $instance = null;
			if ( $instance === null ) {
				$instance = new self();
			}

			return $instance;
		}

		private function __construct() {
			$this->_register_cpt();
		}

		private function _register_cpt() {
			add_action( 'init', array( $this, '_register_cpt_callback' ) );
		}

		function _register_cpt_callback() {
			/**
			 * Post Type: Testimonials.
			 */

			$labels = array(
				"name"          => __( "Testimonials", "" ),
				"singular_name" => __( "Testimonial", "" ),
			);

			$args = array(
				"label"               => __( "Testimonials", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "testi", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-id-alt",
				"supports"            => false,
			);

			register_post_type( "testi", $args );

			/**
			 * Post Type: Forwarders.
			 */

			$labels = array(
				"name"          => __( "Forwarders", "" ),
				"singular_name" => __( "Forwarder", "" ),
				"menu_name"     => __( "Logistic Providers", "" ),
				"all_items"     => __( "All Forwarders", "" ),
			);

			$args = array(
				"label"               => __( "Forwarders", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "forwarder", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-businessman",
				"supports"            => array( "thumbnail", "comments" ),
			);

			register_post_type( "forwarder", $args );

			/**
			 * Post Type: Packages.
			 */

			$labels = array(
				"name"          => __( "Packages", "" ),
				"singular_name" => __( "Package", "" ),
			);

			$args = array(
				"label"               => __( "Packages", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "package", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-products",
				"supports"            => array( "title" ),
			);

			register_post_type( "package", $args );

			/**
			 * Post Type: Payments.
			 */

			$labels = array(
				"name"          => __( "Payments", "" ),
				"singular_name" => __( "Payment", "" ),
			);

			$args = array(
				"label"               => __( "Payments", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "payment", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-awards",
				"supports"            => false,
			);

			register_post_type( "payment", $args );

			/**
			 * Post Type: Quotes.
			 */

			$labels = array(
				"name"          => __( "Quotes", "" ),
				"singular_name" => __( "Quote", "" ),
			);

			$args = array(
				"label"               => __( "Quotes", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "quote", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-portfolio",
				"supports"            => false,
			);

			register_post_type( "quote", $args );

			/**
			 * Post Type: Shippers.
			 */

			$labels = array(
				"name"          => __( "Shippers", "" ),
				"singular_name" => __( "Shipper", "" ),
			);

			$args = array(
				"label"               => __( "Shippers", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "shipper", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-universal-access",
				"supports"            => false,
			);

			register_post_type( "shipper", $args );

			/**
			 * Post Type: Jobs.
			 */

			$labels = array(
				"name"          => __( "Jobs", "" ),
				"singular_name" => __( "Job", "" ),
			);

			$args = array(
				"label"               => __( "Jobs", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "job", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-nametag",
				"supports"            => array( "title" ),
			);

			register_post_type( "job", $args );

			/**
			 * Post Type: Coupons.
			 */

			$labels = array(
				"name"          => __( "Coupons", "" ),
				"singular_name" => __( "Coupon", "" ),
			);

			$args = array(
				"label"               => __( "Coupons", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => false,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => false,
				"show_in_nav_menus"   => false,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "rp", "with_front" => true ),
				"query_var"           => true,
				"supports"            => false,
			);

			register_post_type( "rp", $args );

			/**
			 * Post Type: Notifications.
			 */

			$labels = array(
				"name"          => __( "Notifications", "" ),
				"singular_name" => __( "Notification", "" ),
			);

			$args = array(
				"label"               => __( "Notifications", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => false,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => false,
				"show_in_nav_menus"   => false,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "notif", "with_front" => true ),
				"query_var"           => true,
				"supports"            => array( "title", "editor", "thumbnail" ),
			);

			register_post_type( "notif", $args );

			/**
			 * Post Type: Verifications.
			 */

			$labels = array(
				"name"          => __( "Verifications", "" ),
				"singular_name" => __( "Verification", "" ),
			);

			$args = array(
				"label"               => __( "Verifications", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => false,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => false,
				"show_in_nav_menus"   => false,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "go", "with_front" => true ),
				"query_var"           => true,
				"supports"            => false,
			);

			register_post_type( "verification", $args );

			/**
			 * Post Type: Bids.
			 */

			$labels = array(
				"name"          => __( "Bids", "" ),
				"singular_name" => __( "Bid", "" ),
			);

			$args = array(
				"label"               => __( "Bids", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "bid", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-admin-network",
				"supports"            => false,
			);

			register_post_type( "bid", $args );

			/**
			 * Post Type: Transactions.
			 */

			$labels = array(
				"name"          => __( "Transactions", "" ),
				"singular_name" => __( "Transaction", "" ),
			);

			$args = array(
				"label"               => __( "Transactions", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => true,
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "transaction", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-chart-bar",
				"supports"            => false,
			);

			register_post_type( "transaction", $args );

			/**
			 * Post Type: Warehouses.
			 */

			$labels = array(
				"name"          => __( "Warehouses", "" ),
				"singular_name" => __( "Warehouse", "" ),
			);

			$args = array(
				"label"               => __( "Warehouses", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => "edit.php?post_type=forwarder",
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "warehouse", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-category",
				"supports"            => false,
			);

			register_post_type( "whouse", $args );

			/**
			 * Post Type: Truckings.
			 */

			$labels = array(
				"name"          => __( "Truckings", "" ),
				"singular_name" => __( "Trucking", "" ),
			);

			$args = array(
				"label"               => __( "Truckings", "" ),
				"labels"              => $labels,
				"description"         => "",
				"public"              => true,
				"publicly_queryable"  => true,
				"show_ui"             => true,
				"show_in_rest"        => false,
				"rest_base"           => "",
				"has_archive"         => false,
				"show_in_menu"        => "edit.php?post_type=forwarder",
				"show_in_nav_menus"   => true,
				"exclude_from_search" => false,
				"capability_type"     => "post",
				"map_meta_cap"        => true,
				"hierarchical"        => false,
				"rewrite"             => array( "slug" => "truck", "with_front" => true ),
				"query_var"           => true,
				"menu_icon"           => "dashicons-image-filter",
				"supports"            => false,
			);

			register_post_type( "truck", $args );
		}
	}
}