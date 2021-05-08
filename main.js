let engine;
let render;
let ground;
let mouse;
let mouseConstraints;

function initializeGame() {
    engine = Matter.Engine.create();
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options : {
            width  :1600 , height : 800 , wireframes:false
        }
    });
    ground = Matter.Bodies.rectangle(1200, 500, 300, 20, {isStatic: true});
    mouse = Matter.Mouse.create(render.canvas);
    mouseConstraints = Matter.MouseConstraint.create(engine, {mouse, constraint: {render: {visible: false}}})
}

function createAssets() {
    // let boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    // let boxB = Matter.Bodies.rectangle(300, 200, 80, 80);
    let ball = Matter.Bodies.circle(300 , 600,20);
    let sling = Matter.Constraint.create({
        pointA : {x : 300 , y : 600},
        bodyB : ball , stiffness :0.05
    })
    let stack = Matter.Composites.stack(1100, 200, 4, 4, 0, 0, function (x, y) {
        return Matter.Bodies.polygon(x, y, 8, 30);
    })
    return [stack,ball,sling, ground, mouseConstraints];
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
