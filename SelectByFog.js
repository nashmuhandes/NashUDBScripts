/// <reference path="../udbscript.d.ts" />
`#version 5`;
`#author TheMisterCat`;
`#name Select sectors by fog value`;
`#description `;
`#scriptoptions
FadeColor
{
	description = "Fog value";
	default = "000000";
	type = 10;
}
`;

const sectors = UDB.Map.getSectors();
sectors.forEach(s => {
	if(s.fields['fadecolor'] == UDB.ScriptOptions.FadeColor)
	{
		s.selected = true;
	}
});

UDB.Map.markSelectedSectors();