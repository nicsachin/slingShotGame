let engine;
let render;
let ground;
let mouse;
let mouseConstraints;

function initializeGame() {
    engine = Matter.Engine.create();
    render = Matter.Render.create({
        element: document.body,
        engine: engine
    });
    ground = Matter.Bodies.rectangle(400, 600, 810, 60, {isStatic: true});
    mouse = Matter.Mouse.create(render.canvas);
    mouseConstraints = Matter.MouseConstraint.create(engine, {mouse, constraint: {render: {visible: false}}})
}

function createAssets() {
    // let boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    // let boxB = Matter.Bodies.rectangle(300, 200, 80, 80);
    let stack = Matter.Composites.stack(200, 200, 4, 4, 0, 0, function (x, y) {
        return Matter.Bodies.rectangle(x, y, 80, 80);
    })
    return [stack, ground, mouseConstraints];
}


function main() {
    initializeGame();
    let worldObjects = createAssets();
    /**
     * initialize world
     * */
    Matter.World.add(engine.world, worldObjects)
    Matter.Engine.run(engine);
    Matter.Render.run(render);
}


main();
