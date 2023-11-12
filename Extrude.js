
`#version 4`;

`#name Extrude Linedefs`;

`#description Extrudes the selected linedefs by the distance between the last selected linedef and the mouse cursor. Always extrudes to the front.`;

`#scriptoptions

length
{
    description = "Length of Extrude";
    default = -1;
    type = 0;
}
toMouse
{
    description = "Extrude To Mouse";
    default = false;
    type=3;
}
filled
{
    description = "Extrude Filled";
    default = true;
    type=3;
}
`;

let lines = UDB.Map.getSelectedOrHighlightedLinedefs();

if(lines.length == 0)
{
    UDB.die("Need at least 1 linedef selected");
    return;
}

let length;

if(!UDB.ScriptOptions.toMouse)
{
    length = UDB.ScriptOptions.length;
}
else
{ // broken
    let cursorpos = UDB.Map.snappedToGrid(UDB.Map.mousePosition);
    length = lines[lines.length-1].distanceTo(cursorpos, false);
}

lines.forEach(ld => {
    let vector = UDB.Vector2D.fromAngle(UDB.Angle2D.doomToReal(ld.angle)) * length;
    let v1 = ld.start.position - vector;
    let v2 = ld.end.position - vector;
    if(UDB.ScriptOptions.filled)
    {
        UDB.Map.drawLines([
            ld.start.position,
            v1,
            v2,
            ld.end.position,
        ]);
    }
    else
    {
        ld.split(v2);
        ld.split(v1);
    }
});