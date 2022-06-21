import { Game } from './game'

export class Gamepads {
    public gamepads: any = {};
    private game: Game;

    constructor(game: Game){
        this.game = game;

        window.addEventListener("gamepadconnected", function(e: GamepadEvent) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
              e.gamepad.index, e.gamepad.id,
              e.gamepad.buttons.length, e.gamepad.axes.length);
          });
        
        window.addEventListener("gamepaddisconnected", function(e) {
          console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);
        });  
        window.addEventListener("gamepadconnected", (e: GamepadEvent) => { this.gamepadHandler(e, true); }, false);
        window.addEventListener("gamepaddisconnected", (e: GamepadEvent) => { this.gamepadHandler(e, false); }, false);
    }

    public gamepadHandler(event: GamepadEvent, connecting: boolean) {
      const gamepad = event.gamepad;
      // Note:
      // gamepad === navigator.getGamepads()[gamepad.index]
    
      if (connecting) {
        this.gamepads[gamepad.index] = gamepad;
      } else {
        delete this.gamepads[gamepad.index];
      }
    }

    public axesHandler(coord: number){      
        const myGamepad = navigator.getGamepads()[0]; // use the first gamepad
        return myGamepad.axes[coord]
    }

    public buttonHandler(){
      const myGamepad = navigator.getGamepads()[0]; // use the first gamepad

      for (let i = 0; i < myGamepad.buttons.length; i++) {
        if(myGamepad.buttons[i].pressed) {
          return i
        }
      } 
    }
    
    
    
}