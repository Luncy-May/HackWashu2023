
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set (0,5,16);
camera.lookAt(0,0,0);

// Create a renderer
const renderer = new THREE.WebGLRenderer( {antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("container").appendChild(renderer.domElement);


// Create an OrbitControl
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);


//Below is an example of clickable object
const objects = [];
const popups = [];
// Define a function of addClickableObject
const addClickableButton = (position, color, text) => {
const geometry = new THREE.SphereGeometry(0.17, 10, 10); // Radius, Width Segments, Height Segments
const material = new THREE.MeshBasicMaterial({ color: color }); // put color
const cube = new THREE.Mesh(geometry, material);
cube.position.set(...position);
scene.add(cube);
objects.push(cube);

const popup = document.createElement("div");
popup.className = "popup";
popup.innerHTML = text;
document.body.appendChild(popup);
popups.push(popup);
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onClick = (event) => {
    // Calculate the mouse coordinates in the scene
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        const index = objects.indexOf(object);
        const popup = popups[index];
        const vector = object.position.clone().project(camera);
        const x = (vector.x + 1) / 2 * window.innerWidth;
        const y = (-vector.y + 1) / 2 * window.innerHeight;
        popup.style.left = x + "px";
        popup.style.top = y + "px";

        // Toggle the popup's visibility
        if (popup.style.display === "block") {
            popup.style.display = "none";
        } else {
            popup.style.display = "block";
        }
    }
};

window.addEventListener("click", onClick, false);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("rockRoad.jpg");

const groundGeometry = new THREE.PlaneGeometry(40,40,100,100);
groundGeometry.rotateX(-Math.PI/2);
const groundMaterial = new THREE.MeshStandardMaterial({map: texture});
const groundMesh = new THREE.Mesh(groundGeometry,groundMaterial);
scene.add(groundMesh);

const Falltexture = textureLoader.load("WashuFuture.jpg");
const backgroundGeometry = new THREE.PlaneGeometry(70,50,100,100);
const backgroundMaterial = new THREE.MeshStandardMaterial({map: Falltexture, side: THREE.DoubleSide});

const background = new THREE.Mesh(backgroundGeometry,backgroundMaterial);
background.position.set(0,15,-20);
scene.add(background);

const wallGeometry = new THREE.PlaneGeometry(70,50,100,100);
const Walltexture = textureLoader.load("WashuFall.jpg");
wallGeometry.rotateY(-Math.PI/2);
const wallMaterial = new THREE.MeshStandardMaterial({map: Walltexture, side: THREE.DoubleSide});
const leftWall = new THREE.Mesh(wallGeometry,wallMaterial);
const rightWall = new THREE.Mesh(wallGeometry,wallMaterial);
leftWall.position.set(-20,15,0);
rightWall.position.set(20,15,0);
scene.add(leftWall);
scene.add(rightWall);

const spotLight = new THREE.SpotLight(0xffffff,20,20,8,1);
spotLight.position.set(0,25,0);
scene.add(spotLight);

//Inserting the library model
// NOT SURE GLTF or GLB
const loader = new GLTFLoader().setPath("");
loader.load("LibraryOlin.gltf", (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0,1.05,-1);
    scene.add(mesh);
});

// start making buttons
//Application of addClickableObject
//addClickableObject = (position, color, text)
addClickableButton([0,0.5,3.5],0xcd8500,"Basement");
addClickableButton([0,1.5,3.5],0xff0000,"Floor 1 \nHere, You'll find Whispers Cafe which hosts Corner 17, a popular local Chinese restaurant.");
addClickableButton([0,3,3.5],0x00ff00,"Floor 2");
addClickableButton([0,4,3.5],0x0000ff,"Floor 3");


// Render loop
const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();

// Handle window resize
window.addEventListener('resize', function () {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});