//ES 6 feature - import
import { act_and_update, onStateLoaded, unpause_game, 
    unlock_target, reveal_map } from "./game.js"
import { State } from './js_game_vars.js'
import { saveJS, loadJS } from "./save.js"

//$( document ).ready(function() {
function setup_keypad(inventory) {

    $("#go_wait").click(function(e){
        console.log("Clicked wait button");
        act_and_update({'move': [0,0] });
    });

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

    $("#inven").click(function(e) {
        console.log("Clicked inven");
        var invtem = nunjucks.render('inventory.html', { inventory: inventory })
        $('#inventory').html(invtem)
        setup_inventory(inventory);
        $(".modal").attr("style", "display:block")
        $("#close_btn").click(function(e) {
            console.log("Clicked close")
            $(".modal").attr("style", "display:none");
        });
    });

    $("#drop").click(function(e) {
        console.log("Clicked drop");
        var invtem = nunjucks.render('inventory.html', { inventory: inventory })
        $('#inventory').html(invtem)
        setup_inventory(inventory, true);
        $(".modal").attr("style", "display:block")
        $("#close_btn").click(function(e) {
            console.log("Clicked close")
            $(".modal").attr("style", "display:none");
        });
    });

    $("#look").click(function(e) {
        console.log("Clicked look");
        act_and_update({'look': true});
    });

    $("#enter").click(function(e) {
        act_and_update({'target': true});
    });

    $("#save").click(function(e) {
        saveJS(State)
    });

    $("#load").click(function(e){
        onStateLoaded(loadJS())
    });

    // $("#examine").click(function(e) {
    //     console.log("Clicked examine");
    //     show_codepad();
    // });
    $("#debug").click(function(e) {
        console.log("Clicked debug")
        show_debug();
    });
}

//In the Flask version this was handled by Jinja, alas, Nunjucks seems to evaluate functions passed to it every frame...
function setup_inventory(inventory, drop=false){
    console.log("Drop: " + drop);

    for (var i = 0; i < inventory.length; i++){
        var item = inventory[i];
        //console.log(item);
        //for some reason, this doesn't work (wrong references in click handler)
        var letter = item[0];
        // var name = item[1];
        // var entity = item[2];

        var id = "button-"+letter.toString();
        //console.log("id: " + id);
        $(document.getElementById(id)).click(function(e) {
            console.log("Clicked letter " + $(this).val());
            var entity = $(this).attr("data-entity");
            console.log("Ent: " + entity);
            if (drop) {
                //console.log("drop...")
                act_and_update({"drop_item": Number(entity)})
                //https://stackoverflow.com/questions/41512720/jquery-cancel-others-event?noredirect=1&lq=1
                //e.stopImmediatePropagation();
            }
            else{
                act_and_update({"use_item":Number(entity)});
            }
        });

    }
}

function setup_codepad(){
    for (var i = 0; i < 10; i++){
        $(document.getElementById(i)).click(function(e) {
            console.log("Clicked " + $(this).val());
            //var txt = $(document.getElementById("code")).text()
            if ($(document.getElementById("code")).text().length < 5){
                //console.log("L: " + $(document.getElementById("code")).text().length)
                //append on click
                $(document.getElementById("code")).append($(this).val())
            }
        });
    }
}

function show_codepad(ent_target){
    console.log("Show codepad...")
    var code_keypad = nunjucks.render('codepad.html')
    $('#codepad').html(code_keypad)
    setup_codepad()

    $(".modal").attr("style", "display:block")
    $("#close_btn").click(function(e) {
        console.log("Clicked close")
        $(".modal").attr("style", "display:none");
        //unpause game
        unpause_game();
        var code = $(document.getElementById("code")).text().trim();
        console.log("Entered code: " + code);
        //unlock target
        unlock_target(code, ent_target);
    });
}

function show_debug(){
    var debug = nunjucks.render('debug.html')
    $('#debug_menu').html(debug)

    $("#debug-view").click(function(e) {
        console.log("Clicked debug view");
        reveal_map();
    })

    $(".modal").attr("style", "display:block")
    $("#close_btn").click(function(e) {
        console.log("Clicked close")
        $(".modal").attr("style", "display:none");
        //unpause game
        //unpause_game();
    });

}

//});

export { setup_keypad, setup_inventory, show_codepad }