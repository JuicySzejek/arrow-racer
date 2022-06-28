import {
    PlaneGeometry,
    MeshPhongMaterial,
    Mesh,
    TextureLoader,
} from "three";
import texture from '../../assets/map/road.png'

export class Road extends Mesh {

    constructor() {
        super(new PlaneGeometry(100, 100), new MeshPhongMaterial({
            map: new TextureLoader().load(texture),
            transparent: true,
            opacity: 1,
            specular: 0xffffff,
            shininess: 100,
        }))
    }
}