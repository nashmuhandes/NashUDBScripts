`#version 4`;
`#name Triangulate and slope sectors`;
`#description Triangulates sectors and sets the vertex heights of the resulting sectors so that it slopes between the sectors.`;
`#scriptoptions
whichsurface
{
	description = "Surface to slope";
	default = 0;
	type = 11;
	enumvalues {
		0 = "Floor and Ceiling";
		1 = "Floor only";
		2 = "Ceiling only";
	}
}
`;

if(UDB.Map.isDoom)
	UDB.die('Map needs to be in Hexen format or UDMF');

let sectors = UDB.Map.getSelectedSectors();

if(sectors.length == 0)
	UDB.die('You need to select sectors. Aborting');

let processedlinedefs = [];

// Set the vertex height for the selected sectors
sectors.forEach(s => {
	let sidedefs = s.getSidedefs();

	if(sidedefs.length > 4)
		UDB.die(`This only works with sectors that have 4 sides (${s} has ${sidedefs.length} sides)`);

	// Find the sidedefs that have another selected sector on their other side, and set the vertex height to the heights
	// of that other sector. It doesn't matter that the sectors are not triangulated, yet
	sidedefs.filter(sd => sd.other != null && sectors.includes(sd.sector) && sectors.includes(sd.other.sector)).forEach(sd => {
		if(processedlinedefs.includes(sd.line))
		return;

	if(UDB.ScriptOptions.whichsurface == 0 || UDB.ScriptOptions.whichsurface == 1)
	{
		if(UDB.Map.isUDMF)
		{
			sd.line.start.floorZ = sd.other.sector.floorHeight;
			sd.line.end.floorZ = sd.other.sector.floorHeight;
		}
		else
		{
			UDB.Map.createThing([ sd.line.start.position.x, sd.line.start.position.y, sd.other.sector.floorHeight ], 1504);
			UDB.Map.createThing([ sd.line.end.position.x, sd.line.end.position.y, sd.other.sector.floorHeight ], 1504);
		}
	}

	if(UDB.ScriptOptions.whichsurface == 0 || UDB.ScriptOptions.whichsurface == 2)
	{
		if(UDB.Map.isUDMF)
		{
			sd.line.start.ceilingZ = sd.other.sector.ceilingHeight;
			sd.line.end.ceilingZ = sd.other.sector.ceilingHeight;
		}
		else
		{
			UDB.Map.createThing([ sd.line.start.position.x, sd.line.start.position.y, sd.other.sector.ceilingHeight ], 1505);
			UDB.Map.createThing([ sd.line.end.position.x, sd.line.end.position.y, sd.other.sector.ceilingHeight ], 1505);
		}
	}

	processedlinedefs.push(sd.line);
	});
});

// Triangulate the sectors
sectors.forEach(s => {
	let vertices = [];

	// Add the vertices of all the sector's sidedefs to the list
	s.getSidedefs().forEach(sd => {
		if(!vertices.includes(sd.line.start)) vertices.push(sd.line.start);
		if(!vertices.includes(sd.line.end)) vertices.push(sd.line.end);
	});

	// Get the first vertex
	let v1 = vertices[0];

	// Remove all vertices from the list that belong to lines that are connected to our first vertex
	v1.getLinedefs().forEach(ld => vertices = vertices.filter(v => v != ld.start && v != ld.end));

	// There's only one vertex remaining, so take that as the second vertex
	let v2 = vertices[0];

	// Draw the lien that cuts the sector into two triangles
	UDB.Map.drawLines([ v1.position, v2.position ]);
})
