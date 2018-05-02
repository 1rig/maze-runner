async function startProgram() {
	// Write code here

	//	setSpeed(100);
	let myspeed = 45;
	await roll(0, myspeed, 2);
	let distance_travelled = 0;
	let old_location = 0;
	setMainLed({
		r: 0,
		g: 255,
		b: 0
	});

	while (true) {
		setMainLed({
			r: 0,
			g: 255,
			b: 0
		});
		let velocity = getVelocity().y;

		//await speak ('velocity is ' + Math.ceil(velocity));
		await delay(0.2);

		if (velocity < 10) {
			setMainLed({
				r: 255,
				g: 0,
				b: 0
			});
			//setSpeed(-10);
			//await delay(1);
			//setSpeed(0);
			await roll(0, -10, 1);

			let current_location = getLocation().y;

			//await speak ('location is' + getLocation().y, true);
			// what is the distance travelled
			distance_travelled = current_location - old_location;
			//			await speak('blocked with ' + distance_travelled, true);

			old_location = current_location;
			if (distance_travelled < 10) {
				// turn right
				await speak('no travel', true);
				//setHeading(getHeading() + 180);
				await spin(getHeading() + 180, 0.5);
			} else {
				// turn left
				//setHeading(getHeading() + 270);
				await spin(getHeading() + 270, 0.5);
			}

			await delay(.2);
			resetAim();
			await roll(0, myspeed, 2);
		}
	}
}