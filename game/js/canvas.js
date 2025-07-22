////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.framerate = 50;
	createjs.Ticker.addEventListener("tick", tick);
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, resultContainer, confirmContainer;
var guideline, bg, logo, buttonOk, result, shadowResult, buttonReplay, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff;

$.cards = {};
$.prizes = {};
$.coins = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	coinsContainer = new createjs.Container();
	statusContainer = new createjs.Container();
	scoreContainer = new createjs.Container();
	wonContainer = new createjs.Container();
	wonMoveContainer = new createjs.Container();
	cardSelectContainer = new createjs.Container();
	cardContainer = new createjs.Container();
	cardMoveContainer = new createjs.Container();
	cardBgContainer = new createjs.Container();
	cardLogoContainer = new createjs.Container();
	cardScratchContainer = new createjs.Container();
	cardPrizesContainer = new createjs.Container();
	cardActionContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	confirmContainer = new createjs.Container();
	
	logo = new createjs.Bitmap(loader.getResult('logo'));
	logoP = new createjs.Bitmap(loader.getResult('logoP'));
	
	buttonPlay = new createjs.Bitmap(loader.getResult('buttonPlay'));
	centerReg(buttonPlay);

	//game
	itemCoinScratch = new createjs.Bitmap(loader.getResult('itemCoinScratch'));
	itemCoinScratch.regX = 10;
	itemCoinScratch.regY = 147;

	itemStatus = new createjs.Bitmap(loader.getResult('itemStatus'));
	centerReg(itemStatus);
	gameStatusTxt = new createjs.Text();
	gameStatusTxt.font = "25px montserratbold";
	gameStatusTxt.color = '#fff';
	gameStatusTxt.textAlign = "center";
	gameStatusTxt.textBaseline='middle';
	statusContainer.addChild(itemStatus, gameStatusTxt);

	itemScore = new createjs.Bitmap(loader.getResult('itemScore'));
	gameScoreTxt = new createjs.Text();
	gameScoreTxt.font = "25px montserratbold";
	gameScoreTxt.color = '#833e29';
	gameScoreTxt.textAlign = "center";
	gameScoreTxt.textBaseline='middle';
	gameScoreTxt.x = 140;
	gameScoreTxt.y = 46;
	gameScoreRedTxt = new createjs.Text();
	gameScoreRedTxt.font = "25px montserratbold";
	gameScoreRedTxt.color = '#B20000';
	gameScoreRedTxt.textAlign = "center";
	gameScoreRedTxt.textBaseline='middle';
	gameScoreRedTxt.x = gameScoreTxt.x;
	gameScoreRedTxt.y = gameScoreTxt.y;
	scoreContainer.addChild(itemScore, gameScoreTxt, gameScoreRedTxt);

	itemWon = new createjs.Bitmap(loader.getResult('itemWon'));
	gameWonTxt = new createjs.Text();
	gameWonTxt.font = "25px montserratbold";
	gameWonTxt.color = '#fff';
	gameWonTxt.textAlign = "center";
	gameWonTxt.textBaseline='alphabetic';
	gameWonTxt.x = 90;
	gameWonTxt.y = 32;
	wonMoveContainer.addChild(itemWon, gameWonTxt);
	wonContainer.addChild(wonMoveContainer);

	scratchTxt = new createjs.Text();
	scratchTxt.font = "25px montserratbold";
	scratchTxt.color = '#833e29';
	scratchTxt.textAlign = "center";
	scratchTxt.textBaseline='middle';
	scratchTxt.text = textDisplay.scratch;

	buttonReveal = new createjs.Bitmap(loader.getResult('buttonReveal'));
	centerReg(buttonReveal);
	buttonAllCards = new createjs.Bitmap(loader.getResult('buttonAllCards'));
	centerReg(buttonAllCards);
	buttonBuyAgain = new createjs.Bitmap(loader.getResult('buttonBuyAgain'));
	centerReg(buttonBuyAgain);
	buyAgainTxt = new createjs.Text();
	buyAgainTxt.font = "20px montserratbold";
	buyAgainTxt.color = '#fff';
	buyAgainTxt.textAlign = "center";
	buyAgainTxt.textBaseline='alphabetic';
	buyAgainTxt.y = 5;

	buttonAllCards.x = -105;
	buttonBuyAgain.x = 105;
	buyAgainTxt.x = 105;
	cardActionContainer.addChild(buttonReveal, buttonAllCards, buttonBuyAgain, buyAgainTxt, scratchTxt);

	buttonArrowL = new createjs.Bitmap(loader.getResult('buttonArrow'));
	centerReg(buttonArrowL);
	buttonArrowR = new createjs.Bitmap(loader.getResult('buttonArrow'));
	centerReg(buttonArrowR);
	buttonBuy = new createjs.Bitmap(loader.getResult('buttonBuy'));
	centerReg(buttonBuy);
	buyTxt = new createjs.Text();
	buyTxt.font = "20px montserratbold";
	buyTxt.color = '#fff';
	buyTxt.textAlign = "center";
	buyTxt.textBaseline='alphabetic';
	buyTxt.y = 5;
	buttonArrowL.x = -110;
	buttonArrowR.x = 110;
	buttonArrowL.scaleX = -1;
	
	cardActionContainer.addChild(buttonBuy, buyTxt, buttonArrowL, buttonArrowR, statusContainer);


	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemPop'));
	itemResultP = new createjs.Bitmap(loader.getResult('itemPopP'));
	
	itemResultH = new createjs.Bitmap(loader.getResult('itemResultH'));
	centerReg(itemResultH);

	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "30px built_titlingbold";
	resultShareTxt.color = '#895F1A';
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = textDisplay.share;
	
	resultDescTxt = new createjs.Text();
	resultDescTxt.font = "60px built_titlingbold";
	resultDescTxt.color = '#fff';
	resultDescTxt.textAlign = "center";
	resultDescTxt.textBaseline='alphabetic';
	resultDescTxt.text = '';

	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "40px built_titlingbold";
	resultTitleTxt.color = "#895F1A";
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = textDisplay.resultTitle;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonMusicOn = new createjs.Bitmap(loader.getResult('buttonMusicOn'));
	centerReg(buttonMusicOn);
	buttonMusicOff = new createjs.Bitmap(loader.getResult('buttonMusicOff'));
	centerReg(buttonMusicOff);
	buttonMusicOn.visible = false;
	
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonMusicOn);
	createHitarea(buttonMusicOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemPop'));
	itemExitP = new createjs.Bitmap(loader.getResult('itemPopP'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	
	popDescTxt = new createjs.Text();
	popDescTxt.font = "35px built_titlingbold";
	popDescTxt.lineHeight = 35;
	popDescTxt.color = "#895F1A";
	popDescTxt.textAlign = "center";
	popDescTxt.textBaseline='alphabetic';
	popDescTxt.text = textDisplay.exitMessage;

	exitTitleTxt = new createjs.Text();
	exitTitleTxt.font = "65px built_titlingbold";
	exitTitleTxt.color = "#895F1A";
	exitTitleTxt.textAlign = "center";
	exitTitleTxt.textBaseline='alphabetic';
	exitTitleTxt.text = textDisplay.exitTitle;
	
	confirmContainer.addChild(itemExit, itemExitP, popDescTxt, exitTitleTxt, buttonConfirm, buttonCancel);
	confirmContainer.visible = false;
	
	if(guide){
		guideline = new createjs.Shape();	
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	mainContainer.addChild(logo, logoP, buttonPlay);
	cardMoveContainer.addChild(cardBgContainer, cardLogoContainer, cardPrizesContainer, cardScratchContainer);
	cardContainer.addChild(coinsContainer, cardMoveContainer);
	gameContainer.addChild(cardSelectContainer, cardContainer, cardActionContainer, scoreContainer, wonContainer);

	resultContainer.addChild(itemResult, itemResultP, itemResultH, buttonContinue, resultDescTxt, resultTitleTxt);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
	}
	
	canvasContainer.addChild(mainContainer, gameContainer, resultContainer, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	changeViewport(viewport.isLandscape);
	resizeGameFunc();
}

function changeViewport(isLandscape){
	if(isLandscape){
		//landscape
		stageW=landscapeSize.w;
		stageH=landscapeSize.h;
		contentW = landscapeSize.cW;
		contentH = landscapeSize.cH;
	}else{
		//portrait
		stageW=portraitSize.w;
		stageH=portraitSize.h;
		contentW = portraitSize.cW;
		contentH = portraitSize.cH;
	}
	
	gameCanvas.width = stageW;
	gameCanvas.height = stageH;
	
	canvasW=stageW;
	canvasH=stageH;
	
	changeCanvasViewport();
}

function changeCanvasViewport(){
	if(canvasContainer!=undefined){

		if(viewport.isLandscape){
			logo.visible = true;
			logoP.visible = false;

			buttonPlay.x = canvasW/2;
			buttonPlay.y = canvasH/100 * 80;

			//game
			
			//result
			itemResult.visible = true;
			itemResultP.visible = false;
			
			buttonFacebook.x = canvasW/100*43;
			buttonFacebook.y = canvasH/100*60;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*60;
			buttonWhatsapp.x = canvasW/100*57;
			buttonWhatsapp.y = canvasH/100*60;
			
			itemResultH.x = canvasW/2;
			itemResultH.y = canvasH/100 * 41;

			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 70;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 54;
	
			resultDescTxt.x = canvasW/2;
			resultDescTxt.y = canvasH/100 * 44;

			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 33;
			
			//exit
			itemExit.visible = true;
			itemExitP.visible = false;

			buttonConfirm.x = (canvasW/2);
			buttonConfirm.y = (canvasH/100 * 61);
			
			buttonCancel.x = (canvasW/2);
			buttonCancel.y = (canvasH/100 * 70);
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 43;

			exitTitleTxt.x = canvasW/2;
			exitTitleTxt.y = canvasH/100 * 37;

		}else{
			logo.visible = false;
			logoP.visible = true;
			
			buttonPlay.x = canvasW/2;
			buttonPlay.y = canvasH/100 * 75;

			//game
			
			//result
			itemResult.visible = false;
			itemResultP.visible = true;
			
			buttonFacebook.x = canvasW/100*39;
			buttonFacebook.y = canvasH/100*58;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*58;
			buttonWhatsapp.x = canvasW/100*61;
			buttonWhatsapp.y = canvasH/100*58;

			itemResultH.x = canvasW/2;
			itemResultH.y = canvasH/100 * 44;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 65;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 53;
	
			resultDescTxt.x = canvasW/2;
			resultDescTxt.y = canvasH/100 * 46;

			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 38;
			
			//exit
			itemExit.visible = false;
			itemExitP.visible = true;

			buttonConfirm.x = (canvasW/2);
			buttonConfirm.y = (canvasH/100 * 58);
			
			buttonCancel.x = (canvasW/2);
			buttonCancel.y = (canvasH/100 * 65);
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 46;

			exitTitleTxt.x = canvasW/2;
			exitTitleTxt.y = canvasH/100 * 41;
		}
	}
}



/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		
		buttonSettings.x = (canvasW - offset.x) - 50;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 60;
		var nextCount = 0;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*(nextCount+2));
		}

		resizeGameLayout();
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame(event);
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}