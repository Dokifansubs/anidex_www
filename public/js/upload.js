var dndSupported = function() {
	var div = document.createElement('div');
	return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
};

/*
var doc = document.getElementById('dropzone');
doc.ondragover = function() { this.classList.add('hover'); return false; };
doc.ondragend = function() { this.classList.remove('hover'); return false; };
doc.ondragleave = function() { this.classList.remove('hover'); return false };
doc.ondrop = function(event) {
	event.preventDefault && event.preventDefault();
	this.className = '';

	var files = event.dataTransfer.files;
	console.log('Dropped files: ' + files);

	return false;
};
*/

$(document).on('click', '.dropdown-menu.dropdown-menu-form', function(e) {
    e.stopPropagation();
});