//ES 6 feature - import
import { setup, get_position, get_map, get_fov } from "./game.js"
import { setup_keypad } from "./keypad.js";
import { get_terminal, redraw_terminal } from "./renderer.js";

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
    var term = redraw_terminal(pos, get_map(), get_fov())[0];

    nunjucks.configure('templates', { autoescape: true });
    var maintem = nunjucks.render('main.html', { position: pos, terminal: term })
    //force updates the whole page
    //document.write(
    $('#output').html(maintem)
    
    setup_keypad()
    //console.log(maintem)
}


function draw() {
  var pos = get_position()
  var term = redraw_terminal(pos, get_map(), get_fov())[0];
  var maintem = nunjucks.render('main.html', { position: pos, terminal: term })
  //force updates the whole page
  //document.write(
  $('#output').html(maintem)
  
  setup_keypad()
}

//});

export { draw }