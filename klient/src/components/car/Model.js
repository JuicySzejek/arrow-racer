import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { CharacterController } from './Keyboard'

export class CarModel {
    constructor() {
        this._id = null
        this.color = null
        this.position = null
        this.ready = false

        this.scene = null
        this.mesh = null
        this.controller = null
        this.loader = new FBXLoader()
    }

    load(scene, color) {
        this.scene = scene
        this.color = color
        this.loader.load(`./assets/${this.color}.fbx`, (mesh) => {
            this.mesh = mesh
            this.mesh.scale.set(0.15, 0.15, 0.15)
            this.mesh.position.set(-1000, -1000, -1000)
            this.mesh.rotation.y = (Math.PI * 1.13)
            this.scene.add(this.mesh);
            this.controller = new CharacterController(window, this.mesh)
            return this.controller
        })
    }

    startGameBox() {
        const startGameBox = document.createElement('div')
        startGameBox.classList.add('gui-box')
        startGameBox.innerText = 'Jeśli jesteś gotowy naciśnij [SPACJE]'
        document.body.appendChild(startGameBox)
    }

    isReady() {
        const startGameBox = document.querySelector('.gui-box')
        if (startGameBox) startGameBox.innerText = 'Oczekiwanie na drugiego gracza...'

        //socket na serwer z informacją, że player z _id = this._id (czyli ja jestem gotowy) jest ready = true
        // server ... //
        // jeśli oboje gracze sa gotowi to startuje gra, a jezeli nie no to czekamy na drugiego

        //przykładowy response
        const data = {
            players: [
                {
                    _id: this._id,
                    room_id: 'asdasdasdasdas',
                    ready: true,
                    position: { x: 160, y: 0, z: 0 },
                    color: 'blue',
                },

                //jak nie ma drugiego gracza to jego pozycja niech bedzie jego data bedzie id=0, color=red lub blue, position -1000,-1000,-1000

                {
                    _id: 'sdfsdfsdfsd',
                    room_id: 'asdgt45sfsdf',
                    ready: true,
                    position: { x: 60, y: 0, z: 0 },
                    color: 'red',
                }
            ],
        }

        if ( data.players[0].ready == true && data.players[1].ready == true) return true
        else return false

    }
}