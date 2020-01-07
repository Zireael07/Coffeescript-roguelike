function intersect(...sets) {
    console.log("Intersecting ... " + sets);
    if (!sets.length) return new Set();
    
    const i = sets.reduce((m, s, i) => s.size < sets[m].size ? i : m, 0);
    const [smallest] = sets.splice(i, 1);
    const res = new Set();
    for (let val of smallest)
        if (sets.every(s => s.has(val)))
            //console.log(val);
            res.add(val);

    console.log(res);
    return res;
}

//https://stackoverflow.com/a/37067050
function intersect_lists(lists) {
    console.log("Intersecting .... " + lists);

    var int = lists.reduce((p,c) => p.filter(e => c.includes(e)));

    console.log(int);
    return int;
}

export { intersect_lists }