let engine;
let render;
let ground;
let mouse;
let mouseConstraints;
let ball;
let sling;
let firing = false;
let chances = 100;
let borders = [];
let score = new Set();

function initializeGame() {
    updateDom();
    engine = Matter.Engine.create();
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: document.body.clientWidth, height: 800, wireframes: false
        }
    });
    ground = Matter.Bodies.rectangle(1000, 500, 300, 20, {isStatic: true});
    //left side
    borders.push(Matter.Bodies.rectangle(0, 0, 10, document.body.clientWidth, {
        isStatic: true,
        restitution: 0.8,
        render: {fillStyle: "red"}
    }));
    //top
    borders.push(Matter.Bodies.rectangle(0, 0, document.body.clientWidth * 2, 50, {
        isStatic: true,
        restitution: 0.8,
        render: {fillStyle: "red"}
    }));
    //bottom
    borders.push(Matter.Bodies.rectangle(0, 800, document.body.clientWidth * 2, 50, {
        isStatic: true,
        restitution: 0.8,
        render: {fillStyle: "red"},
        name: "floor"
    }));
    //right
    borders.push(Matter.Bodies.rectangle(document.body.clientWidth, 0, 50, 800*2, {
        isStatic: true,
        restitution: 0.8,
        render: {fillStyle: "red"},
        name: "floor"
    }));
    mouse = Matter.Mouse.create(render.canvas);

    mouseConstraints = Matter.MouseConstraint.create(engine, {mouse, constraint: {render: {visible: false}}})
}

function createAssets() {
    // let boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    // let boxB = Matter.Bodies.rectangle(300, 200, 80, 80);
    ball = Matter.Bodies.circle(300, 600, 20, {restitution: 0.8, name: "ball"});
    sling = Matter.Constraint.create({
        pointA: {x: 300, y: 600},
        bodyB: ball, stiffness: 0.05
    })
    let stack = Matter.Composites.stack(900, 200, 4, 4, 0, 0, function (x, y) {
        return Matter.Bodies.circle(x, y, 15, {
            restitution: 0.8,
            noDrag: true,
            sleepThreshold: Infinity,
            name: "block"
        });
    })


    return [stack, ball, sling, ground, mouseConstraints, ...borders];
}

function updateDom() {
    document.querySelector("#chances").innerText = `Chances left ${chances}`
}

function restart() {
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
            ball = Matter.Bodies.circle(300, 600, 20, {restitution: 0.8});
            Matter.World.add(engine.world, ball);
            sling.bodyB = ball;
            firing = false;
            chances -= 1;
            updateDom();
        }
    })
    Matter.Events.on(engine, 'collisionStart', function (event) {

        event.pairs.forEach((el) => {
            if (el.bodyA.name && el.bodyB.name && el.bodyA.name !== el.bodyB.name)
                // console.log('**' ,el.bodyA.name , el.bodyB.name )
                if (el.bodyA.name === "floor" && el.bodyB.name === "block") {
                    score.add(el.bodyB.id)
                    // score += 1
                    console.log(score.size);
                    if(score.size === 16){
                        return alert("you won the game")
                    }
                }
            // if(el.bodyA.name)
        })
    })

    Matter.World.add(engine.world, worldObjects)
    Matter.Engine.run(engine);
    Matter.Render.run(render);
}


main();
