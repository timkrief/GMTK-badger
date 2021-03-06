//IDs used by this script
const canvasID = "badge";
const inputFieldID = "inputField";
const nameFieldID = "nameField";
const templateImageID = "template";
const gradientImageID = "gradient";
const iconImageID = "iconLoader";
const statCheckboxID = "includeStat";
const linkCheckboxID = "includeLink";
const nameCheckboxID = "includeName";

//Image layout
const height = 600;
const width = 800;

const iconX = 28;
const iconY = 27;
const iconW = 234;
const iconH = 185;

const gameNameX = iconX + iconW / 2;
const gameNameY = iconY + iconH + 16;

const numBars = 4;
const ratingBarStart = 258;
const ratingBarWidth = 284;
const ratingBarHeight = 73;
const ratingBars = [223, 307, 392, 476];

const dataX = 650;
const scoreYoff = 13;
const positionYoff = 25;
const percentileYoff = 35;

var canvas;
var inputField;
var nameField;
var templateImg;
var gradientImg;
var iconImg;
var statCheckbox;
var linkCheckbox;
var nameCheckbox;

function loadBadger() {
	canvas = document.getElementById(canvasID).getContext("2d");
	statCheckbox= document.getElementById(statCheckboxID);
	linkCheckbox= document.getElementById(linkCheckboxID);
	nameCheckbox= document.getElementById(nameCheckboxID);
	templateImg = document.getElementById(templateImageID);
	gradientImg = document.getElementById(gradientImageID);
	inputField  = document.getElementById(inputFieldID);
	nameField   = document.getElementById(nameFieldID);
	iconImg     = document.getElementById(iconImageID);

	clearCanvas();
}

function clearCanvas() {
	canvas.fillStyle = "#220011";
	canvas.fillRect(0, 0, width, height);
}

function makeBadge(gameID) {
	clearCanvas();
	var ratings = getRatings(gameID);
	for (var i = 0; i < numBars; i++) {
		canvas.drawImage(gradientImg, ratingBarStart, ratingBars[i], ratingBarWidth * ratings[i].scoreNorm, ratingBarHeight);
	}
	canvas.drawImage(templateImg, 0, 0);
	canvas.drawImage(iconImg, iconX, iconY, iconW, iconH);
	
	if (nameCheckbox.checked) {
		var originalAlign = canvas.textAlign;
		canvas.font = "17px Arial";
		canvas.fillStyle = "#000000";
		canvas.textAlign = "center";
		var gameName = getGameName(gameID);
		var textwidth = canvas.measureText(gameName).width;
		var xpos = Math.max(textwidth/2 + 5, gameNameX);
		canvas.fillText(gameName, xpos, gameNameY);
		canvas.textAlign = originalAlign;
	}

	if (linkCheckbox.checked) {
		canvas.font = "13px Arial";
		canvas.fillStyle = "#FFFFFF";
		canvas.fillText(getGameURL(gameID), 4, 363);
	}
	if (statCheckbox.checked) {
		canvas.fillStyle = "#FFFFFF";
		for (var i = 0; i < numBars; i++) {
			canvas.font = "22px Helvetica, sans";
			canvas.fillText(ratings[i].score, dataX, ratingBars[i] + scoreYoff);
			canvas.font = "14px Helvetica, sans";
			canvas.fillText(ratings[i].position, dataX, ratingBars[i] + positionYoff);
			canvas.font = "11px Helvetica, sans";
			canvas.fillText(ratings[i].percentile, dataX, ratingBars[i] + percentileYoff);
		}
	}
}

function LoadGame() {
	try {
		var gameID = /\d{6}/.exec(inputField.value)[0];
	} catch(e) {
		var gameID = undefined;
	}
	if (gameID != undefined) inputField.value = gameID;
	if (doesGameExist(gameID)) {
		nameField.value = getGameName(gameID);
		loadIcon(gameID);
	} else {
		nameField.value = "GAME NOT FOUND"
	}
	return false;
}

function loadIcon(gameID) {
	url = getImageURL(gameID)
    if (iconImg.src == url && iconImg.complete) {
        makeBadge(gameID);
    } else {
        iconImg.onload = ()=>makeBadge(gameID);
        iconImg.src = url;
    }
}
