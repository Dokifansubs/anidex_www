$(document).on('click', '.dropdown-menu.dropdown-menu-form', function(e) {
    e.stopPropagation();
})

$(document).ready(function() {
    $('input#torrentfile').on('change', function() {
        document.getElementById('filename').value = $(this).val();
        processTorrent($('#torrentfile')[0].files[0]);
    });
});

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
                var id = document.getElementById('infohash');
                id.innerHTML = t.infoHash;
                document.getElementById('filename').value = t.name;
            }
        }

        formData.append('torrent', torrent);

        xhr.send(formData);
        console.log('Sent XHR');
    } else {
        //alert('Not a torrent file, stop trying to break it!');
    }
}