`#version 4`;

`#name ZDRay: Convert lights`;

`#description Converts lights between dynamic and static, for ZDRay. Written by Nash Muhandes. Special thanks to boris for scripting help.`;

`#scriptoptions
conversiondirection
{
	description = "Conversion direction";
	default = 0;
	type = 11;
	enumvalues
	{
		0 = "Dynamic -> Static";
		1 = "Static -> Dynamic";
	}
}
`;

const TYPE_POINTLIGHT_ATTENUATED = 9830;
const TYPE_SPOTLIGHT_ATTENUATED = 9870;
const TYPE_POINTLIGHT_STATIC = 9876;
const TYPE_SPOTLIGHT_STATIC = 9881;

let selectedThings = (UDB.ScriptOptions.conversiondirection == 0) ?
	UDB.Map.getSelectedThings().filter(t => t.type == TYPE_POINTLIGHT_ATTENUATED || t.type == TYPE_SPOTLIGHT_ATTENUATED) :
	UDB.Map.getSelectedThings().filter(t => t.type == TYPE_POINTLIGHT_STATIC || t.type == TYPE_SPOTLIGHT_STATIC);

if (selectedThings.length == 0)
{
	let errorStr = "";

	if (UDB.ScriptOptions.conversiondirection == 0)
	{
		errorStr = 'You must select at least one attenuated point light (type ' + TYPE_POINTLIGHT_ATTENUATED + ') or attenuated spotlight (type ' + TYPE_SPOTLIGHT_ATTENUATED + ')!';
	}
	else
	{
		errorStr = 'You must select at least one static point light (type ' + TYPE_POINTLIGHT_STATIC + ') or static spotlight (type ' + TYPE_SPOTLIGHT_STATIC + ')!';
	}

	UDB.die(errorStr);
}

let convertedLightCount = 0;

if (UDB.ScriptOptions.conversiondirection == 0)
{
	// convert dynamic lights to static lights
	selectedThings.filter(t => t.type == TYPE_POINTLIGHT_ATTENUATED || t.type == TYPE_SPOTLIGHT_ATTENUATED).forEach(t =>
	{
		// write point light
		if (t.type == TYPE_POINTLIGHT_ATTENUATED)
		{
			// change type to PointLightStatic
			t.type = TYPE_POINTLIGHT_STATIC;
		}

		// write spotlight
		else if (t.type == TYPE_SPOTLIGHT_ATTENUATED)
		{
			// change type to SpotLightStatic
			t.type = TYPE_SPOTLIGHT_STATIC;

			// if the color was defined as a string, convert it to an int so ZDRay can read it
			if (t.fields.arg0str != null)
			{
				let hexString = t.fields.arg0str;
				let rgb = parseInt('0x' + hexString);
				t.args[0] = rgb;
			}
		}

		// write light intensity
		// this doesn't exist on dynamic lights so just hardcode it to 1.0
		t.fields.lightintensity = 1.0;

		convertedLightCount++;
	});

	UDB.showMessage("Converted " + convertedLightCount + " dynamic lights into static lights");
}
else
{
	// convert static lights to dynamic lights
	selectedThings.filter(t => t.type == TYPE_POINTLIGHT_STATIC || t.type == TYPE_SPOTLIGHT_STATIC).forEach(t =>
	{
		// write point light
		if (t.type == TYPE_POINTLIGHT_STATIC)
		{
			// change type to PointLightAttenuated
			t.type = TYPE_POINTLIGHT_ATTENUATED;
		}

		// write spotlight
		else if (t.type == TYPE_SPOTLIGHT_STATIC)
		{
			// change type to SpotLightAttenuated
			t.type = TYPE_SPOTLIGHT_ATTENUATED;

			// convert the int color to a hex string because UDB's color picker expects it
			if (t.fields.arg0str == null)
			{
				let hexString = t.args[0].toString(16).toUpperCase();
				t.fields.arg0str = hexString;
			}
		}

		convertedLightCount++;
	});

	UDB.showMessage("Converted " + convertedLightCount + " static lights into dynamic lights");
}
