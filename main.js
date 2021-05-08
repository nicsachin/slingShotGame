let engine;
let render;
let ground;
let mouse;
let mouseConstraints;
let ball;
let sling;
let firing = false;
let chances = 2;

function initializeGame() {
    updateDom();
    engine = Matter.Engine.create();
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 1600, height: 800, wireframes: false
        }
    });
    ground = Matter.Bodies.rectangle(1200, 500, 300, 20, {isStatic: true});
    mouse = Matter.Mouse.create(render.canvas);
    mouseConstraints = Matter.MouseConstraint.create(engine, {mouse, constraint: {render: {visible: false}}})
}

function createAssets() {
    // let boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    // let boxB = Matter.Bodies.rectangle(300, 200, 80, 80);
    ball = Matter.Bodies.circle(300, 600, 20);
    sling = Matter.Constraint.create({
        pointA: {x: 300, y: 600},
        bodyB: ball, stiffness: 0.05
    })
    let stack = Matter.Composites.stack(1100, 200, 4, 4, 0, 0, function (x, y) {
        return Matter.Bodies.polygon(x, y, 8, 30);
    })
    return [stack, ball, sling, ground, mouseConstraints];
}

function updateDom(){
    document.querySelector("#chances").innerText = `Chances left ${chances}`
}

function restart(){
    chances = 2;
    updateDom();
    window.location.reload();
}

function main() {
    initializeGame();
    let worldObjects = createAssets();
    /**
     * initialize world
     * */
    Matter.Events.on(mouseConstraints, 'enddrag', (e) => {
        if (e.body === ball) firing = true
    })

    Matter.Events.on(engine, 'afterUpdate', (e) => {
        if (firing && Math.abs(ball.position.x - 300) < 20 && Math.abs(ball.position.y - 600) < 20 && chances > 0) {
            // ball
            ball = Matter.Bodies.circle(300, 600, 20);
            Matter.World.add(engine.world, ball);
            sling.bodyB = ball;
            firing =false;
            chances-=1;
            updateDom();
        }
    })

    Matter.World.add(engine.world, worldObjects)
    Matter.Engine.run(engine);
    Matter.Render.run(render);
}


main();
