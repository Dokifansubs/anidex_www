var dndSupported = function() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
};

document.body.id += 'dropzone';
console.log(document.body);
console.log(location.hostname);

var reader = new FileReader();

var doc = document.getElementById('dropzone');
doc.ondragover = function() { this.classList.add('hover'); return false; };
doc.ondragend = function() { this.classList.remove('hover'); return false; };
doc.ondragleave = function() { this.classList.remove('hover'); return false };
doc.ondrop = function(event) {
    event.preventDefault && event.preventDefault();
    this.classList.remove('hover');
    var url = 'http://' + location.hostname + ':8008/upload';
    var files = event.dataTransfer.files;
    var formData = new FormData();
    console.log('Dropped files: ');
    console.log(files[0]);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var torrent = JSON.parse(xhr.response);
            document.getElementById('fname').innerHTML = torrent.name;
            document.getElementById('fsize').innerHTML = torrent.length;
            document.getElementById('finfo').innerHTML = torrent.infoHash;
        }
    }

    formData.append("torrent", files[0]);
    xhr.open('post', url, true);

    xhr.send(formData);

    return false;
};