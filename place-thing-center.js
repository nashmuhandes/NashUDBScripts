`#version 4`;

`#name Place thing in the center of each sector`;

`#description Places a thing in the center of each selected sector.`;

`#scriptoptions

type
{
	description = "Type of thing to be placed";
	type = 0;
	default = 0;
}
`;

function Point(x, y) {
	this.x = x;
	this.y = y;
 }

 // Contour object
 function Contour(points) {
	this.pts = points || []; // an array of Point objects defining the contour
 }


 Contour.prototype.area = function() {
	var area = 0;
	var pts = this.pts;
	var nPts = pts.length;
	var j = nPts - 1;
	var p1; var p2;

	for (var i = 0; i < nPts; j = i++) {
		p1 = pts[i]; p2 = pts[j];
		area += p1.x * p2.y;
		area -= p1.y * p2.x;
	}
	area /= 2;

	return area;
 };

 Contour.prototype.centroid = function() {
	var pts = this. pts;
	var nPts = pts.length;
	var x = 0; var y = 0;
	var f;
	var j = nPts - 1;
	var p1; var p2;

	for (var i = 0; i < nPts; j = i++) {
		p1 = pts[i]; p2 = pts[j];
		f= p1.x * p2.y - p2.x * p1.y;
		x += (p1.x + p2.x) * f;
		y += (p1.y + p2.y) * f;
	}

	f = this.area() * 6;
	return new Point(x / f, y / f);
 };

let sectors = UDB.Map.getSelectedSectors();

if(sectors.length == 0)
UDB.die('You need to select at least one sector.');

let index = 0;
let x = 0;
let y = 0;
sectors.forEach(s => {s.getTriangles().forEach(t => {
	var con = new Contour(t);
	center = con.centroid();
	x += center.x;
	y += center.y;
	index++;
})
	UDB.Map.createThing([x / index, y / index], UDB.ScriptOptions.type);
	index = 0;
	x = 0;
	y = 0;
});
