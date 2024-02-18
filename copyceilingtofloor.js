/// <reference path="../../udbscript.d.ts" />

`#version 4`;

`#name Copy Ceiling to Floor`;

`#description Copies selected sector(s) ceiling textures, offsets, scales and rotations to their floor(s).`

let sectors = UDB.Map.getSelectedSectors();

if(sectors.length == 0)
UDB.die('You need to select at least one sector.');

sectors.forEach(s => {
	s.floorTexture = s.ceilingTexture;
	s.fields.xpanningfloor = s.fields.xpanningceiling;
	s.fields.ypanningfloor = s.fields.ypanningceiling;
	s.fields.xscalefloor = s.fields.xscaleceiling;
	s.fields.yscalefloor = s.fields.yscaleceiling;
	s.fields.rotationfloor = s.fields.rotationceiling;
});

UDB.showMessage('Sector ceiling stuff copied to floor.');