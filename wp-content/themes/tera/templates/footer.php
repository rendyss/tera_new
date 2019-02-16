<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2/16/2019
 * Time: 10:39 PM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} ?>

<?php $loginPage   = get_page_by_path( 'login' );
$createAccountPage = get_page_by_path( 'create-account' );
if ( get_the_ID() != $loginPage->ID && get_the_ID() != $createAccountPage->ID ) : ?>
    <footer>
        <div class="container">
            <div class="row">
<!--				--><?php //if ( have_rows( 'columns_f', 'options' ) ) :
//					while ( have_rows( 'columns_f', 'options' ) ) : the_row(); ?>
<!--                        <div class="col-sm-3">-->
<!--							--><?php //$rnum = 0;
//							if ( have_rows( 'rows' ) ):
//								while ( have_rows( 'rows' ) ): the_row(); ?>
<!--                                    <div class="foot-menu --><?php //echo $rnum > 0 ? "mt30" : ""; ?><!--">-->
<!--										--><?php //echo get_sub_field( 'title' ) ? "<h3 class=\"foot-title\">" . get_sub_field( 'title' ) . "</h3>" : ""; ?>
<!--										--><?php //$links = get_sub_field( 'links' );
//										if ( ! empty( $links ) ) : ?>
<!--                                            <ul>-->
<!--												--><?php //foreach ( $links as $lid ) :
//													$ext_link = $lid['external_link'];
//													$lcaption = $lid['caption'];
//													$llink = $ext_link ? $lid['ext_link'] : $lid['link'];
//													$css_class = $lid['extra_css_class']; ?>
<!--                                                    <li>-->
<!--														--><?php //echo "<a href=\"$llink\" class=\"$css_class\">$lcaption</a>"; ?>
<!--                                                    </li>-->
<!--												--><?php //endforeach; ?>
<!--                                            </ul>-->
<!--										--><?php //endif; ?>
<!--                                    </div>-->
<!--									--><?php //$rnum ++;
//								endwhile;
//							endif; ?>
<!--                        </div>-->
<!--					--><?php //endwhile;
//				endif; ?>
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-md-6 col-sm-12">
                            <h3 class="foot-title">Follow</h3>
                            <div class="social">
<!--								--><?php //echo get_field( 'facebook_n', 'options' ) ? "<a target=\"_blank\" href=\"" . get_field( 'facebook_n', 'options' ) . "\" class=\"fa fa-facebook\"></a>" : ""; ?>
<!--								--><?php //echo get_field( 'twitter_n', 'options' ) ? "<a target=\"_blank\" href=\"" . get_field( 'twitter_n', 'options' ) . "\" class=\"fa fa-twitter\"></a>" : ""; ?>
<!--								--><?php //echo get_field( 'linkedin_n', 'options' ) ? "<a target=\"_blank\" href=\"" . get_field( 'linkedin_n', 'options' ) . "\" class=\"fa fa-linkedin\"></a>" : ""; ?>
                            </div>
<!--							--><?php //if ( have_rows( 'bank_accounts', 'options' ) ) { ?>
<!--                                <h3 class="foot-title">Bank Transfer</h3>-->
<!--                                <div class="payment">-->
<!--									--><?php //while ( have_rows( 'bank_accounts', 'options' ) ) : the_row();
//										$blogo = get_sub_field( 'logo' );
//										if ( ! $blogo ) {
//											continue;
//										} ?>
<!--                                        <div class="col">-->
<!--                                            <div class="box-logo">-->
<!--                                                <img src="--><?php //echo wp_get_attachment_image_url( $blogo, 'medium' ); ?><!--">-->
<!--                                            </div>-->
<!--                                        </div>-->
<!--									--><?php //endwhile; ?>
<!--                                </div>-->
<!--							--><?php //} ?>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <h3 class="foot-title">Subscribe to our newsletter</h3>
                            <div class="subscribe">
                                <div id="qwenotice"></div>
                                <form class="form-subscribe" id="fdosubs" method="post">
                                    <input class="form-control" type="email" name="eml"
                                           placeholder="Enter your email address" required>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-12 copyright">
                    <p>&copy; <?php echo date( 'Y' ); ?> <?php bloginfo( 'name' ); ?>. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
<?php endif; ?>
<script>
    var $ = jQuery.noConflict();
</script>
<?php wp_footer(); ?>
</body>
</html>
