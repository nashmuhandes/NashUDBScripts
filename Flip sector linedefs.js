`#version 4`;
`#name Flip sector linedefs`;
`#description Flips all linedefs of selected sectors so that their front sidedefs are either the selected sectors or not. One-sided linedefs are skipped. Shared lines between selected sectors are skipped. Linededefs where both sidedefs belong to a selected sector are skipped.`;
`#scriptoptions
direction
{
	description = "Direction to flip the linedefs to";
	default = 0;
	type = 11;
	enumvalues {
		0 = "Inside";
		1 = "Outside";
}
}
`;

const sectors = UDB.Map.getSelectedSectors();

if(sectors.length == 0)
	UDB.die('You need to select at least one sector');

sectors.forEach(s => s.getSidedefs().filter(sd => sd.other != null && !sectors.includes(sd.other.sector)).forEach(sd => {
	if((UDB.ScriptOptions.direction == 0 && s != sd.line.front.sector) || (UDB.ScriptOptions.direction == 1 && s != sd.line.back.sector))
	sd.line.flip();
}));
