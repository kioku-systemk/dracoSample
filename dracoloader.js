(function (window) {
    function download(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
        if ( (xhr.readyState == 4) ) {
                if ( xhr.status == 200 || xhr.status == 0 ) {
                    callback(xhr.response);
                } else {
                    console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );
                }
            }
        };
        xhr.open( "GET", url, true );
        xhr.send( null );
    }

    function getNumFaces(draco, dracoGeometry) {
        let numFaces;
        const geometryType = dracoGeometry.geometryType;
        if (geometryType == draco.TRIANGULAR_MESH) {
            numFaces = dracoGeometry.num_faces();
        } else {
            numFaces = 0;
        }
        return numFaces;
    }

    function getVertices(draco, decoder, dracoGeometry) {
        
        const posAttId = decoder.GetAttributeId(dracoGeometry, draco.POSITION);
        if (posAttId == -1) {
            const errorMsg = 'Draco: No position attribute found.';
            console.error(errorMsg);
            draco.destroy(decoder);
            draco.destroy(dracoGeometry);
            throw new Error(errorMsg);
        }
        const posAttribute = decoder.GetAttribute(dracoGeometry, posAttId);
        const posAttributeData = new draco.DracoFloat32Array();
        decoder.GetAttributeFloatForAllPoints(dracoGeometry, posAttribute, posAttributeData);

        const numPoints = dracoGeometry.num_points();
        const numVertces = numPoints * 3;
        const vertices = new Float32Array(numVertces);
        
        for (var i = 0; i < numVertces; i += 1) {
            vertices[i] = posAttributeData.GetValue(i);  // XYZ XYZ
        }

        draco.destroy(posAttributeData);
        return vertices;
    }

    function getIndcies(draco, decoder, dracoGeometry, triangleStripDrawMode) {
        // For mesh, we need to generate the faces.
        const geometryType = dracoGeometry.geometryType;
        if (geometryType !== draco.TRIANGULAR_MESH) {
            return null;
        }

        let indices;
        if (triangleStripDrawMode === undefined) {
            triangleStripDrawMode = false;
        }

        if (triangleStripDrawMode) {
            const stripsArray = new draco.DracoInt32Array();
            const numStrips = decoder.GetTriangleStripsFromMesh(dracoGeometry, stripsArray);
            indices = new Uint32Array(stripsArray.size());
            for (var i = 0; i < stripsArray.size(); ++i) {
                indices[i] = stripsArray.GetValue(i);
            }
            draco.destroy(stripsArray);
        } else { // TRIANGLES
            const numFaces = dracoGeometry.num_faces();
            const numIndices = numFaces * 3;
            indices = new Uint32Array(numIndices);
            const ia = new draco.DracoInt32Array();
            for (let i = 0; i < numFaces; ++i) {
                decoder.GetFaceFromMesh(dracoGeometry, i, ia);
                var index = i * 3;
                indices[index] = ia.GetValue(0);
                indices[index + 1] = ia.GetValue(1);
                indices[index + 2] = ia.GetValue(2);
            }
            draco.destroy(ia);
        }
        return indices;
    }
    
    function getColors(draco, decoder, dracoGeometry) {
        // Get color attributes if exists.
        var colorAttId = decoder.GetAttributeId(dracoGeometry, draco.COLOR);
        var colAttributeData;
        if (colorAttId === -1) {
            return null;
        } else {
            //console.log('Loaded color attribute.');

            const colAttribute = decoder.GetAttribute(dracoGeometry, colorAttId);
            colAttributeData = new draco.DracoFloat32Array();
            decoder.GetAttributeFloatForAllPoints(dracoGeometry, colAttribute, colAttributeData);

            const numPoints = dracoGeometry.num_points();
            const numComponents = colAttribute.num_components();
            numVertces = numPoints * 4;
            const colors = new Float32Array(numVertces);
            for (let i = 0; i < numVertces; i += numComponents) {
                colors[i  ] = colAttributeData.GetValue(i);
                colors[i+1] = colAttributeData.GetValue(i+1);
                colors[i+2] = colAttributeData.GetValue(i+2);
                if (numComponents == 4) {
                    colors[i+3] = colAttributeData.GetValue(i+3);
                } else {
                    colors[i+3] = 1.0;
                }
            }
            draco.destroy(colAttributeData);

            return colors;
        }

    }
    
    function getNormals(draco, decoder, dracoGeometry) {
        // Get normal attributes if exists.
        var normalAttId = decoder.GetAttributeId(dracoGeometry, draco.NORMAL);
        var norAttributeData;
        if (normalAttId === -1) {
            return null;
        } else {
            //console.log('Loaded normal attribute.');
            
            var norAttribute = decoder.GetAttribute(dracoGeometry, normalAttId);
            norAttributeData = new draco.DracoFloat32Array();
            decoder.GetAttributeFloatForAllPoints(dracoGeometry, norAttribute, norAttributeData);

            const numPoints = dracoGeometry.num_points();
            const numVertces = numPoints * 3;
            const normals = new Float32Array(numVertces);
            for (var i = 0; i < numVertces; i += 1) {
                normals[i] = norAttributeData.GetValue(i);  // XYZ XYZ
            }
            draco.destroy(norAttributeData);
            return normals;
        }
    }

    function getTextures(draco, decoder, dracoGeometry) {
        // Get texture coord attributes if exists.
        var texCoordAttId = decoder.GetAttributeId(dracoGeometry, draco.TEX_COORD);
        var textCoordAttributeData;
        if (texCoordAttId === -1) {
            return null;
        } else {
            //console.log('Loaded texture coordinate attribute.');
            
            var texCoordAttribute = decoder.GetAttribute(dracoGeometry, texCoordAttId);
            textCoordAttributeData = new draco.DracoFloat32Array();
            decoder.GetAttributeFloatForAllPoints(dracoGeometry, texCoordAttribute, textCoordAttributeData);
            
            const numPoints = dracoGeometry.num_points();
            const numVertces = numPoints * 2;
            const texcoords = new Float32Array(numVertces);
            for (var i = 0; i < numVertces; i += 1) {
                texcoords[i] = textCoordAttributeData.GetValue(i);
            }
            draco.destroy(textCoordAttributeData);
            return texcoords;
        }
    }
    
    function decodeDraco(draco, decoder, rawBuffer) {
        const buffer = new draco.DecoderBuffer();
        buffer.Init(new Int8Array(rawBuffer), rawBuffer.byteLength);
        const geometryType = decoder.GetEncodedGeometryType(buffer);
        let dracoGeometry;
        let decodingStatus;
        if (geometryType === draco.TRIANGULAR_MESH) {
            //console.log('Loaded a mesh.');
            dracoGeometry = new draco.Mesh();
            decodingStatus = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
        } else if (geometryType == draco.POINT_CLOUD) {
            //console.log('Loaded a point cloud.');
            dracoGeometry = new draco.PointCloud();
            decodingStatus = decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
        } else {
            const errorMsg = 'Unknown geometry type.';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        dracoGeometry.geometryType = geometryType; // store

        if (!decodingStatus.ok() || dracoGeometry.ptr == 0) {
            let errorMsg = 'Decoding failed: ';
            errorMsg += decodingStatus.error_msg();
            console.error(errorMsg);
            draco.destroy(decoder);
            draco.destroy(dracoGeometry);
            throw new Error(errorMsg);
        }
        draco.destroy(buffer);
        //console.log('Decoded.');

        return dracoGeometry;
    }

    function loadDraco(draco_url, callback) {
        download(draco_url, function (dracodata) {    
            const draco = new DracoDecoderModule();
            const decoder = new draco.Decoder();        
            const dracoGeometry = decodeDraco(draco, decoder, dracodata);
            
            const numFaces = getNumFaces(draco, dracoGeometry);
            const numAttributes = dracoGeometry.num_attributes();
            const numPoints = dracoGeometry.num_points();
            
            const vertex   = getVertices(draco, decoder, dracoGeometry);
            const color    = getColors(draco, decoder, dracoGeometry);
            const normal   = getNormals(draco, decoder, dracoGeometry);
            const texcoord = getTextures(draco, decoder, dracoGeometry);
            const index    = getIndcies(draco, decoder, dracoGeometry);

            callback({
                numFaces: numFaces,
                numPoints: numPoints,
                numAttributes: numAttributes,
                vertex: vertex,
                color: color,
                normal: normal,
                texcoord: texcoord,
                index: index
            });
        });
    }

    window.loadDraco = loadDraco;
}(window));