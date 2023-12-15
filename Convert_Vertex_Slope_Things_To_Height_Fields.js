`#version 4`;
`#name Convert vertex slope things`;
`#description Convert vertex slope things to vertex height data for UDMF.`;
`#scriptoptions
DeleteThings
{
	description = "Delete things";
	default = false;
	type = 3;

}
`;
const sectors = UDB.Map.getSectors();
const lines = UDB.Map.getLinedefs();
const verts = UDB.Map.getVertices();
const things = UDB.Map.getThings();

const vertFloorThings = [];
const vertCeilingThings = [];

things.forEach(t => {
	if(t.type == 1504) { vertFloorThings.push(t); }
	if(t.type == 1505) { vertCeilingThings.push(t); }
});

verts.forEach(v => {
	vertFloorThings.forEach(vt => {
		if(v.position.x == vt.position.x && v.position.y == vt.position.y)
		{
			v.floorZ = vt.position.z;
		}
	});
	vertCeilingThings.forEach(vt => {
		if(v.position.x == vt.position.x && v.position.y == vt.position.y)
		{
			v.ceilingZ = vt.position.z;
		}
	});
});

if(UDB.ScriptOptions.DeleteThings == true)
{
	vertFloorThings.forEach(vt => vt.delete());
	vertCeilingThings.forEach(vt => vt.delete());
}