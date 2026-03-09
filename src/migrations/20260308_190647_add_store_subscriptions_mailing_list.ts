import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_rich_text_max_width" AS ENUM('600', '800', '1000', 'full');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_image_size" AS ENUM('small', 'medium', 'large', 'full');
  CREATE TYPE "public"."enum_pages_blocks_image_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_video_embed_size" AS ENUM('medium', 'large', 'full');
  CREATE TYPE "public"."enum_pages_blocks_cta_button_style" AS ENUM('accent', 'dark', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_cta_style" AS ENUM('light', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_cta_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_artist_list_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_button_buttons_style" AS ENUM('accent', 'dark', 'outline-dark', 'outline-light');
  CREATE TYPE "public"."enum_pages_blocks_button_buttons_size" AS ENUM('sm', 'normal', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_button_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_mailing_list_style" AS ENUM('light', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_donation_style" AS ENUM('light', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_embed_max_width" AS ENUM('400', '600', '800', 'full');
  CREATE TYPE "public"."enum_pages_blocks_calendar_default_view" AS ENUM('month', 'list');
  CREATE TYPE "public"."enum_pages_blocks_file_download_style" AS ENUM('list', 'cards');
  CREATE TYPE "public"."enum_pages_blocks_columns_layout" AS ENUM('half-half', 'thirds', 'quarters', 'two-thirds-one-third', 'one-third-two-thirds', 'three-quarters-one-quarter', 'one-quarter-three-quarters');
  CREATE TYPE "public"."enum_pages_blocks_columns_vertical_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_columns_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_section_style" AS ENUM('light', 'dark', 'muted', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_section_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_section_container_width" AS ENUM('narrow', 'default', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_grid_items_col_span" AS ENUM('1', '2', '3', '4', 'full');
  CREATE TYPE "public"."enum_pages_blocks_grid_columns" AS ENUM('1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum_pages_blocks_grid_mobile_columns" AS ENUM('1', '2');
  CREATE TYPE "public"."enum_pages_blocks_grid_tablet_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum_pages_blocks_grid_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_grid_vertical_alignment" AS ENUM('start', 'center', 'end', 'stretch');
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('home', 'general', 'artists', 'events', 'store', 'video-gallery', 'music', 'contact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_max_width" AS ENUM('600', '800', '1000', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_image_size" AS ENUM('small', 'medium', 'large', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_image_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_video_embed_size" AS ENUM('medium', 'large', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_button_style" AS ENUM('accent', 'dark', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_style" AS ENUM('light', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_artist_list_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_button_buttons_style" AS ENUM('accent', 'dark', 'outline-dark', 'outline-light');
  CREATE TYPE "public"."enum__pages_v_blocks_button_buttons_size" AS ENUM('sm', 'normal', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_button_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_mailing_list_style" AS ENUM('light', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_donation_style" AS ENUM('light', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_embed_max_width" AS ENUM('400', '600', '800', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_calendar_default_view" AS ENUM('month', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_file_download_style" AS ENUM('list', 'cards');
  CREATE TYPE "public"."enum__pages_v_blocks_columns_layout" AS ENUM('half-half', 'thirds', 'quarters', 'two-thirds-one-third', 'one-third-two-thirds', 'three-quarters-one-quarter', 'one-quarter-three-quarters');
  CREATE TYPE "public"."enum__pages_v_blocks_columns_vertical_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_columns_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_section_style" AS ENUM('light', 'dark', 'muted', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_section_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_section_container_width" AS ENUM('narrow', 'default', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_items_col_span" AS ENUM('1', '2', '3', '4', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_columns" AS ENUM('1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_mobile_columns" AS ENUM('1', '2');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_tablet_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_vertical_alignment" AS ENUM('start', 'center', 'end', 'stretch');
  CREATE TYPE "public"."enum__pages_v_version_page_type" AS ENUM('home', 'general', 'artists', 'events', 'store', 'video-gallery', 'music', 'contact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_artists_social_links_platform" AS ENUM('facebook', 'instagram', 'twitter', 'youtube', 'spotify', 'apple-music', 'soundcloud', 'bandcamp');
  CREATE TYPE "public"."enum_videos_platform" AS ENUM('vimeo', 'youtube');
  CREATE TYPE "public"."enum_site_themes_typography_heading_font" AS ENUM('Open Sans', 'Montserrat', 'Playfair Display', 'Roboto', 'Lato', 'Poppins', 'Raleway', 'Merriweather', 'Oswald', 'Georgia');
  CREATE TYPE "public"."enum_site_themes_typography_body_font" AS ENUM('Assistant', 'Open Sans', 'Roboto', 'Lato', 'Source Sans 3', 'Inter', 'Nunito', 'PT Sans');
  CREATE TYPE "public"."enum_site_themes_typography_heading_weight" AS ENUM('400', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_themes_typography_line_height" AS ENUM('1.4', '1.6', '1.8');
  CREATE TYPE "public"."enum_site_themes_navigation_text_transform" AS ENUM('uppercase', 'none', 'capitalize');
  CREATE TYPE "public"."enum_site_themes_navigation_font_weight" AS ENUM('400', '600', '700');
  CREATE TYPE "public"."enum_site_themes_navigation_letter_spacing" AS ENUM('0', '0.5', '1', '1.5');
  CREATE TYPE "public"."enum_site_themes_hero_overlay_opacity" AS ENUM('0', '0.2', '0.35', '0.5', '0.6', '0.8');
  CREATE TYPE "public"."enum_site_themes_buttons_border_radius" AS ENUM('0', '4', '8', '50');
  CREATE TYPE "public"."enum_site_themes_buttons_padding_x" AS ENUM('0.75', '1.5', '2.5');
  CREATE TYPE "public"."enum_site_themes_buttons_padding_y" AS ENUM('0.4', '0.6', '0.8');
  CREATE TYPE "public"."enum_site_themes_buttons_font_weight" AS ENUM('400', '600', '700');
  CREATE TYPE "public"."enum_site_themes_buttons_text_transform" AS ENUM('none', 'uppercase');
  CREATE TYPE "public"."enum_site_themes_spacing_section_padding" AS ENUM('2', '4', '5', '6');
  CREATE TYPE "public"."enum_site_themes_spacing_container_width" AS ENUM('960', '1200', '1400');
  CREATE TYPE "public"."enum_site_themes_mobile_section_padding" AS ENUM('1.5', '2.5', '3.5');
  CREATE TYPE "public"."enum_site_themes_tablet_section_padding" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_site_themes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_themes_v_version_typography_heading_font" AS ENUM('Open Sans', 'Montserrat', 'Playfair Display', 'Roboto', 'Lato', 'Poppins', 'Raleway', 'Merriweather', 'Oswald', 'Georgia');
  CREATE TYPE "public"."enum__site_themes_v_version_typography_body_font" AS ENUM('Assistant', 'Open Sans', 'Roboto', 'Lato', 'Source Sans 3', 'Inter', 'Nunito', 'PT Sans');
  CREATE TYPE "public"."enum__site_themes_v_version_typography_heading_weight" AS ENUM('400', '600', '700', '800', '900');
  CREATE TYPE "public"."enum__site_themes_v_version_typography_line_height" AS ENUM('1.4', '1.6', '1.8');
  CREATE TYPE "public"."enum__site_themes_v_version_navigation_text_transform" AS ENUM('uppercase', 'none', 'capitalize');
  CREATE TYPE "public"."enum__site_themes_v_version_navigation_font_weight" AS ENUM('400', '600', '700');
  CREATE TYPE "public"."enum__site_themes_v_version_navigation_letter_spacing" AS ENUM('0', '0.5', '1', '1.5');
  CREATE TYPE "public"."enum__site_themes_v_version_hero_overlay_opacity" AS ENUM('0', '0.2', '0.35', '0.5', '0.6', '0.8');
  CREATE TYPE "public"."enum__site_themes_v_version_buttons_border_radius" AS ENUM('0', '4', '8', '50');
  CREATE TYPE "public"."enum__site_themes_v_version_buttons_padding_x" AS ENUM('0.75', '1.5', '2.5');
  CREATE TYPE "public"."enum__site_themes_v_version_buttons_padding_y" AS ENUM('0.4', '0.6', '0.8');
  CREATE TYPE "public"."enum__site_themes_v_version_buttons_font_weight" AS ENUM('400', '600', '700');
  CREATE TYPE "public"."enum__site_themes_v_version_buttons_text_transform" AS ENUM('none', 'uppercase');
  CREATE TYPE "public"."enum__site_themes_v_version_spacing_section_padding" AS ENUM('2', '4', '5', '6');
  CREATE TYPE "public"."enum__site_themes_v_version_spacing_container_width" AS ENUM('960', '1200', '1400');
  CREATE TYPE "public"."enum__site_themes_v_version_mobile_section_padding" AS ENUM('1.5', '2.5', '3.5');
  CREATE TYPE "public"."enum__site_themes_v_version_tablet_section_padding" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__site_themes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_products_product_type" AS ENUM('physical', 'digital', 'printful');
  CREATE TYPE "public"."enum_subscription_plans_billing_interval" AS ENUM('monthly', 'quarterly', 'annual');
  CREATE TYPE "public"."enum_customer_subscriptions_status" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete');
  CREATE TYPE "public"."enum_discount_codes_discount_type" AS ENUM('percentage', 'fixed');
  CREATE TYPE "public"."enum_transactions_type" AS ENUM('payment', 'subscription', 'refund', 'donation', 'tip');
  CREATE TYPE "public"."enum_transactions_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded', 'disputed');
  CREATE TYPE "public"."enum_mailing_list_subscribers_status" AS ENUM('active', 'unsubscribed', 'bounced');
  CREATE TYPE "public"."enum_mailing_list_subscribers_source" AS ENUM('website', 'import', 'checkout', 'subscription');
  CREATE TYPE "public"."enum_users_tenants_roles" AS ENUM('editor', 'admin');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'content-provider');
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"max_width" "enum_pages_blocks_rich_text_max_width" DEFAULT '800',
  	"alignment" "enum_pages_blocks_rich_text_alignment" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"size" "enum_pages_blocks_image_size" DEFAULT 'medium',
  	"alignment" "enum_pages_blocks_image_alignment" DEFAULT 'center',
  	"link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_image_gallery_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"caption" varchar,
  	"size" "enum_pages_blocks_video_embed_size" DEFAULT 'large',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_music_playlist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"playlist_id" integer,
  	"show_cover_image" boolean DEFAULT true,
  	"show_description" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Learn More',
  	"button_link" varchar,
  	"button_style" "enum_pages_blocks_cta_button_style" DEFAULT 'accent',
  	"style" "enum_pages_blocks_cta_style" DEFAULT 'dark',
  	"alignment" "enum_pages_blocks_cta_alignment" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'medium',
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"default_open" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"link_label" varchar DEFAULT 'Learn More'
  );
  
  CREATE TABLE "pages_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_pages_blocks_card_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_artist_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"limit" numeric DEFAULT 12,
  	"columns" "enum_pages_blocks_artist_list_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_event_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"limit" numeric DEFAULT 10,
  	"show_past" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_button_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum_pages_blocks_button_buttons_style" DEFAULT 'accent',
  	"size" "enum_pages_blocks_button_buttons_size" DEFAULT 'normal',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"alignment" "enum_pages_blocks_button_alignment" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_mailing_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Stay in the Loop',
  	"description" varchar DEFAULT 'Sign up for our newsletter to get the latest news and updates.',
  	"button_label" varchar DEFAULT 'Subscribe',
  	"style" "enum_pages_blocks_mailing_list_style" DEFAULT 'dark',
  	"collect_name" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_donation_preset_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_donation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Support Our Work',
  	"description" varchar,
  	"allow_custom_amount" boolean DEFAULT true,
  	"button_label" varchar DEFAULT 'Donate',
  	"style" "enum_pages_blocks_donation_style" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tip_jar_preset_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"emoji" varchar
  );
  
  CREATE TABLE "pages_blocks_tip_jar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Leave a Tip',
  	"description" varchar DEFAULT 'Enjoyed the show? Leave a tip to support the artists.',
  	"allow_custom_amount" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"caption" varchar,
  	"max_width" "enum_pages_blocks_embed_max_width" DEFAULT '800',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_calendar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"show_past" boolean DEFAULT false,
  	"default_view" "enum_pages_blocks_calendar_default_view" DEFAULT 'month',
  	"months_to_show" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_file_download_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_file_download" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"style" "enum_pages_blocks_file_download_style" DEFAULT 'list',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_columns_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_columns_layout" DEFAULT 'half-half',
  	"vertical_alignment" "enum_pages_blocks_columns_vertical_alignment" DEFAULT 'top',
  	"gap" "enum_pages_blocks_columns_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_section_style" DEFAULT 'light',
  	"padding" "enum_pages_blocks_section_padding" DEFAULT 'medium',
  	"background_image_id" integer,
  	"container_width" "enum_pages_blocks_section_container_width" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"col_span" "enum_pages_blocks_grid_items_col_span" DEFAULT '1'
  );
  
  CREATE TABLE "pages_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_grid_columns" DEFAULT '3',
  	"mobile_columns" "enum_pages_blocks_grid_mobile_columns" DEFAULT '1',
  	"tablet_columns" "enum_pages_blocks_grid_tablet_columns" DEFAULT '2',
  	"gap" "enum_pages_blocks_grid_gap" DEFAULT 'medium',
  	"vertical_alignment" "enum_pages_blocks_grid_vertical_alignment" DEFAULT 'stretch',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar,
  	"slug" varchar,
  	"page_type" "enum_pages_page_type" DEFAULT 'general',
  	"content" jsonb,
  	"hero_image_id" integer,
  	"hero_headline" varchar,
  	"hero_subheadline" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"requires_subscription" boolean DEFAULT false,
  	"gated_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"max_width" "enum__pages_v_blocks_rich_text_max_width" DEFAULT '800',
  	"alignment" "enum__pages_v_blocks_rich_text_alignment" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"size" "enum__pages_v_blocks_image_size" DEFAULT 'medium',
  	"alignment" "enum__pages_v_blocks_image_alignment" DEFAULT 'center',
  	"link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_image_gallery_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"caption" varchar,
  	"size" "enum__pages_v_blocks_video_embed_size" DEFAULT 'large',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_music_playlist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"playlist_id" integer,
  	"show_cover_image" boolean DEFAULT true,
  	"show_description" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Learn More',
  	"button_link" varchar,
  	"button_style" "enum__pages_v_blocks_cta_button_style" DEFAULT 'accent',
  	"style" "enum__pages_v_blocks_cta_style" DEFAULT 'dark',
  	"alignment" "enum__pages_v_blocks_cta_alignment" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_spacer_size" DEFAULT 'medium',
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"default_open" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"link_label" varchar DEFAULT 'Learn More',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum__pages_v_blocks_card_grid_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_artist_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"limit" numeric DEFAULT 12,
  	"columns" "enum__pages_v_blocks_artist_list_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_event_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"limit" numeric DEFAULT 10,
  	"show_past" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_button_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar,
  	"style" "enum__pages_v_blocks_button_buttons_style" DEFAULT 'accent',
  	"size" "enum__pages_v_blocks_button_buttons_size" DEFAULT 'normal',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_button" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"alignment" "enum__pages_v_blocks_button_alignment" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mailing_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Stay in the Loop',
  	"description" varchar DEFAULT 'Sign up for our newsletter to get the latest news and updates.',
  	"button_label" varchar DEFAULT 'Subscribe',
  	"style" "enum__pages_v_blocks_mailing_list_style" DEFAULT 'dark',
  	"collect_name" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_donation_preset_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_donation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Support Our Work',
  	"description" varchar,
  	"allow_custom_amount" boolean DEFAULT true,
  	"button_label" varchar DEFAULT 'Donate',
  	"style" "enum__pages_v_blocks_donation_style" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tip_jar_preset_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"emoji" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tip_jar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Leave a Tip',
  	"description" varchar DEFAULT 'Enjoyed the show? Leave a tip to support the artists.',
  	"allow_custom_amount" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"caption" varchar,
  	"max_width" "enum__pages_v_blocks_embed_max_width" DEFAULT '800',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_calendar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"show_past" boolean DEFAULT false,
  	"default_view" "enum__pages_v_blocks_calendar_default_view" DEFAULT 'month',
  	"months_to_show" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_file_download_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_file_download" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"style" "enum__pages_v_blocks_file_download_style" DEFAULT 'list',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_columns_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_columns_layout" DEFAULT 'half-half',
  	"vertical_alignment" "enum__pages_v_blocks_columns_vertical_alignment" DEFAULT 'top',
  	"gap" "enum__pages_v_blocks_columns_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_section_style" DEFAULT 'light',
  	"padding" "enum__pages_v_blocks_section_padding" DEFAULT 'medium',
  	"background_image_id" integer,
  	"container_width" "enum__pages_v_blocks_section_container_width" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"col_span" "enum__pages_v_blocks_grid_items_col_span" DEFAULT '1',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_grid_columns" DEFAULT '3',
  	"mobile_columns" "enum__pages_v_blocks_grid_mobile_columns" DEFAULT '1',
  	"tablet_columns" "enum__pages_v_blocks_grid_tablet_columns" DEFAULT '2',
  	"gap" "enum__pages_v_blocks_grid_gap" DEFAULT 'medium',
  	"vertical_alignment" "enum__pages_v_blocks_grid_vertical_alignment" DEFAULT 'stretch',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_page_type" "enum__pages_v_version_page_type" DEFAULT 'general',
  	"version_content" jsonb,
  	"version_hero_image_id" integer,
  	"version_hero_headline" varchar,
  	"version_hero_subheadline" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_keywords" varchar,
  	"version_requires_subscription" boolean DEFAULT false,
  	"version_gated_message" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "navigation_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "artists_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_artists_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "artists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"bio" jsonb,
  	"photo_id" integer,
  	"genre" varchar,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tracks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"artist_id" integer NOT NULL,
  	"audio_file" varchar NOT NULL,
  	"duration" varchar,
  	"track_number" numeric,
  	"album_title" varchar,
  	"album_art_id" integer,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "playlists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "playlists_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tracks_id" integer
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"platform" "enum_videos_platform" DEFAULT 'vimeo',
  	"description" varchar,
  	"thumbnail_id" integer,
  	"artist_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"venue" varchar NOT NULL,
  	"address" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"ticket_price" numeric,
  	"ticket_url" varchar,
  	"is_sold_out" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"artists_id" integer
  );
  
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"organization" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"category" varchar,
  	"artist_id" integer,
  	"image_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "site_themes_site_profile_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "site_themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar DEFAULT 'Default Theme',
  	"site_profile_site_name" varchar,
  	"site_profile_site_icon_id" integer,
  	"site_profile_footer_text" varchar,
  	"seo_google_analytics_id" varchar,
  	"seo_google_search_console_verification" varchar,
  	"seo_default_meta_keywords" varchar,
  	"seo_custom_head_content" varchar,
  	"typography_heading_font" "enum_site_themes_typography_heading_font" DEFAULT 'Open Sans',
  	"typography_body_font" "enum_site_themes_typography_body_font" DEFAULT 'Assistant',
  	"typography_h1_size" numeric DEFAULT 40,
  	"typography_h2_size" numeric DEFAULT 32,
  	"typography_h3_size" numeric DEFAULT 26,
  	"typography_h4_size" numeric DEFAULT 22,
  	"typography_body_size" numeric DEFAULT 16,
  	"typography_heading_weight" "enum_site_themes_typography_heading_weight" DEFAULT '700',
  	"typography_line_height" "enum_site_themes_typography_line_height" DEFAULT '1.6',
  	"colors_primary" varchar DEFAULT '#1a1a2e',
  	"colors_accent" varchar DEFAULT '#1fa85d',
  	"colors_accent_hover" varchar DEFAULT '#5c24eb',
  	"colors_body_background" varchar DEFAULT '#ffffff',
  	"colors_body_text" varchar DEFAULT '#222222',
  	"colors_nav_background" varchar DEFAULT '#000000',
  	"colors_nav_text" varchar DEFAULT '#ffffffd9',
  	"colors_footer_background" varchar DEFAULT '#1a1a1a',
  	"colors_footer_text" varchar DEFAULT '#ffffffb3',
  	"colors_dark_section_bg" varchar DEFAULT '#3b3b3b',
  	"navigation_font_size" numeric DEFAULT 14,
  	"navigation_text_transform" "enum_site_themes_navigation_text_transform" DEFAULT 'uppercase',
  	"navigation_font_weight" "enum_site_themes_navigation_font_weight" DEFAULT '600',
  	"navigation_letter_spacing" "enum_site_themes_navigation_letter_spacing" DEFAULT '0.5',
  	"hero_height" numeric DEFAULT 70,
  	"hero_min_height" numeric DEFAULT 400,
  	"hero_max_height" numeric DEFAULT 700,
  	"hero_overlay_opacity" "enum_site_themes_hero_overlay_opacity" DEFAULT '0.5',
  	"hero_headline_size" numeric DEFAULT 2.8,
  	"hero_subheadline_size" numeric DEFAULT 1.2,
  	"buttons_border_radius" "enum_site_themes_buttons_border_radius" DEFAULT '4',
  	"buttons_padding_x" "enum_site_themes_buttons_padding_x" DEFAULT '1.5',
  	"buttons_padding_y" "enum_site_themes_buttons_padding_y" DEFAULT '0.6',
  	"buttons_font_weight" "enum_site_themes_buttons_font_weight" DEFAULT '600',
  	"buttons_text_transform" "enum_site_themes_buttons_text_transform" DEFAULT 'none',
  	"spacing_section_padding" "enum_site_themes_spacing_section_padding" DEFAULT '4',
  	"spacing_container_width" "enum_site_themes_spacing_container_width" DEFAULT '1200',
  	"mobile_h1_size" numeric,
  	"mobile_h2_size" numeric,
  	"mobile_h3_size" numeric,
  	"mobile_body_size" numeric,
  	"mobile_hero_height" numeric,
  	"mobile_hero_min_height" numeric,
  	"mobile_hero_headline_size" numeric,
  	"mobile_hero_subheadline_size" numeric,
  	"mobile_section_padding" "enum_site_themes_mobile_section_padding",
  	"mobile_nav_font_size" numeric,
  	"tablet_h1_size" numeric,
  	"tablet_h2_size" numeric,
  	"tablet_body_size" numeric,
  	"tablet_hero_height" numeric,
  	"tablet_hero_headline_size" numeric,
  	"tablet_section_padding" "enum_site_themes_tablet_section_padding",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_themes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_themes_v_version_site_profile_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_themes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_name" varchar DEFAULT 'Default Theme',
  	"version_site_profile_site_name" varchar,
  	"version_site_profile_site_icon_id" integer,
  	"version_site_profile_footer_text" varchar,
  	"version_seo_google_analytics_id" varchar,
  	"version_seo_google_search_console_verification" varchar,
  	"version_seo_default_meta_keywords" varchar,
  	"version_seo_custom_head_content" varchar,
  	"version_typography_heading_font" "enum__site_themes_v_version_typography_heading_font" DEFAULT 'Open Sans',
  	"version_typography_body_font" "enum__site_themes_v_version_typography_body_font" DEFAULT 'Assistant',
  	"version_typography_h1_size" numeric DEFAULT 40,
  	"version_typography_h2_size" numeric DEFAULT 32,
  	"version_typography_h3_size" numeric DEFAULT 26,
  	"version_typography_h4_size" numeric DEFAULT 22,
  	"version_typography_body_size" numeric DEFAULT 16,
  	"version_typography_heading_weight" "enum__site_themes_v_version_typography_heading_weight" DEFAULT '700',
  	"version_typography_line_height" "enum__site_themes_v_version_typography_line_height" DEFAULT '1.6',
  	"version_colors_primary" varchar DEFAULT '#1a1a2e',
  	"version_colors_accent" varchar DEFAULT '#1fa85d',
  	"version_colors_accent_hover" varchar DEFAULT '#5c24eb',
  	"version_colors_body_background" varchar DEFAULT '#ffffff',
  	"version_colors_body_text" varchar DEFAULT '#222222',
  	"version_colors_nav_background" varchar DEFAULT '#000000',
  	"version_colors_nav_text" varchar DEFAULT '#ffffffd9',
  	"version_colors_footer_background" varchar DEFAULT '#1a1a1a',
  	"version_colors_footer_text" varchar DEFAULT '#ffffffb3',
  	"version_colors_dark_section_bg" varchar DEFAULT '#3b3b3b',
  	"version_navigation_font_size" numeric DEFAULT 14,
  	"version_navigation_text_transform" "enum__site_themes_v_version_navigation_text_transform" DEFAULT 'uppercase',
  	"version_navigation_font_weight" "enum__site_themes_v_version_navigation_font_weight" DEFAULT '600',
  	"version_navigation_letter_spacing" "enum__site_themes_v_version_navigation_letter_spacing" DEFAULT '0.5',
  	"version_hero_height" numeric DEFAULT 70,
  	"version_hero_min_height" numeric DEFAULT 400,
  	"version_hero_max_height" numeric DEFAULT 700,
  	"version_hero_overlay_opacity" "enum__site_themes_v_version_hero_overlay_opacity" DEFAULT '0.5',
  	"version_hero_headline_size" numeric DEFAULT 2.8,
  	"version_hero_subheadline_size" numeric DEFAULT 1.2,
  	"version_buttons_border_radius" "enum__site_themes_v_version_buttons_border_radius" DEFAULT '4',
  	"version_buttons_padding_x" "enum__site_themes_v_version_buttons_padding_x" DEFAULT '1.5',
  	"version_buttons_padding_y" "enum__site_themes_v_version_buttons_padding_y" DEFAULT '0.6',
  	"version_buttons_font_weight" "enum__site_themes_v_version_buttons_font_weight" DEFAULT '600',
  	"version_buttons_text_transform" "enum__site_themes_v_version_buttons_text_transform" DEFAULT 'none',
  	"version_spacing_section_padding" "enum__site_themes_v_version_spacing_section_padding" DEFAULT '4',
  	"version_spacing_container_width" "enum__site_themes_v_version_spacing_container_width" DEFAULT '1200',
  	"version_mobile_h1_size" numeric,
  	"version_mobile_h2_size" numeric,
  	"version_mobile_h3_size" numeric,
  	"version_mobile_body_size" numeric,
  	"version_mobile_hero_height" numeric,
  	"version_mobile_hero_min_height" numeric,
  	"version_mobile_hero_headline_size" numeric,
  	"version_mobile_hero_subheadline_size" numeric,
  	"version_mobile_section_padding" "enum__site_themes_v_version_mobile_section_padding",
  	"version_mobile_nav_font_size" numeric,
  	"version_tablet_h1_size" numeric,
  	"version_tablet_h2_size" numeric,
  	"version_tablet_body_size" numeric,
  	"version_tablet_hero_height" numeric,
  	"version_tablet_hero_headline_size" numeric,
  	"version_tablet_section_padding" "enum__site_themes_v_version_tablet_section_padding",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_themes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"sku" varchar,
  	"price_override" numeric,
  	"in_stock" boolean DEFAULT true
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb,
  	"price" numeric NOT NULL,
  	"product_type" "enum_products_product_type" DEFAULT 'physical' NOT NULL,
  	"printful_product_id" varchar,
  	"in_stock" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscription_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "subscription_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb,
  	"plan_type" varchar NOT NULL,
  	"billing_interval" "enum_subscription_plans_billing_interval" NOT NULL,
  	"price" numeric NOT NULL,
  	"stripe_price_id" varchar,
  	"stripe_product_id" varchar,
  	"trial_days" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customer_subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"customer_email" varchar NOT NULL,
  	"customer_name" varchar,
  	"plan_id" integer NOT NULL,
  	"status" "enum_customer_subscriptions_status" DEFAULT 'active' NOT NULL,
  	"stripe_subscription_id" varchar NOT NULL,
  	"stripe_customer_id" varchar NOT NULL,
  	"current_period_start" timestamp(3) with time zone,
  	"current_period_end" timestamp(3) with time zone,
  	"cancel_at_period_end" boolean DEFAULT false,
  	"canceled_at" timestamp(3) with time zone,
  	"trial_end" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "discount_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"code" varchar NOT NULL,
  	"description" varchar,
  	"discount_type" "enum_discount_codes_discount_type" DEFAULT 'percentage' NOT NULL,
  	"value" numeric NOT NULL,
  	"min_order_amount" numeric,
  	"max_uses" numeric,
  	"uses_remaining" numeric,
  	"max_uses_per_customer" numeric DEFAULT 1,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "discount_codes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"subscription_plans_id" integer
  );
  
  CREATE TABLE "transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"type" "enum_transactions_type" NOT NULL,
  	"status" "enum_transactions_status" DEFAULT 'pending' NOT NULL,
  	"amount" numeric NOT NULL,
  	"refunded_amount" numeric DEFAULT 0,
  	"currency" varchar DEFAULT 'usd',
  	"description" varchar NOT NULL,
  	"customer_email" varchar NOT NULL,
  	"customer_name" varchar,
  	"stripe_payment_intent_id" varchar,
  	"stripe_charge_id" varchar,
  	"stripe_invoice_id" varchar,
  	"discount_code_id" integer,
  	"subscription_id" integer,
  	"product_id" integer,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mailing_list_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"email" varchar NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"status" "enum_mailing_list_subscribers_status" DEFAULT 'active' NOT NULL,
  	"source" "enum_mailing_list_subscribers_source" DEFAULT 'website',
  	"subscribed_at" timestamp(3) with time zone,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mailing_list_subscribers_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"domain" varchar NOT NULL,
  	"theme_color_primary" varchar DEFAULT '#1a1a2e',
  	"theme_color_accent" varchar DEFAULT '#e94560',
  	"theme_font_family" varchar DEFAULT 'system-ui, sans-serif',
  	"stripe_secret_key" varchar,
  	"stripe_publishable_key" varchar,
  	"stripe_webhook_secret" varchar,
  	"printful_api_key" varchar,
  	"resend_from_email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_tenants_roles" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_users_tenants_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'content-provider' NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"navigation_id" integer,
  	"artists_id" integer,
  	"tracks_id" integer,
  	"playlists_id" integer,
  	"videos_id" integer,
  	"events_id" integer,
  	"awards_id" integer,
  	"media_id" integer,
  	"files_id" integer,
  	"site_themes_id" integer,
  	"products_id" integer,
  	"subscription_plans_id" integer,
  	"customer_subscriptions_id" integer,
  	"discount_codes_id" integer,
  	"transactions_id" integer,
  	"mailing_list_subscribers_id" integer,
  	"tenants_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery" ADD CONSTRAINT "pages_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_music_playlist" ADD CONSTRAINT "pages_blocks_music_playlist_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_music_playlist" ADD CONSTRAINT "pages_blocks_music_playlist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_items" ADD CONSTRAINT "pages_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion" ADD CONSTRAINT "pages_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_artist_list" ADD CONSTRAINT "pages_blocks_artist_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_event_list" ADD CONSTRAINT "pages_blocks_event_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_button_buttons" ADD CONSTRAINT "pages_blocks_button_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_button" ADD CONSTRAINT "pages_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_mailing_list" ADD CONSTRAINT "pages_blocks_mailing_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation_preset_amounts" ADD CONSTRAINT "pages_blocks_donation_preset_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_donation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donation" ADD CONSTRAINT "pages_blocks_donation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tip_jar_preset_amounts" ADD CONSTRAINT "pages_blocks_tip_jar_preset_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tip_jar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tip_jar" ADD CONSTRAINT "pages_blocks_tip_jar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_embed" ADD CONSTRAINT "pages_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_calendar" ADD CONSTRAINT "pages_blocks_calendar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_download_files" ADD CONSTRAINT "pages_blocks_file_download_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_download_files" ADD CONSTRAINT "pages_blocks_file_download_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_file_download"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_download" ADD CONSTRAINT "pages_blocks_file_download_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_columns_columns" ADD CONSTRAINT "pages_blocks_columns_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_columns" ADD CONSTRAINT "pages_blocks_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_section" ADD CONSTRAINT "pages_blocks_section_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_section" ADD CONSTRAINT "pages_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid_items" ADD CONSTRAINT "pages_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid" ADD CONSTRAINT "pages_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery" ADD CONSTRAINT "_pages_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_embed" ADD CONSTRAINT "_pages_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_music_playlist" ADD CONSTRAINT "_pages_v_blocks_music_playlist_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_music_playlist" ADD CONSTRAINT "_pages_v_blocks_music_playlist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_items" ADD CONSTRAINT "_pages_v_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion" ADD CONSTRAINT "_pages_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_artist_list" ADD CONSTRAINT "_pages_v_blocks_artist_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_event_list" ADD CONSTRAINT "_pages_v_blocks_event_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_button_buttons" ADD CONSTRAINT "_pages_v_blocks_button_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_button"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_button" ADD CONSTRAINT "_pages_v_blocks_button_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mailing_list" ADD CONSTRAINT "_pages_v_blocks_mailing_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation_preset_amounts" ADD CONSTRAINT "_pages_v_blocks_donation_preset_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_donation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donation" ADD CONSTRAINT "_pages_v_blocks_donation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tip_jar_preset_amounts" ADD CONSTRAINT "_pages_v_blocks_tip_jar_preset_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tip_jar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tip_jar" ADD CONSTRAINT "_pages_v_blocks_tip_jar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_embed" ADD CONSTRAINT "_pages_v_blocks_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_calendar" ADD CONSTRAINT "_pages_v_blocks_calendar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_download_files" ADD CONSTRAINT "_pages_v_blocks_file_download_files_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_download_files" ADD CONSTRAINT "_pages_v_blocks_file_download_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_file_download"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_download" ADD CONSTRAINT "_pages_v_blocks_file_download_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_columns_columns" ADD CONSTRAINT "_pages_v_blocks_columns_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_columns" ADD CONSTRAINT "_pages_v_blocks_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section" ADD CONSTRAINT "_pages_v_blocks_section_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section" ADD CONSTRAINT "_pages_v_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grid_items" ADD CONSTRAINT "_pages_v_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grid" ADD CONSTRAINT "_pages_v_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_children" ADD CONSTRAINT "navigation_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artists_social_links" ADD CONSTRAINT "artists_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artists" ADD CONSTRAINT "artists_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artists" ADD CONSTRAINT "artists_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tracks" ADD CONSTRAINT "tracks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_art_id_media_id_fk" FOREIGN KEY ("album_art_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "playlists" ADD CONSTRAINT "playlists_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "playlists" ADD CONSTRAINT "playlists_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "playlists_rels" ADD CONSTRAINT "playlists_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "playlists_rels" ADD CONSTRAINT "playlists_rels_tracks_fk" FOREIGN KEY ("tracks_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "files" ADD CONSTRAINT "files_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_themes_site_profile_footer_links" ADD CONSTRAINT "site_themes_site_profile_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_themes" ADD CONSTRAINT "site_themes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_themes" ADD CONSTRAINT "site_themes_site_profile_site_icon_id_media_id_fk" FOREIGN KEY ("site_profile_site_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_themes_v_version_site_profile_footer_links" ADD CONSTRAINT "_site_themes_v_version_site_profile_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_themes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_themes_v" ADD CONSTRAINT "_site_themes_v_parent_id_site_themes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_themes_v" ADD CONSTRAINT "_site_themes_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_themes_v" ADD CONSTRAINT "_site_themes_v_version_site_profile_site_icon_id_media_id_fk" FOREIGN KEY ("version_site_profile_site_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscription_plans_features" ADD CONSTRAINT "subscription_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscription_plans" ADD CONSTRAINT "subscription_plans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customer_subscriptions" ADD CONSTRAINT "customer_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "discount_codes_rels" ADD CONSTRAINT "discount_codes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."discount_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discount_codes_rels" ADD CONSTRAINT "discount_codes_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discount_codes_rels" ADD CONSTRAINT "discount_codes_rels_subscription_plans_fk" FOREIGN KEY ("subscription_plans_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_discount_code_id_discount_codes_id_fk" FOREIGN KEY ("discount_code_id") REFERENCES "public"."discount_codes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_subscription_id_customer_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."customer_subscriptions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mailing_list_subscribers" ADD CONSTRAINT "mailing_list_subscribers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mailing_list_subscribers_texts" ADD CONSTRAINT "mailing_list_subscribers_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mailing_list_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_tenants_roles" ADD CONSTRAINT "users_tenants_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users_tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_navigation_fk" FOREIGN KEY ("navigation_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artists_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tracks_fk" FOREIGN KEY ("tracks_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_playlists_fk" FOREIGN KEY ("playlists_id") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_themes_fk" FOREIGN KEY ("site_themes_id") REFERENCES "public"."site_themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscription_plans_fk" FOREIGN KEY ("subscription_plans_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customer_subscriptions_fk" FOREIGN KEY ("customer_subscriptions_id") REFERENCES "public"."customer_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_discount_codes_fk" FOREIGN KEY ("discount_codes_id") REFERENCES "public"."discount_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mailing_list_subscribers_fk" FOREIGN KEY ("mailing_list_subscribers_id") REFERENCES "public"."mailing_list_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_gallery_images_order_idx" ON "pages_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_images_parent_id_idx" ON "pages_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_images_image_idx" ON "pages_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_gallery_order_idx" ON "pages_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_parent_id_idx" ON "pages_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_path_idx" ON "pages_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_embed_order_idx" ON "pages_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_embed_parent_id_idx" ON "pages_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_embed_path_idx" ON "pages_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_music_playlist_order_idx" ON "pages_blocks_music_playlist" USING btree ("_order");
  CREATE INDEX "pages_blocks_music_playlist_parent_id_idx" ON "pages_blocks_music_playlist" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_music_playlist_path_idx" ON "pages_blocks_music_playlist" USING btree ("_path");
  CREATE INDEX "pages_blocks_music_playlist_playlist_idx" ON "pages_blocks_music_playlist" USING btree ("playlist_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_items_order_idx" ON "pages_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_items_parent_id_idx" ON "pages_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_order_idx" ON "pages_blocks_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_parent_id_idx" ON "pages_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_path_idx" ON "pages_blocks_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_grid_cards_order_idx" ON "pages_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_cards_parent_id_idx" ON "pages_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_cards_image_idx" ON "pages_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_artist_list_order_idx" ON "pages_blocks_artist_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_artist_list_parent_id_idx" ON "pages_blocks_artist_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_artist_list_path_idx" ON "pages_blocks_artist_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_event_list_order_idx" ON "pages_blocks_event_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_event_list_parent_id_idx" ON "pages_blocks_event_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_event_list_path_idx" ON "pages_blocks_event_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_button_buttons_order_idx" ON "pages_blocks_button_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_button_buttons_parent_id_idx" ON "pages_blocks_button_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_button_order_idx" ON "pages_blocks_button" USING btree ("_order");
  CREATE INDEX "pages_blocks_button_parent_id_idx" ON "pages_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_button_path_idx" ON "pages_blocks_button" USING btree ("_path");
  CREATE INDEX "pages_blocks_mailing_list_order_idx" ON "pages_blocks_mailing_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_mailing_list_parent_id_idx" ON "pages_blocks_mailing_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mailing_list_path_idx" ON "pages_blocks_mailing_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_donation_preset_amounts_order_idx" ON "pages_blocks_donation_preset_amounts" USING btree ("_order");
  CREATE INDEX "pages_blocks_donation_preset_amounts_parent_id_idx" ON "pages_blocks_donation_preset_amounts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_donation_order_idx" ON "pages_blocks_donation" USING btree ("_order");
  CREATE INDEX "pages_blocks_donation_parent_id_idx" ON "pages_blocks_donation" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_donation_path_idx" ON "pages_blocks_donation" USING btree ("_path");
  CREATE INDEX "pages_blocks_tip_jar_preset_amounts_order_idx" ON "pages_blocks_tip_jar_preset_amounts" USING btree ("_order");
  CREATE INDEX "pages_blocks_tip_jar_preset_amounts_parent_id_idx" ON "pages_blocks_tip_jar_preset_amounts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tip_jar_order_idx" ON "pages_blocks_tip_jar" USING btree ("_order");
  CREATE INDEX "pages_blocks_tip_jar_parent_id_idx" ON "pages_blocks_tip_jar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tip_jar_path_idx" ON "pages_blocks_tip_jar" USING btree ("_path");
  CREATE INDEX "pages_blocks_embed_order_idx" ON "pages_blocks_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_embed_parent_id_idx" ON "pages_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_embed_path_idx" ON "pages_blocks_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_calendar_order_idx" ON "pages_blocks_calendar" USING btree ("_order");
  CREATE INDEX "pages_blocks_calendar_parent_id_idx" ON "pages_blocks_calendar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_calendar_path_idx" ON "pages_blocks_calendar" USING btree ("_path");
  CREATE INDEX "pages_blocks_file_download_files_order_idx" ON "pages_blocks_file_download_files" USING btree ("_order");
  CREATE INDEX "pages_blocks_file_download_files_parent_id_idx" ON "pages_blocks_file_download_files" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_file_download_files_file_idx" ON "pages_blocks_file_download_files" USING btree ("file_id");
  CREATE INDEX "pages_blocks_file_download_order_idx" ON "pages_blocks_file_download" USING btree ("_order");
  CREATE INDEX "pages_blocks_file_download_parent_id_idx" ON "pages_blocks_file_download" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_file_download_path_idx" ON "pages_blocks_file_download" USING btree ("_path");
  CREATE INDEX "pages_blocks_columns_columns_order_idx" ON "pages_blocks_columns_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_columns_columns_parent_id_idx" ON "pages_blocks_columns_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_columns_order_idx" ON "pages_blocks_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_columns_parent_id_idx" ON "pages_blocks_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_columns_path_idx" ON "pages_blocks_columns" USING btree ("_path");
  CREATE INDEX "pages_blocks_section_order_idx" ON "pages_blocks_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_section_parent_id_idx" ON "pages_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_section_path_idx" ON "pages_blocks_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_section_background_image_idx" ON "pages_blocks_section" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_grid_items_order_idx" ON "pages_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_grid_items_parent_id_idx" ON "pages_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grid_order_idx" ON "pages_blocks_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_grid_parent_id_idx" ON "pages_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grid_path_idx" ON "pages_blocks_grid" USING btree ("_path");
  CREATE INDEX "pages_tenant_idx" ON "pages" USING btree ("tenant_id");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_order_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_image_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_order_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_parent_id_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_path_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_embed_order_idx" ON "_pages_v_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_embed_parent_id_idx" ON "_pages_v_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_embed_path_idx" ON "_pages_v_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_music_playlist_order_idx" ON "_pages_v_blocks_music_playlist" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_music_playlist_parent_id_idx" ON "_pages_v_blocks_music_playlist" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_music_playlist_path_idx" ON "_pages_v_blocks_music_playlist" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_music_playlist_playlist_idx" ON "_pages_v_blocks_music_playlist" USING btree ("playlist_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_items_order_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_items_parent_id_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_order_idx" ON "_pages_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_parent_id_idx" ON "_pages_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_path_idx" ON "_pages_v_blocks_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_order_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_image_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_artist_list_order_idx" ON "_pages_v_blocks_artist_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_artist_list_parent_id_idx" ON "_pages_v_blocks_artist_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_artist_list_path_idx" ON "_pages_v_blocks_artist_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_event_list_order_idx" ON "_pages_v_blocks_event_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_event_list_parent_id_idx" ON "_pages_v_blocks_event_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_event_list_path_idx" ON "_pages_v_blocks_event_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_button_buttons_order_idx" ON "_pages_v_blocks_button_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_button_buttons_parent_id_idx" ON "_pages_v_blocks_button_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_button_order_idx" ON "_pages_v_blocks_button" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_button_parent_id_idx" ON "_pages_v_blocks_button" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_button_path_idx" ON "_pages_v_blocks_button" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_mailing_list_order_idx" ON "_pages_v_blocks_mailing_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mailing_list_parent_id_idx" ON "_pages_v_blocks_mailing_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mailing_list_path_idx" ON "_pages_v_blocks_mailing_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_donation_preset_amounts_order_idx" ON "_pages_v_blocks_donation_preset_amounts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_donation_preset_amounts_parent_id_idx" ON "_pages_v_blocks_donation_preset_amounts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_donation_order_idx" ON "_pages_v_blocks_donation" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_donation_parent_id_idx" ON "_pages_v_blocks_donation" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_donation_path_idx" ON "_pages_v_blocks_donation" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_tip_jar_preset_amounts_order_idx" ON "_pages_v_blocks_tip_jar_preset_amounts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tip_jar_preset_amounts_parent_id_idx" ON "_pages_v_blocks_tip_jar_preset_amounts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tip_jar_order_idx" ON "_pages_v_blocks_tip_jar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tip_jar_parent_id_idx" ON "_pages_v_blocks_tip_jar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tip_jar_path_idx" ON "_pages_v_blocks_tip_jar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_embed_order_idx" ON "_pages_v_blocks_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_embed_parent_id_idx" ON "_pages_v_blocks_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_embed_path_idx" ON "_pages_v_blocks_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_calendar_order_idx" ON "_pages_v_blocks_calendar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_calendar_parent_id_idx" ON "_pages_v_blocks_calendar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_calendar_path_idx" ON "_pages_v_blocks_calendar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_file_download_files_order_idx" ON "_pages_v_blocks_file_download_files" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_file_download_files_parent_id_idx" ON "_pages_v_blocks_file_download_files" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_file_download_files_file_idx" ON "_pages_v_blocks_file_download_files" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_file_download_order_idx" ON "_pages_v_blocks_file_download" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_file_download_parent_id_idx" ON "_pages_v_blocks_file_download" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_file_download_path_idx" ON "_pages_v_blocks_file_download" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_columns_columns_order_idx" ON "_pages_v_blocks_columns_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_columns_columns_parent_id_idx" ON "_pages_v_blocks_columns_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_columns_order_idx" ON "_pages_v_blocks_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_columns_parent_id_idx" ON "_pages_v_blocks_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_columns_path_idx" ON "_pages_v_blocks_columns" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_section_order_idx" ON "_pages_v_blocks_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_section_parent_id_idx" ON "_pages_v_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_section_path_idx" ON "_pages_v_blocks_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_section_background_image_idx" ON "_pages_v_blocks_section" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_grid_items_order_idx" ON "_pages_v_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_grid_items_parent_id_idx" ON "_pages_v_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_grid_order_idx" ON "_pages_v_blocks_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_grid_parent_id_idx" ON "_pages_v_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_grid_path_idx" ON "_pages_v_blocks_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_tenant_idx" ON "_pages_v" USING btree ("version_tenant_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "navigation_children_order_idx" ON "navigation_children" USING btree ("_order");
  CREATE INDEX "navigation_children_parent_id_idx" ON "navigation_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_tenant_idx" ON "navigation" USING btree ("tenant_id");
  CREATE INDEX "navigation_updated_at_idx" ON "navigation" USING btree ("updated_at");
  CREATE INDEX "navigation_created_at_idx" ON "navigation" USING btree ("created_at");
  CREATE INDEX "artists_social_links_order_idx" ON "artists_social_links" USING btree ("_order");
  CREATE INDEX "artists_social_links_parent_id_idx" ON "artists_social_links" USING btree ("_parent_id");
  CREATE INDEX "artists_tenant_idx" ON "artists" USING btree ("tenant_id");
  CREATE INDEX "artists_slug_idx" ON "artists" USING btree ("slug");
  CREATE INDEX "artists_photo_idx" ON "artists" USING btree ("photo_id");
  CREATE INDEX "artists_updated_at_idx" ON "artists" USING btree ("updated_at");
  CREATE INDEX "artists_created_at_idx" ON "artists" USING btree ("created_at");
  CREATE INDEX "tracks_tenant_idx" ON "tracks" USING btree ("tenant_id");
  CREATE INDEX "tracks_artist_idx" ON "tracks" USING btree ("artist_id");
  CREATE INDEX "tracks_album_art_idx" ON "tracks" USING btree ("album_art_id");
  CREATE INDEX "tracks_updated_at_idx" ON "tracks" USING btree ("updated_at");
  CREATE INDEX "tracks_created_at_idx" ON "tracks" USING btree ("created_at");
  CREATE INDEX "playlists_tenant_idx" ON "playlists" USING btree ("tenant_id");
  CREATE INDEX "playlists_slug_idx" ON "playlists" USING btree ("slug");
  CREATE INDEX "playlists_cover_image_idx" ON "playlists" USING btree ("cover_image_id");
  CREATE INDEX "playlists_updated_at_idx" ON "playlists" USING btree ("updated_at");
  CREATE INDEX "playlists_created_at_idx" ON "playlists" USING btree ("created_at");
  CREATE INDEX "playlists_rels_order_idx" ON "playlists_rels" USING btree ("order");
  CREATE INDEX "playlists_rels_parent_idx" ON "playlists_rels" USING btree ("parent_id");
  CREATE INDEX "playlists_rels_path_idx" ON "playlists_rels" USING btree ("path");
  CREATE INDEX "playlists_rels_tracks_id_idx" ON "playlists_rels" USING btree ("tracks_id");
  CREATE INDEX "videos_tenant_idx" ON "videos" USING btree ("tenant_id");
  CREATE INDEX "videos_thumbnail_idx" ON "videos" USING btree ("thumbnail_id");
  CREATE INDEX "videos_artist_idx" ON "videos" USING btree ("artist_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE INDEX "events_tenant_idx" ON "events" USING btree ("tenant_id");
  CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_artists_id_idx" ON "events_rels" USING btree ("artists_id");
  CREATE INDEX "awards_tenant_idx" ON "awards" USING btree ("tenant_id");
  CREATE INDEX "awards_artist_idx" ON "awards" USING btree ("artist_id");
  CREATE INDEX "awards_image_idx" ON "awards" USING btree ("image_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE INDEX "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "files_tenant_idx" ON "files" USING btree ("tenant_id");
  CREATE INDEX "files_updated_at_idx" ON "files" USING btree ("updated_at");
  CREATE INDEX "files_created_at_idx" ON "files" USING btree ("created_at");
  CREATE UNIQUE INDEX "files_filename_idx" ON "files" USING btree ("filename");
  CREATE INDEX "site_themes_site_profile_footer_links_order_idx" ON "site_themes_site_profile_footer_links" USING btree ("_order");
  CREATE INDEX "site_themes_site_profile_footer_links_parent_id_idx" ON "site_themes_site_profile_footer_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_themes_tenant_idx" ON "site_themes" USING btree ("tenant_id");
  CREATE INDEX "site_themes_site_profile_site_profile_site_icon_idx" ON "site_themes" USING btree ("site_profile_site_icon_id");
  CREATE INDEX "site_themes_updated_at_idx" ON "site_themes" USING btree ("updated_at");
  CREATE INDEX "site_themes_created_at_idx" ON "site_themes" USING btree ("created_at");
  CREATE INDEX "site_themes__status_idx" ON "site_themes" USING btree ("_status");
  CREATE INDEX "_site_themes_v_version_site_profile_footer_links_order_idx" ON "_site_themes_v_version_site_profile_footer_links" USING btree ("_order");
  CREATE INDEX "_site_themes_v_version_site_profile_footer_links_parent_id_idx" ON "_site_themes_v_version_site_profile_footer_links" USING btree ("_parent_id");
  CREATE INDEX "_site_themes_v_parent_idx" ON "_site_themes_v" USING btree ("parent_id");
  CREATE INDEX "_site_themes_v_version_version_tenant_idx" ON "_site_themes_v" USING btree ("version_tenant_id");
  CREATE INDEX "_site_themes_v_version_site_profile_version_site_profile_idx" ON "_site_themes_v" USING btree ("version_site_profile_site_icon_id");
  CREATE INDEX "_site_themes_v_version_version_updated_at_idx" ON "_site_themes_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_themes_v_version_version_created_at_idx" ON "_site_themes_v" USING btree ("version_created_at");
  CREATE INDEX "_site_themes_v_version_version__status_idx" ON "_site_themes_v" USING btree ("version__status");
  CREATE INDEX "_site_themes_v_created_at_idx" ON "_site_themes_v" USING btree ("created_at");
  CREATE INDEX "_site_themes_v_updated_at_idx" ON "_site_themes_v" USING btree ("updated_at");
  CREATE INDEX "_site_themes_v_latest_idx" ON "_site_themes_v" USING btree ("latest");
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_idx" ON "products_images" USING btree ("image_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE INDEX "products_tenant_idx" ON "products" USING btree ("tenant_id");
  CREATE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "subscription_plans_features_order_idx" ON "subscription_plans_features" USING btree ("_order");
  CREATE INDEX "subscription_plans_features_parent_id_idx" ON "subscription_plans_features" USING btree ("_parent_id");
  CREATE INDEX "subscription_plans_tenant_idx" ON "subscription_plans" USING btree ("tenant_id");
  CREATE INDEX "subscription_plans_slug_idx" ON "subscription_plans" USING btree ("slug");
  CREATE INDEX "subscription_plans_updated_at_idx" ON "subscription_plans" USING btree ("updated_at");
  CREATE INDEX "subscription_plans_created_at_idx" ON "subscription_plans" USING btree ("created_at");
  CREATE INDEX "customer_subscriptions_tenant_idx" ON "customer_subscriptions" USING btree ("tenant_id");
  CREATE INDEX "customer_subscriptions_customer_email_idx" ON "customer_subscriptions" USING btree ("customer_email");
  CREATE INDEX "customer_subscriptions_plan_idx" ON "customer_subscriptions" USING btree ("plan_id");
  CREATE UNIQUE INDEX "customer_subscriptions_stripe_subscription_id_idx" ON "customer_subscriptions" USING btree ("stripe_subscription_id");
  CREATE INDEX "customer_subscriptions_stripe_customer_id_idx" ON "customer_subscriptions" USING btree ("stripe_customer_id");
  CREATE INDEX "customer_subscriptions_updated_at_idx" ON "customer_subscriptions" USING btree ("updated_at");
  CREATE INDEX "customer_subscriptions_created_at_idx" ON "customer_subscriptions" USING btree ("created_at");
  CREATE INDEX "discount_codes_tenant_idx" ON "discount_codes" USING btree ("tenant_id");
  CREATE INDEX "discount_codes_code_idx" ON "discount_codes" USING btree ("code");
  CREATE INDEX "discount_codes_updated_at_idx" ON "discount_codes" USING btree ("updated_at");
  CREATE INDEX "discount_codes_created_at_idx" ON "discount_codes" USING btree ("created_at");
  CREATE INDEX "discount_codes_rels_order_idx" ON "discount_codes_rels" USING btree ("order");
  CREATE INDEX "discount_codes_rels_parent_idx" ON "discount_codes_rels" USING btree ("parent_id");
  CREATE INDEX "discount_codes_rels_path_idx" ON "discount_codes_rels" USING btree ("path");
  CREATE INDEX "discount_codes_rels_products_id_idx" ON "discount_codes_rels" USING btree ("products_id");
  CREATE INDEX "discount_codes_rels_subscription_plans_id_idx" ON "discount_codes_rels" USING btree ("subscription_plans_id");
  CREATE INDEX "transactions_tenant_idx" ON "transactions" USING btree ("tenant_id");
  CREATE INDEX "transactions_customer_email_idx" ON "transactions" USING btree ("customer_email");
  CREATE INDEX "transactions_stripe_payment_intent_id_idx" ON "transactions" USING btree ("stripe_payment_intent_id");
  CREATE INDEX "transactions_discount_code_idx" ON "transactions" USING btree ("discount_code_id");
  CREATE INDEX "transactions_subscription_idx" ON "transactions" USING btree ("subscription_id");
  CREATE INDEX "transactions_product_idx" ON "transactions" USING btree ("product_id");
  CREATE INDEX "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  CREATE INDEX "mailing_list_subscribers_tenant_idx" ON "mailing_list_subscribers" USING btree ("tenant_id");
  CREATE INDEX "mailing_list_subscribers_email_idx" ON "mailing_list_subscribers" USING btree ("email");
  CREATE INDEX "mailing_list_subscribers_updated_at_idx" ON "mailing_list_subscribers" USING btree ("updated_at");
  CREATE INDEX "mailing_list_subscribers_created_at_idx" ON "mailing_list_subscribers" USING btree ("created_at");
  CREATE INDEX "mailing_list_subscribers_texts_order_parent" ON "mailing_list_subscribers_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE UNIQUE INDEX "tenants_domain_idx" ON "tenants" USING btree ("domain");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "users_tenants_roles_order_idx" ON "users_tenants_roles" USING btree ("order");
  CREATE INDEX "users_tenants_roles_parent_idx" ON "users_tenants_roles" USING btree ("parent_id");
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_navigation_id_idx" ON "payload_locked_documents_rels" USING btree ("navigation_id");
  CREATE INDEX "payload_locked_documents_rels_artists_id_idx" ON "payload_locked_documents_rels" USING btree ("artists_id");
  CREATE INDEX "payload_locked_documents_rels_tracks_id_idx" ON "payload_locked_documents_rels" USING btree ("tracks_id");
  CREATE INDEX "payload_locked_documents_rels_playlists_id_idx" ON "payload_locked_documents_rels" USING btree ("playlists_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_files_id_idx" ON "payload_locked_documents_rels" USING btree ("files_id");
  CREATE INDEX "payload_locked_documents_rels_site_themes_id_idx" ON "payload_locked_documents_rels" USING btree ("site_themes_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_subscription_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("subscription_plans_id");
  CREATE INDEX "payload_locked_documents_rels_customer_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("customer_subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_discount_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("discount_codes_id");
  CREATE INDEX "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
  CREATE INDEX "payload_locked_documents_rels_mailing_list_subscribers_i_idx" ON "payload_locked_documents_rels" USING btree ("mailing_list_subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_image_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_image_gallery" CASCADE;
  DROP TABLE "pages_blocks_video_embed" CASCADE;
  DROP TABLE "pages_blocks_music_playlist" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages_blocks_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_accordion" CASCADE;
  DROP TABLE "pages_blocks_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid" CASCADE;
  DROP TABLE "pages_blocks_artist_list" CASCADE;
  DROP TABLE "pages_blocks_event_list" CASCADE;
  DROP TABLE "pages_blocks_button_buttons" CASCADE;
  DROP TABLE "pages_blocks_button" CASCADE;
  DROP TABLE "pages_blocks_mailing_list" CASCADE;
  DROP TABLE "pages_blocks_donation_preset_amounts" CASCADE;
  DROP TABLE "pages_blocks_donation" CASCADE;
  DROP TABLE "pages_blocks_tip_jar_preset_amounts" CASCADE;
  DROP TABLE "pages_blocks_tip_jar" CASCADE;
  DROP TABLE "pages_blocks_embed" CASCADE;
  DROP TABLE "pages_blocks_calendar" CASCADE;
  DROP TABLE "pages_blocks_file_download_files" CASCADE;
  DROP TABLE "pages_blocks_file_download" CASCADE;
  DROP TABLE "pages_blocks_columns_columns" CASCADE;
  DROP TABLE "pages_blocks_columns" CASCADE;
  DROP TABLE "pages_blocks_section" CASCADE;
  DROP TABLE "pages_blocks_grid_items" CASCADE;
  DROP TABLE "pages_blocks_grid" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_music_playlist" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_artist_list" CASCADE;
  DROP TABLE "_pages_v_blocks_event_list" CASCADE;
  DROP TABLE "_pages_v_blocks_button_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_button" CASCADE;
  DROP TABLE "_pages_v_blocks_mailing_list" CASCADE;
  DROP TABLE "_pages_v_blocks_donation_preset_amounts" CASCADE;
  DROP TABLE "_pages_v_blocks_donation" CASCADE;
  DROP TABLE "_pages_v_blocks_tip_jar_preset_amounts" CASCADE;
  DROP TABLE "_pages_v_blocks_tip_jar" CASCADE;
  DROP TABLE "_pages_v_blocks_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_calendar" CASCADE;
  DROP TABLE "_pages_v_blocks_file_download_files" CASCADE;
  DROP TABLE "_pages_v_blocks_file_download" CASCADE;
  DROP TABLE "_pages_v_blocks_columns_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_section" CASCADE;
  DROP TABLE "_pages_v_blocks_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_grid" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  DROP TABLE "navigation_children" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "artists_social_links" CASCADE;
  DROP TABLE "artists" CASCADE;
  DROP TABLE "tracks" CASCADE;
  DROP TABLE "playlists" CASCADE;
  DROP TABLE "playlists_rels" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "files" CASCADE;
  DROP TABLE "site_themes_site_profile_footer_links" CASCADE;
  DROP TABLE "site_themes" CASCADE;
  DROP TABLE "_site_themes_v_version_site_profile_footer_links" CASCADE;
  DROP TABLE "_site_themes_v" CASCADE;
  DROP TABLE "products_images" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "subscription_plans_features" CASCADE;
  DROP TABLE "subscription_plans" CASCADE;
  DROP TABLE "customer_subscriptions" CASCADE;
  DROP TABLE "discount_codes" CASCADE;
  DROP TABLE "discount_codes_rels" CASCADE;
  DROP TABLE "transactions" CASCADE;
  DROP TABLE "mailing_list_subscribers" CASCADE;
  DROP TABLE "mailing_list_subscribers_texts" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "users_tenants_roles" CASCADE;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_rich_text_max_width";
  DROP TYPE "public"."enum_pages_blocks_rich_text_alignment";
  DROP TYPE "public"."enum_pages_blocks_image_size";
  DROP TYPE "public"."enum_pages_blocks_image_alignment";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_video_embed_size";
  DROP TYPE "public"."enum_pages_blocks_cta_button_style";
  DROP TYPE "public"."enum_pages_blocks_cta_style";
  DROP TYPE "public"."enum_pages_blocks_cta_alignment";
  DROP TYPE "public"."enum_pages_blocks_spacer_size";
  DROP TYPE "public"."enum_pages_blocks_card_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_artist_list_columns";
  DROP TYPE "public"."enum_pages_blocks_button_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_button_buttons_size";
  DROP TYPE "public"."enum_pages_blocks_button_alignment";
  DROP TYPE "public"."enum_pages_blocks_mailing_list_style";
  DROP TYPE "public"."enum_pages_blocks_donation_style";
  DROP TYPE "public"."enum_pages_blocks_embed_max_width";
  DROP TYPE "public"."enum_pages_blocks_calendar_default_view";
  DROP TYPE "public"."enum_pages_blocks_file_download_style";
  DROP TYPE "public"."enum_pages_blocks_columns_layout";
  DROP TYPE "public"."enum_pages_blocks_columns_vertical_alignment";
  DROP TYPE "public"."enum_pages_blocks_columns_gap";
  DROP TYPE "public"."enum_pages_blocks_section_style";
  DROP TYPE "public"."enum_pages_blocks_section_padding";
  DROP TYPE "public"."enum_pages_blocks_section_container_width";
  DROP TYPE "public"."enum_pages_blocks_grid_items_col_span";
  DROP TYPE "public"."enum_pages_blocks_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_grid_mobile_columns";
  DROP TYPE "public"."enum_pages_blocks_grid_tablet_columns";
  DROP TYPE "public"."enum_pages_blocks_grid_gap";
  DROP TYPE "public"."enum_pages_blocks_grid_vertical_alignment";
  DROP TYPE "public"."enum_pages_page_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_image_size";
  DROP TYPE "public"."enum__pages_v_blocks_image_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_video_embed_size";
  DROP TYPE "public"."enum__pages_v_blocks_cta_button_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_size";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_artist_list_columns";
  DROP TYPE "public"."enum__pages_v_blocks_button_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_button_buttons_size";
  DROP TYPE "public"."enum__pages_v_blocks_button_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_mailing_list_style";
  DROP TYPE "public"."enum__pages_v_blocks_donation_style";
  DROP TYPE "public"."enum__pages_v_blocks_embed_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_calendar_default_view";
  DROP TYPE "public"."enum__pages_v_blocks_file_download_style";
  DROP TYPE "public"."enum__pages_v_blocks_columns_layout";
  DROP TYPE "public"."enum__pages_v_blocks_columns_vertical_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_columns_gap";
  DROP TYPE "public"."enum__pages_v_blocks_section_style";
  DROP TYPE "public"."enum__pages_v_blocks_section_padding";
  DROP TYPE "public"."enum__pages_v_blocks_section_container_width";
  DROP TYPE "public"."enum__pages_v_blocks_grid_items_col_span";
  DROP TYPE "public"."enum__pages_v_blocks_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_grid_mobile_columns";
  DROP TYPE "public"."enum__pages_v_blocks_grid_tablet_columns";
  DROP TYPE "public"."enum__pages_v_blocks_grid_gap";
  DROP TYPE "public"."enum__pages_v_blocks_grid_vertical_alignment";
  DROP TYPE "public"."enum__pages_v_version_page_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_artists_social_links_platform";
  DROP TYPE "public"."enum_videos_platform";
  DROP TYPE "public"."enum_site_themes_typography_heading_font";
  DROP TYPE "public"."enum_site_themes_typography_body_font";
  DROP TYPE "public"."enum_site_themes_typography_heading_weight";
  DROP TYPE "public"."enum_site_themes_typography_line_height";
  DROP TYPE "public"."enum_site_themes_navigation_text_transform";
  DROP TYPE "public"."enum_site_themes_navigation_font_weight";
  DROP TYPE "public"."enum_site_themes_navigation_letter_spacing";
  DROP TYPE "public"."enum_site_themes_hero_overlay_opacity";
  DROP TYPE "public"."enum_site_themes_buttons_border_radius";
  DROP TYPE "public"."enum_site_themes_buttons_padding_x";
  DROP TYPE "public"."enum_site_themes_buttons_padding_y";
  DROP TYPE "public"."enum_site_themes_buttons_font_weight";
  DROP TYPE "public"."enum_site_themes_buttons_text_transform";
  DROP TYPE "public"."enum_site_themes_spacing_section_padding";
  DROP TYPE "public"."enum_site_themes_spacing_container_width";
  DROP TYPE "public"."enum_site_themes_mobile_section_padding";
  DROP TYPE "public"."enum_site_themes_tablet_section_padding";
  DROP TYPE "public"."enum_site_themes_status";
  DROP TYPE "public"."enum__site_themes_v_version_typography_heading_font";
  DROP TYPE "public"."enum__site_themes_v_version_typography_body_font";
  DROP TYPE "public"."enum__site_themes_v_version_typography_heading_weight";
  DROP TYPE "public"."enum__site_themes_v_version_typography_line_height";
  DROP TYPE "public"."enum__site_themes_v_version_navigation_text_transform";
  DROP TYPE "public"."enum__site_themes_v_version_navigation_font_weight";
  DROP TYPE "public"."enum__site_themes_v_version_navigation_letter_spacing";
  DROP TYPE "public"."enum__site_themes_v_version_hero_overlay_opacity";
  DROP TYPE "public"."enum__site_themes_v_version_buttons_border_radius";
  DROP TYPE "public"."enum__site_themes_v_version_buttons_padding_x";
  DROP TYPE "public"."enum__site_themes_v_version_buttons_padding_y";
  DROP TYPE "public"."enum__site_themes_v_version_buttons_font_weight";
  DROP TYPE "public"."enum__site_themes_v_version_buttons_text_transform";
  DROP TYPE "public"."enum__site_themes_v_version_spacing_section_padding";
  DROP TYPE "public"."enum__site_themes_v_version_spacing_container_width";
  DROP TYPE "public"."enum__site_themes_v_version_mobile_section_padding";
  DROP TYPE "public"."enum__site_themes_v_version_tablet_section_padding";
  DROP TYPE "public"."enum__site_themes_v_version_status";
  DROP TYPE "public"."enum_products_product_type";
  DROP TYPE "public"."enum_subscription_plans_billing_interval";
  DROP TYPE "public"."enum_customer_subscriptions_status";
  DROP TYPE "public"."enum_discount_codes_discount_type";
  DROP TYPE "public"."enum_transactions_type";
  DROP TYPE "public"."enum_transactions_status";
  DROP TYPE "public"."enum_mailing_list_subscribers_status";
  DROP TYPE "public"."enum_mailing_list_subscribers_source";
  DROP TYPE "public"."enum_users_tenants_roles";
  DROP TYPE "public"."enum_users_role";`)
}
