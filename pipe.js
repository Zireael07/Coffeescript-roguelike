//https://dev.to/benlesh/a-simple-explanation-of-functional-pipe-in-javascript-2hbj

function pipe(...fns) {
    return (arg) => fns.reduce((prev, fn) => fn(prev), arg);
  }

  function pipeWith(arg, ...fns) {
    return pipe(...fns)(arg);
  }

  export { pipeWith }