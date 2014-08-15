var dndSupported = function() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
};

document.body.id += 'dropzone';
console.log(document.body);
console.log(location.hostname);

var reader = new FileReader();

var createDiv = function(classes) {
    if (Array.isArray(classes)) {
        classes = classes.join(' ');
    }

    var element = document.createElement("div");

    element.className += classes;
    return element;
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
    var catLogo = createDiv('torrent-category');
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
    sizeField.innerHTML = 'File size: ' + torrent.size;
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

addTorrentElement(createTorrentElement({}));

var doc = document.getElementById('dropzone');
doc.ondragover = function() { this.classList.add('hover'); return false; };
doc.ondragend = function() { this.classList.remove('hover'); return false; };
doc.ondragleave = function() { this.classList.remove('hover'); return false };
doc.ondrop = function(event) {
    var files = event.dataTransfer.files;
    event.preventDefault && event.preventDefault();
    this.classList.remove('hover');
    if (files[0].type === 'application/x-bittorrent') {
        var url = 'http://' + location.hostname + ':8008/upload';
        var formData = new FormData();
        console.log('Dropped files: ');
        console.log(files[0]);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var torrents = JSON.parse(xhr.response);
                for (i in torrents) {
                    addTorrentElement(createTorrentElement(torrents[i]));
                }
            }
        }

        for (i in files) {
            formData.append('torrent', files[i]);
        }

        xhr.open('post', url, true);
        xhr.send(formData);

        return false;
    } else {
        alert('Not a torrent file, stop trying to break it!');
        return false;
    }
};