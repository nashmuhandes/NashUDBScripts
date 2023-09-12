`#version 5`;

`#name Place thing on each label position`;

`#description Places a thing on the label positions of each selected sector.`;

`#scriptoptions

type
{
	description = "Type of thing to be placed";
	type = 18;
}`;

let sectors = UDB.Map.getSelectedSectors();

if (sectors.length === 0) {
	UDB.die('You need to select at least one sector.');
}

let index = 0;
let x = 0;
let y = 0;
for (let sector of sectors) {
	let positions = sector.getLabelPositions();
	if(positions.length > 0){
		for(let position of positions){
			UDB.Map.createThing(positions[index], UDB.ScriptOptions.type);
			index++;
		}
		index = 0;
	}
}
