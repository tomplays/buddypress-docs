jQuery(document).ready(function($){
	/* Unhide JS content */
	$('.hide-if-no-js').show();

	$('.bp-docs-attachment-clip').on('click', function(e) {
		var att_doc_id = $(e.target).closest('.bp-docs-attachment-clip').attr('id').split('-').pop();
		var att_doc_drawer = $('#bp-docs-attachment-drawer-'+att_doc_id);
		att_doc_drawer.slideToggle( 400 );
	});

	$('#doc-attachments-ul > li').each( function( i ) {
		$(this).addClass( (i + 1) % 2 ? 'odd' : 'even' );
	});

	// Fix the wonky tabindex on Text mode
	$('input#doc-permalink').on('keydown',function(e){
		focus_in_content_area(e);	
	});

	// When a Doc is created new, there is no Permalink input
	$('input#doc-title').on('keydown',function(e){
		if ( ! document.getElementById( 'doc-permalink' ) ) {  
			focus_in_content_area(e);	
		}
	});

	/* When a toggle is clicked, show the toggle-content */
	$('.toggle-link').click(function(){
		// Traverse for some items
		var toggleable = $(this).parents('.toggleable');
		var tc = $(toggleable).find('.toggle-content');
		var ts = $(toggleable).find('.toggle-switch');
		var pom = $(this).find('.plus-or-minus');

		// Toggle the active-content class
		if($(tc).hasClass('active-content')){
			$(tc).removeClass('active-content');
		}else{
			$(tc).addClass('active-content');
		}

		// Toggle the active-switch class
		if($(ts).hasClass('active-switch')){
			$(ts).removeClass('active-switch');
		}else{
			$(ts).addClass('active-switch');
		}

		// Slide the tags up or down
		$(tc).slideToggle(400, function(){
			var rclass, aclass;	
			if ( $(pom).hasClass('show-pane') ) {
				rclass = 'show-pane';
				aclass = 'hide-pane';
			} else {
				rclass = 'hide-pane';
				aclass = 'show-pane';
			}

			$(pom).removeClass(rclass);
			$(pom).addClass(aclass);
		});

		return false;
	});

	$('#bp-docs-group-enable').click(function(){
		$('#group-doc-options').slideToggle(400);
	});

	/* Permissions snapshot toggle */
	var thisaction, showing, hidden;
	$('#doc-permissions-summary').show();
	$('#doc-permissions-details').hide();
	var dpt = $('.doc-permissions-toggle');
	$(dpt).on('click',function(e){
		e.preventDefault();
		thisaction = $(e.target).attr('id').split('-').pop();
		showing = 'more' == thisaction ? 'summary' : 'details';
		hidden = 'summary' == showing ? 'details' : 'summary';
		$('#doc-permissions-' + showing).slideUp(100, function(){
			$('#doc-permissions-' + hidden).slideDown(100);
		});
	});

	/** Directory filters ************************************************/

	var hidden_tag_counter = 0,
		tag_button_action,
		$dfsection,
		$dfsection_tags = $( '#docs-filter-section-tags' ),
		$dfsection_tags_list = $dfsection_tags.find( 'ul#tags-list' ),
		$dfsection_tags_items = $dfsection_tags_list.children( 'li' );

	// Set up filter sections
	// - hide if necessary
	$('.docs-filter-section').each(function(){
		$dfsection = $(this);
		// Open sections:
		if ( ! $dfsection.hasClass( 'docs-filter-section-open' ) ) {
			$dfsection.hide();
		}
	});

	// Collapse the Tags filter if it contains greater than 10 items
	if ( $dfsection_tags_items.length > 10 ) {
		tags_section_collapse( $dfsection_tags );
	}

	$dfsection_tags.on( 'click', 'a.tags-action-button', function( e ) {
		$dfsection_tags.slideUp( 300, function() {
			tag_button_action = $( e.target ).hasClass( 'tags-unhide' ) ? 'expand' : 'collapse';	

			if ( 'expand' == tag_button_action ) {
				tags_section_expand( $dfsection_tags );
			} else if ( 'collapse' == tag_button_action ) {
				tags_section_collapse( $dfsection_tags );
			}

			$dfsection_tags.slideDown();
		} );
		return false;
	} );

	$('.docs-filter-title').on('click',function(e){
		var filter_title = $(this);
		var filter_title_id = filter_title.attr('id');
		var filter_id = filter_title_id.split('-').pop();
		var filter_to_show_id = 'docs-filter-section-' + filter_id;
		var showing_filter_id = $('.docs-filter-section-open').attr('id');
		
		$('.docs-filter-title').removeClass( 'current' );
		filter_title.addClass( 'current' );

		var filter_sections = $('.docs-filter-section');
		filter_sections.removeClass( 'docs-filter-section-open' );

		var all_section_slideup = function() {
			$('.docs-filter-section').slideUp(100);
		}

		$.when( all_section_slideup() ).done(function(){
			if ( filter_to_show_id != showing_filter_id ) {
				$('#' + filter_to_show_id).fadeIn().addClass( 'docs-filter-section-open' );
			}
		});
		return false;
	});

	/**
	 * Collapse the Tags filter section
	 */
	function tags_section_collapse( $section ) {
		$section.find( 'a.tags-hide' ).remove();

		$dfsection_tags_items.each( function( k, v ) {
			if ( k > 6 ) {
				$( v ).addClass( 'hidden-tag' );
				hidden_tag_counter++;
			}
		} );

		// Add an ellipses item
		var st = '&hellip; and %d more';
		st = st.replace( /%d/, hidden_tag_counter );  

		$dfsection_tags_list.append( '<li class="tags-ellipses">' + st + '</li>' );

		$dfsection_tags.prepend( '<a class="tags-unhide tags-action-button" href="#">show all tags</a>' );
	}

	/**
	 * Expand the Tags filter section
	 */
	function tags_section_expand( $section ) {
		$section.find( 'a.tags-unhide' ).remove();
		$section.find( '.tags-ellipses' ).remove();
		$dfsection_tags_items.removeClass( 'hidden-tag' );
		$dfsection_tags.prepend( '<a class="tags-hide tags-action-button" href="#">show fewer tags</a>' );
		hidden_tag_counter = 0;
	}

	function focus_in_content_area(e){
		var code = e.keyCode || e.which;
		if ( code == 9 ) {
			$doc_content = $('textarea#doc_content');
			if ( $doc_content.is(':visible') ) {
				var doccontent = $doc_content.val();
				$doc_content.val('');	
				$doc_content.focus();
				$doc_content.val(doccontent);
				return false;
			}
		}
	}
},(jQuery));

function bp_docs_load_idle() {
	if(jQuery('#doc-form').length != 0 && jQuery('#existing-doc-id').length != 0 ) {
		// For testing
		//setIdleTimeout(1000 * 3); // 25 minutes until the popup (ms * s * min)
		//setAwayTimeout(1000 * 10); // 30 minutes until the autosave

		/* Set away timeout for quasi-autosave */
		setIdleTimeout(1000 * 60 * 25); // 25 minutes until the popup (ms * s * min)
		setAwayTimeout(1000 * 60 * 30); // 30 minutes until the autosave
		document.onIdle = function() {
			jQuery.colorbox({
				inline: true,
				href: "#still_working_content",
				width: "50%",
				height: "50%"
			});
		}
		document.onAway = function() {
			jQuery.colorbox.close();
			var is_auto = '<input type="hidden" name="is_auto" value="1">';
			jQuery('#doc-form').append(is_auto);
			jQuery('#doc-edit-submit').click();
		}

		/* Remove the edit lock when the user clicks away */
		jQuery("a").click(function(){
			var doc_id = jQuery("#existing-doc-id").val();
			var data = {action:'remove_edit_lock', doc_id:doc_id};
			jQuery.ajax({
				url: ajaxurl,
				type: 'POST',
				async: false,
				timeout: 10000,
				dataType:'json',
				data: data,
				success: function(response){
					return true;
				},
				complete: function(){
					return true;
				}
			});
		});
	}
}

function bp_docs_kitchen_sink(ed) {
	var adv_button = jQuery('#' + ed.editorContainer).find('a.mce_wp_adv');
	if ( 0 != adv_button.length ) {
		jQuery(adv_button).on('click',function(e){
			var sec_rows = jQuery(adv_button).closest('table.mceToolbar').siblings('table.mceToolbar');
			jQuery(sec_rows).each(function(k,row){
				if ( !jQuery(row).hasClass('mceToolbarRow2') ) {
					jQuery(row).toggle();
				}
			});
		});
	}
}
