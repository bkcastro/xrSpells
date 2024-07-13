import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import ThreeMeshUI from 'three-mesh-ui';
import { playlists, images } from '../utils.js';

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

export class SpellCasterUI extends THREE.Group {

    constructor(spellCaster) {
        super();

        // Make the body  
        const body = new ThreeMeshUI.Block({
            padding: 0.1,
            backgroundOpacity: 0.0,
            justifyContent: 'center',
            contentDirection: 'row',
            fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
            fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png'
        });

        body.userData = {
            type: 'ui_handle'
        };

        //body.position.set(0, 2.0, -1.0);
        body.rotation.x = -0.3;

        MakePanel(body, spellCaster);

        this.add(body);

        this.scale.multiplyScalar(1 / 3)
    }

    update(elapsed, delta) {
        ThreeMeshUI.update();
    }
}

function MakePanel(body, spellCaster) {

    const leftPanel = new ThreeMeshUI.Block({
        // height: 0,
        padding: 0.025,
        backgroundOpacity: 1,
        justifyContent: 'center',
        fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
        fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png'
    })

    const rightPanel = new ThreeMeshUI.Block({
        // height: 0,
        padding: 0.025,
        backgroundOpacity: 1,
        justifyContent: 'center',
        fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
        fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png'
    })

    const spells = spellCaster.getAllSpells();

    for (let i = 0; i < Math.round(spells.length / 2); i++) {

        const imageBlock = new ThreeMeshUI.Block({
            width: 0.75,
            height: .35,
            margin: 0.01,
        });

        imageBlock.frame.userData.type = 'ui_image';
        imageBlock.frame.userData.action = () => {
            spellCaster.castSpell(spells[i].userData.name);
        }

        new THREE.TextureLoader().load(spells[i].userData.image, (texture) => {
            imageBlock.set({
                backgroundTexture: texture,
            })
        })

        leftPanel.add(imageBlock);
    }

    for (let i = Math.round(spells.length / 2); i < spells.length; i++) {

        const imageBlock = new ThreeMeshUI.Block({
            width: 0.75,
            height: .35,
            margin: 0.01,
        });

        imageBlock.frame.userData.type = 'ui_image';
        imageBlock.frame.userData.action = () => {
            spellCaster.castSpell(spells[i].userData.name);
        }

        new THREE.TextureLoader().load(spells[i].userData.image, (texture) => {
            imageBlock.set({
                backgroundTexture: texture,
            })
        })

        rightPanel.add(imageBlock);
    }



    body.add(leftPanel);
    body.add(rightPanel);

}

function buildJustifiedPanel(id, color, contentDirection) {

    const panel = new ThreeMeshUI.Block({
        width: contentDirection === 'row' ? DIM_HIGH : DIM_LOW,
        height: contentDirection === 'row' ? DIM_LOW : DIM_HIGH,
        contentDirection: contentDirection,
        justifyContent: 'start',
        backgroundOpacity: 0.5,
        padding: 0.02,
        margin: 0.01,
        offset: 0.0001
    });
    container.add(panel);

    // const letters = 'ABCDEF';

    for (let i = 0; i < 5; i++) {

        const blockText = new ThreeMeshUI.Block({
            width: 0.125,
            height: 0.125,
            margin: 0.01,
            borderRadius: 0.02,
            backgroundColor: color,
            justifyContent: 'center',
            alignItems: 'center',
            offset: 0.001
        });

        panel.add(blockText);

        // const text = new ThreeMeshUI.Text( {
        // 	content: letters[ i ]
        // } );
        // blockText.add( text );

    }

    return panel;
}

// const mainUI = new MainUI(); 

export default SpellCasterUI; 
