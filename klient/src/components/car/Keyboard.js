import { config } from './Config'

export class CharacterController {
    constructor(domElement, modelMesh) {
        this.domElement = domElement
        this.modelMesh = modelMesh

        this.domElement.addEventListener('keydown', e => {
            this.onKeyDown(e)
        })
        this.domElement.addEventListener('keyup', e => {
            this.onKeyUp(e)
        })
    }

    onKeyDown(e) {
        switch (e.keyCode) {
            case 32:
                config.playerIsReady = true
                break
        }
    }
    onKeyUp(e) {
        switch (e.keyCode) {
            case 32:
                config.playerIsReady = false
                break
        }
    }
}
