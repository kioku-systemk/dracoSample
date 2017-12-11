(function (window) {
    var vertexshader = "precision highp float;" +
        "attribute vec3 position;" +
        "attribute vec3 normal;" +
        "varying vec3 nor;" +
        "uniform mat4 world;" +
        "uniform mat4 view;" +
        "uniform mat4 proj;" +
        "void main() {" +
        "    gl_Position = proj * view * world * vec4(position, 1.0);"+
        "    nor = (view * world * vec4(normal,0.0)).xyz;"+
        "}",
        fragmentshader = "precision highp float;" +
        "varying vec3 nor;" +
        "void main() {" +
        "    vec3 L = normalize(vec3(1,1,1));" +
        "    float dt = dot(L, normalize(nor));" +
        "    gl_FragColor = vec4(dt,dt,dt,1);" +
        "}";

    function loadfunc() {
        var can = document.getElementById('can'),
            gl = vgl.initGL(can, true),
            width = can.clientWidth,
            height = can.clientHeight,
            shader = new vgl.ShaderProgram(gl),
            positionBuf = null,
            normalBuf = null,
            indexBuf = null,
            center = new vmath.Vec3();
            offset = new vmath.Vec3();

        shader.create(vertexshader, fragmentshader);
        var err = shader.getErrorMessage()
        if (err) {
            console.log('ShaderError:', err);
            return;
        }

        loadDraco('bunny.drc', function (geodata) {
            console.log(geodata);

            positionBuf = new vgl.BufferObject(gl),
            positionBuf.write(gl.ARRAY_BUFFER, geodata.vertex, geodata.numPoints);
            normalBuf = new vgl.BufferObject(gl),
            normalBuf.write(gl.ARRAY_BUFFER, geodata.normal, geodata.numPoints);
            
            if (geodata.index) {
                indexBuf = new vgl.BufferObject(gl);
                indexBuf.write(gl.ELEMENT_ARRAY_BUFFER, geodata.index, geodata.numFaces*3);
            }

            //calc center
            var i, vmin = [999.e+30, 999.e+30, 999.e+30], vmax = [-999.e+30, -999.e+30, -999.e+30];
            for (i = 0; i <geodata.vertex.length / 3; ++i) {
                vmax[0] = Math.max(vmax[0], geodata.vertex[3*i  ]);
                vmax[1] = Math.max(vmax[1], geodata.vertex[3*i+1]);
                vmax[2] = Math.max(vmax[2], geodata.vertex[3*i+2]);
                vmin[0] = Math.min(vmin[0], geodata.vertex[3*i  ]);
                vmin[1] = Math.min(vmin[1], geodata.vertex[3*i+1]);
                vmin[2] = Math.min(vmin[2], geodata.vertex[3*i+2]);
            }
            center.x = (vmax[0] + vmin[0]) * 0.5;
            center.y = (vmax[1] + vmin[1]) * 0.5;
            center.z = (vmax[2] + vmin[2]) * 0.5;
            offset.z = -2.0 * Math.sqrt((vmax[0] - vmin[0])*(vmax[0] - vmin[0]) + (vmax[1] - vmin[1])*(vmax[1] - vmin[1]) + (vmax[2] - vmin[2])*(vmax[2] - vmin[2]));
            offset.add(offset, center);
        });

        var rot = 0;
        vgl.mainloop(function () {
            gl.clearColor(0.1, 0.2, 0.3, 1.0);            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);

            var world, view, proj;
            proj = vmath.Mat4.perspective(30, width / height, 0.10, 100.0);
            view = vmath.Mat4.lookat(offset, center, new vmath.Vec3(0,1,0));
            world = vmath.Mat4.rotateY(rot);

            rot += 1.0;
            
            shader.bind();
            shader.setMat4('world', world.m);
            shader.setMat4('view', view.m);
            shader.setMat4('proj', proj.m);
            
            if (positionBuf && normalBuf && indexBuf) {
                shader.setAttrib('position', positionBuf);
                shader.setAttrib('normal', normalBuf);
                indexBuf.draw(gl.TRIANGLES);                 
            }
            shader.unbind();
        });
    }
    window.addEventListener('load', loadfunc);
  
}(window));