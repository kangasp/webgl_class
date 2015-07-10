"use strict";

var canvas;
var gl;
var NumTimesToSubdivide = 2;

window.onload = init

function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    render( NumTimesToSubdivide );

};


function update( i )
{
    alert(i);
    render( 4 );
}

function divideTriangle( a, b, c, count, p )
{
    // check for end of recursion
    if ( count === 0 ) {
        p.push( a,b,c);
    }
    else {
        //bisect the sides
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );
        --count;

        // three new triangles
        divideTriangle( a, ab, ac, count, p );
        divideTriangle( c, ac, bc, count, p );
        divideTriangle( b, bc, ab, count, p );
    }
}

function render(num)
{
    //  Initialize our data for the Sierpinski Gasket
    // First, initialize the corners of our gasket with three points.
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )   ];
    var points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2], num, points );
    
    // Send new data over
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // render 
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
