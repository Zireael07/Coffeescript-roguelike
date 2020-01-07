//ES 6 feature - import
import { setup, get_position } from "./game.js"
import { setup_keypad } from "./keypad.js";


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
    setup()

    nunjucks.configure('templates', { autoescape: true });

    var maintem = nunjucks.render('main.html', { position: get_position() })
    //force updates the whole page
    //document.write(
    $('#output').html(maintem)
    
    setup_keypad()
    //console.log(maintem)
}


function draw() {
  var maintem = nunjucks.render('main.html', { position: get_position() })
  //force updates the whole page
  //document.write(
  $('#output').html(maintem)
  
  setup_keypad()
}

//});

export { draw }