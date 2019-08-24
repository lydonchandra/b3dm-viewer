window.THREE = require("three")
var GLTFLoader = require("three/examples/js/loaders/GLTFLoader.js")
window.THREE.B3DMLoader = require("three/examples/js/loaders/B3DMLoader.js")


// var canvas = document.getElementById( 'webgl-canvas' );
// var context = canvas.getContext( 'webgl2' );
// var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();
var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );

var line = new THREE.Line( geometry, material );

scene.add( line );
renderer.render( scene, camera );








// Keep a record of content types and their size in bytes.
let contentTypes = {};
let b3dms = []

// HTML element to output our data.
const output = document.querySelector('.analysis-output');
output.innerHTML = '';
// Simple render function.
const render = (b3dm) => {
    // //output.innerHTML = '';
    // for (let type in contentTypes) {
    //     output.innerHTML += `<p>${type}: ${contentTypes[type].size}</p>`
    // }

    output.innerHTML += `<p>${b3dm.url}: ${b3dm.size}</p>`

};
// When a network request has finished this function will be called.
chrome.devtools.network.onRequestFinished.addListener(request => {
    if(request.request.url.toLowerCase().endsWith("b3dm")) {
        let url = request.request.url
        let b3dm = {
            url: url,
            size: 0
        }

        request.getContent(function(data) {
            //console.log(data)
        })

        const response = request.response;
        b3dm.size += response.content.size

        b3dms.push(b3dm)
        render(b3dm)
    }



    //Find the Content-Type header.
    // const contentHeader = response.headers.find(header => header.name.toLowerCase() === 'content-type');
    // if (contentHeader) {
    //     const contentType = contentHeader.value;
    //     if (!contentTypes[contentType]) {
    //         contentTypes[contentType] = { size: 0 };
    //     }
    //     // Add the size of the body response to our table.
    //     contentTypes[contentType].size += response.bodySize;
    //     render();
    // }
});

// Clear the record if the page is refreshed or the user navigates to another page.
chrome.devtools.network.onNavigated.addListener(() => contentTypes = {});



