window.THREE = require("three")

var GLTFLoader = require("three/examples/js/loaders/GLTFLoader.js")
require("three/examples/js/loaders/B3DMLoader.js")
require("three/examples/js/loaders/DRACOLoader.js")
require('three/examples/js/controls/OrbitControls');
require('three/examples/js/controls/TrackballControls');
require('three/examples/js/controls/FirstPersonControls');



//
canvas = document.getElementById("canvas-webgl")

renderer = new THREE.WebGLRenderer( { canvas: canvas } );
const ratio = 0.5
const width = ratio * window.innerWidth
const height = ratio * window.innerHeight

renderer.setSize( width, height );

document.body.appendChild( renderer.domElement );

defaultCamera = new THREE.PerspectiveCamera( 45, width / height, 1, 500 );
defaultCamera.position.set( 0, 0, 100 );
defaultCamera.lookAt( 0, 0, 0 );

// var controls = new THREE.OrbitControls( defaultCamera, renderer.domElement );
// controls.autoRotate = false;
// controls.autoRotateSpeed = -10;
// controls.screenSpacePanning = true;
// controls.enabled = true;

var trackballControls = new THREE.TrackballControls( defaultCamera, renderer.domElement );
trackballControls.rotateSpeed = 1.0;
trackballControls.zoomSpeed = 1.0;
trackballControls.panSpeed = 1.0;

// var fpControls = new THREE.FirstPersonControls(defaultCamera, renderer.domElement);
// fpControls.lookSpeed = 0.4;
// fpControls.movementSpeed = 20;
// fpControls.lookVertical = true;
// fpControls.constrainVertical = true;
// fpControls.verticalMin = 1.0;
// fpControls.verticalMax = 2.0;

scene = new THREE.Scene();

// scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

// var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// var geometry = new THREE.Geometry();
// var line = new THREE.Line( geometry, material );
// scene.add( line );
// renderer.render( scene, defautCamera );

const manager = new THREE.LoadingManager();

const gltfLoader = new THREE.GLTFLoader(manager);
gltfLoader.setCrossOrigin('anonymous');
gltfLoader.setDRACOLoader( new THREE.DRACOLoader() );
const b3dmLoader = new THREE.B3DMLoader(manager, gltfLoader);

// b3dmLoader.load(testUrl, (gltf) => {
//
//     const scene = gltf.scene || gltf.scenes[0];
//     const clips = gltf.animations || [];
//     setContent(scene, clips);
//     // See: https://github.com/google/draco/issues/349
//     // THREE.DRACOLoader.releaseDecoderModule();
//
// }, undefined, undefined);

function viewB3dm (url) {
    b3dmLoader.load( url, (gltf) => {
        const scene = gltf.scene || gltf.scenes[0];
        const clips = gltf.animations
        setContent(scene, clips);
    })
}

function setContent ( object, clips ) {

    // this.clear();

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // controls.reset();

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
    // controls.saveState();
    // this.controls.saveState();

    scene.add(object);
    //renderer.render( scene, defaultCamera );

    var spotLight = new THREE.SpotLight("#ffffff");
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 100;
    // spotLight.target = plane;
    spotLight.distance = 0;
    spotLight.angle = 0.4;
    spotLight.shadow.camera.fov = 120;
    //
    // var directionalLight = new THREE.DirectionalLight("#ffffff")
    // directionalLight.castShadow = true;
    // directionalLight.shadow.camera.near = 2;
    // directionalLight.shadow.camera.far = 800;
    // directionalLight.shadow.camera.left = -30;
    // directionalLight.shadow.camera.right = 30;
    // directionalLight.shadow.camera.top = 30;
    // directionalLight.shadow.camera.bottom = -30;
    //
    //
    scene.add(spotLight);
    // scene.add(directionalLight)


    // var ambientLight = new THREE.AmbientLight("#606008");
    // scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight();
    hemiLight.name = 'hemi_light';
    scene.add(hemiLight);

    renderWebgl()
    // this.state.addLights = true;
    // this.content.traverse((node) => {
    //     if (node.isLight) {
    //         this.state.addLights = false;
    //     }
    // });
    //
    // this.setClips(clips);
    // this.updateLights();
    // this.updateGUI();
    // this.updateEnvironment();
    // this.updateTextureEncoding();
}

var clock = new THREE.Clock();

function renderWebgl () {

    var delta = clock.getDelta();
    trackballControls.update(delta);
    // fpControls.update(delta);

    // controls.update();
    requestAnimationFrame(renderWebgl)
    renderer.render( scene, defaultCamera );

}


// Keep a record of content types and their size in bytes.
let contentTypes = {};
let b3dms = []

// HTML element to output our data.
const output = document.querySelector('.analysis-output');
output.innerHTML = '';

output.addEventListener("click", clickHandler, false)

function clickHandler(evt, url) {
    evt.preventDefault()
    if( evt.target.className === "b3dm-url" && evt.target.tagName === "A" ) {
        const b3dmUrl = evt.target.getAttribute("data-b3dm-url")
        viewB3dm( b3dmUrl )
    }
}

const clearUrlsBtn = document.getElementById("clearUrls")
clearUrlsBtn.addEventListener("click", clearUrls)

function clearUrls() {

    output.innerHTML = ""
    b3dms = []

}

const clearCanvasBtn = document.getElementById("clearCanvas")
clearCanvasBtn.addEventListener("click", clearCanvas)

function clearCanvas() {
    for ( var childIdx = 0; childIdx < scene.children.length; childIdx++ ) {
        var sceneChild = scene.children[ childIdx ]

        if ( sceneChild instanceof THREE.Scene ) {
            for ( var grandChildIdx = sceneChild.children.length - 1; grandChildIdx >= 0; grandChildIdx-- ) {
                var grandChild = sceneChild.children [ grandChildIdx ]
                sceneChild.remove( grandChild )
            }
        }
    }

}

// Simple render function.
const render = (b3dm) => {
    output.innerHTML =
        `<p><a class="b3dm-url" 
               data-b3dm-url="${b3dm.url}" 
               href="${b3dm.url}">${b3dm.url}
            </a> (${parseInt(b3dm.size/1024, 10)} KiB)
        </p>`
        + output.innerHTML
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





