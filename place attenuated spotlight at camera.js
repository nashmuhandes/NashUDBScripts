`#name Place Attenuated Spotight At Camera`;

`#description places an attenuated spotlight at the camera position and applies the camera's yaw and pitch. I.e. the newly placed light will "look" at where the camera is looking at.`;

`#scriptoptions

color
{
	description = "Color";
	type = 10; // Color
	default = "FFFFFF";
}

innerangle
{
	description = "Inner angle";
	type = 0; // Integer
	default = 8;
}

outerangle
{
	description = "Outer angle";
	type = 0; // Integer
	default = 32;
}

intensity
{
	description = "Intensity";
	type = 0; // Integer
	default = 128;
}
`;

let thing = Map.createThing([ parseInt(Map.camera.position.x), parseInt(Map.camera.position.y), parseInt(Map.camera.position.z) ], 9870);
thing.angle = parseInt(Angle2D.radToDeg(Map.camera.angleXY + Math.PI/2));
thing.pitch = parseInt(Angle2D.radToDeg(Map.camera.angleZ + Math.PI));
thing.args[0] = ScriptOptions.color;
thing.args[1] = ScriptOptions.innerangle;
thing.args[2] = ScriptOptions.outerangle;
thing.args[3] = ScriptOptions.intensity;
