import {
    BoxGeometry,
    MeshPhongMaterial,
    Mesh,
    TextureLoader,
} from "three";
import texture from '../../assets/map/building.png'

export class Building extends Mesh {

    constructor() {
        const materials = [
            new MeshPhongMaterial({ map: new TextureLoader().load(texture), specular: 0xffffff, shininess: 100, }),
            new MeshPhongMaterial({ map: new TextureLoader().load(texture), specular: 0xffffff, shininess: 100, }),
            new MeshPhongMaterial({ map: new TextureLoader().load(texture), specular: 0xffffff, shininess: 100, }),
        ]
        super(new BoxGeometry(100, 150, 200), materials)
    }

}