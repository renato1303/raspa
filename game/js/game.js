
////////////////////////////////////////////////////////////
// GAME v1.2
////////////////////////////////////////////////////////////

$.editor = {enable:false};
var playerData = {credit:0};
var gameData = {paused:true, cardIndex:0, cardW:550, cardH:450, scratch:false, scratchShape:null, lastX:0, lastY:0};
var tweenData = {score:0, tweenScore:0};
var gravityData = {animate:false, total:10, gravity:1, drag:.99, range:100};
var rotateData = {
	angle:0,
	landscape:{
		scale:.9,
		radiusX:0,
		radiusY:45
	},
	portrait:{
		scale:.9,
		radiusX:0,
		radiusY:65
	}
};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});

	if($.browser.mobile || isTablet){
		
	}else{
		var isInIframe = (window.location != window.parent.location) ? true : false;
		if(isInIframe){
			$(window).blur(function() {
				appendFocusFrame();
			});
			appendFocusFrame();
        }
	}

	buttonPlay.cursor = "pointer";
	buttonPlay.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('game');
	});

	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		stopGame();
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('result');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	buttonArrowL.cursor = "pointer";
	buttonArrowL.addEventListener("click", function(evt) {
		toggleCards(false);
	});

	buttonArrowR.cursor = "pointer";
	buttonArrowR.addEventListener("click", function(evt) {
		toggleCards(true);
	});

	buttonBuy.cursor = "pointer";
	buttonBuy.addEventListener("click", function(evt) {
		tryBuyCard();
	});

	buttonBuyAgain.cursor = "pointer";
	buttonBuyAgain.addEventListener("click", function(evt) {
		tryBuyCard();
	});

	buttonAllCards.cursor = "pointer";
	buttonAllCards.addEventListener("click", function(evt) {
		playSound('soundButton');
		showAllCards();
	});

	buttonReveal.cursor = "pointer";
	buttonReveal.addEventListener("click", function(evt) {
		playSound('soundButton');
		revealPrizes();
	});

	buildCoinGravity();
	setupScratchEvents();
	rotateData.drumGap = 100 / cardsSettings.length;
	for(var n=0; n<cardsSettings.length; n++){
		$.cards['select'+n] = new createjs.Container();
		$.cards['landscapeSelect'+n] = new createjs.Container();
		$.cards['portraitSelect'+n] = new createjs.Container();

		$.cards['select'+n].addChild($.cards['landscapeSelect'+n], $.cards['portraitSelect'+n]);
		cardSelectContainer.addChild($.cards['select'+n]);

		gameData.cardIndex = n;
		cacheCard('landscape',n);
		cacheCard('portrait',n);

		$.cards['select'+n].angle = $.cards['select'+n].oriAngle = -(n * ((Math.PI * 2) / cardsSettings.length));
		$.cards['select'+n].oriRotate = randomIntFromInterval(-5,5);
	}
	gameData.cardIndex = 0;
}

function cacheCard(viewportMode, index){
	createCard();
	resizeCardLayout(viewportMode);

	var pos = {x:0, y:0, w:0, h:0};
	if(viewportMode == 'landscape'){
		pos = {x:-gameData.cardW, y:-(gameData.cardH/2), w:gameData.cardW*2, h:gameData.cardH};
	}else{
		pos = {x:-(gameData.cardW/2), y:-gameData.cardH, w:gameData.cardW, h:gameData.cardH*2};
	}
	cardContainer.cache(pos.x,pos.y,pos.w,pos.h);
	var url = cardContainer.cacheCanvas.toDataURL();
	var urlImg = new Image();
	urlImg.src = url;
	cardContainer.uncache();
	
	urlImg.onload = function() {
		var bitmap = new createjs.Bitmap(urlImg);
		centerReg(bitmap);
		$.cards[viewportMode+'Select'+index].addChild(bitmap);
		resizeGameLayout();
	};
}


/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			togglePop(false);
			playSound('soundResult');

			tweenData.tweenScore = 0;
			TweenMax.to(tweenData, .5, {tweenScore:playerData.credit, overwrite:true, onUpdate:function(){
				resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', addCommas(Math.floor(tweenData.tweenScore)));
			}});

			saveGame(playerData.credit);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.paused = false;
	gameData.cardIndex = 0;

	playerData.credit = gameSettings.credit;
	updateGameScore();
	
	showGameStatus();
	showWonStatus();
	toggleScratch(false);
	showAllCards();

	//memberpayment
	if(typeof memberData != 'undefined' && memberSettings.enableMembership){
		playerData.credit = memberData.point;
		if(!checkMemberGameType()){
			goMemberPage('user');
		}
	}
	updateGameScore();
}

function toggleScratch(con){
	itemCoinScratch.alpha = 1;
	itemCoinScratch.visible = con;
	gameData.scratch = con;
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	TweenMax.killAll(false, true, false);
	gameData.paused = true;
	stopSoundLoop('soundScratching');
	stopSoundLoop('soundScratch');
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * RESIZE GAME LAYOUT - This is the function that runs for resize game layout
 * 
 */
function resizeGameLayout(){
	cardContainer.x = cardSelectContainer.x = canvasW/2;
	cardContainer.y = cardSelectContainer.y = canvasH/2;

	scoreContainer.x = (offset.x + 10) + gameSettings.score.x;
	scoreContainer.y = (offset.y + 10) + gameSettings.score.y;

	var viewportMode = 'landscape';
	if(viewport.isLandscape){
		cardActionContainer.x = canvasW/2;
		cardActionContainer.y = canvasH/100 * 83;

		wonContainer.x = (offset.x + 270) + gameSettings.score.x;
		wonContainer.y = (offset.y + 32) + gameSettings.score.y;
	}else{
		viewportMode = 'portrait';
		cardActionContainer.x = canvasW/2;
		cardActionContainer.y = canvasH/100 * 91;

		wonContainer.x = scoreContainer.x + 50;
		wonContainer.y = scoreContainer.y + 80;
	}

	for(var n=0; n<cardsSettings.length; n++){
		$.cards['landscapeSelect'+n].visible = false;
		$.cards['portraitSelect'+n].visible = false;

		$.cards[viewportMode+'Select'+n].visible = true;
	}

	resizeCardLayout(viewportMode);
}

/*!
 * 
 * ANIMATION - This is the function that runs for card animation
 * 
 */
function animateBlink(obj, alpha){
	var alphaNum = alpha == undefined ? 1 : alpha;
	obj.alpha = alphaNum;
	TweenMax.to(obj, .3, {alpha:.5, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .3, {alpha:alphaNum, overwrite:true, onComplete:animateBlink, onCompleteParams:[obj, alpha]});	
	}});
}

function killAnimateBlink(obj){
	obj.visible = false;
	TweenMax.killTweensOf(obj);
}

function animatePrize(obj, alpha){
	var scaleNum = 1;
	var alphaNum = alpha == undefined ? 1 : alpha;
	obj.alpha = alphaNum;
	TweenMax.to(obj, .3, {alpha:.5, scaleX:scaleNum, scaleY:scaleNum, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .3, {alpha:alphaNum, scaleX:1, scaleY:1, overwrite:true, onComplete:animatePrize, onCompleteParams:[obj, alpha]});	
	}});
}

function animateCredit(){
	var scaleNum = 1.5;
	TweenMax.to(gameScoreTxt, .2, {scaleX:scaleNum, scaleY:scaleNum, overwrite:true, onComplete:function(){
		TweenMax.to(gameScoreTxt, .2, {scaleX:1, scaleY:1, overwrite:true});	
	}});

	TweenMax.to(gameScoreRedTxt, .2, {alpha:1, scaleX:scaleNum, scaleY:scaleNum, overwrite:true, onComplete:function(){
		TweenMax.to(gameScoreRedTxt, .2, {alpha:0, scaleX:1, scaleY:1, overwrite:true});	
	}});
}

/*!
 * 
 * TOGGLE CARDS - This is the function that runs for change select cards
 * 
 */
function toggleCards(con){
	if(!con){
		gameData.cardIndex--;
		gameData.cardIndex = gameData.cardIndex < 0 ? 0 : gameData.cardIndex;
	}else{
		gameData.cardIndex++;
		gameData.cardIndex = gameData.cardIndex >= cardsSettings.length-1 ? cardsSettings.length-1 : gameData.cardIndex;
	}

	playSound('soundCard');
	showSelectCard(false);
	showCardButtons('select');
}

/*!
 * 
 * SHOW CARD BUTTONS - This is the function that runs to show card buttons
 * 
 */
function showCardButtons(con){
	buttonReveal.visible = false;
	buttonAllCards.visible = false;
	buttonBuyAgain.visible = false;

	buttonBuy.visible = false;
	buttonArrowL.visible = false;
	buttonArrowR.visible = false;

	buyTxt.visible = false;
	buyAgainTxt.visible = false;
	scratchTxt.visible = false;

	var cardPrice = addCommas(cardsSettings[gameData.cardIndex].price.value);
	if(con == 'select'){
		buttonBuy.visible = true;
		buttonArrowL.visible = true;
		buttonArrowR.visible = true;
		buyTxt.visible = true;
		buyTxt.text = textDisplay.buy.replace('[NUMBER]', cardPrice);

		if(gameData.cardIndex <= 0){
			buttonArrowL.visible = false;
		}

		if(gameData.cardIndex == cardsSettings.length-1 && cardsSettings.length > 1){
			buttonArrowR.visible = false;
		}

		if(gameData.cardIndex == 0 && cardsSettings.length == 1){
			buttonArrowR.visible = false;
		}
	}else if(con == 'reveal'){
		buttonReveal.visible = true;
	}else if(con == 'complete'){
		buttonAllCards.visible = true;
		buttonBuyAgain.visible = true;
		buyAgainTxt.visible = true;
		buyAgainTxt.text = textDisplay.buyAgain.replace('[NUMBER]', cardPrice);
	}
}

/*!
 * 
 * CREATE CARD - This is the function that runs to create new card
 * 
 */
function showAllCards(){
	toggleCoinsFall(false);
	showCardButtons('select');
	showSelectCard(true);

	cardSelectContainer.visible = true;
	cardContainer.visible = false;
}

function showSelectCard(con){
	for(var n=0; n<cardsSettings.length; n++){
		//animation
		var scaleX = .9;
		var scaleY = .9;
		var rotation = 0;

		if(n != gameData.cardIndex){
			randomX = randomIntFromInterval(-100,100);
			randomY = randomIntFromInterval(-50,50);
			rotation = randomIntFromInterval(-10,10);
			scaleX = scaleY = .8;
		}else{
			if(con)
				$.cards['select'+n].scaleX = $.cards['select'+n].scaleY = 1;
		}
	}
}

/*!
 * 
 * CREATE CARD - This is the function that runs to create new card
 * 
 */
function createCard(){
	cardBgContainer.removeAllChildren();
	cardLogoContainer.removeAllChildren();
	cardScratchContainer.removeAllChildren();

	for(var n=0; n<2; n++){
		var viewportMode = n == 0 ? 'landscape' : 'portrait';

		$.cards[viewportMode+'bg'] = new createjs.Bitmap(loader.getResult(viewportMode+'CardBg'+gameData.cardIndex));
		centerReg($.cards[viewportMode+'bg']);
		$.cards[viewportMode+'logo'] = new createjs.Bitmap(loader.getResult(viewportMode+'CardLogo'+gameData.cardIndex));
		$.cards[viewportMode+'design'] = new createjs.Bitmap(loader.getResult(viewportMode+'CardScratch'+gameData.cardIndex));

		var cardPriceTxt = new createjs.Text();
		cardPriceTxt.font = "35px montserratbold";
		cardPriceTxt.color = "#fff";
		cardPriceTxt.textAlign = "left";
		cardPriceTxt.textBaseline='alphabetic';
		cardPriceTxt.text = textDisplay.price.replace('[NUMBER]', addCommas(cardsSettings[gameData.cardIndex].price.value));
		cardPriceTxt.x = cardsSettings[gameData.cardIndex].price.x;
		cardPriceTxt.y = cardsSettings[gameData.cardIndex].price.y;

		var cardPriceShadowTxt = new createjs.Text();
		cardPriceShadowTxt.font = "35px montserratbold";
		cardPriceShadowTxt.color = "#000";
		cardPriceShadowTxt.textAlign = "left";
		cardPriceShadowTxt.textBaseline='alphabetic';
		cardPriceShadowTxt.text = textDisplay.price.replace('[NUMBER]', addCommas(cardsSettings[gameData.cardIndex].price.value));
		cardPriceShadowTxt.x = cardsSettings[gameData.cardIndex].price.x;
		cardPriceShadowTxt.y = cardsSettings[gameData.cardIndex].price.y + 3;
		
		cardBgContainer.addChild($.cards[viewportMode+'bg']);
		cardLogoContainer.addChild($.cards[viewportMode+'logo'], cardPriceShadowTxt, cardPriceTxt);

		var scratchArt = new createjs.Shape();
		$.cards[viewportMode+'scratch'] = new createjs.Container();
		$.cards[viewportMode+'scratch'].art = scratchArt;
		$.cards[viewportMode+'scratch'].cache(0,0,gameData.cardW,gameData.cardH);
		$.cards[viewportMode+'scratch'].addChild($.cards[viewportMode+'design'], scratchArt);
		$.cards[viewportMode+'scratch'].updateCache("source-over");
		$.cards[viewportMode+'scratch'].removeChild($.cards[viewportMode+'design']);
		
		cardScratchContainer.addChild($.cards[viewportMode+'scratch']);
	}

	var viewportMode = viewport.isLandscape == true ? 'landscape' : 'portrait';
	resizeCardLayout(viewportMode);
}

function resizeCardLayout(currentViewport){
	for(var n=0; n<2; n++){
		var viewportMode = n == 0 ? 'landscape' : 'portrait';
		$.cards[viewportMode+'bg'].visible = false;
		$.cards[viewportMode+'logo'].visible = false;
		$.cards[viewportMode+'scratch'].visible = false;
	}

	var viewportMode = 'landscape';
	if(currentViewport == 'landscape'){
		viewportMode = 'landscape';
		cardLogoContainer.x = -(gameData.cardW);
		cardLogoContainer.y = -(gameData.cardH/2);
		cardScratchContainer.x = cardPrizesContainer.x = 0;
		cardScratchContainer.y = cardPrizesContainer.y = -(gameData.cardH/2);
	}else{
		viewportMode = 'portrait';
		cardLogoContainer.x = -(gameData.cardW/2);
		cardLogoContainer.y = -(gameData.cardH);
		cardScratchContainer.x = cardPrizesContainer.x = -(gameData.cardW/2);
		cardScratchContainer.y = cardPrizesContainer.y = 0;
	}

	$.cards[viewportMode+'bg'].visible = true;
	$.cards[viewportMode+'logo'].visible = true;
	$.cards[viewportMode+'scratch'].visible = true;
}

/*!
 * 
 * CREATE PRIZES - This is the function that runs to create prizes
 * 
 */
function createPrizes(result){
	cardPrizesContainer.removeAllChildren();

	var matchedItems = cardsSettings[gameData.cardIndex].matchedItems;
	var bonusMax = cardsSettings[gameData.cardIndex].bonusMax;
	var totalPrizes = 0;
	var totalBonus = 0;
	var totalNumbers = 0;
	for(var n=0; n<cardsSettings[gameData.cardIndex].items.length; n++){
		var thisItemType = cardsSettings[gameData.cardIndex].items[n].type;
		if(thisItemType == 'prize'){
			totalPrizes++;
		}else if(thisItemType == 'bonus'){
			totalBonus++;
		}else if(thisItemType == 'number'){
			totalNumbers++;
		}else if(thisItemType == 'prize,bonus'){
			totalPrizes++;
			totalBonus++;
		}
	}

	var prizeArr = [];
	var bonusArr = [];
	gameData.prizeIndex = '';
	gameData.winNumbers = [];
	gameData.userNumbers = [];
	gameData.bonusSlots = [];
	gameData.symbols = fillSymbols();

	//numbers
	if(cardsSettings[gameData.cardIndex].numbers.length == 2){
		var startNumber = cardsSettings[gameData.cardIndex].numbers[0];
		var endNumber = cardsSettings[gameData.cardIndex].numbers[1];
		for(var n=startNumber; n<=endNumber; n++){
			gameData.userNumbers.push(n);
		}
		shuffle(gameData.userNumbers);
		gameData.winNumbers = gameData.userNumbers.slice();
		gameData.winNumbers.length = totalNumbers;
		gameData.userNumbers = gameData.userNumbers.splice(totalNumbers, totalPrizes);
	}

	//generate prizes
	if(result != undefined){
		gameData.prizeIndex = result.prize_index;
		prizeArr = result.prizes;
		bonusArr = result.bonus;
		gameData.winNumbers = result.win_numbers;
		gameData.userNumbers = result.user_numbers;
		gameData.bonusSlots = result.bonus_slots;
		gameData.symbols = result.symbols;
	}else{
		if(gameSettings.enablePercentage){
			createPercentage();
			prizeArr = getPrizesOnPercent(totalPrizes, matchedItems);
			bonusArr = getBonusOnPercent(totalBonus, matchedItems, bonusMax);
		}else{
			prizeArr = fillPrizes(totalPrizes, matchedItems, true);
			bonusArr = fillBonus(totalBonus, matchedItems, bonusMax, true);
		}
	}
	
	//insert prizes
	var targetArr;
	var targetArrIndex;
	var targetNumberArr;
	var targetNumberArrIndex;
	
	var prizeIndex = 0;
	var bonusIndex = 0;
	var winNumberIndex = 0;
	var userNumberIndex = 0;
	for(var n=0; n<cardsSettings[gameData.cardIndex].items.length; n++){
		$.prizes[n] = new createjs.Container();
		$.prizes[n].x = cardsSettings[gameData.cardIndex].items[n].x;
		$.prizes[n].y = cardsSettings[gameData.cardIndex].items[n].y;
		$.prizes[n].pos = [{x:$.prizes[n].x, y:$.prizes[n].y, active:false}];
		$.prizes[n].scratchPos = {x:0, y:0};
		$.prizes[n].lastX = 0;
		$.prizes[n].lastY = 0;
		$.prizes[n].bonus = false;
		cardPrizesContainer.addChild($.prizes[n]);

		var showImage = false;
		var showPrize = true;
		var showNumber = false;
		var imageName = '';

		var thisItemType = cardsSettings[gameData.cardIndex].items[n].type;
		if(thisItemType == 'prize,bonus'){
			targetArr = cardsSettings[gameData.cardIndex].prizes;
			targetArrIndex = prizeArr[prizeIndex];
			if(gameData.userNumbers.length > 0){
				showNumber = true;
				targetNumberArr = gameData.userNumbers;
				targetNumberArrIndex = userNumberIndex;
				showImage = targetArr[targetArrIndex].image != '' ? true : false;
				imageName = 'card'+gameData.cardIndex+'Prize'+targetArrIndex;
				userNumberIndex++;
			}

			if(gameData.bonusSlots[n] == 0){
				$.prizes[n].bonus = true;
				showNumber = false;
				targetArr = cardsSettings[gameData.cardIndex].bonus;
				targetArrIndex = bonusArr[bonusIndex];

				showImage = targetArr[targetArrIndex].image != '' ? true : false;
				imageName = 'card'+gameData.cardIndex+'Bonus'+targetArrIndex;
			}

			prizeIndex++;
			bonusIndex++;
		}else if(thisItemType == 'prize'){
			targetArr = cardsSettings[gameData.cardIndex].prizes;
			targetArrIndex = prizeArr[prizeIndex];

			if(gameData.symbols.length > 0){
				//insert symbols
				targetArr = cardsSettings[gameData.cardIndex].symbols;
				showImage = targetArr[targetArrIndex].image != '' ? true : false;
				imageName = 'card'+gameData.cardIndex+'Symbol'+targetArrIndex;
			}
			prizeIndex++;
			if(gameData.userNumbers.length > 0){
				showNumber = true;
				targetNumberArr = gameData.userNumbers;
				targetNumberArrIndex = userNumberIndex;
				userNumberIndex++;
			}
		}else if(thisItemType == 'bonus'){
			targetArr = cardsSettings[gameData.cardIndex].bonus;
			targetArrIndex = bonusArr[bonusIndex];
			showImage = targetArr[targetArrIndex].image != '' ? true : false;
			imageName = 'card'+gameData.cardIndex+'Bonus'+targetArrIndex;
			bonusIndex++;
		}else if(thisItemType == 'display'){
			targetArr = cardsSettings[gameData.cardIndex].prizes;
			targetArrIndex = gameData.prizeIndex;
		}else if(thisItemType == 'number'){
			showPrize = false;
			showNumber = true;
			targetNumberArr = gameData.winNumbers;
			targetNumberArrIndex = winNumberIndex;
			winNumberIndex++
		}

		if(showImage){
			var itemItemImg = new createjs.Bitmap(loader.getResult(imageName));
			centerReg(itemItemImg);
			itemItemImg.x = cardsSettings[gameData.cardIndex].items[n].image.offsetX;
			itemItemImg.y = cardsSettings[gameData.cardIndex].items[n].image.offsetY;
			$.prizes[n].addChild(itemItemImg);
		}

		if(showPrize){
			var itemPrizeTxt = new createjs.Text();
			itemPrizeTxt.font = targetArr[targetArrIndex].text.fontSize + "px montserratbold";
			itemPrizeTxt.lineHeight = targetArr[targetArrIndex].text.lineHeight;
			itemPrizeTxt.color = targetArr[targetArrIndex].text.color;
			itemPrizeTxt.textAlign = "center";
			itemPrizeTxt.textBaseline='middle';
			itemPrizeTxt.text = targetArr[targetArrIndex].text.display;
			itemPrizeTxt.prizeValue = targetArr[targetArrIndex].value;
			itemPrizeTxt.x = cardsSettings[gameData.cardIndex].items[n].prize.offsetX;
			itemPrizeTxt.y = cardsSettings[gameData.cardIndex].items[n].prize.offsetY;

			$.prizes[n].itemType = thisItemType;
			$.prizes[n].itemTypeIndex = targetArrIndex;
			$.prizes[n].addChild(itemPrizeTxt);
		}

		if(showNumber){
			var itemNumberTxt = new createjs.Text();
			itemNumberTxt.font = cardsSettings[gameData.cardIndex].items[n].number.fontSize + "px montserratbold";
			itemNumberTxt.lineHeight = cardsSettings[gameData.cardIndex].items[n].number.lineHeight;
			itemNumberTxt.color = cardsSettings[gameData.cardIndex].items[n].number.color;
			itemNumberTxt.textAlign = "center";
			itemNumberTxt.textBaseline='middle';
			itemNumberTxt.text = targetNumberArr[targetNumberArrIndex];
			itemNumberTxt.x = cardsSettings[gameData.cardIndex].items[n].number.offsetX;
			itemNumberTxt.y = cardsSettings[gameData.cardIndex].items[n].number.offsetY;

			$.prizes[n].itemType = thisItemType;
			$.prizes[n].userNumber = targetNumberArr[targetNumberArrIndex];
			$.prizes[n].addChild(itemNumberTxt);
		}

		//create area
		var strokeX = gameSettings.scratchStrokeNum[1];
		var strokeY = gameSettings.scratchStrokeNum[1]/1.5;
		var pos = {x:$.prizes[n].x, y:$.prizes[n].y, startX:$.prizes[n].x, startY:$.prizes[n].y, strokeX:0, strokeY:0};
		for(var l=0; l<100; l++){
			for(var p=0; p<4; p++){
				var shapePoint = new createjs.Shape();
				if(guide){
					shapePoint.graphics.beginFill('red').drawCircle(0,0,3);
				}

				pos.strokeX = strokeX*(l+1);
				pos.strokeY = strokeY*(l+1);

				if(pos.strokeX >= cardsSettings[gameData.cardIndex].items[n].width){
					pos.strokeX = cardsSettings[gameData.cardIndex].items[n].width;
				}

				if(pos.strokeY >= cardsSettings[gameData.cardIndex].items[n].height){
					pos.strokeY = cardsSettings[gameData.cardIndex].items[n].height;
				}
				
				if(p == 0){
					pos.x = pos.startX-pos.strokeX;
					pos.y = pos.startY;
				}else if(p == 1){
					pos.x = pos.startX;
					pos.y = pos.startY-pos.strokeY;
				}else if(p == 2){
					pos.x = pos.startX+pos.strokeX;
					pos.y = pos.startY;
				}else if(p == 3){
					pos.x = pos.startX;
					pos.y = pos.startY+pos.strokeY;
				}
				shapePoint.x = pos.x;
				shapePoint.y = pos.y;

				$.prizes[n].pos.push({x:pos.x, y:pos.y, active:false});
				cardPrizesContainer.addChild(shapePoint);
			}

			if(pos.strokeX >= cardsSettings[gameData.cardIndex].items[n].width && pos.strokeY >= cardsSettings[gameData.cardIndex].items[n].height){
				l = 100;
			}
		}
	}
}

/*!
 * 
 * FILL PRIZE & BONUS - This is the function that runs for game to fill prizes and bonus
 * 
 */
function fillSymbols(){
	var returnArr = [];
	for(var p=0; p<cardsSettings[gameData.cardIndex].symbols.length; p++){
		returnArr.push(p);
	}
	shuffle(returnArr);
	return returnArr;
}

function fillPrizes(total, matchedItems, prize){
	var isWinNumber = gameData.winNumbers.length > 0 ? true : false;
	var returnArr = [];
	for(var p=0; p<cardsSettings[gameData.cardIndex].prizes.length; p++){
		if(matchedItems != 0){
			for(var l=0; l<matchedItems-1; l++){
				returnArr.push(p);
			}
		}else{
			returnArr.push(p);
		}
	}

	shuffle(returnArr);
	gameData.prizeIndex = returnArr[0];
	returnArr.length = total;

	if(prize){
		if(matchedItems != 0){
			if(getWinRatio()[0] == 1){
				var prizeIndex = Math.floor(Math.random()*cardsSettings[gameData.cardIndex].prizes.length);
				for(var n=0; n<matchedItems; n++){
					returnArr[n] = prizeIndex;

					var totalMatched = 0;
					for(var l=0; l<returnArr.length; l++){
						if(returnArr[l] == prizeIndex){
							totalMatched++;
						}
					}
					if(totalMatched == matchedItems){
						n = matchedItems;
					}
				}
			}
		}else{
			for(var n=0; n<total; n++){
				var prizeIndex = Math.floor(Math.random()*cardsSettings[gameData.cardIndex].prizes.length);
				if(isWinNumber){
					if(getWinRatio()[0] == 1){
						var randomWinNumber = Math.floor(Math.random() * gameData.winNumbers.length);
						gameData.userNumbers[n] = gameData.winNumbers[randomWinNumber];
						returnArr[n] = prizeIndex;
					}
				}else{
					returnArr[n] = prizeIndex;
				}
			}
		}
	}

	shuffle(returnArr);
	return returnArr;
}

function fillBonus(total, matchedItems, bonusMax, prize){
	var returnArr = [];
	for(var p=0; p<cardsSettings[gameData.cardIndex].bonus.length; p++){
		if(matchedItems != 0){
			for(var l=0; l<matchedItems-1; l++){
				returnArr.push(p);
			}
		}else{
			returnArr.push(p);
		}
	}
	returnArr.length = total;

	if(prize){
		for(var n=0; n<total; n++){
			var prizeIndex = Math.floor(Math.random()*cardsSettings[gameData.cardIndex].bonus.length);
			if(prizeIndex != -1){
				returnArr[n] = prizeIndex;
			}
		}
	}

	shuffle(returnArr);

	//slots
	if(bonusMax > 0){
		gameData.bonusSlots = [];
		var randomTotalFill = randomIntFromInterval(0,bonusMax);
		for(var n=0; n<total; n++){
			if(n < randomTotalFill){
				gameData.bonusSlots.push(0);
			}else{
				gameData.bonusSlots.push(-1);
			}
		}
		shuffle(gameData.bonusSlots);
	}

	return returnArr;
}

function getWinRatio(){
	var winRatio = [0,0,0,1];
	shuffle(winRatio);
	return winRatio;
}

/*!
 * 
 * PERCENTAGE - This is the function that runs to create result percentage
 * 
 */
function createPercentage(){
	var totalPercent = 0;
	gameData.percentagePrizesArray = [];
	for(var n=0; n<cardsSettings[gameData.cardIndex].prizes.length; n++){
		var percent = cardsSettings[gameData.cardIndex].prizes[n].percent;
		if(!isNaN(percent)){
			if(percent > 0){
				totalPercent += percent;
				for(var p=0; p<percent; p++){
					gameData.percentagePrizesArray.push(n);
				}
			}
		}
	}
	
	var noResultPercent = cardsSettings[gameData.cardIndex].overallPercent - totalPercent;
	for(var n=0; n<noResultPercent; n++){
		gameData.percentagePrizesArray.push(-1);
	}

	var totalPercent = 0;
	gameData.percentageBonusArray = [];
	for(var n=0; n<cardsSettings[gameData.cardIndex].bonus.length; n++){
		var percent = cardsSettings[gameData.cardIndex].bonus[n].percent;
		if(!isNaN(percent)){
			if(percent > 0){
				totalPercent += percent;
				for(var p=0; p<percent; p++){
					gameData.percentageBonusArray.push(n);
				}
			}
		}
	}
	
	var noResultPercent = cardsSettings[gameData.cardIndex].overallPercent - totalPercent;
	for(var n=0; n<noResultPercent; n++){
		gameData.percentageBonusArray.push(-1);
	}
}

function getPrizesOnPercent(total, matchedItems){
	shuffle(gameData.percentagePrizesArray);
	var isWinNumber = gameData.winNumbers.length > 0 ? true : false;
	var prizesResult = fillPrizes(total, matchedItems, false);

	if(matchedItems != 0){
		var percentIndex = gameData.percentagePrizesArray[0];
		if(percentIndex != -1){
			gameData.prizeIndex = percentIndex;
			if(gameData.symbols.length > 0){
				//replace symbols
				percentIndex = Math.floor(Math.random()*gameData.symbols.length);
			}

			for(var n=0; n<matchedItems; n++){
				prizesResult[n] = percentIndex;

				var totalMatched = 0;
				for(var l=0; l<prizesResult.length; l++){
					if(prizesResult[l] == percentIndex){
						totalMatched++;
					}
				}
				if(totalMatched == matchedItems){
					n = matchedItems;
				}
			}
			shuffle(prizesResult);
		}
	}else{
		for(var n=0; n<total; n++){
			shuffle(gameData.percentagePrizesArray);
			var percentIndex = gameData.percentagePrizesArray[n];
			if(percentIndex != -1){
				if(isWinNumber){
					var randomWinNumber = Math.floor(Math.random() * gameData.winNumbers.length);
					gameData.userNumbers[n] = gameData.winNumbers[randomWinNumber];
					prizesResult[n] = percentIndex;
				}else{
					prizesResult[n] = percentIndex;
				}
			}
		}
	}
	
	return prizesResult;
}

function getBonusOnPercent(total, matchedItems, bonusMax){
	var bonusResult = fillBonus(total, matchedItems, bonusMax, false);

	for(var n=0; n<total; n++){
		shuffle(gameData.percentageBonusArray);
		var percentIndex = gameData.percentageBonusArray[n];
		if(percentIndex != -1){
			bonusResult[n] = percentIndex;
		}
	}
	
	return bonusResult;
}

/*!
 * 
 * BUY CARD - This is the function that runs to buy card
 * 
 */
function tryBuyCard(){
	//memberpayment
	if(typeof memberData != 'undefined' && memberSettings.enableMembership){
		if(!checkMemberGameType()){
			goMemberPage('user');
		}else{
			buyCard();
		}
	}else{
		buyCard();
	}
}

function buyCard(){
	//memberpayment
	if(typeof memberData != 'undefined' && memberSettings.enableMembership && !memberData.ready){
		return;
	}

	if(playerData.credit < cardsSettings[gameData.cardIndex].price.value){
		animateCredit();
		playSound('soundError');
		return;
	}

	playerData.credit -= cardsSettings[gameData.cardIndex].price.value;
	updateGameScore();
	showWonStatus();
	showCardButtons();
	toggleCoinsFall(false);

	//memberpayment
	if(typeof memberData != 'undefined' && memberSettings.enableMembership){
		getUserResult("proceedValidatCard", gameData.cardIndex+1);
	}else{
		proceedValidatCard();
	}
}

function proceedValidatCard(result){
	playSound('soundCard');
	playSound('soundStart');

	cardSelectContainer.visible = false;
	cardContainer.visible = true;
	
	showGameStatus(textDisplay.scratch, .5);
	showCardButtons('reveal');

	createCard();
	createPrizes(result);
	toggleScratch(true);

	cardMoveContainer.scaleX = cardMoveContainer.scaleY = $.cards['select'+gameData.cardIndex].scaleX;
	TweenMax.to(cardMoveContainer, .3, {x:0, y:0, alpha:1, rotation:0, scaleX:1, scaleY:1, ease:Expo.easeOut, overwrite:true});
}

/*!
 * 
 * SETUP SCRATCH EVENTS - This is the function that runs to scratch events
 * 
 */
function setupScratchEvents(){
	stage.on("stagemousedown", startScratch);
	stage.on("stagemousemove", moveScratch);
	stage.on("stagemouseup", endScratch);
}

function startScratch(evt) {
	if(gameData.scratch){
		itemCoinScratch.alpha = .5;
		var point = cardScratchContainer.globalToLocal(evt.stageX, evt.stageY);
		gameData.lastX = point.x;
		gameData.lastY = point.y;
		gameData.scratching = true;
		moveScratch(evt);
	}
}

function moveScratch(evt) {
	if(gameData.scratching){
		playSoundLoop('soundScratching');

		var point = cardScratchContainer.globalToLocal(evt.stageX, evt.stageY);
		for(var n=0; n<2; n++){
			var viewportMode = n == 0 ? 'landscape' : 'portrait';
			var scratchShape = $.cards[viewportMode+'scratch'].art;
			var strokeNum = randomIntFromInterval(gameSettings.scratchStrokeNum[0], gameSettings.scratchStrokeNum[1]);
			scratchShape.graphics.ss(strokeNum,1).s('#ccff00').mt(gameData.lastX,gameData.lastY).lt(point.x, point.y);
			$.cards[viewportMode+'scratch'].updateCache("destination-out");
			scratchShape.graphics.clear();
		}
		
		gameData.lastX = point.x;
		gameData.lastY = point.y;

		updateScratchPercent(point);
	}
}

function endScratch(evt) {
	if(gameData.scratching){
		itemCoinScratch.alpha = 1;
		stopSoundLoop('soundScratching');
		gameData.scratching = false;
		checkScratchComplete();
	}
}

function updateScratchPercent(point){
	for(var n=0; n<cardsSettings[gameData.cardIndex].items.length; n++){
		for(var p=0; p<$.prizes[n].pos.length; p++){
			if(!$.prizes[n].pos[p].active){
				var strokeDistance = getDistance($.prizes[n].pos[p].x, $.prizes[n].pos[p].y, point.x, point.y);
				if(strokeDistance <= gameSettings.scratchStrokeNum[1]/2){
					$.prizes[n].pos[p].active = true;
				}
			}
		}
	}
}

function checkScratchComplete(){
	var completeCount = 0;
	for(var n=0; n<cardsSettings[gameData.cardIndex].items.length; n++){
		var prizeRevealed = 0;
		for(var p=0; p<$.prizes[n].pos.length; p++){
			if($.prizes[n].pos[p].active){
				prizeRevealed++;
			}
		}

		if(prizeRevealed >= $.prizes[n].pos.length-1){
			completeCount++;
		}
	}

	if(completeCount >= cardsSettings[gameData.cardIndex].items.length){
		toggleScratch(false);
		showScratchComplete();
	}
}

/*!
 * 
 * SCRATCH COMPLETE - This is the function that runs for game scratch complete
 * 
 */
function showScratchComplete(){
	showCardButtons('complete');
	var totalWin = 0;
	var matchedItems = cardsSettings[gameData.cardIndex].matchedItems;
	var userWinNumbers = [];
	var isWinNumber = gameData.winNumbers.length > 0 ? true : false;
	if(matchedItems != 0){
		var matchArr = [];
		var targetPrizeObj = null;
		for(var n=0; n<cardsSettings[gameData.cardIndex].items.length; n++){
			var itemType = $.prizes[n].itemType;
			var itemIndex = $.prizes[n].itemTypeIndex;

			if(itemType == 'prize'){
				var findIndex = matchArr.findIndex(x => x.index === itemIndex);
				if(findIndex == -1){
					matchArr.push({index:itemIndex, arr:[n]});
				}else{
					matchArr[findIndex].arr.push(n);
				}
			}else if(itemType == 'display'){
				targetPrizeObj = $.prizes[n];
			}
		}

		for(var n=0; n<matchArr.length; n++){
			if(matchArr[n].arr.length >= matchedItems){				
				totalWin = cardsSettings[gameData.cardIndex].prizes[matchArr[n].index].value;
				for(var p=0; p<matchArr[n].arr.length; p++){
					setColorFilter($.prizes[matchArr[n].arr[p]]);
					animatePrize($.prizes[matchArr[n].arr[p]]);
				}

				if(targetPrizeObj != null){
					totalWin = cardsSettings[gameData.cardIndex].prizes[targetPrizeObj.itemTypeIndex].value;
					setColorFilter(targetPrizeObj);
					animatePrize(targetPrizeObj);
				}
			}
		}
	}else{
		for(var n=0; n<cardsSettings[gameData.cardIndex].items.length; n++){
			var itemType = $.prizes[n].itemType;
			var itemIndex = $.prizes[n].itemTypeIndex;
			var itemNumber = $.prizes[n].userNumber;
			var itemBonus = $.prizes[n].bonus;
			var prizeValue = 0;

			if(isWinNumber){
				var isWin = false;
				if(itemType == 'prize,bonus'){
					if(itemBonus){
						if(cardsSettings[gameData.cardIndex].bonus[itemIndex].value > 0){
							isWin = true;
							totalWin += cardsSettings[gameData.cardIndex].bonus[itemIndex].value;
						}
					}else{
						if(gameData.winNumbers.indexOf(itemNumber) != -1 && cardsSettings[gameData.cardIndex].prizes[itemIndex].value > 0){
							userWinNumbers.push(itemNumber);
							isWin = true;
							totalWin += cardsSettings[gameData.cardIndex].prizes[itemIndex].value;
						}
					}
				}else if(itemType == 'prize'){
					if(gameData.winNumbers.indexOf(itemNumber) != -1){
						userWinNumbers.push(itemNumber);
						isWin = true;
						totalWin += cardsSettings[gameData.cardIndex].prizes[itemIndex].value;
					}
				}else if(itemType == 'bonus'){
					if(cardsSettings[gameData.cardIndex].bonus[itemIndex].value > 0){
						isWin = true;
						totalWin += cardsSettings[gameData.cardIndex].bonus[itemIndex].value;
					}
				}

				if(isWin){
					setColorFilter($.prizes[n]);
					animatePrize($.prizes[n]);
				}
			}else{
				if(itemType == 'prize'){
					prizeValue = cardsSettings[gameData.cardIndex].prizes[itemIndex].value;
				}else if(itemType == 'bonus'){
					prizeValue = cardsSettings[gameData.cardIndex].bonus[itemIndex].value;
				}

				if(prizeValue > 0){
					setColorFilter($.prizes[n]);
					animatePrize($.prizes[n]);
					totalWin += prizeValue;
				}
			}
		}

		for(var n=0; n<cardsSettings[gameData.cardIndex].items.length; n++){
			var itemType = $.prizes[n].itemType;
			var itemNumber = $.prizes[n].userNumber;

			if(isWinNumber){
				var isWin = false;
				if(itemType == 'number'){
					if(userWinNumbers.indexOf(itemNumber) != -1){
						isWin = true;
					}
				}

				if(isWin){
					setColorFilter($.prizes[n]);
					animatePrize($.prizes[n]);
				}
			}
		}
	}

	if(totalWin > 0){
		playerData.credit += totalWin;
		updateGameScore();
		showWonStatus(totalWin);
		toggleCoinsFall(true);
		playSound('soundWin');
	}else{
		playSound('soundLose');
		if(playerData.credit <= 0){
			showCardButtons();
			showGameStatus(textDisplay.noCredit, 2);
			endGame();
		}
	}

	//memberpayment
	if(typeof memberData != 'undefined' && memberSettings.enableMembership){
		var returnPoint = {chance:0, point:playerData.credit, score:0};
		matchUserResult(undefined, returnPoint);
	}
}

function setColorFilter(obj){
	obj.filters = [
		new createjs.ColorFilter(0,0,0,1,gameSettings.winColorFilter[0],gameSettings.winColorFilter[1],gameSettings.winColorFilter[2],0)
	];
	var cacheW = 200;
	var cacheH = 100;
	obj.cache(-(cacheW/2), -(cacheH/2), cacheW, cacheH);
}

/*!
 * 
 * REVEAL PRIZES - This is the function that runs to reveal prizes
 * 
 */
function revealPrizes(){
	playSoundLoop('soundScratch');
	toggleScratch(false);
	gameData.revealCount = 0;
	for(var n=0; n<cardsSettings[gameData.cardIndex].items.length; n++){
		var scratchShape = $.prizes[n].scratchPos;
		var strokePosition = $.prizes[n].pos;
		scratchShape.x = $.prizes[n].lastX = strokePosition[0].x;
		scratchShape.y = $.prizes[n].lastY = strokePosition[0].y;
		shuffle(strokePosition);

		var tweenSpeed = strokePosition.length * gameSettings.revealSpeed;
		var delayNum = n*.1;
		TweenMax.to(scratchShape, tweenSpeed, {delay:delayNum, bezier:{type:"thru", values:strokePosition, curviness:gameSettings.revealCurviness, autoRotate:false}, ease:Linear.easeNone, overwrite:true, onUpdate:revealUpdate, onUpdateParams:[n], onComplete:revealPrizesComplete});
	}
	showCardButtons();
}

function revealUpdate(index){
	var scratchShape = $.prizes[index].scratchPos;
	var point = {x:scratchShape.x, y:scratchShape.y};
	for(var n=0; n<2; n++){
		var viewportMode = n == 0 ? 'landscape' : 'portrait';
		var scratchShape = $.cards[viewportMode+'scratch'].art;
		var strokeNum = randomIntFromInterval(gameSettings.revealScratchStrokeNum[0], gameSettings.revealScratchStrokeNum[1]);
		scratchShape.graphics.ss(strokeNum,1).s('#ccff00').mt($.prizes[index].lastX,$.prizes[index].lastY).lt(point.x, point.y);
		$.cards[viewportMode+'scratch'].updateCache("destination-out");
		scratchShape.graphics.clear();
	}
	
	$.prizes[index].lastX = point.x;
	$.prizes[index].lastY = point.y;
}

function revealPrizesComplete(){
	gameData.revealCount++;
	if(gameData.revealCount >= cardsSettings[gameData.cardIndex].items.length){
		stopSoundLoop('soundScratch');
		showScratchComplete();
	}
}

/*!
 * 
 * GAME STATUS - This is the function that runs for game status update
 * 
 */
function updateGameScore(){
	gameScoreRedTxt.alpha = 0;
	TweenMax.to(tweenData, .5, {tweenScore:playerData.credit, overwrite:true, onUpdate:function(){
		gameScoreTxt.text = gameScoreRedTxt.text = textDisplay.price.replace('[NUMBER]', addCommas(Math.floor(tweenData.tweenScore)));
	}});
}

function showWonStatus(score){
	var showWon = score == undefined ? false : true;
	wonContainer.visible = showWon;

	if(showWon){
		gameWonTxt.text = textDisplay.won.replace('[NUMBER]', addCommas(score));
		wonMoveContainer.x = 50;
		TweenMax.to(wonMoveContainer, 1, {x:0, ease:Bounce.easeOut, overwrite:true});	
		animateBlink(wonContainer);
	}else{
		killAnimateBlink(wonContainer);
	}
}

function showGameStatus(text, delay){
	if(text != undefined){
		gameStatusTxt.text = text;
		statusContainer.visible = true;

		statusContainer.scaleX = statusContainer.scaleY = .8;
		TweenMax.to(statusContainer, .5, {scaleX:1, scaleY:1, ease:Expo.easeOut});
		TweenMax.to(statusContainer, .5, {delay:delay, scaleX:0, scaleY:0, ease:Expo.easeIn});
	}else{
		statusContainer.visible = false;
	}
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(event){
	if(!gameData.paused){
		itemCoinScratch.x = stage.mouseX;
		itemCoinScratch.y = stage.mouseY;
		loopCardRotate();
		loopFallingCoins();
	}
}

function loopCardRotate(){
	TweenMax.to(rotateData, .2, {angle:Math.abs($.cards['select'+gameData.cardIndex].oriAngle), overwrite:true});

	var viewportMode = viewport.isLandscape == true ? 'landscape' : 'portrait';	
	var sortArray = [];
	for(var n=0; n<cardsSettings.length; n++){
		var currentAngle = $.cards['select'+n].angle;
		var posX = Math.cos(currentAngle) * rotateData[viewportMode].radiusX;
		var posY = Math.sin(currentAngle) * rotateData[viewportMode].radiusY;

		if(viewportMode == 'portrait'){
			posX = Math.sin(currentAngle) * rotateData[viewportMode].radiusY;
			posY = Math.cos(currentAngle) * rotateData[viewportMode].radiusX;
		}
		var currentScale = Math.cos(currentAngle) * 2;
		var scale = (currentScale / rotateData[viewportMode].radiusY) + rotateData[viewportMode].scale;
		var cardDistance = Math.abs(gameData.cardIndex - n) * .1;
		var rotation = cardDistance * $.cards['select'+n].oriRotate;
		sortArray.push({index:n, scale:scale});

		$.cards['select'+n].x = posX;
		$.cards['select'+n].y = posY;
		$.cards['select'+n].rotation = rotation;
		$.cards['select'+n].scaleX = $.cards['select'+n].scaleY = scale;
		$.cards['select'+n].angle = $.cards['select'+n].oriAngle + rotateData.angle;
	}

	sortOnObject(sortArray, 'scale', false);
	for(var n=0; n<sortArray.length; n++){
		cardSelectContainer.setChildIndex($.cards['select'+sortArray[n].index], n);
	}
}

/*!
 * 
 * STARS GRAVITY - This is the function that runs to build coins gravity
 * 
 */
function buildCoinGravity(){
	for(var n=0; n<gravityData.total; n++){
		$.coins[n] = new createjs.Bitmap(loader.getResult('itemCoin'));
		centerReg($.coins[n]);
		resetCoinData(n);

		coinsContainer.addChild($.coins[n]);
	}
}

function toggleCoinsFall(con){
	coinsContainer.visible = con;
	gravityData.animate = con;
	if(gravityData.animate){
		for(var n=0; n<gravityData.total; n++){
			resetCoinData(n);
		}
	}
}

function resetCoinData(index){
	$.coins[index].x = randomIntFromInterval(-gravityData.range, gravityData.range);
	if(viewport.isLandscape){
		$.coins[index].y = -(gameData.cardH/2);
	}else{
		$.coins[index].y = -(gameData.cardH);
	}

	$.coins[index].xspeed = randomIntFromInterval(-20, 20);
	$.coins[index].yspeed = randomIntFromInterval(-10, -20);

	$.coins[index].scaleX = $.coins[index].scaleY = randomIntFromInterval(5, 10) * .1;
}

function loopFallingCoins(){
	for(var n=0; n<gravityData.total; n++){		
		$.coins[n].y = $.coins[n].y + $.coins[n].yspeed;
		$.coins[n].x = $.coins[n].x + $.coins[n].xspeed;
		$.coins[n].rotation = $.coins[n].rotation + $.coins[n].xspeed;

		$.coins[n].yspeed = $.coins[n].yspeed * gravityData.drag + gravityData.gravity;
		$.coins[n].xspeed = $.coins[n].xspeed * gravityData.drag;

		if ($.coins[n].y > canvasH + (gravityData.range * 2)) {
			if(gravityData.animate){
				playSound('soundCoin');
				resetCoinData(n);
			}
		}
	}
}

/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	playSound('soundOver');
	TweenMax.to(gameContainer, 3, {overwrite:true, onComplete:function(){
		goPage('result');
	}});
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", addCommas(playerData.credit));
	text = shareMessage.replace("[SCORE]", addCommas(playerData.credit));
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
}