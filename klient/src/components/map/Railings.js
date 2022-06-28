import {
    BoxGeometry,
    MeshPhongMaterial,
    Mesh,
    TextureLoader,
} from "three";
import trd from '../../assets/map/trd.png'
import tyres from '../../assets/map/tyres.png'

export class Railings extends Mesh {

    constructor() {
        const materials = [
            new MeshPhongMaterial({ map: new TextureLoader().load(trd), specular: 0xffffff, shininess: 100, }),
            new MeshPhongMaterial({ map: new TextureLoader().load(trd), specular: 0xffffff, shininess: 100, }),
            new MeshPhongMaterial({ map: new TextureLoader().load(tyres), specular: 0xffffff, shininess: 100, }),
        ]
        super(new BoxGeometry(20, 20, 100), materials)
    }

}