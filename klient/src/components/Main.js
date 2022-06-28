import { Scene, Vector3, GridHelper, AmbientLight, PCFSoftShadowMap } from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import Net from './Net';
import Map from './Map';
import GameLogic from "./GameLogic";

import { CarModel } from './car/Model'
import { config } from "./car/Config";

//root files
import { Player } from "./PlayerClass";

export default class Main {

    constructor(container) {

        // net
        this.net = new Net();

        // room
        this.roomId = null;

        // me
        this.me = new Player(null, null, null)
        this.me.car = new CarModel()
        this.activeKey = null
        this.gameEnd = false
        this.goodClickCounter = 0
        this.badClickCounter = 0
        this.onceSentReqPlayerReady = false
        this.updatePositionsAccess = false

        // enemy
        this.enemy = new Player(null, null, null)
        this.enemy.car = new CarModel()
        this.start()

        //camera
        this.camera = new Camera(30, window.innerWidth / 2, window.innerHeight / 2);
        this.camera.position.set(300, 200, 300)
        this.camera.lookAt(new Vector3(0, 0, 0));

        //scene
        this.container = container;
        this.scene = new Scene();

        //renderer
        this.renderer = new Renderer(this.scene, container);
        this.renderer.setClearColor(0x87ceeb, 1);
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap;

        this.light = new AmbientLight(0xffffff, 0.7)
        this.scene.add(this.light)

        //redner map
        this.map = new Map()
        const road = this.map.road()
        for (let i of road) this.scene.add(i)
        const offroad = this.map.offRoad()
        for (let i of offroad) this.scene.add(i)
        const railings = this.map.railings()
        for (let i of railings) this.scene.add(i)
        const buildings = this.map.buildings()
        for (let i of buildings) this.scene.add(i)

        this.render();
    }

    start() {
        const btn = document.querySelector('#start')
        btn.onclick = () => {
            this.newPlayer()
            let loadingScreen = document.querySelector('#info')
            loadingScreen.innerText = "Loading..."

            setTimeout(()=>{
                loadingScreen.style.display = 'none'
                this.me.car.startGameBox()
            },5000)

        }
    }

    newPlayer() {

        this.net.searchForRoom(response => {

            // console.log(response);
            let data = {players: []}
            data.players.push(response);

            this.roomId = response.room_id;

            if(data.players.length == 1){
                this.me.color = data.players[0].color
                this.me.position = data.players[0].position
                this.me._id = data.players[0]._id
                this.me.ready = data.players[0].ready

                if (this.me.color == "red"){
                    this.enemy.position = {x: 160, y: 0, z: 0}
                    this.enemy.color = "blue"
                } else {
                    this.enemy.color = "red"
                    this.enemy.position = {x: 60, y: 0, z: 0}
                }

            } else {
                this.me.color = data.players[1].color
                this.me.position = data.players[1].position
                this.me._id = data.players[1]._id
                this.me.ready = data.players[1].ready

                this.enemy.color = data.players[0].color
                this.enemy.position = data.players[0].position
                this.enemy._id = data.players[0]._id
                this.enemy.ready = data.players[0].ready
            }
    
            this.controller = this.me.car.load(this.scene, this.me.color)
            this.enemy.car.load(this.scene, this.enemy.color)
        });
    }

    render() {
        this.renderer.setViewport(0, 0, innerWidth, innerHeight); //viewport
        this.renderer.render(this.scene, this.camera);

        if (this.me.car.mesh) this.me.car.mesh.position.set(this.me.position.x, this.me.position.y, this.me.position.z)
        if (this.enemy.car.mesh) this.enemy.car.mesh.position.set(this.enemy.position.x, this.enemy.position.y, this.enemy.position.z)

        if(this.updatePositionsAccess == true) {
            //players positions update
            let requestData = {
                playerId: this.me._id,
                position: this.me.position,
                roomId: this.roomId
            }
            this.net.updateMyPosition(requestData, response => {
                let players = response.data

                if (players[0]._id == this.me._id) this.enemy.position = players[1].position
                else this.enemy.position = players[0].position

            });
        }

        if (this.me.car.mesh) {

            if (this.me.moveAccess == true) {
                this.me.position.z += 0.01 * this.gameLogic.multipler
            }

            if (config.playerIsReady && this.me.ready == false) {
                const startGameButtonPress = this.me.car.isReady()
                if (startGameButtonPress == true) {
                    this.me.ready = true
                }
            }

            if (this.me.ready == true && this.onceSentReqPlayerReady == false){
                this.onceSentReqPlayerReady = true;
                
                let requestData = {
                    playerId: this.me._id,
                    ready: this.me.ready,
                    roomId: this.roomId
                };

                this.net.playerIsReady(requestData, response => {
                    // console.log(response)
                    if (response.bothReady == true) {
                        //jeśli gracze są gotowi odliczanie się rozpoczyna
                        // console.log("gra startuje!")

                        this.updatePositionsAccess = true
                        this.me.ready = null
                        this.enemy.ready = null
                        this.gameLogic = new GameLogic()
                        this.gameLogic.startingAnimation()
                        this.activeKey = this.gameLogic.randomSign()
                    } else {
                        // console.log("Nie powinno to się zdarzyć - zwrócony response, ale jeden z nich nie jest gotowy.")
                    }
                });
            }

            const camVector = new Vector3(-1000, 700, -750)
            const camPos = camVector.applyMatrix4(this.me.car.mesh.matrixWorld)
            this.camera.position.set(camPos.x, camPos.y, camPos.z)
            this.camera.fov = 60
            this.camera.lookAt(
                new Vector3(
                    this.me.car.mesh.position.x,
                    this.me.car.mesh.position.y,
                    this.me.car.mesh.position.z
                )
            )
            this.camera.updateProjectionMatrix();

            if(this.me.position.z >= 2050 && this.gameEnd == false) this.gameLogic.endinfo(true, this.goodClickCounter, this.badClickCounter), this.gameEnd = true
            else if (this.enemy.position.z >= 2050 && this.gameEnd == false) this.gameLogic.endinfo(false, this.goodClickCounter, this.badClickCounter), this.gameEnd = true

        }

        if (this.activeKey) {
            document.body.onkeydown = (e)=>{
                let sign = document.querySelector('.sign')
                if (e.keyCode == this.activeKey.toString()){
                    this.me.moveAccess = true
                    this.goodClickCounter++
                    this.activeKey = undefined
                    sign.style.background = '#1aff1a'
                    setTimeout(()=>{
                        sign.style.background = 'orange'
                        this.gameLogic.multipler += 3
                        this.activeKey = this.gameLogic.randomSign()
                    },500)
                } else {
                    this.badClickCounter++
                    sign.style.background = 'red'
                    setTimeout(()=>{sign.style.background = 'orange'},500)
                }
            }
        }

        requestAnimationFrame(this.render.bind(this));
    }
}