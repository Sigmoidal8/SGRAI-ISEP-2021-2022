import * as THREE from '../three/build/three.module.js';

/*
 * parameters = {
 *  color: Color,
 *  side: String,
 *  size: Vector3,
 *  speed: Number,
 *  baseline: Number,
 *  keyCodes: { down: String, up: String }
 * }
 */

export default class Player {
    constructor(parameters, table) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }
        this.halfSize = this.size.clone().divideScalar(2.0);
        this.baseline *= table.halfSize.x;
        /* To-do #7 - Compute the rackets' lower and upper boundaries
            - both the lower and upper boundaries depend on the table and racket dimensions
            - more specifically, the boundaries depend on parameters table.halfSize.y (the table's half Y-dimension) and this.halfSize.y (the racket's half Y-dimension)

        this.centerLower = ...;
        this.centerUpper = ...; */

        this.centerLower = - table.halfSize.y + this.halfSize.y;
        this.centerUpper = +table.halfSize.y - this.halfSize.y;
        this.keyStates = { down: false, up: false, left: false, right: false};

        /* To-do #2 - Create the racket (a rectangle) with properties defined by the following parameters:
            - width: size.x
            - height: size.y
            - color: color

            - follow the instructions in this example to create the rectangle: https://threejs.org/docs/api/en/geometries/PlaneGeometry.html

        const geometry = new THREE.PlaneGeometry(...);
        const material = new THREE.MeshBasicMaterial(...);
        this.object = new THREE.Mesh(...); */

        const geometry = new THREE.PlaneGeometry(this.size.x, this.size.y);
        const material = new THREE.MeshBasicMaterial({color: this.color});
        this.object = new THREE.Mesh(geometry,material); 

        this.initialize();
    }

    /* To-do #8 - Check the racket's lower and upper boundaries
        - lower boundary: this.centerLower
        - upper boundary: this.centerUpper

    checkLowerBoundary() {
        if (...) {
            ...;
        }
    }

    checkUpperBoundary() {
        if (...) {
            ...;
        }
    } */

    checkLowerBoundary(){
        if(this.object.position.y <= this.centerLower){
            this.center.y = this.centerLower;
        }
    }

    checkUpperBoundary() {
        if (this.object.position.y >= this.centerUpper){
            this.center.y = this.centerUpper;
        }
    } 

    checkRearBoundary() {
        if (this.side == 'left'){
            if (this.object.position.x <= -this.halfSize.x* 0.95){
                this.center.x =  -this.halfSize.x* 0.95;
            }
        }else{
            if (this.object.position.x >= this.halfSize.x* 0.95){
                this.center.x = this.halfSize.x* 0.95;
            }
        }
    }

    checkFrontBoundary() {
        if (this.side == 'left'){
            if (this.object.position.x <= -this.halfSize.x* 0.15){
                this.center.x =  -this.halfSize.x* 0.15;
            }
        }else{
            if (this.object.position.x >= this.halfSize.x* 0.15){
                this.center.x = this.halfSize.x* 0.15;
            }
        }
    }

    initialize() {
        this.center = new THREE.Vector3(this.baseline, 0.0, 0.0);
        if (this.side == 'left') { // Player 1 racket: the center's x-coordinate must be negative
            this.center.x = -this.center.x;
        }
        this.score = 0;
        /* To-do #3 - Set the racket's center position:
            - x: this.center.x
            - y: this.center.y
            - z: this.center.z

        this.object.position.set(...); */

        this.object.position.set(this.center.x, this.center.y, this.center.z);
    }

    update(deltaT) {
        /* To-do #6 - Update the racket's center position
            - current position: this.center.y
            - current speed: this.speed
            - elapsed time: deltaT

            - start by computing the covered distance:
                covered distance = racket speed * elapsed time
            - then compute the racket's new position:
                new position = current position ± covered distance (+ or - depending on which key the user is pressing)

        if (this.keyStates.down) {
            ... -= ...;
            this.checkLowerBoundary();
        }
        if (this.keyStates.up) {
            ... += ...;
            this.checkUpperBoundary();
        }
        this.object.position.set(...); */

        let coveredDsitance = this.speed * deltaT;
        if (this.keyStates.down) {
            this.center.y  -=  coveredDsitance;
            this.checkLowerBoundary();
        }
        if (this.keyStates.up) {
            this.center.y  +=  coveredDsitance;
            this.checkUpperBoundary();
        }
        if (this.keyStates.left){
            this.center.x -=  coveredDsitance;
        }
        if (this.keyStates.right){
            this.center.x += coveredDsitance;
        }
        this.object.position.setY(this.center.y);
        this.object.position.setX(this.center.x);
    }
}