/// <reference path="../../udbscript.d.ts" />

`#version 4`;

`#name Copy Floor to Ceiling`;

`#description Copies selected sector(s) floor textures, offsets, scales and rotations to their ceiling(s).`

let sectors = UDB.Map.getSelectedSectors();

if(sectors.length == 0)
UDB.die('You need to select at least one sector.');

sectors.forEach(s => {
	s.ceilingTexture = s.floorTexture;
	s.fields.xpanningceiling = s.fields.xpanningfloor;
	s.fields.ypanningceiling = s.fields.ypanningfloor;
	s.fields.xscaleceiling = s.fields.xscalefloor;
	s.fields.yscaleceiling = s.fields.yscalefloor;
	s.fields.rotationceiling = s.fields.rotationfloor;
});

UDB.showMessage('Sector floor stuff copied to ceiling.');