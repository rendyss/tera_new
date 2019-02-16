<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/16/2019
 * Time: 10:27 PM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} ?>

<!doctype html>
<html lang="">
<head>
	<?php wp_head(); ?>
</head>

<body>
<div id="preloading"></div>

<header class="head-w">
    <div class="container">
<!--        <h1 class="logo"><a href="home.html"><img src="images/logo-tera.svg" alt="Tera Logistics"></a></h1>-->
        <div class="icon-menu">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <nav>
            <ul class="main-menu">
                <li class="has-sub">
                    <a href="forwarders.html">Browse Providers</a>
                    <ul class="sub-menu has-img">
                        <li>
                            <a href="forwarders.html" class="box-img">
                                <div class="img">
<!--                                    <img src="images/icon-forwarders.svg">-->
                                </div>
                            </a>
                            <div class="content">
                                <a href="forwarders.html">Forwarders</a>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                            </div>
                        </li>
                        <li>
                            <a href="forwarders.html" class="box-img">
                                <div class="img">
<!--                                    <img src="images/icon-warehouses.svg">-->
                                </div>
                            </a>
                            <div class="content">
                                <a href="forwarders.html">Warehouse</a>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                            </div>
                        </li>
                        <li>
                            <a href="forwarders.html" class="box-img">
                                <div class="img">
<!--                                    <img src="images/icon-trucking.svg">-->
                                </div>
                            </a>
                            <div class="content">
                                <a href="forwarders.html">Trucking</a>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                            </div>
                        </li>
                    </ul>
                </li>
                <!-- <li class="has-sub"><a href="about.html">About Tera</a>
					<ul class="sub-menu">
						<li><a href="#">Browse Forwarders</a></li>
						<li><a href="#">Why use Tera Logistics</a></li>
						<li><a href="#">About Tera Logistics</a></li>
					</ul>
				</li> -->
                <li><a href="freight-rate.html">Freight Rate</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="faqs.html">FAQs</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <ul class="account-menu">
                <!-- <li><a href="tel:+62213505350"><i class="fa fa-phone" aria-hidden="true"></i> +62-21 350 5350</a></li> -->
                <li><a href="login.html">Login</a></li>
                <li class="menu-btn"><a href="signup.html">Create account</a></li>
            </ul>
        </nav>
    </div>
</header>

<main>
