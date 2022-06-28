//elements
import { Road } from "./map/Road";
import { OffRoad } from "./map/OffRoad";
import { Railings } from "./map/Railings";
import { Building } from "./map/Building";
import { Meta1 } from "./map/Meta1"
import { Meta2 } from "./map/Meta2"

export default class Map {

    constructor() {
        this.roadElements = []
        this.offRoadElements = []
        this.railingsElements = []
        this.buildingElements = []
    }

    road() {
        let rotator = 0
        for (let x = 60; x < 220; x += 100) {
            for (let z = -600; z < 2500; z += 100) {

                if (z == 2000) {
                    if (rotator == 0) {
                        let road = new Meta1()
                        road.rotation.x = -1 * Math.PI / 2
                        road.rotation.z = Math.PI / 2 * rotator
                        road.position.set(x, 0, z)
                        this.roadElements.push(road)
                    }else {
                        let road = new Meta2()
                        road.rotation.x = -1 * Math.PI / 2
                        road.rotation.z = Math.PI / 2 * rotator
                        road.position.set(x, 0, z)
                        this.roadElements.push(road)
                    }
                } else {
                    let road = new Road()
                    road.rotation.x = -1 * Math.PI / 2
                    road.rotation.z = Math.PI / 2 * rotator
                    road.position.set(x, 0, z)
                    this.roadElements.push(road)
                }
            }
            rotator = 2
        }
        return this.roadElements
    }

    offRoad() {
        for (let x = -85; x < 500; x += 380) {
            for (let z = -600; z < 2500; z += 100) {
                let road = new OffRoad()
                road.rotation.x = -1 * Math.PI / 2
                road.position.set(x, 0, z)
                this.offRoadElements.push(road)
            }
        }

        return this.offRoadElements
    }

    railings() {
        for (let x = 0; x < 400; x += 220) {
            for (let z = -600; z < 2500; z += 100) {
                let railings = new Railings()
                railings.position.set(x, 10, z)
                this.railingsElements.push(railings)
            }
        }
        return this.railingsElements
    }

    buildings() {
        for (let z = -650; z < 2500; z += 200) {
            let building = new Building()
            building.position.set(-200, 50, z)
            this.buildingElements.push(building)
        }
        return this.buildingElements
    }

}