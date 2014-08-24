var dndSupported = function() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
};

var createDiv = function(classes) {
    if (Array.isArray(classes)) {
        classes = classes.join(' ');
    }

    var element = document.createElement('div');

    element.className += classes;
    return element;
}

var changeCategory = function(element, classes) {
    element.className = classes.join(' ');
}

var openDropdown = function(element) {
    element.style.visibility = 'visible';
}

var closeDropdown = function(element) {
    element.style.visibility = 'hidden';
}

var createItem = function(button, list, category) {
    var item = createDiv('torrent-list-item');
    var catclasses = category.split('-');
    var catname = createDiv('torrent-list-name');
    catclasses.push('torrent-list-block');
    var caticon = createDiv(catclasses);
    catname.innerHTML = category;
    item.onclick = function() {
        var array = category.split('-');
        array.push('torrent-category');
        changeCategory(button, array);
    }
    item.appendChild(caticon);
    item.appendChild(catname);
    list.appendChild(item);
}

var createDropdown = function(classes, infoHash) {
    if (Array.isArray(classes)) {
        classes = classes.join(' ');
    }

    var button = document.createElement('div');
    var list = createDiv('torrent-list');

    button.onmouseover = function() { openDropdown(list); }
    button.onmouseout = function() { closeDropdown(list); }

    for (i in categories) {
        createItem(button, list, categories[i]);
    }

    button.appendChild(list);

    button.className += classes;
    return button;
}

var removeTorrentElement = function(element) {
    var list = document.getElementById('torrent-list');
    list.removeChild(element);
}

var addTorrentElement = function(element) {
    var list = document.getElementById('torrent-list');
    list.insertBefore(element, list.firstChild);
}

var createTorrentElement = function(torrent) {
    var container = createDiv('torrent-container');
    var category = createDiv('torrent-block');
    var catLogo = createDropdown(['torrent-category','anime','english'], torrent.infoHash);
    var deleteBlock = createDiv(['torrent-block','torrent-right'])
    var deleteButton = createDiv('torrent-delete');
    var topBar = createDiv('torrent-bar');
    var bottomBar = createDiv('torrent-bar');
    var nameField = createDiv('torrent-name');
    var sizeField = createDiv('torrent-size');
    var langField = createDiv('torrent-lang');
    var hentaiField = createDiv('torrent-hentai');
    var filesButton = createDiv('torrent-files');
    var infoField = createDiv('torrent-infoField');

    container.id = torrent.infoHash;
    nameField.innerHTML = 'File name: ' + torrent.name;
    sizeField.innerHTML = 'File size: ' + torrent.length;
    langField.innerHTML = 'English';
    filesButton.innerHTML = 'V';
    hentaiField.innerHTML = '18+';

    category.appendChild(catLogo);
    deleteBlock.appendChild(deleteButton);
    topBar.appendChild(nameField);
    bottomBar.appendChild(sizeField);
    bottomBar.appendChild(filesButton);
    bottomBar.appendChild(hentaiField);
    bottomBar.appendChild(langField);

    container.appendChild(category);
    container.appendChild(deleteBlock);
    container.appendChild(topBar);
    container.appendChild(bottomBar);
    //container.appendChild(infoField);

    deleteButton.onclick = function() {
        removeTorrentElement(container);
    }

    return container;
}

categories.push('other');

addTorrentElement(createTorrentElement({}));

var processTorrent = function(torrent) {
    if (torrent.type === 'application/x-bittorrent') {
        var url = 'http://' + location.hostname + ':8008/parse';
        var formData = new FormData();

        var xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.onreadystatechange = function(e) {
            console.log(xhr.readyState);
            if (xhr.readyState === 4) {
                var t = JSON.parse(xhr.response);
                var id = document.getElementById(t.infoHash);
                if (id != null) {
                    console.log('Duplicate entry');
                } else {
                    addTorrentElement(createTorrentElement(t));
                }
            }
        }

        formData.append('torrent', torrent);

        xhr.send(formData);
        console.log('Sent XHR');
    } else {
        //alert('Not a torrent file, stop trying to break it!');
    }
}

var doc = document.getElementById('dropzone');
doc.ondragover = function() { this.classList.add('hover'); return false; };
doc.ondragend = function() { this.classList.remove('hover'); return false; };
doc.ondragleave = function() { this.classList.remove('hover'); return false };
doc.ondrop = function(event) {
    var files = event.dataTransfer.files;
    event.preventDefault && event.preventDefault();
    this.classList.remove('hover');
    console.log('Total files: ' + files.length);
    for (i in files) {
        processTorrent(files[i]);
    }
};