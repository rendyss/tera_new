<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/16/2019
 * Time: 2:35 PM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Class_Tera_CF' ) ) {
	class Class_Tera_CF {
		static function init() {
			static $instance = null;
			if ( $instance === null ) {
				$instance = new self();
			}

			return $instance;
		}

		private function __construct() {
			$this->_register_cf();
		}

		private function _register_cf() {
			add_filter( 'rwmb_meta_boxes', array( $this, '_register_cf_callback' ) );
		}

		function _register_cf_callback() {
			$meta_boxes[] = array(
				'id'         => 'tera_testimonial',
				'title'      => esc_html__( 'Testimonial' ),
				'post_types' => 'testi',
				'context'    => 'normal',
				'priority'   => 'high',
				'autosave'   => true,
				'fields'     => array(
					array(
						'name' => esc_html__( 'Name' ),
						'id'   => 'name',
						'type' => 'text',
					),
					array(
						'name' => esc_html__( 'Location' ),
						'id'   => 'location',
						'type' => 'text',
					),
					array(
						'name'             => esc_html__( 'Picture' ),
						'id'               => 'picture',
						'type'             => 'image_advanced',
						'max_file_uploads' => 1,
						'max_status'       => false
					),
					array(
						'name' => esc_html__( 'Content' ),
						'id'   => 'content',
						'type' => 'textarea',
						'rows' => 5
					),
//					// CHECKBOX
//					array(
//						'name' => esc_html__( 'Checkbox', 'textdomain' ),
//						'id'   => "{$prefix}checkbox",
//						'type' => 'checkbox',
//						// Value can be 0 or 1
//						'std'  => 1,
//					),
//					// RADIO BUTTONS
//					array(
//						'name'    => esc_html__( 'Radio', 'textdomain' ),
//						'id'      => "{$prefix}radio",
//						'type'    => 'radio',
//						// Array of 'value' => 'Label' pairs for radio options.
//						// Note: the 'value' is stored in meta field, not the 'Label'
//						'options' => array(
//							'value1' => esc_html__( 'Label1', 'textdomain' ),
//							'value2' => esc_html__( 'Label2', 'textdomain' ),
//						),
//					),
//					// SELECT BOX
//					array(
//						'name'            => esc_html__( 'Select', 'textdomain' ),
//						'id'              => "{$prefix}select",
//						'type'            => 'select',
//						// Array of 'value' => 'Label' pairs for select box
//						'options'         => array(
//							'java'       => esc_html__( 'Java', 'textdomain' ),
//							'javascript' => esc_html__( 'JavaScript', 'textdomain' ),
//							'php'        => esc_html__( 'PHP', 'textdomain' ),
//							'csharp'     => esc_html__( 'C#', 'textdomain' ),
//							'objectivec' => esc_html__( 'Objective-C', 'textdomain' ),
//							'kotlin'     => esc_html__( 'Kotlin', 'textdomain' ),
//							'swift'      => esc_html__( 'Swift', 'textdomain' ),
//						),
//						// Select multiple values, optional. Default is false.
//						'multiple'        => true,
//						'std'             => 'value2',
//						'placeholder'     => esc_html__( 'Select an Item', 'textdomain' ),
//						'select_all_none' => true,
//					),
//					// HIDDEN
//					array(
//						'id'   => "{$prefix}hidden",
//						'type' => 'hidden',
//						// Hidden field must have predefined value
//						'std'  => esc_html__( 'Hidden value', 'textdomain' ),
//					),
//					// PASSWORD
//					array(
//						'name' => esc_html__( 'Password', 'textdomain' ),
//						'id'   => "{$prefix}password",
//						'type' => 'password',
//					),
//					// TEXTAREA
//					array(
//						'name' => esc_html__( 'Textarea', 'textdomain' ),
//						'desc' => esc_html__( 'Textarea description', 'textdomain' ),
//						'id'   => "{$prefix}textarea",
//						'type' => 'textarea',
//						'cols' => 20,
//						'rows' => 3,
//					),
				),
//				'validation' => array(
//					'rules'    => array(
//						"{$prefix}password" => array(
//							'required'  => true,
//							'minlength' => 7,
//						),
//					),
//					// optional override of default jquery.validate messages
//					'messages' => array(
//						"{$prefix}password" => array(
//							'required'  => esc_html__( 'Password is required', 'textdomain' ),
//							'minlength' => esc_html__( 'Password must be at least 7 characters', 'textdomain' ),
//						),
//					),
//				),
			);

//			// 2nd meta box
//			$meta_boxes[] = array(
//				'title'  => esc_html__( 'Advanced Fields', 'textdomain' ),
//				'fields' => array(
//					// HEADING
//					array(
//						'type' => 'heading',
//						'name' => esc_html__( 'Heading', 'textdomain' ),
//						'desc' => esc_html__( 'Optional description for this heading', 'textdomain' ),
//					),
//					// SLIDER
//					array(
//						'name'       => esc_html__( 'Slider', 'textdomain' ),
//						'id'         => "{$prefix}slider",
//						'type'       => 'slider',
//						// Text labels displayed before and after value
//						'prefix'     => esc_html__( '$', 'textdomain' ),
//						'suffix'     => esc_html__( ' USD', 'textdomain' ),
//						// jQuery UI slider options. See here http://api.jqueryui.com/slider/
//						'js_options' => array(
//							'min'  => 10,
//							'max'  => 255,
//							'step' => 5,
//						),
//						// Default value
//						'std'        => 155,
//					),
//					// NUMBER
//					array(
//						'name' => esc_html__( 'Number', 'textdomain' ),
//						'id'   => "{$prefix}number",
//						'type' => 'number',
//						'min'  => 0,
//						'step' => 5,
//					),
//					// DATE
//					array(
//						'name'       => esc_html__( 'Date picker', 'textdomain' ),
//						'id'         => "{$prefix}date",
//						'type'       => 'date',
//						// Date picker options. See here http://api.jqueryui.com/datepicker
//						'js_options' => array(
//							'dateFormat'      => 'yy-mm-dd',
//							'showButtonPanel' => false,
//						),
//						// Display inline?
//						'inline'     => false,
//						// Save value as timestamp?
//						'timestamp'  => false,
//					),
//					// DATETIME
//					array(
//						'name'       => esc_html__( 'Datetime picker', 'textdomain' ),
//						'id'         => $prefix . 'datetime',
//						'type'       => 'datetime',
//						// jQuery datetime picker options.
//						// For date options, see here http://api.jqueryui.com/datepicker
//						// For time options, see here http://trentrichardson.com/examples/timepicker/
//						'js_options' => array(
//							'stepMinute'      => 15,
//							'showTimepicker'  => true,
//							'controlType'     => 'select',
//							'showButtonPanel' => false,
//							'oneLine'         => true,
//						),
//					),
//					// TIME
//					array(
//						'name'       => esc_html__( 'Time picker', 'textdomain' ),
//						'id'         => $prefix . 'time',
//						'type'       => 'time',
//						// jQuery datetime picker options.
//						// For date options, see here http://api.jqueryui.com/datepicker
//						// For time options, see here http://trentrichardson.com/examples/timepicker/
//						'js_options' => array(
//							'stepMinute'  => 5,
//							// 'showSecond' => true,
//							// 'stepSecond' => 10,
//							'controlType' => 'select',
//						),
//						'inline'     => true,
//					),
//					// COLOR
//					array(
//						'name'          => esc_html__( 'Color picker', 'textdomain' ),
//						'id'            => 'field_id',
//						'type'          => 'color',
//						// Add alpha channel?
//						'alpha_channel' => true,
//						// Color picker options. See here: https://automattic.github.io/Iris/.
//						'js_options'    => array(
//							'palettes' => array( '#125', '#459', '#78b', '#ab0', '#de3', '#f0f' )
//						),
//					),
//					// CHECKBOX LIST
//					array(
//						'name'            => esc_html__( 'Checkbox list', 'textdomain' ),
//						'id'              => "{$prefix}checkbox_list",
//						'type'            => 'checkbox_list',
//						// Options of checkboxes, in format 'value' => 'Label'
//						'options'         => array(
//							'java'       => esc_html__( 'Java', 'textdomain' ),
//							'javascript' => esc_html__( 'JavaScript', 'textdomain' ),
//							'php'        => esc_html__( 'PHP', 'textdomain' ),
//							'csharp'     => esc_html__( 'C#', 'textdomain' ),
//							'objectivec' => esc_html__( 'Objective-C', 'textdomain' ),
//							'kotlin'     => esc_html__( 'Kotlin', 'textdomain' ),
//							'swift'      => esc_html__( 'Swift', 'textdomain' ),
//						),
//						// Display options in a single row?
//						// 'inline' => true,
//						// Display "Select All / None" button?
//						'select_all_none' => true,
//					),
//					// AUTOCOMPLETE
//					array(
//						'name'    => esc_html__( 'Autocomplete', 'textdomain' ),
//						'id'      => "{$prefix}autocomplete",
//						'type'    => 'autocomplete',
//						// Options of autocomplete, in format 'value' => 'Label'
//						'options' => array(
//							'java'       => esc_html__( 'Java', 'textdomain' ),
//							'javascript' => esc_html__( 'JavaScript', 'textdomain' ),
//							'php'        => esc_html__( 'PHP', 'textdomain' ),
//							'c'          => esc_html__( 'C', 'textdomain' ),
//							'cplusplus'  => esc_html__( 'C++', 'textdomain' ),
//							'csharp'     => esc_html__( 'C#', 'textdomain' ),
//							'objectivec' => esc_html__( 'Objective-C', 'textdomain' ),
//							'kotlin'     => esc_html__( 'Kotlin', 'textdomain' ),
//							'swift'      => esc_html__( 'Swift', 'textdomain' ),
//						),
//						// Input size
//						'size'    => 30,
//						// Clone?
//						// 'clone'   => true,
//					),
//					// RANGE
//					array(
//						'name' => esc_html__( 'Range', 'textdomain' ),
//						'id'   => "{$prefix}range",
//						'desc' => esc_html__( 'Range description', 'textdomain' ),
//						'type' => 'range',
//						'min'  => 0,
//						'max'  => 100,
//						'step' => 5,
//						'std'  => 0,
//					),
//					// OEMBED
//					array(
//						'name' => esc_html__( 'oEmbed', 'textdomain' ),
//						'id'   => "{$prefix}oembed",
//						'desc' => esc_html__( 'oEmbed description', 'textdomain' ),
//						'type' => 'oembed',
//					),
//					// SELECT ADVANCED BOX
//					array(
//						'name'            => esc_html__( 'Select', 'textdomain' ),
//						'id'              => "{$prefix}select_advanced",
//						'type'            => 'select_advanced',
//						// Array of 'value' => 'Label' pairs for select box
//						'options'         => array(
//							'java'       => esc_html__( 'Java', 'textdomain' ),
//							'javascript' => esc_html__( 'JavaScript', 'textdomain' ),
//							'php'        => esc_html__( 'PHP', 'textdomain' ),
//							'csharp'     => esc_html__( 'C#', 'textdomain' ),
//							'objectivec' => esc_html__( 'Objective-C', 'textdomain' ),
//							'kotlin'     => esc_html__( 'Kotlin', 'textdomain' ),
//							'swift'      => esc_html__( 'Swift', 'textdomain' ),
//						),
//						// Select multiple values, optional. Default is false.
//						'multiple'        => true,
//						// 'std'         => 'value2', // Default value, optional
//						'placeholder'     => esc_html__( 'Select an Item', 'textdomain' ),
//						'select_all_none' => true,
//					),
//					// TAXONOMY
//					array(
//						'name'       => esc_html__( 'Taxonomy', 'textdomain' ),
//						'id'         => "{$prefix}taxonomy",
//						'type'       => 'taxonomy',
//						// Taxonomy name
//						'taxonomy'   => 'category',
//						// How to show taxonomy: 'checkbox_list' (default) or 'checkbox_tree', 'select_tree', select_advanced or 'select'. Optional
//						'field_type' => 'select_tree',
//						// 'inline' => false,
//						// Additional arguments for get_terms() function. Optional
//						'query_args' => array(),
//					),
//					// TAXONOMY ADVANCED
//					array(
//						'name'       => esc_html__( 'Taxonomy Advanced', 'textdomain' ),
//						'id'         => "{$prefix}taxonomy_advanced",
//						'type'       => 'taxonomy_advanced',
//						// Can this be cloned?
//						'clone'      => true,
//						// Taxonomy name
//						'taxonomy'   => 'category',
//						// How to show taxonomy: 'checkbox_list' (default) or 'checkbox_tree', 'select_tree', select_advanced or 'select'. Optional
//						'field_type' => 'select_tree',
//						// Additional arguments for get_terms() function. Optional
//						'query_args' => array(),
//					),
//					// POST
//					array(
//						'name'        => esc_html__( 'Posts (Pages)', 'textdomain' ),
//						'id'          => "{$prefix}pages",
//						'type'        => 'post',
//						// Post type
//						'post_type'   => 'page',
//						// Field type, either 'select' or 'select_advanced' (default)
//						'field_type'  => 'select_advanced',
//						'placeholder' => esc_html__( 'Select an Item', 'textdomain' ),
//						// Query arguments (optional). No settings means get all published posts
//						'query_args'  => array(
//							'post_status'    => 'publish',
//							'posts_per_page' => - 1,
//						),
//					),
//					// WYSIWYG/RICH TEXT EDITOR
//					array(
//						'name'    => esc_html__( 'WYSIWYG / Rich Text Editor', 'textdomain' ),
//						'id'      => "{$prefix}wysiwyg",
//						'type'    => 'wysiwyg',
//						// Set the 'raw' parameter to TRUE to prevent data being passed through wpautop() on save
//						'raw'     => false,
//						'std'     => esc_html__( 'WYSIWYG default value', 'textdomain' ),
//						// Editor settings, see wp_editor() function: look4wp.com/wp_editor
//						'options' => array(
//							'textarea_rows' => 4,
//							'teeny'         => true,
//							// 'media_buttons' => false,
//						),
//					),
//					// DIVIDER
//					array(
//						'type' => 'divider',
//					),
//					// FILE UPLOAD
//					array(
//						'name' => esc_html__( 'File Upload', 'textdomain' ),
//						'id'   => "{$prefix}file",
//						'type' => 'file',
//					),
//					// FILE ADVANCED (WP 3.5+)
//					array(
//						'name'             => esc_html__( 'File Advanced Upload', 'textdomain' ),
//						'id'               => "{$prefix}file_advanced",
//						'type'             => 'file_advanced',
//						// Delete file from Media Library when remove it from post meta?
//						// Note: it might affect other posts if you use same file for multiple posts
//						'force_delete'     => false,
//						// Maximum file uploads.
//						'max_file_uploads' => 2,
//						// File types.
//						// 'mime_type'        => 'application,audio,video',
//						// Do not show how many files uploaded/remaining.
//						'max_status'       => 'false',
//					),
//					array(
//						'name' => __( 'Single Image', 'textdomain' ),
//						'id'   => "{$prefix}single_img",
//						'type' => 'single_image',
//						// 'clone' => true,
//					),
//					// IMAGE ADVANCED - RECOMMENDED
//					array(
//						'name'             => esc_html__( 'Image Advanced Upload (Recommended)', 'textdomain' ),
//						'id'               => "{$prefix}imgadv",
//						'type'             => 'image_advanced',
//						// Delete image from Media Library when remove it from post meta?
//						// Note: it might affect other posts if you use same image for multiple posts
//						'force_delete'     => false,
//						// Maximum image uploads
//						'max_file_uploads' => 2,
//						// Display the "Uploaded 1/2 files" status
//						'max_status'       => true,
//						// Image size that displays in the edit page.
//						'image_size'       => 'thumbnail',
//					),
//					// IMAGE UPLOAD
//					array(
//						'id'               => 'image_upload',
//						'name'             => esc_html__( 'Image Upload', 'textdomain' ),
//						'type'             => 'image_upload',
//						// Delete image from Media Library when remove it from post meta?
//						// Note: it might affect other posts if you use same image for multiple posts
//						'force_delete'     => false,
//						// Maximum image uploads
//						'max_file_uploads' => 2,
//						// Display the "Uploaded 1/2 files" status
//						'max_status'       => true,
//					),
//					// PLUPLOAD IMAGE UPLOAD (ALIAS OF IMAGE UPLOAD)
//					array(
//						'name'             => esc_html__( 'Plupload Image (Alias of Image Upload)', 'textdomain' ),
//						'id'               => "{$prefix}plupload",
//						'type'             => 'plupload_image',
//						// Delete image from Media Library when remove it from post meta?
//						// Note: it might affect other posts if you use same image for multiple posts
//						'force_delete'     => false,
//						// Maximum image uploads
//						'max_file_uploads' => 2,
//						// Display the "Uploaded 1/2 files" status
//						'max_status'       => true,
//					),
//					// IMAGE
//					array(
//						'name'         => esc_html__( 'Image Upload', 'textdomain' ),
//						'id'           => "image",
//						'type'         => 'image',
//						// Delete image from Media Library when remove it from post meta?
//						// Note: it might affect other posts if you use same image for multiple posts
//						'force_delete' => false,
//						// Maximum image uploads
//						// 'max_file_uploads' => 2,
//					),
//					// VIDEO
//					array(
//						'name'             => __( 'Video', 'textdomain' ),
//						'id'               => 'video',
//						'type'             => 'video',
//						// Maximum video uploads. 0 = unlimited.
//						'max_file_uploads' => 3,
//						// Delete image from Media Library when remove it from post meta?
//						// Note: it might affect other posts if you use same image for multiple posts
//						'force_delete'     => false,
//						// Display the "Uploaded 1/3 files" status
//						'max_status'       => true,
//					),
//					// BUTTON
//					array(
//						'type'       => 'button',
//						'name'       => esc_html__( 'Advanced Settings', 'textdomain' ),
//						// Button text.
//						'std'        => esc_html__( 'Toggle', 'textdomain' ),
//						// Custom HTML attributes.
//						'attributes' => array(
//							'data-section' => 'advanced-section',
//							'class'        => 'js-toggle',
//						),
//					),
//					// TEXT-LIST
//					array(
//						'name'    => esc_html__( 'Text List', 'rwmb' ),
//						'id'      => "{$prefix}text_list",
//						'type'    => 'text_list',
//						// Options of inputs, in format 'Placeholder' => 'Label'
//						'options' => array(
//							'Placehold1' => esc_html__( 'Label1', 'rwmb' ),
//							'Placehold2' => esc_html__( 'Label2', 'rwmb' ),
//							'Placehold3' => esc_html__( 'Label3', 'rwmb' ),
//						),
//					),
//					// Switch
//					array(
//						'type'      => 'switch',
//						'name'      => esc_html__( 'Switch demo', 'textdomain' ),
//						'id'        => "{$prefix}switch",
//						// Value can be 0 or 1
//						'std'       => 1,
//						// 2 style: rounded and square
//						'style'     => 'square',
//						'on_label'  => 'On',
//						'off_label' => 'Off',
//					),
//					// Button group
//					array(
//						'name'       => esc_html__( 'button group', 'textdomain' ),
//						'id'         => "button_group",
//						'type'       => 'button_group',
//						// Array of 'value' => 'Label' pairs for radio options.
//						// Note: the 'value' is stored in meta field, not the 'Label'
//						'options'    => array(
//							'value1' => esc_html__( 'Button 1', 'textdomain' ),
//							'value2' => esc_html__( 'Button 2', 'textdomain' ),
//							'value3' => esc_html__( 'Button 3', 'textdomain' ),
//							'value4' => esc_html__( 'Button 4', 'textdomain' ),
//							'value5' => esc_html__( 'Button 5', 'textdomain' ),
//						),
//						// style defause wordpress button
//						'attributes' => array(
//							'class' => 'button',
//						),
//						// Display inline? value : true - false
//						'inline'     => true,
//						// Display multiple? value : true - false
//						'multiple'   => true,
//						'clone'      => true,
//					),
//					// background
//					array(
//						'name' => __( 'Background Advanced', 'textdomain' ),
//						'id'   => 'background_demo',
//						'type' => 'background',
//					),
//				),
//			);

			return $meta_boxes;
		}
	}
}