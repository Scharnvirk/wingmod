function HitmapLoader(){
    this.loader = new THREE.XHRLoader();
}

HitmapLoader.prototype.load = function(path, callback){
    this.loader.load(path, result => {
        var jsonObject = JSON.parse(result);
        var faces = this.jsonToFaces(jsonObject);
        this.addVerticesToFaces(jsonObject.vertices, faces);
        callback(faces);
    });
};

HitmapLoader.prototype.jsonToFaces = function(json){
    function isBitSet( value, position ) {
        return value & ( 1 << position );
    }

    var offset, zLength,
    type, isQuad,
    hasMaterial, hasFaceUv, hasFaceVertexUv, hasFaceNormal,
    hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor,
    vertex, normalIndex,
    faces = json.faces,
    vertices = json.vertices,
    normals = json.normals,
    colors = json.colors,
    nUvLayers = 0,
    nVertices = 0;

    for (let i = 0; i < json.uvs.length; i++ ) {
        if ( json.uvs[ i ].length ) nUvLayers ++;
    }

    offset = 0;

    zLength = faces.length;

    var doneFaces = [];

    while ( offset < zLength ) {
        var face = [];
        type = faces[ offset ++ ];

        isQuad              = isBitSet( type, 0 );
        hasMaterial         = isBitSet( type, 1 );
        hasFaceUv           = isBitSet( type, 2 );
        hasFaceVertexUv     = isBitSet( type, 3 );
        hasFaceNormal       = isBitSet( type, 4 );
        hasFaceVertexNormal = isBitSet( type, 5 );
        hasFaceColor        = isBitSet( type, 6 );
        hasFaceVertexColor  = isBitSet( type, 7 );

        if ( isQuad ) {
            face.push(faces[ offset ++ ]);
            face.push(faces[ offset ++ ]);
            face.push(faces[ offset ++ ]);
            face.push(faces[ offset ++ ]);
            nVertices = 4;
        } else {
            face.push(faces[ offset ++ ]);
            face.push(faces[ offset ++ ]);
            face.push(faces[ offset ++ ]);
            nVertices = 3;
        }

        if ( hasMaterial ) {
            offset ++ ;
        }

        if ( hasFaceUv ) {
            for (let i = 0; i < nUvLayers; i++ ) {
                offset ++ ;
            }
        }

        if ( hasFaceVertexUv ) {
            for (let i = 0; i < nUvLayers; i++ ) {
                for (let j = 0; j < nVertices; j ++ ) {
                    offset ++ ;
                }
            }
        }

        if ( hasFaceNormal ) {
            offset ++ ;
        }

        if ( hasFaceVertexNormal ) {
            for (let i = 0; i < nVertices; i++ ) {
                offset ++;
            }
        }

        if ( hasFaceColor ) {
            offset ++ ;
        }

        if ( hasFaceVertexColor ) {
            for (let i = 0; i < nVertices; i++ ) {
                offset ++ ;
            }
        }
        doneFaces.push( face );
    }
    return doneFaces;
};

HitmapLoader.prototype.addVerticesToFaces = function(vertices, faces){
    for (let i = 0, l = faces.length; i < l; i++){
        var face = faces[i];
        for (let j = 0, fl = face.length; j < fl; j++){
            face[j] = [ vertices[face[j]*3], vertices[face[j]*3+1], vertices[face[j]*3+2] ];
        }
    }
};

module.exports = HitmapLoader;
