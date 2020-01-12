//ES 6 feature - import
import { act_and_update } from "./game.js"

//$( document ).ready(function() {
function setup_keypad(inventory) {

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

    $("#enter").click(function(e) {
        act_and_update({'target': true});
    });
}

//In the Flask version this was handled by Jinja, alas, Nunjucks seems to evaluate functions passed to it every frame...
function setup_inventory(inventory, drop=false){
    console.log("Drop: " + drop);
    var letter, entity;

    for (var i = 0; i < inventory.length; i++){
        var item = inventory[i];
        console.log(item);
        [letter, name, entity] = item;
        console.log(letter + " ent: " + entity);
        $("#button-"+letter).click(function(e) {
            console.log("Clicked letter");
            if (drop) {
                console.log("drop...")
                act_and_update({"drop_item": entity})
                //https://stackoverflow.com/questions/41512720/jquery-cancel-others-event?noredirect=1&lq=1
                e.stopImmediatePropagation();
            }
            else{
                act_and_update({"use_item":entity});
            }
        });

    }
}

//});

export { setup_keypad, setup_inventory }