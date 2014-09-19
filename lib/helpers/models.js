'use strict';

exports.torrent = {
    id : { type : 'serial', key: true, mapsTo: 'torrent_id' },
    info_hash  : { type : 'text', size: 40, unique: true },
    complete   : { type : 'integer' },
    incomplete : { type : 'integer' },
    downloaded : { type : 'integer' },
    cat_id     : { type : 'integer', mapsTo: 'category_id' },
    user_id    : { type : 'integer' },
    group_id   : { type : 'integer' },
    created    : { type : 'date', time: true },
    filename   : { type : 'text', size: 255 },
    description: { type : 'text' },
    size       : { type : 'integer', size: 4 },
    comments   : { type : 'integer' }
};