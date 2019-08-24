window.THREE = require("three")

var GLTFLoader = require("three/examples/js/loaders/GLTFLoader.js")
window.THREE.B3DMLoader = require("three/examples/js/loaders/B3DMLoader.js")
require("three/examples/js/loaders/DRACOLoader.js")

// var canvas = document.getElementById( 'webgl-canvas' );
// var context = canvas.getContext( 'webgl2' );
// var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var defaultCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
defaultCamera.position.set( 0, 0, 100 );
defaultCamera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();
// var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// var geometry = new THREE.Geometry();
// geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
// geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
// geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
//
// var line = new THREE.Line( geometry, material );
//
// scene.add( line );
// renderer.render( scene, defautCamera );

const manager = new THREE.LoadingManager();

const gltfLoader = new THREE.GLTFLoader(manager);
gltfLoader.setCrossOrigin('anonymous');
gltfLoader.setDRACOLoader( new THREE.DRACOLoader() );
const b3dmLoader = new THREE.B3DMLoader.B3DMLoader(manager, gltfLoader);

let testUrl = "http://localhost:8080/Build/Apps/CesiumViewer/3dmodels/reindeer/january-2019-no-cesium-patch/textured/b/0/0.b3dm"

b3dmLoader.load(testUrl, (gltf) => {

    const scene = gltf.scene || gltf.scenes[0];
    const clips = gltf.animations || [];
    setContent(scene, clips);


    // See: https://github.com/google/draco/issues/349
    // THREE.DRACOLoader.releaseDecoderModule();

}, undefined, undefined);

function setContent ( object, clips ) {

    // this.clear();

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // this.controls.reset();

    // object.position.x += (object.position.x - center.x);
    // object.position.y += (object.position.y - center.y);
    // object.position.z += (object.position.z - center.z);

    object.position.x = 0
    object.position.y = 0
    object.position.z = 0

    // this.controls.maxDistance = size * 10;
    // defaultCamera.near = size / 100;
    // defaultCamera.far = size * 100;
    // defaultCamera.near = 1
    // defaultCamera.far = 500
    // defaultCamera.updateProjectionMatrix();

    // if (this.options.cameraPosition) {
    //
    //     this.defaultCamera.position.fromArray( this.options.cameraPosition );
    //     this.defaultCamera.lookAt( new THREE.Vector3() );
    //
    // } else {

        // defaultCamera.position.copy(center);
        // defaultCamera.position.x += size / 2.0;
        // defaultCamera.position.y += size / 5.0;
        // defaultCamera.position.z += size / 2.0;
        // defaultCamera.lookAt(center);

    // }

    // this.setCamera(DEFAULT_CAMERA);

    // this.controls.saveState();

    scene.add(object);
    //renderer.render( scene, defaultCamera );

    const hemiLight = new THREE.HemisphereLight();
    hemiLight.name = 'hemi_light';
    scene.add(hemiLight);

    requestAnimationFrame( renderWebgl );
    // this.content = object;
    //
    // this.state.addLights = true;
    // this.content.traverse((node) => {
    //     if (node.isLight) {
    //         this.state.addLights = false;
    //     }
    // });
    //
    // this.setClips(clips);
    //
    // this.updateLights();
    // this.updateGUI();
    // this.updateEnvironment();
    // this.updateTextureEncoding();
    // this.updateDisplay();
    //
    // window.content = this.content;
    // console.info('[glTF Viewer] THREE.Scene exported as `window.content`.');
    // this.printGraph(this.content);
}

function renderWebgl () {
    renderer.render( scene, defaultCamera );
}


// Keep a record of content types and their size in bytes.
let contentTypes = {};
let b3dms = []

// HTML element to output our data.
const output = document.querySelector('.analysis-output');
output.innerHTML = '';

// Simple render function.
const render = (b3dm) => {
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
});

// Clear the record if the page is refreshed or the user navigates to another page.
chrome.devtools.network.onNavigated.addListener(() => contentTypes = {});



