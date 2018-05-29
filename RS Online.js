{
	"translatorID": "9a728068-0958-471b-bfbd-3d028bc5bfd8",
	"label": "RS Online",
	"creator": "John Beard",
	"target": "^https?://(.*)\\.rs-online.com",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2018-05-29 17:44:47"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2018 John Beard
	
	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/


// attr()/text() v2
function attr(docOrElem,selector,attr,index){var elem=index?docOrElem.querySelectorAll(selector).item(index):docOrElem.querySelector(selector);return elem?elem.getAttribute(attr):null;}function text(docOrElem,selector,index){var elem=index?docOrElem.querySelectorAll(selector).item(index):docOrElem.querySelector(selector);return elem?elem.textContent:null;}

function stripInnerText(node) {
	return ZU.trimInternal(node.innerText);
}

function detectWeb(doc, url) {
	return "document";
}


function getSearchResults(doc, checkOnly) {
	return false;
}

function addLink(doc, item) {
	item.attachments.push({
		title:"RS Online Link", 
		snapshot:false, 
		mimeType:"text/html", 
		url:doc.location.href
	});
}

function keyLabelIsRsNo(label) {
	return label === "RS Stock No.";
}

function addKeyDetails(doc, item) {
	
	var details = doc.querySelectorAll(".keyDetailsDivLL .keyDetailsLL li");
		
	var strs = []
		
	for (var i = 0; i < details.length; i++) {
		var label = stripInnerText(details[i].querySelector(".keyLabel"));
		var value = stripInnerText(details[i].querySelector(".keyValue"));
		
		strs.push("<p>" + label + ": " + value + "</p>");
		
		// use RS id as call number
		if (keyLabelIsRsNo(label)) {
			item.callNumber = value;
		}
	}
	
	item.notes.push({note: strs.join("")});
}

function addDocument(techrow, item) {
	
	var url = attr(techrow, "a", "href", 0);
	
	if (url && url.endsWith(".pdf")){
			
		Z.debug(url);
		item.attachments.push({
			title: ZU.trimInternal(techrow.innerText),
			url: url,
			mimeType: "application/pdf"
		});
	}
}

function addTechnicalDocs(doc, item) {
	var techRows = doc.querySelectorAll('.technical-row div');
	
	for (var i =0; i < techRows.length; i++) {
		addDocument(techRows[i], item);
	}
}

function addAbstract(doc, item) {
	
	var hding = doc.querySelectorAll('.prodDetailsContainer .range-heading')[0];
	
	if (hding) {
		item.abstractNote = hding.innerText;
	}
}

function setTitle(doc, item) {
	var title = doc.querySelector("h1.main-page-header");
	item.title = stripInnerText(title);
}

function doWeb(doc, url) {
	scrape(doc, url);
}

function scrape(doc, url) {
	
	var item = new Zotero.Item(detectWeb(doc, url));
	
	setTitle(doc, item);
	addLink(doc, item);
	addKeyDetails(doc, item);
	addAbstract(doc, item);
	addTechnicalDocs(doc, item);
	
	item.complete();
}


/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://uk.rs-online.com/web/p/switch-mode-power-supply-smps-transformers/4185543/",
		"items": [
			{
				"itemType": "document",
				"title": "3 Output 15 → 30W Flyback SMPS Transformer, 85 → 265V ac, 3.3 → 7 V ac, 8 → 17 V ac",
				"creators": [],
				"callNumber": "418-5543",
				"abstractNote": "Switch mode power supply transformers format E25 & ETD, 15 W switch mode",
				"libraryCatalog": "RS Online",
				"attachments": [
					{
						"title": "RS Online Link",
						"snapshot": false,
						"mimeType": "text/html"
					},
					{
						"title": "Size E25 Flyback Transformer Data Sheet",
						"mimeType": "application/pdf"
					}
				],
				"tags": [],
				"notes": [
					{
						"note": "<p>RS Stock No.: 418-5543</p><p>Mfr. Part No.: 74030</p><p>Brand: Myrra</p>"
					}
				],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
