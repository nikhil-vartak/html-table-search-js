TableSearch = function(searchBoxId, dataTableId, options) 
{
	this.searchBox = document.querySelector('#' + searchBoxId);
	this.dataTable = document.querySelector('#' + dataTableId);
	this.options = options;
}

TableSearch.prototype.initialize = function()
{
	var settings = {
		firstRowHeader: true, 
		highlightCss: "style='background-color:yellow'",
		noResultsText: null
	};

	if (this.options) {
		for (var key in settings) {
			// Update settings if valid option and value was supplied.
			if (this.options.hasOwnProperty(key) && (this.options[key] != null && this.options[key].toString() != '')) {
				if (key == 'highlightCss') {
					settings[key] = "class='" + this.options[key] + "'";
					continue;
				}
				settings[key] = this.options[key];
			}
		}
	}
	
	this.options = settings;
	this.searchBox.addEventListener('keyup', this.doSearch.bind(this), false);
}

TableSearch.prototype.doSearch = function(e)
{
	var rowStart = (this.options.firstRowHeader == true) ? 1 : 0;
	var rowCount = this.dataTable.rows.length;
	var colCount = this.dataTable.rows.item(rowStart).cells.length;

	// Remove 'no results' row if it was added during previous search
	var noResultsRow = this.dataTable.querySelector('#noResultsRow');
	if (noResultsRow != null) {
		this.dataTable.deleteRow(rowCount - 1);
		rowCount = rowCount - 1;
		noResultsRow = null;
	}

	if(e.keyCode == 27) {
		this.searchBox.value = ''; // Clear search on Esc
	}

	var keyword =  this.searchBox.value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); // escape special chars
	var textSearchRegex = new RegExp(keyword, "ig"); // case in-sensitive
	var rowDisplay, rowObj, rowHtml, match; 
	
	// Loop through table rows. Skip <th> header
	for (var rowIndex = rowStart; rowIndex < rowCount; rowIndex++) 
	{
		rowDisplay = '';
		rowObj = this.dataTable.rows.item(rowIndex);
		rowHtml = rowObj.innerHTML.replace(/<mark[^/>]*>/g,'').replace(/<\/mark>/g,''); // remove previous highlighting
		
		if (keyword == '') {
			rowDisplay = 'table-row';
		}
		else {
			match = rowHtml.replace(/<[^>]*>/g, '').match(textSearchRegex); // strip html tags and search for keyword
			if(match) {
				// Get unique matches: http://stackoverflow.com/a/21292834/1440057
				match = match.sort().filter(function(element, index, array) { return index == array.indexOf(element); });
				var tempHtml = rowHtml;
				for (var i = 0; i < match.length; i++) {
					tempHtml = this.highlightMatch(tempHtml, match[i]);
				}
				if (tempHtml.search(/<\/mark>/g) > -1) {
					rowHtml = tempHtml;
					rowDisplay = 'table-row';
				}
				else { // Keyword did not match with any column content
					rowDisplay = 'none';
				}
			}
			else { // Keyword did not match even in the row text content
				rowDisplay = 'none';
			}
		}
		rowObj.innerHTML = rowHtml;
		rowObj.style.display = rowDisplay;
	}

	// Check if 'no results' row needs to be added
	if (this.options.noResultsText && keyword != '' && this.dataTable.innerHTML.search(/style=\"display: table-row;\"/g) == -1) {
		noResultsRow = this.dataTable.insertRow(rowCount);
		noResultsRow.setAttribute('id', 'noResultsRow');
		var noResultsRowCell = noResultsRow.insertCell(0);
		noResultsRowCell.setAttribute('colspan', colCount);
		noResultsRowCell.setAttribute('align', 'center');
		noResultsRowCell.textContent = this.options.noResultsText;
	}
}

TableSearch.prototype.highlightMatch = function(rowHtml, match)
{
	var row = document.createElement('tr');
	row.innerHTML = rowHtml;

	var textReplaceRegex = new RegExp(match, "g"); // case sensitive
	var highlightMarkup = '<mark ' + this.options.highlightCss + '>' + match + '</mark>';
	var cell = null;
	var htmlOut = '';
	
	for (var i = 0; i < row.cells.length; i++) {
		cell = row.cells.item(i);
		// Open issue: highlighting works only for direct text content, not nested tags.
		// e.g. searching "blog" in <td><a href="url">my blog</a></td> won't work. :(
		if (cell.children.length == 0) {
			if (cell.textContent.indexOf(match) > -1) {
				// Match found in this cell, highlight it
				htmlOut += '<td>' + cell.textContent.replace(textReplaceRegex, highlightMarkup) + '</td>';
				continue;
			}
		}
		htmlOut += '<td>' + cell.innerHTML + '</td>';
	}

	return htmlOut;
}