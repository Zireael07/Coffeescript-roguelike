//ES 6 feature - import
import { setup, get_position, get_inventory, get_map, get_fov, get_stats } from "./game.js"
import { setup_keypad, setup_inventory } from "./keypad.js";
import { get_terminal, redraw_terminal, get_messages } from "./renderer.js";
import { State } from "./js_game_vars.js";

ready(fn)

//$( document ).ready(function() 
function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

function fn(){
    console.log("Running ready function...")
    setup();

    var pos = get_position();
    //camera
    State.camera.update(pos)
    var term = redraw_terminal(pos, get_map(), get_fov())[0];
    var stat = get_stats();

    var env = nunjucks.configure('templates', { autoescape: true });

    var maintem = nunjucks.render('main.html', { position: pos, terminal: term, messages: [], stats: stat, inventory: [] })
    //force updates the whole page
    //document.write(
    $('#output').html(maintem)
    
    setup_keypad([])
    //console.log(maintem)
}


function draw() {
  var pos = get_position()
  //camera
  State.camera.update(pos)
  var term = redraw_terminal(pos, get_map(), get_fov())[0];
  //HUD
  var msgs = get_messages();
  var stat = get_stats();
  var inventory = get_inventory();

  var maintem = nunjucks.render('main.html', { position: pos, terminal: term, messages: msgs, stats: stat })
  //force updates the whole page
  //document.write(
  $('#output').html(maintem)
  
  setup_keypad(inventory);

}

//});

export { draw }