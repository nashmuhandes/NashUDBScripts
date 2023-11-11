`#version 4`;
`#name Sector text comment generator`;
`#description Draw text-like sectors.  Default scale is 16mu width, 24wu high`;
`#scriptoptions
Text
{
	description = "Text";
	default = "The quick brown fox jumps over the lazy dog";
	type = 2;
}
TextScale
{
	description = "Scale";
	default = 1.0;
	type = 1;
}
Texture
{
	description = "Texture for floors";
	default = "COMPBLUE";
	type = 6;
}

`;

//////////////////////////////////////////////////////////////////////////////////
// INIT

const alphaVec = [
 [ [ [0, 0], [4, 0], [5, 8], [10.4, 8], [12, 0], [16, 0], [10, 24], [5, 24], [0, 0] ],	[ [5.6, 12], [10, 12], [7.6, 20], [5.6, 12] ] ],
 [ [ [0,0], [12,0], [15, 3], [15, 9], [12,12], [15,15], [15,21], [12, 24], [0, 24], [0, 0]],  [ [3, 21], [10, 21], [12, 19], [12, 17], [10, 15], [3, 15], [3, 21]], [ [3, 9], [10, 9], [12,7], [12,5], [10, 3], [3, 3], [3, 9]] ],
 [ [ [4,24], [16,24], [16,20], [8,20], [4,16], [4,8], [8,4], [16,4],[16,0], [4,0], [0,4], [0,20], [4,24] ] ],
 [ [ [0, 0], [0, 24], [12, 24], [16, 20], [16, 4], [12, 0], [0, 0] ], [ [4, 4], [9, 4], [12, 7], [12, 17], [9, 20], [4, 20], [4, 4] ] ],
 [ [ [0,0], [0,24],[16,24], [16,20], [4,20], [4,14], [12,14], [12,10], [4,10], [4,4], [16,4], [16,0], [0,0]] ],
 [ [ [0,0], [0,24],[16,24], [16,20], [4,20], [4,14], [12,14], [12,10], [4,10], [4,0], [0,0]], ],
 [ [ [4,0], [12, 0], [16, 4], [16, 14], [8, 14], [8, 10], [12, 10], [12, 4], [4, 4], [4, 20], [12, 20], [12, 18], [16, 18], [16, 20], [12, 24], [4, 24], [0, 20], [0, 4], [4, 0]] ],
 [ [ [0,0], [0,24], [4,24], [4,14], [12,14], [12,24], [16,24], [16,0], [12,0], [12,10], [4,10], [4,0], [0,0]], ],
 [ [ [16,0], [0,0], [0,4], [6,4], [6,20], [0,20], [0,24], [16,24], [16,20], [10,20], [10,4], [16,4], [16,0]] ],
 [ [ [0,0], [0,10], [4,10], [4,4], [8,4], [12,8], [12,20], [0,20], [0,24], [16,24], [16,4], [12,0], [0,0]] ],
 [ [ [0,0], [0,24], [4,24], [4,16], [12,24], [16,24], [6,14], [16,0], [12,0], [4,12], [4,0], [0,0]] ],
 [ [ [0,0], [0,24], [4,24], [4,4], [16,4], [16,0], [0,0]] ],
 [ [ [0,0], [0,24], [4,24], [8,16], [12,24], [16,24], [16,0], [12,0], [12,18], [8, 10], [4, 18], [4, 0], [0, 0] ] ],
 [ [ [0,0], [0,24], [4,24], [12,8], [12,24], [16,24], [16,0], [12,0], [4,16], [4,0], [0,0]] ],
 [ [ [4,0], [0,4], [0,20], [4,24], [12,24], [16,20],  [16,4], [12,0], [4,0] ], [ [12,8], [12,16],[8,20], [4,16], [4,8], [8,4], [12,8] ] ],
 [ [ [0,0], [0,24], [12,24], [16,20],[16,12], [12,8], [4,8], [4,0], [0,0] ], [ [4,12], [4,20], [9,20], [12,17], [12,15], [9,12], [4,12] ] ],
 [ [ [0,4], [0,20], [4,24], [12,24], [16,20], [16,4], [12, 0], [16,-4], [12,-4], [8,0], [4,0], [0,4] ], [ [12,8], [12,16],[8,20], [4,16], [4,8], [8,4], [12,8] ] ],
 [ [ [0,0], [0,24], [12,24], [16,20], [16,16], [12,12], [16,0], [12,0], [8, 12], [4,12], [4,0], [0,0] ], [ [4,16], [11,16], [12,17], [12,19], [11,20], [4,20], [4,16] ] ],
 [ [ [0,0], [0,4], [12,4], [12,8], [4,8], [0,12], [0,20], [4,24], [12,24], [16,20], [16,16], [12,16], [12,20], [6,20], [4,18], [4,12], [12,12], [16,8], [16,4], [12,0], [0,0] ] ],
 [ [ [0,20], [0,24], [16,24], [16,24], [16,20], [10,20], [10,0], [6, 0], [6,20], [0,20]] ],
 [ [ [0,4], [0,24],  [4,24], [4,8], [8,4], [12,8], [12,24], [16,24], [16,4], [12,0], [4,0], [0,4] ] ],
 [ [ [4,0], [0,24],  [4,24], [8,4], [12,24], [16,24], [12,0], [4,0]] ],
 [ [ [0,0], [0,24], [4,24], [4,6], [8,14], [12,6], [12,24], [16,24], [16,0], [12,0], [8,8], [4,0], [0,0] ] ],
 [ [ [0,0], [6,12], [0,24], [4,24], [8,16], [12,24], [16,24], [10,12], [16,0], [12,0], [8,8], [4,0], [0,0]] ],
 [ [ [0,24], [4,24], [4,16], [8,12], [12,12], [12,24], [16,24], [16,4], [12,0], [0,0], [0,4], [8,4], [12,8], [4,8], [0,12], [0,24]] ],
 [ [ [0,0], [0,4], [12,20], [0,20], [0,24], [16,24], [16,20], [4,4], [16,4], [16,0], [0,0]] ] ];

let checkSize = 128;
let sizeFree = false;

let baseOffset = [ 0, 0 ]
let cursorPos =  [0, 0];
const charLen = 20;
const charHeight = 28;

let textObj = JSON.stringify(UDB.ScriptOptions.Text).replace('"', '').replace('"', '').toUpperCase().replace("\\R","").replace("\\T","");
let textLines = textObj.split('\\N');
let heightOffset = textLines.length*charHeight;

UDB.Log(textObj);

const verts = UDB.Map.getVertices();
const sects = UDB.Map.getSectors();

while(sizeFree == false)
{
	let intersecting = false;
	for(let i = 0; i < verts.length; i++)
	{
		if(verts[i].position.x < baseOffset[0]+checkSize && verts[i].position.x >= baseOffset[0]) { intersecting = true; break; }
		if(verts[i].position.y < baseOffset[1]+checkSize-heightOffset && verts[i].position.y >= baseOffset[1]-heightOffset) { intersecting = true; break; }
	}
	for(let p = 0; p < sects.length; p++)
	{
		if(sects[p].intersect([baseOffset[0], baseOffset[1]]) == true) { intersecting = true; break; }
	}
	if(intersecting == false) { sizeFree = true; }
	else { baseOffset[0] += checkSize; baseOffset[1] += checkSize;  }
}

const newSectors = [];
let depth = 0;


let progCount = 0;

textLines.forEach(tl => {
	tl = tl.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace("\\R","");
	for (let i = 0; i < tl.length; i++) {
	   let charCode = tl.charCodeAt(i);
	   let cc = charCode-65;
	   if(cc < 26 && cc >= 0)
	   {
		   depth = 0;
		   let charOff = alphaVec[cc];
		   charOff.forEach(shape => { 
			newShape = [];
			depth += 1;
			shape.forEach(co => { 
				UDB.Map.clearAllMarks();
				let vx = baseOffset[0]+((co[0]+cursorPos[0]));
				let vy = baseOffset[1]+((co[1]+cursorPos[1]));
				vx *= UDB.ScriptOptions.TextScale;
				vy *= UDB.ScriptOptions.TextScale;
				newShape.push([vx, vy]); });
				UDB.Map.DrawLines(newShape);
				if(depth == 1)
				{
					progCount++;
					markedSectors = UDB.Map.getMarkedSectors();
					UDB.setProgress((progCount/textObj.length)*100)
					markedSectors.forEach(ms => { newSectors.push(ms) });
				}
			});
	   }
	   
	   cursorPos[0] = cursorPos[0] + charLen;
	}
	
	cursorPos[1] -= charHeight;
	cursorPos[0] = 0;
});
UDB.Log(newSectors.length);
newSectors.forEach(ns => { ns.floorTexture = UDB.ScriptOptions.Texture; ns.selected = true; });
UDB.Map.joinSectors(newSectors);


