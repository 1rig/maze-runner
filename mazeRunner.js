const SPEED = 45;
let heading = 0;
let distance_travelled = 0;
let old_location = 0;
let blocked = false;
const SPEED_THRESHOLD = 5;
const DISTANCE_THRESHOLD = 15;
let old_velocity = 0;
let velocity_zero_count = 0;
let old_x_pos = 0;
let old_y_pos = 0;

async function startProgram() {
	// Write code here

	setMainLed({
		r: 0,
		g: 255,
		b: 0
	});

	await roll(heading, SPEED);
	await delay(0.2);

	while (true) {
		let current_velocity = getEffectiveMetric(getVelocity);
		let accl = getEffectiveMetric(getAcceleration);

		await delay(0.2);

		// Detect the start of the maze - Maze solved
		if (blocked && getLocation().x < 10 && getLocation().y < 10) {
			await celebrate();
			//			break;
			exitProgram();
		}

		// collision
		//await speak(Math.ceil(current_velocity) + "", true);
		if (current_velocity < SPEED_THRESHOLD) {
			//			if ((current_velocity - old_velocity) < 0) {
			velocity_zero_count++;
			if (velocity_zero_count == 2) {
				velocity_zero_count = 0;

				await handleCollision();
			}

		}
		/*
					else {
						//continue
						await roll(heading, SPEED, 2);
					}
		*/
	}
}

async function handleCollision() {
	//await speak("handle collision", true);

	//stopRoll();

	setMainLed({
		r: 255,
		g: 0,
		b: 0
	});

	blocked = true;

	await roll(heading, -20, 0.5);

	let current_location = Math.sqrt(getLocation().x ** 2 + getLocation().y ** 2);

	let new_x_pos = getLocation().x;
	let new_y_pos = getLocation().y;
	await speak(old_x_pos + "and " + new_x_pos);

	// what is the distance travelled based on x axis travel or y axis travel
	//distance_travelled = Math.abs(current_location - old_location);
	distance_travelled = getDistanceTravelled(old_x_pos, old_y_pos, new_x_pos, new_y_pos, getHeading());

	//old_location = current_location;
	old_x_pos = new_x_pos;
	old_y_pos = new_y_pos;

	//await speak("" + getHeading(), true);
	await speak(Math.ceil(distance_travelled) + "", true);
	if (distance_travelled < DISTANCE_THRESHOLD) {
		// turn right
		turnHeadingRight();
	} else {
		// turn left
		turnHeadingLeft();
	}
	setMainLed({
		r: 0,
		g: 255,
		b: 0
	});

	await roll(heading, SPEED);
	await delay(1);


}

function getDistanceTravelled(old_x_pos, old_y_pos, new_x_pos, new_y_pos, heading) {
	if (heading > 340 || heading < 20 || (heading > 160 && heading < 200)) {

		return Math.abs(new_y_pos - old_y_pos);
	} else {

		return Math.abs(new_x_pos - old_x_pos);
	}
}

function turnHeadingRight() {
	//		await speak("Turn right", true);
	heading = getHeading() + 180;
}

function turnHeadingLeft() {
	//		await speak("turn left", true);
	heading = getHeading() - 90;
}

function getEffectiveMetric(metric) {
	return Math.sqrt(metric().x ** 2 + metric().y ** 2);
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