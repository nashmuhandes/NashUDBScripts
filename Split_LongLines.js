`#version 4`;
`#author TheMisterCat`;
`#name Long line splitter`;
`#description Splits lines longer than a specific amount
Splits selection or all.`;
`#scriptoptions
LowestCheckSize
{
	description = "Shortest Size";
	default = 256;
	type = 0;
}
`;

let splitList = [];

let lines = UDB.Map.getSelectedLinedefs(true);
if(lines.length == 0) { lines = UDB.Map.getLinedefs(); }
splitList = lines.filter((l) => l.length > UDB.ScriptOptions.LowestCheckSize);

while(splitList.length > 0)
{
	let curLine = splitList.shift();
	let newLine = curLine.split(curLine.getCenterPoint());
	if(newLine.length > UDB.ScriptOptions.LowestCheckSize) { splitList.push(newLine); }
	if(curLine.length > UDB.ScriptOptions.LowestCheckSize) { splitList.push(curLine); }
}
