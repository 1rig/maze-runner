const SPEED = 45;
let heading = 0;
let distance_travelled = 0;
let old_location = 0;
let blocked = false;
const SPEED_THRESHOLD = 10;
const DISTANCE_THRESHOLD = 10;

async function startProgram() {
	// Write code here

	setMainLed({
		r: 0,
		g: 255,
		b: 0
	});

	await roll(heading, SPEED, 2);

	while (true) {
		let velocity = Math.sqrt(getVelocity().x ** 2 + getVelocity().y ** 2);

		await delay(0.2);

		// Detect the start of the maze - Maze solved
		if (blocked && getLocation().x < 10 && getLocation().y < 10) {
			await celebrate();
			//			break;
			exitProgram();
		}

		// collision
		if (velocity < SPEED_THRESHOLD) {
			await handleCollision();
		} else {
			//continue
			await roll(heading, SPEED, 2);
		}
	}
}

async function handleCollision() {
//		await speak("handle collision", true);
	setMainLed({
		r: 255,
		g: 0,
		b: 0
	});

	blocked = true;

	await roll(heading, -10, 1);

	let current_location = Math.sqrt(getLocation().x ** 2 + getLocation().y ** 2);

	// what is the distance travelled
	distance_travelled = Math.abs(current_location - old_location);

	old_location = current_location;

//		await speak(Math.ceil(distance_travelled) + "", true);
	if (distance_travelled < DISTANCE_THRESHOLD) {
		// turn right
		await turnHeadingRight();
	} else {
		// turn left
		await turnHeadingLeft();
	}

	setMainLed({
		r: 0,
		g: 255,
		b: 0
	});

	await roll(heading, SPEED, 2);
}

async function turnHeadingRight() {
//		await speak("Turn right", true);
	heading = getHeading() + 180;
}

async function turnHeadingLeft() {
//		await speak("turn left", true);
	heading = getHeading() - 90;
}

async function celebrate() {
	await Sound.Personality.Celebrate.play(false);
	await strobe({
		r: 37,
		g: 255,
		b: 100
	}, 0.05, 10);

	await spin(180, 0.2);
	await spin(-180, 0.2);
	await spin(180, 0.2);
	await spin(-180, 0.2);
}