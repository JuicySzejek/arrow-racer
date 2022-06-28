import {
    PlaneGeometry,
    MeshPhongMaterial,
    Mesh,
    TextureLoader,
} from "three";
import texture from '../../assets/map/offroad.png'

export class OffRoad extends Mesh {

    constructor() {
        super(new PlaneGeometry(150, 100), new MeshPhongMaterial({
            map: new TextureLoader().load(texture),
            transparent: true,
            opacity: 1,
            specular: 0xffffff,
            shininess: 100,
        }))
    }
}