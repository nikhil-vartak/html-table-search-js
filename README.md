# HTML Table Search

<ul>
	<li>Highlight search results</li>
	<li>Search multiple tables on same page</li>
	<li>Works with/without table header</li>
	<li>Uses plain JavaScript</li>
	<li>No dependencies involved</li>
</ul>

<h3><a href="http://htmlpreview.github.io/?https://github.com/niksoft3ng/html-table-search-js/blob/master/demo.htm">demo</a></h3>

<h3>How to use?</h3>
<ul>
	<li>Download and add reference to <code>tablesearch.js</code><br/></li>
	<li>Initialize search at the end of HTML table markup or bottom of the page<br/>
		<code>new TableSearch(searchBoxId, dataTableId [, options]).initialize();</code><br/>
	</li>
	<li>Parameters:<br/>
		<ul>
			<li><i>searchBoxId</i>: Mandatory. Id of the search text box.<br/></li>
			<li><i>dataTableId</i>: Mandatory. Id of the table to search for.<br/></li>
			<li>
				<i>options</i>: Optional. Search settings.<br/>
				&nbsp;&nbsp;&nbsp;<i>firstRowHeader</i>: Whether to treat first row as header. True/false. Default is true.<br/>
				&nbsp;&nbsp;&nbsp;<i>highlightCss</i>: CSS class name for search highlights. Uses <i>yellow</i> color by default.<br/>
				&nbsp;&nbsp;&nbsp;<i>noResultsText</i>: Message to show if no results are found. Message is turned off by default.
			</li>
		</ul>
	</li>
</ul>

<h3>Example</h3>
<pre>
&lt;input type="text" id="txtSearch" /&gt;
&lt;table id="tblTarget" /&gt;
&lt;script type="text/javascript"&gt;
	new TableSearch('txtSearch', 'tblTarget', { noResultsText: 'Nothing found! Try different keyword' }).initialize();
&lt;/script&gt;
</pre>