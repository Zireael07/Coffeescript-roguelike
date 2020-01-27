import { Rect } from './map_common.js';

// max area rect under histogram
//direct port of Rust approach from https://codereview.stackexchange.com/questions/197112/largest-rectangle-in-histogram-in-rust?rq=1
function max_rectangle_histogram (floors, hist_index){
    const stack = []
    // populate stack with 0 to avoid checking for empty stack
    stack.push(0);
    // insert -1 from both sides so that we don't have to test for corner cases
    // trick described in e.g. http://shaofanlai.com/post/85
    floors.unshift(-1)
    floors.push(-1)
    let max_area = 0;
    let rect = null;
    let answer = null;

    floors.forEach((height, i) => {
        //console.log("height: " + height + " i: " + i);
        //If this bar is higher than the previous, push it to stack 
        if (height > floors[stack[stack.length - 1]]){
            stack.push(i);
        }
        else {
            // If this bar is lower, pop the bar from stack
            while (height < floors[stack[stack.length - 1]]) {
                // aka area height
                var last_bar = floors[stack[stack.pop()]]
                //unlike the more popular version, we don't need to have a case for empty stack here
                var width = (i - 1 - stack[stack.length - 1]);
                var area = last_bar * width;
                //console.log("w: " + width + " i: " + i + " x: " + (i-width))

                if (area > max_area){
                    max_area = area
                    // we assigned 1 for the first free cell in a column, but a Rect with a height of 1 is x+1 not x
                    // so we need to deduce 1 (so we get x and not x+1)
                    // this algo is bottom-up, rect is top-down - deduce height from y and add 1 so that we cover the bottom line
                    answer = [area, new Rect((i-width), (hist_index-last_bar+1), width, (last_bar)), hist_index]
                    //console.log("area: " + area + "y: " + hist_index)
                    //console.log("row y: " + hist_index + " h: " + (last_bar+1))
                    //console.log("rect: x " + (i-width) + " y " + (hist_index-last_bar+1) + " w " + width + " h " + (last_bar+1))
                }
            }

            stack.push(i);
        }
            
    })

    //console.log(answer[0])
    //console.log(answer[1])
    //console.log(answer[2])
    return answer
}

export {max_rectangle_histogram}