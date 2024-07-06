import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import ThreeMeshUI from 'three-mesh-ui';
import { playlists, images } from '../utils.js';
import { attribute, userData } from 'three/examples/jsm/nodes/Nodes.js';
import spellCaster from './SpellCaster.js'
import { spellList } from '../utils.js';

const selectedAttributes = {
    offset: 0.002,
    backgroundOpacity: 0.7,
    backgroundColor: new THREE.Color(0x777777),
    fontColor: new THREE.Color(0x222222)
};

const hoveredStateAttributes = {
    state: 'hovered',
    attributes: {
        offset: 0.002,
        backgroundColor: new THREE.Color(0x999999),
        backgroundOpacity: 0.3,
        fontColor: new THREE.Color(0xffffff)
    },
};

const idleStateAttributes = {
    state: 'idle',
    attributes: {
        offset: 0.002,
        backgroundColor: new THREE.Color(0x666666),
        backgroundOpacity: 0.5,
        fontColor: new THREE.Color(0xffffff)
    },
};

export class MainUI extends THREE.Group {

    constructor() {
        super();

        this.init();
    }

    init() {

        // Make the body of the playlist 
        const body = new ThreeMeshUI.Block({
            padding: 0.1,
            backgroundOpacity: 0.0,
            justifyContent: 'center',
            contentDirection: 'row',
            fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
            fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png'
        });

        //body.position.set(0, 2.0, -1.0);
        body.rotation.x = -0.3;

        MakePanelOne(body);
        // MakePanelTwo(body);
        // MakePanelThree(body);
        this.add(body);

        body.userData = {
            type: 'ui_handle'
        };

        this.scale.multiplyScalar(1 / 3)

    }

    playSong(song) {
        console.log("play this song", song.name);
    }

    update(elapsed, delta) {
        ThreeMeshUI.update();
    }
}

function MakePanelOne(body) {

    const leftPanel = new ThreeMeshUI.Block({
        // height: 0,
        padding: 0.05,
        backgroundOpacity: 1,
        justifyContent: 'center',
        fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
        fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png'
    })

    leftPanel.setupState({
        state: 'selected',
        attributes: selectedAttributes,
        onSet: () => {
            console.log("selected body");
        }
    });

    leftPanel.setupState(hoveredStateAttributes);
    leftPanel.setupState(idleStateAttributes);

    for (let i = 0; i < images.length; i++) {

        const imageBlock = new ThreeMeshUI.Block({
            width: 0.75,
            height: .35,
            margin: 0.01,
        })

        console.log(imageBlock)

        imageBlock.frame.userData.type = 'ui_image';
        imageBlock.frame.userData.action = () => {
            spellCaster.castSpell(spellList[i]);
        }

        new THREE.TextureLoader().load(images[i], (texture) => {
            imageBlock.set({
                backgroundTexture: texture,
            })
        })

        leftPanel.add(imageBlock);
    }

    body.add(leftPanel);
}

function MakePanelTwo(body) {

    const middlePanel = new ThreeMeshUI.Block({
        height: 2.75,
        width: 2.6,
        backgroundOpacity: 0.25,
        justifyContent: 'center',
        contentDirection: 'column',
    })
    // Add the title  
    const header = new ThreeMeshUI.Block({
        height: 0.2,
        width: .75,
        justifyContent: 'center',
        backgroundOpacity: 0.2,
        fontSize: 0.09,
    });

    header.add(
        new ThreeMeshUI.Text({
            content: "Baryon XR",
            fontSize: 0.1
        })
    );

    middlePanel.add(header);

    const baryonPlaylist = playlists[0]; // This will change 
    const songs = baryonPlaylist.songs;

    const container = new ThreeMeshUI.Block({
        padding: 0.05,
        width: 2.6,
        backgroundOpacity: 0.0,
        justifyContent: 'space-around',
        contentDirection: "row",
    })

    for (let i = 0; i < 2; i++) {

        const row = new ThreeMeshUI.Block({
            padding: 0.05,
            height: 0.35 * (Math.round(songs.length / 2)) + 0.25,
            backgroundOpacity: 0.0,
            justifyContent: 'space-around',
        })

        for (let j = 0; j < songs.length / 2; j++) {

            const card = new ThreeMeshUI.Block({
                width: 1.1,
                justifyContent: 'start',
                contentDirection: "row",
                backgroundOpacity: 0.0,
                fontSize: 0.09,
            })

            const index = i * (Math.round(songs.length / 2)) + j

            if (index < songs.length) {

                const leftSubBlock = new ThreeMeshUI.Block({
                    height: 0.35,
                    width: 0.35,
                    textAlign: "left",
                    justifyContent: "end",
                });

                const rightSubBlock = new ThreeMeshUI.Block({
                    width: .70,
                    height: 0.35,
                    padding: 0.025,
                    justifyContent: "center",
                    textAlign: "left",
                    backgroundOpacity: 0.2,
                });

                rightSubBlock.add(
                    new ThreeMeshUI.Text({
                        content: songs[index].name + "\n",
                        fontSize: 0.075,
                    }),
                    new ThreeMeshUI.Text({
                        content: songs[index].by,
                        fontSize: 0.05
                    })
                )

                rightSubBlock.setupState({
                    state: 'selected',
                    attributes: selectedAttributes,
                    onSet: () => {
                        this.playSong(songs[index])
                    }
                });

                rightSubBlock.setupState(hoveredStateAttributes);
                rightSubBlock.setupState(idleStateAttributes);


                card.add(leftSubBlock, rightSubBlock);

                new THREE.TextureLoader().load(songs[index].image, (texture) => {
                    leftSubBlock.set({
                        backgroundTexture: texture,
                    })
                })
            }

            row.add(card);
        }

        container.add(row);
    }

    const audioBarContainer = new ThreeMeshUI.Block({
        height: 0.35,
        width: 0.35,
        backgroundOpacity: 0,
    })

    // Instantiate a loader
    const loader = new GLTFLoader();

    loader.load(
        // resource URL
        'glb/audioUI.glb',
        // called when the resource is loaded
        function (gltf) {
            let model = gltf.scene;
            model.scale.multiplyScalar(1 / 2)
            console.log(model);
            model.children[2].visible = false;
            body.add(model);
            audioBarContainer.add(model);
        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );

    middlePanel.add(container);
    middlePanel.add(audioBarContainer);
    body.add(middlePanel);
}

function MakePanelThree(body) {

    const thirdPanel = new ThreeMeshUI.Block({
        height: 2.6,
        width: 3,
        backgroundOpacity: 0,
    })

    // thirdPanel.add(baryon);

    body.add(thirdPanel);
}

// const mainUI = new MainUI(); 

export default MainUI; 
