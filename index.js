//ES 6 feature - import
import { setup, get_position, get_inventory, get_equipped, get_map, get_fov, get_stats, loadData, get_cursor_position } from "./game.js"
import { setup_keypad, setup_inventory } from "./keypad.js";
import { get_terminal, redraw_terminal, get_messages, get_look_list } from "./renderer.js";
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

function initial_draw() {
    var pos = get_position();
    //camera
    State.camera.update(pos)
    var term = redraw_terminal(pos, get_map(), get_fov())[0];
    var stat = get_stats();
    var inventory = get_inventory();
    var equipped = get_equipped();

    var env = nunjucks.configure('templates', { autoescape: true });

    var maintem = nunjucks.render('main.html', { position: pos, terminal: term, messages: [], stats: stat, inventory: inventory, equipped: equipped })
    //force updates the whole page
    //document.write(
    $('#output').html(maintem)
    
    setup_keypad(inventory)
    //console.log(maintem)
}


function fn(){
    //test for touch events support and if NOT supported, attach .no-touch class to the HTML tag.
    if (!("ontouchstart" in document.documentElement)) {
      document.documentElement.className += " no-touch";
      }

    console.log("Running ready function...")
    //setup();
    loadData();

    //initial_draw();
}


function draw() {
  var pos = get_position()
  //camera
  State.camera.update(pos)
  var term = redraw_terminal(pos, get_map(), get_fov())[0];
  //HUD
  var msgs = get_messages();
  var stat = get_stats();
  var cursor_pos = get_cursor_position();
  var look_list = get_look_list(cursor_pos);
  var inventory = get_inventory();
  var equipped = get_equipped();

  var maintem = nunjucks.render('main.html', { position: pos, terminal: term, messages: msgs, stats: stat, look: look_list,  equipped: equipped })
  //force updates the whole page
  //document.write(
  $('#output').html(maintem)
  
  setup_keypad(inventory);

}

//});

export { draw, initial_draw }