function intersect(...sets) {
    //console.log("Intersecting ... " + sets);
    if (!sets.length) return new Set();
    
    const i = sets.reduce((m, s, i) => s.size < sets[m].size ? i : m, 0);
    const [smallest] = sets.splice(i, 1);
    const res = new Set();
    for (let val of smallest)
        if (sets.every(s => s.has(val)))
            //console.log(val);
            res.add(val);

    //console.log(res);
    return res;
}

//https://stackoverflow.com/a/37067050
function intersect_lists(lists) {
    //console.log("Intersecting .... " + lists);

    //fix crashes with one list being empty
    for (var i = 0; i < lists.length; i++){
        var list = lists[i];
        if (list == undefined){
            console.log("Empty list passed...")
            return [] // return empty list
        }
    }

    var int = lists.reduce((p,c) => p.filter(e => c.includes(e)));

    //console.log(int);
    return int;
}

function remove_list(list, item) {
    const newlist = list.filter(it => it !== item)

    return newlist;
}

export { intersect_lists, remove_list }