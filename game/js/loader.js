////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
 function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(checkMobileOrientation, 1000);
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/logo_p.png', id:'logoP'},
			{src:'assets/button_play.png', id:'buttonPlay'},

			{src:'assets/item_status.png', id:'itemStatus'},
			{src:'assets/item_score.png', id:'itemScore'},
			{src:'assets/item_won.png', id:'itemWon'},
			{src:'assets/item_result_h.png', id:'itemResultH'},
			{src:'assets/button_reveal.png', id:'buttonReveal'},
			{src:'assets/button_cards.png', id:'buttonAllCards'},
			{src:'assets/button_buy_again.png', id:'buttonBuyAgain'},
			{src:'assets/button_buy.png', id:'buttonBuy'},
			{src:'assets/button_arrow.png', id:'buttonArrow'},
			{src:'assets/item_coin.png', id:'itemCoin'},
			{src:'assets/item_coin_scratch.png', id:'itemCoinScratch'},
		
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/item_pop.png', id:'itemPop'},
			{src:'assets/item_pop_p.png', id:'itemPopP'},
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_music_on.png', id:'buttonMusicOn'},
			{src:'assets/button_music_off.png', id:'buttonMusicOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'}
	];

	for(var n=0; n<cardsSettings.length; n++){
		manifest.push({src:cardsSettings[n].assets.landscape.background, id:'landscapeCardBg'+n});
		manifest.push({src:cardsSettings[n].assets.portrait.background, id:'portraitCardBg'+n});

		manifest.push({src:cardsSettings[n].assets.landscape.logo, id:'landscapeCardLogo'+n});
		manifest.push({src:cardsSettings[n].assets.portrait.logo, id:'portraitCardLogo'+n});

		manifest.push({src:cardsSettings[n].assets.landscape.scratch, id:'landscapeCardScratch'+n});
		manifest.push({src:cardsSettings[n].assets.portrait.scratch, id:'portraitCardScratch'+n});

		for(var p=0; p<cardsSettings[n].prizes.length; p++){
			if(cardsSettings[n].prizes[p].image != ''){
				manifest.push({src:cardsSettings[n].prizes[p].image, id:'card'+n+'Prize'+p});
			}
		}

		for(var p=0; p<cardsSettings[n].bonus.length; p++){
			if(cardsSettings[n].bonus[p].image != ''){
				manifest.push({src:cardsSettings[n].bonus[p].image, id:'card'+n+'Bonus'+p});
			}
		}

		for(var p=0; p<cardsSettings[n].symbols.length; p++){
			if(cardsSettings[n].symbols[p].image != ''){
				manifest.push({src:cardsSettings[n].symbols[p].image, id:'card'+n+'Symbol'+p});
			}
		}
	}

	//memberpayment
	if(typeof memberData != 'undefined' && memberSettings.enableMembership){
		addMemberRewardAssets();
	}
	
	if ( typeof addScoreboardAssets == 'function' ) { 
		addScoreboardAssets();
	}
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}else{
		if(!enableDesktopSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/sound_click.ogg', id:'soundButton'});
		manifest.push({src:'assets/sounds/sound_result.ogg', id:'soundResult'});
		manifest.push({src:'assets/sounds/sound_start.ogg', id:'soundStart'});
		manifest.push({src:'assets/sounds/sound_over.ogg', id:'soundOver'});
		manifest.push({src:'assets/sounds/sound_card.ogg', id:'soundCard'});
		manifest.push({src:'assets/sounds/sound_lose.ogg', id:'soundLose'});
		manifest.push({src:'assets/sounds/sound_win.ogg', id:'soundWin'});
		manifest.push({src:'assets/sounds/sound_error.ogg', id:'soundError'});
		manifest.push({src:'assets/sounds/sound_coin.ogg', id:'soundCoin'});
		manifest.push({src:'assets/sounds/sound_scratch.ogg', id:'soundScratch'});
		manifest.push({src:'assets/sounds/sound_scratching.ogg', id:'soundScratching'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}