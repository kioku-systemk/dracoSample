/*
    vmath library (math lib for graphics)
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
	//---------------------------------------------
	function Vec2 (x, y) {
	    this.x = x || 0;
	    this.y = y || 0;	    
	}
	Vec2.prototype = {
	    set: function (x, y) {
	        this.x = x || 0;
	        this.y = y || 0;
	        return this;
	    },
		copy: function (v) {
			this.x = v.x;
			this.y = v.y;		
			return this;	
		},
		clone: function () {
	        return new Vec2(this.x, this.y);
	    },
	    toString: function () {
	        return "Vec2:(" + this.x + ", " + this.y + ")";
	    },	
	    add: function (a, b) {
	        this.x = a.x + b.x;
	        this.y = a.y + b.y;	        
	        return this;
	    },
	    sub: function (a, b) {
	        this.x = a.x - a.x;
	        this.y = a.y - b.y;
	        return this;
	    },
		mul: function (a, b) {
			this.x = a.x * b.x;
			this.y = a.y * b.y;
			return this;
		},
	    div: function (a, b) {
			this.x = a.x / b.x;
			this.y = a.y / b.y;
			return this;
		},	    
		scale: function (v, s) {
	        this.x = v.x * s;
	        this.y = v.y * s;
	        return this;
	    },
	    dot: function (v) {
	        return this.x * v.x + this.y * v.y;
	    },
	    cross: function (a, b) {
	        return a.x * b.y - a.y * b.x;
	    },
		sqrLength: function () {
			return this.x * this.x + this.y * this.y;
		},
		length: function () {
        	return Math.sqrt(this.x * this.x + this.y * this.y);
    	},
		inverse: function () {
			this.x = 1.0 / this.x;	
			this.y = 1.0 / this.y;
			return this;
		},
		normalize: function () {
	        var l = 1.0 / this.length();
	        this.x *= l;
	        this.y *= l;	       
	        return this;
	    },
		lerp: function (a, b, t) {
		    this.x = a.x + t * (b.x - a.x);
		    this.y = a.y + t * (b.y - a.y);
		    return this;
		},
		mulMat: function (mat2, v) {
			var tm = mat2.m,
	        	tx = tm[0] * v.x + tm[2] * v.y,
				ty = tm[1] * v.x + tm[3] * v.y;	        	
	        this.x = tx;
	        this.y = ty;	       
	        return this;		
		}
	}; // Vec2.prototype
	
	//---------------------------------------------
	
	function Vec3 (x, y, z) {
	    this.x = x || 0;
	    this.y = y || 0;
	    this.z = z || 0;
	}
	Vec3.prototype = {
	    set: function (x, y, z) {
	        this.x = x || 0;
	        this.y = y || 0;
	        this.z = z || 0;
	        return this;
	    },
		copy: function (v) {
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;			
			return this;	
		},
		clone: function () {
	        return new Vec3(this.x, this.y, this.z);
	    },		
	    toString: function () {
	        return "Vec3:(" + this.x + ", " + this.y + ", " + this.z + ")";
	    },		
	    add: function (a, b) {
	        this.x = a.x + b.x;
	        this.y = a.y + b.y;
	        this.z = a.z + b.z;
	        return this;
	    },
	    sub: function (a, b) {
	        this.x = a.x - b.x;
	        this.y = a.y - b.y;
	        this.z = a.z - b.z;
	        return this;
	    },
		mul: function (a, b) {
			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;
			return this;
		},
		div: function (a, b) {
			this.x = a.x / b.x;
			this.y = a.y / b.y;
			this.z = a.z / b.z;
			return this;
		},	
	    scale: function (v, s) {
	        this.x = v.x * s;
	        this.y = v.y * s;
	        this.z = v.z * s;
	        return this;
	    },
	    dot: function (v) {
	        return this.x * v.x + this.y * v.y + this.z * v.z;
	    },
	    cross: function (a, b) {
	        var tx = a.y * b.z - a.z * b.y,
	        	ty = a.z * b.x - a.x * b.z,
	        	tz = a.x * b.y - a.y * b.x;
	        this.x = tx;
	        this.y = ty;
	        this.z = tz;
	        return this;
	    },
		sqrLength: function () {
			return this.x * this.x + this.y * this.y + this.z * this.z;
		},
		length: function () {
        	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    	},
		inverse: function () {
			this.x = 1.0 / this.x;	
			this.y = 1.0 / this.y;	
			this.z = 1.0 / this.z;
			return this;
		},
		normalize: function () {
	        var l = 1.0 / this.length();
	        this.x *= l;
	        this.y *= l;
	        this.z *= l;
	        return this;
	    },
		lerp: function (a, b, t) {
		    this.x = a.x + t * (b.x - a.x);
		    this.y = a.y + t * (b.y - a.y);
		    this.z = a.z + t * (b.z - a.z);
		    return this;
		},
		mulMat: function (mat3, v) {
	        var tm = mat3.m,
	        	tx = tm[0] * v.x + tm[3] * v.y + tm[6] * v.z,
				ty = tm[1] * v.x + tm[4] * v.y + tm[7] * v.z,
	        	tz = tm[2] * v.x + tm[5] * v.y + tm[8] * v.z;
	        this.x = tx;
	        this.y = ty;
	        this.z = tz;
	        return this;
	    }
	}; // Vec3.prototype
	
	//---------------------------------------------

	function Vec4 (x, y, z, w) {
	    this.x = x || 0;
	    this.y = y || 0;
	    this.z = z || 0;
	    this.w = w || 0;
	}
	Vec4.prototype = {
	    set: function (x, y, z, w) {
	        this.x = x || 0;
	        this.y = y || 0;
	        this.z = z || 0;
			this.w = w || 0;
	        return this;
	    },
		copy: function (v) {
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;			
			this.w = v.w;			
			return this;	
		},
		clone: function () {
	        return new Vec4(this.x, this.y, this.z, this.w);
	    },		
	    toString: function () {
	        return "Vec4:(" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ")";
	    },		
	    add: function (a, b) {
	        this.x = a.x + b.x;
	        this.y = a.y + b.y;
	        this.z = a.z + b.z;
			this.w = a.w + b.w;
	        return this;
	    },
	    sub: function (a, b) {
	        this.x = a.x - b.x;
	        this.y = a.y - b.y;
	        this.z = a.z - b.z;
	        this.w = a.w - b.w;
			return this;
	    },
		mul: function (a, b) {
			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;
			this.w = a.w * b.w;
			return this;
		},
		div: function (a, b) {
			this.x = a.x / b.x;
			this.y = a.y / b.y;
			this.z = a.z / b.z;
			this.w = a.w / b.w;
			return this;
		},	
	    scale: function (v, s) {
	        this.x = v.x * s;
	        this.y = v.y * s;
	        this.z = v.z * s;
			this.w = v.w * s;
	        return this;
	    },
	    dot: function (v) {
	        return this.x * v.x + this.y * v.y + this.z * v.z;
	    },
	    cross: function (a, b) {
	        var tx = a.y * b.z - a.z * b.y,
	        	ty = a.z * b.x - a.x * b.z,
	        	tz = a.x * b.y - a.y * b.x;
	        this.x = tx;
	        this.y = ty;
	        this.z = tz;
			this.w = 0.0;
	        return this;
	    },
		sqrLength: function () {
			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
		},
		length: function () {
        	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    	},
		inverse: function () {
			this.x = 1.0 / this.x;	
			this.y = 1.0 / this.y;	
			this.z = 1.0 / this.z;	
			this.w = 1.0 / this.w;	
		},
		normalize: function () {
	        var l = 1.0 / this.length();
	        this.x *= l;
	        this.y *= l;
	        this.z *= l;
	        this.w *= l;	        
			return this;
	    },
		lerp: function (a, b, t) {
		    this.x = a.x + t * (b.x - a.x);
		    this.y = a.y + t * (b.y - a.y);
		    this.z = a.z + t * (b.z - a.z);
		    this.w = a.w + t * (b.w - a.w);
		    return this;
		},
		mulMat: function (mat4, v) {
	        var tm = mat4.m,
	        	tx = tm[0] * v.x + tm[4] * v.y + tm[ 8] * v.z + tm[12] * v.w,
				ty = tm[1] * v.x + tm[5] * v.y + tm[ 9] * v.z + tm[13] * v.w,
	        	tz = tm[2] * v.x + tm[6] * v.y + tm[10] * v.z + tm[14] * v.w,
				tw = tm[3] * v.x + tm[7] * v.y + tm[11] * v.z + tm[15] * v.w;
	        this.x = tx;
	        this.y = ty;
	        this.z = tz;
	        this.w = tw;
			return this;
	    }
	}; // Vec4.prototype
	
	//---------------------------------------------
	
	function Mat4(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
    	var t = [16];//new Float32Array(16);
		this.m = t;
	    t[0] = (m11 !== undefined) ? m11 : 1; t[1] = m12 || 0; t[2] = m13 || 0; t[3] = m14 || 0;
		t[4] = m21 || 0; t[5] = (m22 !== undefined) ? m22 : 1; t[6] = m23 || 0; t[7] = m24 || 0;
		t[8] = m31 || 0; t[9] = m32 || 0; t[10] = (m33 !== undefined) ? m33 : 1; t[11] = m34 || 0; 
		t[12] = m41 || 0; t[13] = m42 || 0; t[14] = m43 || 0; t[15] = ( m44 !== undefined ) ? m44 : 1;
	};
	Mat4.prototype = {
	    set: function (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
			var t = this.m;
	        t[0] = (m11 !== undefined) ? m11 : 1; t[1] = m12 || 0; t[2] = m13 || 0; t[3] = m14 || 0;
			t[4] = m21 || 0; t[5] = (m22 !== undefined) ? m22 : 1; t[6] = m23 || 0; t[7] = m24 || 0;
			t[8] = m31 || 0; t[9] = m32 || 0; t[10] = (m33 !== undefined) ? m33 : 1; t[11] = m34 || 0; 
			t[12] = m41 || 0; t[13] = m42 || 0; t[14] = m43 || 0; t[15] = ( m44 !== undefined ) ? m44 : 1;
	        return this;
	    },
		clone: function () {
			var m = this.m;
			return new Mat4(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);	
		},
		mul: function (ma, mb) {
			 var th = this.m,
	        	ta = ma.m,
	        	tb = mb.m,				
				a0 = ta[0], a1 = ta[1], a2 = ta[2], a3 = ta[3],
				a4 = ta[4], a5 = ta[5], a6 = ta[6], a7 = ta[7],
				a8 = ta[8], a9 = ta[9], a10 = ta[10],a11 = ta[11],
				a12 = ta[12], a13 = ta[13], a14 = ta[14],a15 = ta[15],
				b0 = tb[0], b1 = tb[1], b2 = tb[2], b3 = tb[3],
				b4 = tb[4], b5 = tb[5], b6 = tb[6], b7 = tb[7],
				b8 = tb[8], b9 = tb[9], b10 = tb[10],b11 = tb[11],
				b12 = tb[12], b13 = tb[13], b14 = tb[14],b15 = tb[15];
				
			th[0] = a0 * b0 + a4 * b1 + a8 * b2 + a12 * b3;
			th[1] = a1 * b0 + a5 * b1 + a9 * b2 + a13 * b3;
			th[2] = a2 * b0 + a6 * b1 + a10 * b2 + a14 * b3;
			th[3] = a3 * b0 + a7 * b1 + a11 * b2 + a15 * b3;
	
			th[4] = a0 * b4 + a4 * b5 + a8 * b6 + a12 * b7;
			th[5] = a1 * b4 + a5 * b5 + a9 * b6 + a13 * b7;
			th[6] = a2 * b4 + a6 * b5 + a10 * b6 + a14 * b7;
			th[7] = a3 * b4 + a7 * b5 + a11 * b6 + a15 * b7;
	
			th[ 8] = a0 * b8 + a4 * b9 + a8 * b10 + a12 * b11;
			th[ 9] = a1 * b8 + a5 * b9 + a9 * b10 + a13 * b11;
			th[10] = a2 * b8 + a6 * b9 + a10 * b10 + a14 * b11;
			th[11] = a3 * b8 + a7 * b9 + a11 * b10 + a15 * b11;
	
			th[12] = a0 * b12 + a4 * b13 + a8 * b14 + a12 * b15;
			th[13] = a1 * b12 + a5 * b13 + a9 * b14 + a13 * b15;
			th[14] = a2 * b12 + a6 * b13 + a10 * b14 + a14 * b15;
			th[15] = a3 * b12 + a7 * b13 + a11 * b14 + a15 * b15;
			return this;
		},
		transpose: function () {
			var m = this.m,
				t;
			t = m[ 1]; m[ 4] = m[ 1]; m[ 4] = t;
			t = m[ 2]; m[ 8] = m[ 2]; m[ 8] = t;
			t = m[ 3]; m[12] = m[ 3]; m[12] = t;
			t = m[ 6]; m[ 9] = m[ 6]; m[ 9] = t;
			t = m[ 7]; m[13] = m[ 7]; m[13] = t;
			t = m[11]; m[14] = m[11]; m[14] = t;
			return this;
		},
		inverse: function () {
      		var m = this.m,
			  	inv0  =  m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10],
				inv4  = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10],
				inv8  =  m[4] * m[9]  * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9],
				inv12 = -m[4] * m[9]  * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9],
				inv1  = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10],
				inv5  =  m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10],
				inv9  = -m[0] * m[9]  * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9],
				inv13 =  m[0] * m[9]  * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9],
				inv2  =  m[1] * m[6]  * m[15] - m[1] * m[7]  * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7]  - m[13] * m[3] * m[6],
				inv6  = -m[0] * m[6]  * m[15] + m[0] * m[7]  * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7]  + m[12] * m[3] * m[6],
				inv10 =  m[0] * m[5]  * m[15] - m[0] * m[7]  * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7]  - m[12] * m[3] * m[5],
				inv14 = -m[0] * m[5]  * m[14] + m[0] * m[6]  * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6]  + m[12] * m[2] * m[5],
				inv3  = -m[1] * m[6]  * m[11] + m[1] * m[7]  * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9]  * m[2] * m[7]  + m[9]  * m[3] * m[6],
				inv7  =  m[0] * m[6]  * m[11] - m[0] * m[7]  * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8]  * m[2] * m[7]  - m[8]  * m[3] * m[6],
				inv11 = -m[0] * m[5]  * m[11] + m[0] * m[7]  * m[9]  + m[4] * m[1] * m[11] - m[4] * m[3] * m[9]  - m[8]  * m[1] * m[7]  + m[8]  * m[3] * m[5],
				inv15 =  m[0] * m[5]  * m[10] - m[0] * m[6]  * m[9]  - m[4] * m[1] * m[10] + m[4] * m[2] * m[9]  + m[8]  * m[1] * m[6]  - m[8]  * m[2] * m[5],
				det = m[0] * inv0 + m[1] * inv4 + m[2] * inv8 + m[3] * inv12;

    		if (det == 0)
        		return null;
			det = 1.0 / det;
    		
			m[0]  = inv0  * det;
			m[1]  = inv1  * det;
			m[2]  = inv2  * det;
			m[3]  = inv3  * det;
			m[4]  = inv4  * det;
			m[5]  = inv5  * det;
			m[6]  = inv6  * det;
			m[7]  = inv7  * det;
			m[8]  = inv8  * det;
			m[9]  = inv9  * det;
			m[10] = inv10 * det;
			m[11] = inv11 * det;
			m[12] = inv12 * det;
			m[13] = inv13 * det;
			m[14] = inv14 * det;
			m[15] = inv15 * det;
			return this;
		},

		toString: function () {
			var str = "matrix:[",
				i;
			for (i = 0; i < 15; ++i) {
				str += this.m[i] + ",";
			}
			str += this.m[15] + "]";
			return str;
		}
	};
	
	//---------------------------------------------
	
	function Mat3(m11, m12, m13, m21, m22, m23, m31, m32, m33){
    	var t = [9];//new Float32Array(9);
		this.m = t;
	    t[0] = (m11 !== undefined) ? m11 : 1; t[1] = m12 || 0; t[2] = m13 || 0;
		t[3] = m21 || 0; t[4] = (m22 !== undefined) ? m22 : 1; t[5] = m23 || 0;
		t[6] = m31 || 0; t[7] = m32 || 0; t[8] = (m33 !== undefined) ? m33 : 1;
	};
	Mat3.prototype = {
	    set: function (m11, m12, m13, m21, m22, m23, m31, m32, m33) {
			var t = this.m;
	        t[0] = (m11 !== undefined) ? m11 : 1; t[1] = m12 || 0; t[2] = m13 || 0;
			t[3] = m21 || 0; t[4] = (m22 !== undefined) ? m22 : 1; t[5] = m23 || 0;
			t[6] = m31 || 0; t[7] = m32 || 0; t[8] = (m33 !== undefined) ? m33 : 1;
	        return this;
	    },
		clone: function () {
			var m = this.m;
			return new Mat3(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);	
		},
		mul: function (ma, mb) {
	        var th = this.m,
	        	ta = ma.m,
	        	tb = mb.m,				
				a0 = ta[0], a1 = ta[1], a2 = ta[2],
				a3 = ta[3], a4 = ta[4], a5 = ta[5],
				a6 = ta[6], a7 = ta[7], a8 = ta[8],
	        	b0 = tb[0], b1 = tb[1], b2 = tb[2], 
				b3 = tb[3], b4 = tb[4], b5 = tb[5],
				b6 = tb[6], b7 = tb[7], b8 = tb[8];
	        th[0] = a0 * b0 + a3 * b1 + a6 * b2;
	        th[1] = a1 * b0 + a4 * b1 + a7 * b2;
	        th[2] = a2 * b0 + a5 * b1 + a8 * b2;
	        th[3] = a0 * b3 + a3 * b4 + a6 * b5;
	        th[4] = a1 * b3 + a4 * b4 + a7 * b5;
	        th[5] = a2 * b3 + a5 * b4 + a8 * b5;
	        th[6] = a0 * b6 + a3 * b7 + a6 * b8;
	        th[7] = a1 * b6 + a4 * b7 + a7 * b8;
	        th[8] = a2 * b6 + a5 * b7 + a8 * b8;
	        return this;
	    },
		transpose: function () {
			var m = this.m,
				t;
			t = m[1]; m[4] = m[1]; m[4] = t;
			t = m[3]; m[6] = m[6]; m[3] = t;
			t = m[5]; m[7] = m[7]; m[5] = t;
			return this;
		},
		inverse: function () {
			var m = this.m,
				a00 = m[0], a01 = m[1], a02 = m[2],
  				a10 = m[3], a11 = m[4], a12 = m[5],
  				a20 = m[6], a21 = m[7], a22 = m[8],
				b01 =  a22 * a11 - a12 * a21,
  				b11 = -a22 * a10 + a12 * a20,
  				b21 =  a21 * a10 - a11 * a20,
				det =  a00 * b01 + a01 * b11 + a02 * b21;

			m[0] = b01                      / det;
			m[1] = (-a22 * a01 + a02 * a21) / det;
			m[2] = (a12 * a01 - a02 * a11)  / det;
			m[3] = b11                      / det;
			m[4] = (a22 * a00 - a02 * a20)  / det;
			m[5] = (-a12 * a00 + a02 * a10) / det;
			m[6] = b21                      / det;
			m[7] = (-a21 * a00 + a01 * a20) / det;
			m[8] = (a11 * a00 - a01 * a10)  / det;
 			return this;
		},

		toString: function () {
			var str = "matrix:[",
				i;
			for (i = 0; i < 8; ++i) {
				str += this.m[i] + ",";
			}
			str += this.m[8] + "]";
			return str;
		}
	};
	//---------------------------------------------
	
	function Mat2(m11, m12, m21, m22){
    	var t = [4];//new Float32Array(4);
		this.m = t;
	    t[0] = (m11 !== undefined) ? m11 : 1; t[1] = m12 || 0;
		t[2] = m21 || 0; t[3] = (m22 !== undefined) ? m22 : 1;
	};
	Mat2.prototype = {
	    set: function (m11, m12, m21, m22) {
			var t = this.m;
	        t[0] = (m11 !== undefined) ? m11 : 1; t[1] = m12 || 0;
			t[2] = m21 || 0; t[3] = (m22 !== undefined) ? m22 : 1;
	        return this;
	    },
		clone: function () {
			var m = this.m;
			return new Mat2(m[0], m[1], m[2], m[3]);	
		},
		mul: function (ma, mb) {
			var th = this.m,
	        	ta = ma.m,
	        	tb = mb.m,
				a0 = ta[0], a1 = ta[1],
	        	a2 = ta[2], a3 = ta[3],	        	
	        	b0 = tb[0], b1 = tb[1],
	       		b2 = tb[2], b3 = tb[3];
	        th[0] = a0 * b0 + a2 * b1;
			th[1] = a1 * b0 + a3 * b2;
			th[2] = a0 * b2 + a2 * b3;
			th[3] = a1 * b2 + a3 * b3;
	        return this;
		},
		transpose: function () {
			var m = this.m,
				t;
			t = m[2]; m[2] = m[1]; m[1] = t;
			return this;
		}
	};
	
	//---------------------------------------------
	Mat2.rotate = function (angle) {
		var cs = Math.cos(angle),
			sn = Math.sin(angle);
		return new Mat2(cs, sn, sn, -cs);
	};

	//---------------------------------------------

	Mat4.lookat = function (eyeVec3, tarVec3, upVec3) {
		var z = new Vec3(0,0,0),
			x = new Vec3(0,0,0),
			y = new Vec3(0,0,0);
		z.sub(eyeVec3, tarVec3);
		z.normalize();
		x.cross(upVec3, z);
		x.normalize();
		y.cross(z, x);
		y.normalize();
		return new Mat4(
			 x.x, y.x, z.x, 0,
			 x.y, y.y, z.y, 0,
			 x.z, y.z, z.z, 0,
			-x.dot(eyeVec3), -y.dot(eyeVec3), -z.dot(eyeVec3),  1.0
		);
	};
	Mat4.perspective = function (fovy, aspect, znear, zfar) {
		var h = 1.0 / Math.tan(fovy * Math.PI / 180.0 * 0.5),
			w = h / aspect;
		return new Mat4(w, 0.0, 0.0, 0.0,
					 	0.0, h, 0.0, 0.0,
					 	0.0, 0.0, -(zfar + znear) / (zfar - znear), -1.0,
					 	0.0, 0.0, -2.0 * znear * zfar / (zfar - znear),  0.0);
	};
	Mat4.frustum = function (l, r, b, t, znear, zfar) {
		var x = 2.0 * znear / (r - l),
			y = 2.0 * znear / (t - b),
			z = (r + l) / (r - l),
			w = (t + b) / (t - b),
			e = - (zfar + znear) / (zfar - znear),
			p = -2.0 * zfar * znear / (zfar - znear);
		return new Mat4(
			x, 0, 0,  0,
			0, y, 0,  0,
			z, w, e, -1,
			0, 0, p,  0
		);
	};
	Mat4.ortho = function (l, r, b, t, znear, zfar) {
		var x =  2.0 / (r - l),
			y =  2.0 / (t - b),
			z =  -2.0 / (zfar - znear),
			tx = - (r + l) / (r - l),
			ty = - (t + b) / (t - b),
			tz = - (zfar + znear) / (zfar - znear);
		return new Mat4(x, 0, 0, 0,
						0, y, 0, 0,
						0, 0, z, 0,
						tx, ty, tz, 1
		);
	};

	Mat4.translate = function (x, y, z) {
		return new Mat4(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, z, 1
		);
	};
	Mat4.scale = function (x, y, z) {
		return new Mat4(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		);	
	};
	Mat4.rotateX = function (degrees) {
		var rad = degrees * Math.PI / 180.0,
			s = Math.sin(rad),
			c = Math.cos(rad);
		return new Mat4(
			1,  0, 0, 0,
			0,  c, s, 0,
			0, -s, c, 0,
			0,  0, 0, 1
		);
	};
	Mat4.rotateY = function (degrees) {
		var rad = degrees * Math.PI / 180.0,
			s = Math.sin(rad),
			c = Math.cos(rad);
		return new Mat4(
			c, 0, -s, 0,
			0, 1,  0, 0,
			s, 0,  c, 0,
			0, 0,  0, 1
		);
	};
	Mat4.rotateZ = function (degrees) {
		var rad = degrees * Math.PI / 180.0,
			s = Math.sin(rad),
			c = Math.cos(rad);
		return new Mat4(
			 c, s, 0, 0,
			-s, c, 0, 0,
			 0, 0, 1, 0,
			 0, 0, 0, 1
		);
	};
	Mat4.rotate = function (axis, degrees) {
		var rad = degrees * Math.PI / 180.0,
			cosa = Math.cos(rad),
    		sina = Math.sin(rad),
    		x = axis.x,
			y = axis.y,
			z = axis.z;
		return new Mat4(
			cosa + (1.0 - cosa) * x * x,
			(1.0 - cosa) * x * y + sina * z,
			(1.0 - cosa) * x * z - sina * y,
			0,
			(1.0 - cosa) * x * y - z * sina,
			cosa + (1 - cosa) * y * y,
			(1.0 - cosa) * y * z + x * sina,
			0,
			(1.0 - cosa) * x * z + sina * y,
			(1.0 - cosa) * y * z - sina * x,
			 cosa + (1.0 - cosa) * z * z,
			 0.0,
			 0.0,
			 0.0,
			 0.0,
			 1.0
		);
	};
	Mat4.euler = function (roll_degree, pitch_degree, yaw_degree) {
		var roll = roll_degree * Math.PI / 180.0,
			pitch = pitch_degree * Math.PI / 180.0,
			yaw = yaw_degree * Math.PI / 180.0,
			sin_y = Math.sin( yaw ),
			cos_y = Math.cos( yaw ),
			sin_p = Math.sin( pitch ),
			cos_p = Math.cos( pitch ),
			sin_r = Math.sin( roll ),
			cos_r = Math.cos( roll );
		return new Mat4(
			cos_y * cos_r + sin_y * sin_p * sin_r,
			sin_r * cos_p,
			cos_r * -sin_y + sin_r * sin_p * cos_y,
			0.0,
			-sin_r * cos_y + cos_r * sin_p * sin_y,
			cos_r * cos_p,
			sin_r * sin_y + cos_r * sin_p * cos_y,
			0.0,
			cos_p * sin_y,
			-sin_p,
			cos_p * cos_y,
			0.0, 0.0, 0.0, 0.0, 1.0
		);
	};

	//---------------------------------------------

	var vmath = {
		Vec4: Vec4,
		Vec3: Vec3,
		Vec2: Vec2,
		Mat4: Mat4,
		Mat3: Mat3,
		Mat2: Mat2
	};
    return vmath;
}, "vmath");