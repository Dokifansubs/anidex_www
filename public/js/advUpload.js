var dndSupported = function() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
};

document.body.id += 'dropzone';
console.log(document.body);
console.log(location.hostname);

var reader = new FileReader();

var createDiv = function() {
    return document.createElement("div");
}

var addTorrentElement = function(element) {
    var list = document.getElementById('torrent-list');
    list.insertBefore(element, list.firstChild);
}

var createTorrentElement = function(torrent) {
    var container = createDiv();
    container.setAttribute('class', 'torrent-container');
    container.id = torrent.infoHash;

    var category = createDiv();
    category.setAttribute('class', 'torrent-category');

    var deleteButton = createDiv();
    deleteButton.setAttribute('class', 'torrent-delete');

    var nameField = createDiv();
    nameField.setAttribute('class', 'torrent-name');
    nameField.innerHTML = torrent.name;

    var sizeField = createDiv();
    sizeField.setAttribute('class', 'torrent-size');
    sizeField.innerHTML = torrent.size;

    var langField = createDiv();
    langField.setAttribute('class', 'torrent-lang');
    langField.innerHTML = 'English';

    var hentaiField = createDiv();
    hentaiField.setAttribute('class', 'torrent-hentai');


    var filesButton = createDiv();
    filesButton.setAttribute('class', 'torrent-files');


    var infoField = createDiv();
    infoField.setAttribute('class', 'torrent-infoField');


    sizeField.appendChild(filesButton);
    sizeField.appendChild(hentaiField);
    sizeField.appendChild(langField);
    container.appendChild(category);
    container.appendChild(deleteButton);
    container.appendChild(nameField);
    container.appendChild(sizeField);
    //container.appendChild(infoField);

    return container;
}

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
                for (torrent of torrents) {
                    addTorrentElement(createTorrentElement(torrent));
                }
            }
        }

        for (file of files) {
            formData.append('torrent', file);
        }

        xhr.open('post', url, true);
        xhr.send(formData);

        return false;
    } else {
        alert('Not a torrent file, stop trying to break it!');
        return false;
    }
};