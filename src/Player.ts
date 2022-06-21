import * as PIXI from 'pixi.js'
import { TownMap } from './TownMap'
import { Game } from './game'
import { Npc } from "./Npc"
import { Gamepads } from './gamepads'

export class Player extends PIXI.Sprite {
    //variables
    private xspeed: number;
    private yspeed: number;
    private direction: number; //clockwise, starting at north, 0-3
    private health: number;
    private woodclubTexture: PIXI.Texture;
    private tempTexture: PIXI.Texture;
    private townMap: TownMap;
    private game: Game;
    private gamepads: Gamepads;

    constructor(game: Game, gamepads: Gamepads, townMap: TownMap, texture: PIXI.Texture, woodclubTexture: PIXI.Texture) {
        super(texture)
        
        console.log("hyaa! i am link!");
        this.xspeed = 0;
        this.yspeed = 0;
        this.direction = 2;
        this.townMap = townMap;

        this.game = game;
        this.gamepads = gamepads
        this.anchor.set(0.5);
        this.x = game.pixi.screen.width / 2;
        this.y = game.pixi.screen.height / 2;

        this.health = 10
        //this.inventory.push("sword", "mysCrystal")

        this.x = 400
        this.y = 400

        this.scale.set(0.2)
        this.anchor.set(0.5)

        this.woodclubTexture = woodclubTexture

        window.addEventListener("keydown", (e: KeyboardEvent) => this.move(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.unMove(e))
    }

    //operations
    public update(delta: number) {
        
        if (this.gamepads.gamepads != undefined){
            this.gamepadMove()
            this.gamepadButton()
        }
    

        let mapwidth = 3050 //De breedte van het Map
        let mapheight = 2350 //De lengte van de Map
        let centerx = 720 // midden van de viewport X
        let centery = 564.5 // midden van de viewport Y

        // Speler mag niet buiten beeld lopen
        this.x = this.clamp(this.x + this.xspeed, 36, 3010)
        this.y = this.clamp(this.y + this.yspeed, 48, 1984)

        let mapx = this.clamp(this.x, centerx, mapwidth - centerx)
        let mapy = this.clamp(this.y, centery, mapheight - centery)
        this.game.pixi.stage.pivot.set(mapx, mapy)    


        // console.log("X:", this.x, "Y:", this.y)
    }
    // ??? does some math idk ask Bilal
    public clamp(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max)
    }

// on button press, sets appropriate speed, or calls function for interactivity
    private move(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case "A":
            case "ARROWLEFT":
                this.direction = 3
                this.xspeed = -3
                break
            case "D":
            case "ARROWRIGHT":
                this.direction = 1
                this.xspeed = 3                
                break
            case "W":
            case "ARROWUP":
                this.direction = 0
                this.yspeed = -3
                break
            case "S":
            case "ARROWDOWN":
                this.direction = 2
                this.yspeed = 3
                break
            case "K":
                this.attack()
                break
            case "E":
                this.interact()
                break
        }
    }

    // on button release, resets appropriate speeds
    private unMove(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case "A":
            case "D":
            case "ARROWLEFT":
            case "ARROWRIGHT":
                this.xspeed = 0
                break
            case "W":
            case "S":
            case "ARROWUP":
            case "ARROWDOWN":
                this.yspeed = 0
                break
        }
    }

    private gamepadMove(){
        // console.log(this.gamepads.axesHandler)
        let leftPos: any[] = [];
        let x = this.gamepads.axesHandler(0)
        let y = this.gamepads.axesHandler(1)
        if(x != null && y != null){
            leftPos.push(x)
            leftPos.push(y)
        }
        
        // console.log(leftPos)
        let i = 0
        for(let coord of leftPos){
            if (i == 0){
                if(coord < -0.5) {
                    this.xspeed = -3
                } else if(coord > 0.5) {
                    this.xspeed = 3
                } else {
                    this.xspeed = 0
                } i = 1
            }
            if (i == 1){
                if(coord < -0.5) {
                    this.yspeed = -3
                } else if(coord > 0.5) {
                    this.yspeed = 3
                } else {
                    this.yspeed = 0
                } 
            }
        }
    }

    private gamepadButton(){
        let buttonDown = this.gamepads.buttonHandler()
        // console.log(buttonDown)

        switch (buttonDown) {
            case 0: 
                this.interact()
                break
            case 1:
                this.attack()
                break
            case 2:
                break
            case 3:
                this.openInventory()
                break
        }
    }

    // attacks, changes character sprite to woodenclub. not right.
    private attack() {
        console.log("ATTACKKKKK")
        this.tempTexture = this.texture
        this.texture = this.woodclubTexture
        this.woodclubTexture = this.tempTexture
    }

    // interacts with the first npc in the array that has this.inRange == true,
    // then calls said npc's dialogue function.
    private interact() {
        let npcInRange = this.game.npcs.find((npc: Npc) => npc.getInRange() === true)
        if(npcInRange != undefined){
            npcInRange.dialogue()
        }
    }

    private openInventory() {

    }
    private takeDamage() {

    }
    private die() {

    }
}