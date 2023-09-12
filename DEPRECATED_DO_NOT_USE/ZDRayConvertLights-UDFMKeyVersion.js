`#version 4`;

`#name ZDRay: Convert lights (UDMF Key version - OBSOLETE!)`;

`#description Converts lights between dynamic and static, for ZDRay. Written by Nash Muhandes. Special thanks to boris for scripting help. WARNING: This script is obsolete and only kept for historical purposes. Do not use (it won't work with the final lightmap implementation)`;

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
	// convert dynamic lights
	selectedThings.filter(t => t.type == TYPE_POINTLIGHT_ATTENUATED || t.type == TYPE_SPOTLIGHT_ATTENUATED).forEach(t =>
	{
		// write point light
		if (t.type == TYPE_POINTLIGHT_ATTENUATED)
		{
			// change type to PointLightStatic
			t.type = TYPE_POINTLIGHT_STATIC;

			// write light color
			let r = t.args[0];
			let g = t.args[1];
			let b = t.args[2];
			let rgb = r;
			rgb = rgb << 8;
			rgb |= g;
			rgb = rgb << 8;
			rgb |= b;
			t.fields['lightcolor'] = rgb;
		}

		// write spotlight
		else if (t.type == TYPE_SPOTLIGHT_ATTENUATED)
		{
			// change type to SpotLightStatic
			t.type = TYPE_SPOTLIGHT_STATIC;

			// write light color
			let hexString = t.fields['arg0str'];
			let rgb = parseInt('0x' + hexString);
			t.fields['lightcolor'] = rgb;

			// write spotlight angles
			t.fields['lightinnerangle'] = parseFloat(t.args[1].toFixed());
			t.fields['lightouterangle'] = parseFloat(t.args[2].toFixed());
		}

		// write light distance (it's called "intensity" on dynamic lights)
		t.fields['lightdistance'] = parseFloat(t.args[3].toFixed());

		// write light intensity
		// this doesn't exist on dynamic lights so just hardcode it to 1.0
		t.fields['lightintensity'] = 1.0;

		// clear the args
		t.args[0] = 0;
		t.args[1] = 0;
		t.args[2] = 0;
		t.args[3] = 0;
		t.fields['arg0str'] = null;

		convertedLightCount++;
	});

	UDB.showMessage("Converted " + convertedLightCount + " dynamic lights into static lights");
}
else
{
	// convert static lights
	selectedThings.filter(t => t.type == TYPE_POINTLIGHT_STATIC || t.type == TYPE_SPOTLIGHT_STATIC).forEach(t =>
	{
		// write point light
		if (t.type == TYPE_POINTLIGHT_STATIC)
		{
			// change type to PointLightAttenuated
			t.type = TYPE_POINTLIGHT_ATTENUATED;

			// write RGB
			let rgb = t.fields['lightcolor'];
			let red = (rgb >> 16) & 0xFF;
			let green = (rgb >> 8) & 0xFF;
			let blue = rgb & 0xFF;
			t.args[0] = red;
			t.args[1] = green;
			t.args[2] = blue;
		}

		// write spotlight
		else if (t.type == TYPE_SPOTLIGHT_STATIC)
		{
			// change type to SpotLightAttenuated
			t.type = TYPE_SPOTLIGHT_ATTENUATED;

			// write color
			let hexString = t.fields['lightcolor'].toString(16).toUpperCase();
			t.fields['arg0str'] = hexString;

			// write spotlight angles
			t.args[1] = Math.trunc(t.fields['lightinnerangle']);
			t.args[2] = Math.trunc(t.fields['lightouterangle']);
		}

		// write intensity
		t.args[3] = Math.trunc(t.fields['lightdistance']);

		// remove ZDRay UDMF keys
		t.fields['lightcolor'] = null;
		t.fields['lightdistance'] = null;
		t.fields['lightintensity'] = null;
		t.fields['lightinnerangle'] = null;
		t.fields['lightouterangle'] = null;

		convertedLightCount++;
	});

	UDB.showMessage("Converted " + convertedLightCount + " static lights into dynamic lights");
}
