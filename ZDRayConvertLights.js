`#version 4`;

`#name ZDRay: Convert lights`;

`#description Converts lights between dynamic and lightmap, for ZDRay. Written by Nash Muhandes. Special thanks to boris for scripting help.`;

`#scriptoptions
conversiondirection
{
	description = "Conversion direction";
	default = 0;
	type = 11;
	enumvalues
	{
		0 = "Dynamic -> Lightmap";
		1 = "Lightmap -> Dynamic";
	}
}
`;

const TO_LIGHTMAP = 0;
const TO_DYNLIGHT = 1;

const TYPE_POINTLIGHT_ATTEN				= 9830;
const TYPE_POINTLIGHT_PULSE_ATTEN		= 9831;
const TYPE_POINTLIGHT_FLICKER_ATTEN		= 9832;
const TYPE_POINTLIGHT_RANDOM_ATTEN		= 9834;
const TYPE_SPOTLIGHT_ATTEN				= 9870;
const TYPE_SPOTLIGHT_PULSE_ATTEN		= 9871;
const TYPE_SPOTLIGHT_FLICKER_ATTEN		= 9872;
const TYPE_SPOTLIGHT_RANDOM_ATTEN		= 9874;

const TYPE_POINTLIGHT_LM				= 9876;
const TYPE_POINTLIGHT_PULSE_LM			= 9877;
const TYPE_POINTLIGHT_FLICKER_LM		= 9878;
const TYPE_POINTLIGHT_RANDOM_LM			= 9879;
const TYPE_SPOTLIGHT_LM					= 9881;
const TYPE_SPOTLIGHT_PULSE_LM			= 9882;
const TYPE_SPOTLIGHT_FLICKER_LM			= 9883;
const TYPE_SPOTLIGHT_RANDOM_LM			= 9884;

let selectedThings = (UDB.ScriptOptions.conversiondirection == TO_LIGHTMAP) ?
	UDB.Map.getSelectedThings().filter
	(
		t =>
		t.type == TYPE_POINTLIGHT_ATTEN ||
		t.type == TYPE_POINTLIGHT_PULSE_ATTEN ||
		t.type == TYPE_POINTLIGHT_FLICKER_ATTEN ||
		t.type == TYPE_POINTLIGHT_RANDOM_ATTEN ||
		t.type == TYPE_SPOTLIGHT_ATTEN ||
		t.type == TYPE_SPOTLIGHT_PULSE_ATTEN ||
		t.type == TYPE_SPOTLIGHT_FLICKER_ATTEN ||
		t.type == TYPE_SPOTLIGHT_RANDOM_ATTEN
	)
	:
	UDB.Map.getSelectedThings().filter
	(
		t =>
		t.type == TYPE_POINTLIGHT_LM ||
		t.type == TYPE_POINTLIGHT_PULSE_LM ||
		t.type == TYPE_POINTLIGHT_FLICKER_LM ||
		t.type == TYPE_POINTLIGHT_RANDOM_LM ||
		t.type == TYPE_SPOTLIGHT_LM ||
		t.type == TYPE_SPOTLIGHT_PULSE_LM ||
		t.type == TYPE_SPOTLIGHT_FLICKER_LM ||
		t.type == TYPE_SPOTLIGHT_RANDOM_LM
	);

if (selectedThings.length == 0)
{
	let errorStr = "";

	if (UDB.ScriptOptions.conversiondirection == TO_LIGHTMAP)
	{
		errorStr = "You must select at least one attenuated light!";
	}
	else if (UDB.ScriptOptions.conversiondirection == TO_DYNLIGHT)
	{
		errorStr = "You must select at least one lightmap light!";
	}
	else
	{
		UDB.die("Invalid conversion direction (shouldn't happen)");
	}

	UDB.die(errorStr);
}

let convertedLights = 0;

// convert dynamic lights to lightmap lights
if (UDB.ScriptOptions.conversiondirection == TO_LIGHTMAP)
{
	selectedThings.filter
	(
		t =>
		t.type == TYPE_POINTLIGHT_ATTEN ||
		t.type == TYPE_POINTLIGHT_PULSE_ATTEN ||
		t.type == TYPE_POINTLIGHT_FLICKER_ATTEN ||
		t.type == TYPE_POINTLIGHT_RANDOM_ATTEN ||
		t.type == TYPE_SPOTLIGHT_ATTEN ||
		t.type == TYPE_SPOTLIGHT_PULSE_ATTEN ||
		t.type == TYPE_SPOTLIGHT_FLICKER_ATTEN ||
		t.type == TYPE_SPOTLIGHT_RANDOM_ATTEN
	)
	.forEach
	(
		t =>
		{
			let isSpotlight = false;

			switch (t.type)
			{
			case TYPE_POINTLIGHT_ATTEN:
				t.type = TYPE_POINTLIGHT_LM;
				break;
			case TYPE_POINTLIGHT_PULSE_ATTEN:
				t.type = TYPE_POINTLIGHT_PULSE_LM;
				break;
			case TYPE_POINTLIGHT_FLICKER_ATTEN:
				t.type = TYPE_POINTLIGHT_FLICKER_LM;
				break;
			case TYPE_POINTLIGHT_RANDOM_ATTEN:
				t.type = TYPE_POINTLIGHT_RANDOM_LM;
				break;
			case TYPE_SPOTLIGHT_ATTEN:
				t.type = TYPE_SPOTLIGHT_LM;
				isSpotlight = true;
				break;
			case TYPE_SPOTLIGHT_PULSE_ATTEN:
				t.type = TYPE_SPOTLIGHT_PULSE_LM;
				isSpotlight = true;
				break;
			case TYPE_SPOTLIGHT_FLICKER_ATTEN:
				t.type = TYPE_SPOTLIGHT_FLICKER_LM;
				isSpotlight = true;
				break;
			case TYPE_SPOTLIGHT_RANDOM_ATTEN:
				t.type = TYPE_SPOTLIGHT_RANDOM_LM;
				isSpotlight = true;
				break;
			default:
				break;
			}

			if (isSpotlight)
			{
				// if the color was defined as a string, convert it to an int so ZDRay can read it
				if (t.fields.arg0str != null)
				{
					let hexString = t.fields.arg0str;
					let rgb = parseInt('0x' + hexString);
					t.args[0] = rgb;
				}
			}

			convertedLights++;
		}
	);

	UDB.showMessage("Converted " + convertedLights + " dynamic lights into lightmap lights");
}
// convert lightmap lights to dynamic lights
else if (UDB.ScriptOptions.conversiondirection == TO_DYNLIGHT)
{
	selectedThings.filter
	(
		t =>
		t.type == TYPE_POINTLIGHT_LM ||
		t.type == TYPE_POINTLIGHT_PULSE_LM ||
		t.type == TYPE_POINTLIGHT_FLICKER_LM ||
		t.type == TYPE_POINTLIGHT_RANDOM_LM ||
		t.type == TYPE_SPOTLIGHT_LM ||
		t.type == TYPE_SPOTLIGHT_PULSE_LM ||
		t.type == TYPE_SPOTLIGHT_FLICKER_LM ||
		t.type == TYPE_SPOTLIGHT_RANDOM_LM
	)
	.forEach
	(
		t =>
		{
			let isSpotlight = false;

			switch (t.type)
			{
			case TYPE_POINTLIGHT_LM:
				t.type = TYPE_POINTLIGHT_ATTEN;
				break;
			case TYPE_POINTLIGHT_PULSE_LM:
				t.type = TYPE_POINTLIGHT_PULSE_ATTEN;
				break;
			case TYPE_POINTLIGHT_FLICKER_LM:
				t.type = TYPE_POINTLIGHT_FLICKER_ATTEN;
				break;
			case TYPE_POINTLIGHT_RANDOM_LM:
				t.type = TYPE_POINTLIGHT_RANDOM_ATTEN;
				break;
			case TYPE_SPOTLIGHT_LM:
				t.type = TYPE_SPOTLIGHT_ATTEN;
				isSpotlight = true;
				break;
			case TYPE_SPOTLIGHT_PULSE_LM:
				t.type = TYPE_SPOTLIGHT_PULSE_ATTEN;
				isSpotlight = true;
				break;
			case TYPE_SPOTLIGHT_FLICKER_LM:
				t.type = TYPE_SPOTLIGHT_FLICKER_ATTEN;
				isSpotlight = true;
				break;
			case TYPE_SPOTLIGHT_RANDOM_LM:
				t.type = TYPE_SPOTLIGHT_RANDOM_ATTEN;
				isSpotlight = true;
				break;
			default:
				break;
			}

			if (isSpotlight)
			{
				// convert the int color to a hex string because UDB's color picker expects it
				if (t.fields.arg0str == null)
				{
					let hexString = t.args[0].toString(16).toUpperCase();
					t.fields.arg0str = hexString;
				}
			}

			convertedLights++;
		}
	);

	UDB.showMessage("Converted " + convertedLights + " lightmap lights into dynamic lights");
}
else
{
	UDB.die("Invalid conversion direction (shouldn't happen)");
}
