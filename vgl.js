/*
    vgl library (WebGL Graphics lib)
    ver. 0.5.0
    2017.12.11

    Author: kioku (@kioku_systemk)
    MIT License
*/

// UMD (Universal Module Definition)
(function(global, factory, name) {
if (typeof define === 'function' && define.amd) { define([], factory); /* AMD*/ }
else if (typeof exports === 'object') { module.exports = factory(); /* CommonJS */ }
else { global[name] = factory(); /* Global*/ }
})(this, function() {
    'use strict';

    function makeProgram(gl, vshader, fshader, errorFunc) {
        var fs = gl.createShader(gl.FRAGMENT_SHADER),
            vs = gl.createShader(gl.VERTEX_SHADER),
            pr,
            err;
            gl.shaderSource(vs, vshader);
            gl.shaderSource(fs, fshader);
            gl.compileShader(vs);
            gl.compileShader(fs);
            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
                //console.log(gl.getShaderInfoLog(vs));
                err = gl.getShaderInfoLog(vs);
                if (errorFunc) {
                    errorFunc(err);
                } else {
                    console.log(err);
                }
                return 0;
            }
            if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
                err = gl.getShaderInfoLog(fs);
                if (errorFunc) {
                    errorFunc(err);
                } else {
                    console.log(err);
                }
                return 0;
            }

            pr = gl.createProgram();
            gl.attachShader(pr, vs);
            gl.attachShader(pr, fs);
            gl.linkProgram(pr);
            
            if (!gl.getProgramParameter(pr, gl.LINK_STATUS)){
                console.log(gl.getProgramInfoLog(pr));
                return 0;
            }

            return pr;
    }

    function noWarn(msg) { }
    function ifErrorReport(err, msg) {
		err ? noWarn(msg) : console.warn(msg);
	}
    
    function initGL(canvasElement, antialias) {
        var anti = (antialias === undefined) ? true : antialias,
            gl = canvasElement.getContext('webgl', {antialias:anti}) || canvasElement.getContext('experimental-webgl', {antialias: anti});
        if (gl == null) {
            console.error('Not supported webgl');
            return null;
        }
       
		
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        canvasElement.addEventListener('webglcontextlost', function(){
            // context is lost
            console.log('webglcontextlost');
        }, false);

        canvasElement.addEventListener('webglcontextrestored', function(){
            // context is restored
            console.log('webglcontextrestored');
        }, false);

        // check extensions
        var ext = gl.getExtension("OES_element_index_uint");
		ifErrorReport(ext, "not support OES_element_index_uint");

        return gl;
    }
    
    function mainloop(drawfunc) {
        var startdate = new Date();
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
        (function animloop(){
            var date = new Date();
            window.requestAnimFrame(animloop);
            drawfunc((date.getTime() - startdate.getTime()) * 0.001);
        })();
    }
    
    //--------------
    
    function ShaderProgram(gl) {
        this.gl = gl;
        this.prg = 0;
        this.errMsg = '';
    }
    function shaderErrFunc(self) {
        return function (err) {
            self.errMsg = err;
        };
    }
    ShaderProgram.prototype = {
        create: function (vs, fs) {
            var prg = makeProgram(this.gl, vs, fs, shaderErrFunc(this));
            if (prg !== 0) {
                if (this.prg !== 0) {
                    this.release();
                }
                this.prg = prg;
            }
            return prg;
        },
        getErrorMessage: function() {
            return this.errMsg;  
        },
        getProgram: function () {
            return this.prg;
        },
        bind: function () {
            this.gl.useProgram(this.prg);
        },
        unbind: function () {
            // this.gl.useProgram(0); // if you need, use.
        },
        setInt: function (name, val) {
            var loc = this.gl.getUniformLocation(this.prg, name);
            if (loc !== null) {
                this.gl.uniform1i(loc, val);                
            }
        },
        setFloat: function (name, val) {
            var loc = this.gl.getUniformLocation(this.prg, name);
            if (loc !== null) {
                this.gl.uniform1f(loc, val);            
            }
        },
        setVec2: function (name, x, y) {
            var loc = this.gl.getUniformLocation(this.prg, name);
            if (loc !== null) {
                this.gl.uniform2fv(loc, [x, y]);
            }
        },
        setVec3: function (name, x, y, z) {
            var loc = this.gl.getUniformLocation(this.prg, name);
            if (loc !== null) {
                this.gl.uniform3fv(loc, [x, y, z]);
            }
        },
        setVec4: function (name, x, y, z, w) {
            var loc = this.gl.getUniformLocation(this.prg, name);
            if (loc !== null) {
                this.gl.uniform4fv(loc, [x, y, z, w]);
            }
        },
        setMat4: function (name, mat) {
            var loc = this.gl.getUniformLocation(this.prg, name);
            if (loc !== null) {
                this.gl.uniformMatrix4fv(loc, false, mat);
            }
        },
        setMat3: function (name, mat) {
            var loc = this.gl.getUniformLocation(this.prg, name);
            if (loc !== null) {
                this.gl.uniformMatrix3fv(loc, false, mat);
            }
        },
        setMat2: function (name, mat) {
            var loc = this.gl.getUniformLocation(this.prg, name);
            if (loc !== null) {
                this.gl.uniformMatrix2fv(loc, false, mat);
            }
        },
        release: function () {
            this.gl.deleteProgram(this.prg);
            this.prg = 0;
        },
        setAttrib: function (varyingName, vertexBuffer, stride, offset) {
            var attr = this.gl.getAttribLocation(this.prg, varyingName);
            if (attr !== -1) {
                if (vertexBuffer === null) {
                    this.gl.disableVertexAttribArray(attr);
                } else {
                    this.gl.enableVertexAttribArray(attr);
                    this.gl.bindBuffer(vertexBuffer.arrayMode, vertexBuffer.buffer);
                    this.gl.vertexAttribPointer(attr, vertexBuffer.getElementSize(), this.gl.FLOAT, false, stride | 0, offset | 0);
                }
            } else {
                console.warn("Not found vertex attribute: " + varyingName);
            }
        }
    };
    
    //-----------------------
    function BufferObject(gl) {
        this.gl = gl;
        this.buffer = 0;
        this.num = 0;
        this.elementSize = 0;
        this.num = 0;
        this.arrayMode = 0;
        this.indexType = 0;
        this.buffer = this.gl.createBuffer();
    }
    
    function drawIndex(thisptr, primitiveMode) {
        thisptr.gl.bindBuffer(thisptr.gl.ELEMENT_ARRAY_BUFFER, thisptr.buffer);
        thisptr.gl.drawElements(primitiveMode, thisptr.elementNum, thisptr.indexType, 0);
    }
    function drawArray(thisptr, primitiveMode) {
        thisptr.gl.bindBuffer(thisptr.gl.ARRAY_BUFFER, thisptr.buffer);
        thisptr.gl.drawArrays(primitiveMode, 0, thisptr.elementNum);
    }
        
    BufferObject.prototype = {
        write: function (arrayMode, arrayBuffer, elementNum) {
            var esize = arrayBuffer.byteLength / arrayBuffer.length;
             if (arrayMode === this.gl.ELEMENT_ARRAY_BUFFER) {
                this.drawFunc = drawIndex;
                if (esize === 2) {
                    this.indexType = this.gl.UNSIGNED_SHORT;
                } else if (esize === 4) {
                    this.indexType = this.gl.UNSIGNED_INT;    
                } else {
                    console.error('Unknow BufferObject size.', esize);
                }
            } else {
                this.drawFunc = drawArray;
            }
            this.arrayMode = arrayMode;
            this.elementSize = arrayBuffer.length / elementNum;
            this.elementNum = elementNum;
            this.gl.bindBuffer(arrayMode, this.buffer);
            this.gl.bufferData(arrayMode, arrayBuffer, this.gl.STATIC_DRAW);
        },
        getNum: function () {
            return this.elementNum;
        },
        createFromArrayBuffer: function (arrayBuffer) {
            // TODO       
        },
        release: function() {
            this.deleteBuffer(this.buffer);
            this.buffer = null;
        },
        getElementSize: function () {
            return this.elementSize;
        },
        draw: function (primitiveMode) {
            this.drawFunc(this, primitiveMode);
        }
    };
    //-----------------------
    
    function Texture(gl) {
        this.gl = gl;
        this.texture_ = null;
        this.width_ = 0;
        this.height_ = 0;
        this.mipmapNum_ = 1;
        this.textureType_ = Texture.TYPE_2D;
        this.bufferType_ = gl.RGBA;
        this.bufferComponent_ = gl.UNSIGNED_BYTE;
    }

    Texture.TYPE_2D   = 0;
    Texture.TYPE_CUBE = 1;

    function getTextureMode(type) {
        const textureMode = [3553, 34067]; // TEXTURE_2D, TEXTURE_CUBE_MAP
        return textureMode[type];
    }

     
    const ARRAY_TYPES = {
        5120: Int8Array,    // BYTE
        5121: Uint8Array,   // UNSIGNED_BYTE
        5122: Int16Array,   // SHORT
        5123: Uint16Array,  // UNSIGNED_SHORT
        5124: Int32Array,  // INT
        5125: Uint32Array,  // UNSIGNED_INT
        5126: Float32Array, // FLOAT
        36193: Uint16Array  // HALF_FLOAT
    };
    function getBufferView(bufferComponent) {
        return ARRAY_TYPES[bufferComponent];
    }
        
    Texture.prototype = {
        create2D: function (width, height, bufferType, bufferComponent, bufferData) {
            const gl = this.gl;
            if (this.texture_) {
                gl.deleteTexture(this.texture_);
            }
            this.texture_ = gl.createTexture();
            this.width_ = width;
            this.height_ = height;
            this.textureType_ = Texture.TYPE_2D;
            this.bufferType_ = bufferType; //gl.RGBA;
            this.bufferComponent_ = bufferComponent;
            const bview = getBufferView(this.bufferComponent_);
            
            this.bind();
            
            let mipNum = 1;
            if (bufferData.toString() === "[object HTMLImageElement]"
            ||  bufferData.toString() === "[object HTMLCanvasElement]") {
                if (Array.isArray(bufferData)) {
                    bufferData = bufferData[0];
                }
                gl.texImage2D(gl.TEXTURE_2D, 0, this.bufferType_, this.bufferType_, this.bufferComponent_, bufferData);
            } else { // Array
                if (Array.isArray(bufferData)) { // has mipmap ?
                    let w = width,
                        h = height,
                        m;
                    mipNum = bufferData.length;
                    for (m = 0; m < mipNum; ++m) {
                        gl.texImage2D(gl.TEXTURE_2D, m, this.bufferType_, w, h, 0, this.bufferType_, this.bufferComponent_, new bview(bufferData[m].buffer));
                        w = Math.max(w >> 1, 1);
                        h = Math.max(h >> 1, 1);
                    }
                    if (mipNum != 1) { // same mipmap  
                        if ((width >> mipNum) > 0 || (height >> mipNum) > 0) { // invalid mipmap
                            do {
                                const tempbuf = new bview(w * h * 4);
                                gl.texImage2D(gl.TEXTURE_2D, m, this.bufferType_, w, h, 0, this.bufferType_, this.bufferComponent_, new bview(tempbuf));
                                w = Math.max(w >> 1, 1);
                                h = Math.max(h >> 1, 1);
                                ++m;
                            } while ((width >> m) > 0 || (height >> m) > 0);
                        }
                    }
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, 0, this.bufferType_, width, height, 0, this.bufferType_, this.bufferComponent_, new bview(bufferData.buffer));
                }
            }
            
            this.mipmapNum_ = mipNum;
            this.updateFilter();
            this.unbind();
        },
        createCube: function (faceWidth, faceHeight, bufferType, bufferComponent, facesBufferData, mipNum) {
            const gl = this.gl;
            if (this.texture_) {
                gl.deleteTexture(this.texture_);
            }
            this.texture_ = gl.createTexture();
            this.width_ = faceWidth;
            this.height_ = faceHeight;
            this.textureType_ = Texture.TYPE_CUBE;
            this.bufferType_ = bufferType;
            this.bufferComponent_ = bufferComponent;
            const bview = getBufferView(this.bufferComponent_);
            if (mipNum === undefined) {
                mipNum = 1;
            }

            gl.activeTexture(gl.TEXTURE0);
            this.bind();
            
            
            const cubeTarget = [
                gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
            ];

            for (let f = 0; f < 6; ++f) {
                let w = faceWidth;
                let h = faceHeight;
                let m;
                for (m = 0; m < mipNum; ++m) {
                    const idx = f * mipNum + m;
                    const bf = facesBufferData[idx].buffer;
                    if (!bf) {
                        debugger;
                    }
                    const bb = new bview(facesBufferData[idx].buffer);
                    if (bb === undefined || bb === null) {
                        debugger;
                    }
                    
                    gl.texImage2D(cubeTarget[f], m, this.bufferType_, w, h, 0, this.bufferType_, this.bufferComponent_, bb);
                    //console.log('TEXTURE:face[' + f + '] mip = [' + m + '] / (' + w + ',' + h + ')' );
                    w = Math.max(w >> 1, 1);
                    h = Math.max(h >> 1, 1);
                }
                if (mipNum == 1) {
                    continue;
                }
                if ((faceWidth >> mipNum) > 0 || (faceHeight >> mipNum) > 0) { // invalid mipmap
                    do {
                        const tempbuf = new bview(w * h * 4);
                        gl.texImage2D(cubeTarget[f], m, this.bufferType_, w, h, 0, this.bufferType_, this.bufferComponent_, new bview(tempbuf));
                        //console.log('TEXTURE:face[' + f + '] mip = [' + m + '] / (' + w + ',' + h + ') Additional' );
                        w = Math.max(w >> 1, 1);
                        h = Math.max(h >> 1, 1);
                        ++m;
                    } while ((faceWidth >> m) > 0 || (faceHeight >> m) > 0);
                }
            }
            
            this.mipmapNum_ = mipNum;
            this.updateFilter();
            this.unbind();
        },
        updateFilter: function () {
            const gl = this.gl,
                  bindMode = getTextureMode(this.textureType_);
            this.bind();
            gl.texParameteri(bindMode, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(bindMode, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            if (this.mipmapNum_ == 1) {
                gl.texParameteri(bindMode, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            } else {
                //gl.texParameteri(bindMode, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                //if (this.textureType_ == Texture.TYPE_CUBE) {
                    gl.texParameteri(bindMode, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                //} else {
                //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                //}
            }
            gl.texParameteri(bindMode, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            
            // NEAREST_MIPMAP_NEAREST
            // temporary 
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        },
        getWidth: function () {
            return this.width_;
        },
        getHeight: function () {
            return this.height_;
        },
        getTexture: function () {
            return this.texture_;  
        },
        release: function() {
            this.deleteTexture(this.texture_);
            this.width_ = 0;
            this.height_ = 0;            
            this.texture_ = null;
        },
        bind: function () {
            const otherMode = getTextureMode((this.textureType_ + 1) & 1); 
            const bindMode = getTextureMode(this.textureType_);
            this.gl.bindTexture(otherMode, null);
            this.gl.bindTexture(bindMode, this.texture_);
        },
        unbind: function () {
            const bindMode = getTextureMode(this.textureType_);
            this.gl.bindTexture(bindMode, null);
        },
        generateMipmap: function () {
            const bindMode = getTextureMode(this.textureType_);
            this.bind();
            this.gl.generateMipmap(bindMode);
            this.unbind();  
        },
        getTexImage: function () {
            const bindMode = getTextureMode(this.textureType_);
            
            // TODO!!
            var pixels;
            this.gl.getTexImage (bindMode, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        }

    };
    
    //-----------------------
    function RenderTarget(gl) {
        this.gl = gl;
        this.colorTexture_ = new Texture(gl);
        this.depthTexture_ = null;
        this.depthRenderBuffer_ = gl.createRenderbuffer();
        this.frameBuffer_ = gl.createFramebuffer();
        this.bufferType_  = gl.RGBA;
        this.bufferComponent = gl.UNSIGNED_BYTE;
        this.width = 0;
        this.height = 0;
    }
        
    RenderTarget.prototype = {
        create: function (width, height, bufferType, bufferComponent) {
            const gl = this.gl,
                  changed = false;
            if (this.width !== width || this.height !== height) {
                this.width = width;
                this.height = height;
                changed = true;
            }
            if (bufferType && this.bufferType_ !== bufferType) {
                this.bufferType_ = bufferType;
                changed = true;
            }
            if (bufferComponent && this.bufferComponent !== bufferComponent) {
                this.bufferComponent = bufferComponent;
                changed = true;
            }
            if (changed) {
                this.internalCreate();
            }
        },
        internalCreate: function () {
            const gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer_);            
            
            // color
            gl.bindTexture(gl.TEXTURE_2D, this.colorTexture_.getTexture());
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
            gl.texImage2D(gl.TEXTURE_2D, 0, this.bufferType_, this.width, this.height, 0, this.bufferType, this.bufferComponent, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTexture_.getTexture(), 0);
            // depth
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderBuffer_);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthRenderBuffer_);                        
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            },
        resize: function(w, h) {
            if (this.width === w && this.height === h) {
                return;
            }
            this.width  = w;
            this.height = h;
            //console.log("rendertarget resize:", this.width, this.height);
            this.internalCreate();
        },
        release: function() {
            var gl = this.gl;
            gl.deleteFrameBuffer(this.frameBuffer_);
            gl.deleteTexture(this.colorTexture_);
            if (this.depthTexture_) {
                gl.deleteTexture(this.depthTexture_);
            }
            gl.deleteRenderbuffer(this.depthRenderBuffer_);
            this.buffer = null;
        },
        bind: function () {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer_);
        },
        unbind: function () {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        },
        getColorTexture: function () {
            return this.colorTexture_;
        },
        getDepthTexture: function () {
            return this.depthTexture_;
        }     
    };
    
    //-----------------------------------------------------------------------------
    
    function STRINGFY(func) {
        return func.toString().match(/\n([\s\S]*)\n/)[1];
    }
    
    var vgl = {
        initGL: initGL,
        mainloop: mainloop,
        BufferObject: BufferObject,
        ShaderProgram: ShaderProgram,
        Texture: Texture,
        RenderTarget: RenderTarget,
        STRINGFY: STRINGFY
    }
    return vgl;
}, "vgl");