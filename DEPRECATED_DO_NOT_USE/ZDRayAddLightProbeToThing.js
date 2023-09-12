`#version 4`;

`#name ZDRay: Add light probe to thing`;

`#description Adds a light probe to the selected things. Written by Nash Muhandes`;

const TYPE_LIGHT_PROBE = 9875;

let selectedThings = UDB.Map.getSelectedThings();

if (selectedThings.length == 0)
{
	UDB.die("You must select some things!");
}
else
{
	let count = 0;
	selectedThings.forEach(t =>
	{
		let probe = UDB.Map.createThing(t.position, TYPE_LIGHT_PROBE);
		count++;
	});

	if (count > 0)
	{
		UDB.showMessage("Added " + count + " light probes");
	}
}
