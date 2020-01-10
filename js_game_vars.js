
//have to wrap it in an object since ES6 modules are automatically strict
let State = {
    world: null,
    map: null,
    fov: null,
    explored: null,
    messages: null,
};

export { State };