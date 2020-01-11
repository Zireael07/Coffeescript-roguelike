//ES 6 feature - import
import { act_and_update } from "./game.js"

//$( document ).ready(function() {
function setup_keypad() {

    $("#go_s").click(function(e) {
        console.log("Clicked a button 1");
        act_and_update({'move': [0, 1] });
       
    });
    $("#go_w").click(function(e) {
        console.log("Clicked a button 1");
        act_and_update({'move': [-1,0]});
        
    });
    $("#go_e").click(function(e) {
        act_and_update({'move': [1,0]})
        console.log("Clicked a button 1");
    });
    $("#go_se").click(function(e) {
        act_and_update({'move': [1,1]});
    
    });
    $("#go_sw").click(function(e) {
        act_and_update({'move': [-1, 1]});

    });
    $("#go_n").click(function(e) {
        act_and_update({'move':[0,-1]});
    });
    $("#go_ne").click(function(e) {
        //console.log("Clicked a button 1");
        act_and_update({'move':[1,-1]});

    });
    $("#go_nw").click(function(e) {
        //console.log("Clicked a button 1");
        act_and_update({'move':[-1, -1]});
    });
    $("#get").click(function(e){
        act_and_update({'pick_up': true});
    })

}

//});

export { setup_keypad }