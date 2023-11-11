/// <reference path="../udbscript.d.ts" />

`#version 5`;

`#name Apply sidedef skewing`;

`#description Applies sidedef skewing to the selected sidedefs, based on the selected sector surfaces. Only one surface per sector may be selected. Only one sector on a linedef's side may be selected. GZDoom and Eternity Engine only. USE FROM VISUAL MODE ONLY!`;

`#scriptoptions
style
{
    description = "Skew style";
    default = 0;
    type = 11;
    enumvalues {
        0 = "Auto-detect";
        1 = "Both";
        2 = "GZDoom";
        3 = "Eternity Engine";
    }
}
`

/**
 * Applies EE style texture skewing to the given sidedefs for the given sector.
 * @param {UDB.Sector} sector
 * @param {UDB.Sidedef[]} sidedefs
 */
function applyEESkewing(sector, sidedefs)
{
    // Get which surface is selected. We are sure only one is selected, otherwise the script would have aborted
    const surface = sector.floorSelected ? 'floor' : 'ceiling';

    let numApplied = 0;

    sidedefs.forEach(sd => {
        const side = ((sd.sector == sector && sd.isFront) || sd.sector != sector && !sd.isFront) ? 'front' : 'back';

        // Go through all sidedef parts, check if they are selected, and apply the UDMF property and value
        [ 'upper', 'middle', 'lower' ].filter(p => sd[`${p}Selected`]).forEach(p => {
            const property = `skew_${SidedefPart[p]}_type`;
            const value = `${side}_${surface}`;

            sd.fields[property] = value;

            numApplied++;
        });
    });
}

/**
 * Applies GZDoom style texture skewing to the given sidedefs for the given sector.
 * @param {UDB.Sector} sector
 * @param {UDB.Sidedef[]} sidedefs
 */
function applyGZDoomSkewing(sector, sidedefs)
{
    const surfaceModifier = sector.floorSelected ? 1 : 2;

    let numApplied = 0;

    sidedefs.forEach(sd => {
        const sideModifier = sd.sector == sector ? 0 : 2;

        // Go through all sidedef parts, check if they are selected, and apply the UDMF property and value
        [ 'upper', 'middle', 'lower' ].filter(p => sd[`${p}Selected`]).forEach(p => {
            const property = `skew_${SidedefPart[p]}`;
            const value = surfaceModifier + sideModifier;

            sd.fields[property] = value;

            numApplied++;
        });
    });
}

/**
 * Determintes which skewing style to use.
 * @returns Skewing style
 */
function determineSkewStyle()
{
    if (UDB.ScriptOptions.style == SkewingStyle.Autodetect)
    {
        // Right now there's no way to access the game config, so we have to use a crutch to
        // determine what skewing style is used by the config. Since the UDMF fields are defined
        // in the config they have specific types, GZDoom uses ints, EE uses strings. So trying
        // to set a value of a wrong type will cause an exception we can catch. I.e. if an
        // exception is caught it means that this field is defined in the config
        try
        {
            // Try to set GZDoom's skewing setting to a string, which will throw an exception
            const oldValue = sidedefs[0].fields.skew_top;
            sidedefs[0].fields.skew_top = "stylecheck";
            sidedefs[0].fields.skew_top = oldValue;
        }
        catch (error) // If we get here it's GZDoom style
        {
            return SkewingStyle.GZDoom;
        }

        try
        {
            // Try to set EE's skewing setting to a number, which will throw an exception
            const oldValue = sidedefs[0].fields.skew_top_type;
            sidedefs[0].fields.skew_top_type = 1;
            sidedefs[0].fields.skew_top_type = oldValue;
        }
        catch (error) //  If we get here it's EE style
        {
            return SkewingStyle.EternityEngine;
        }

        // If setting both GZDoom and EE style fields worked we can't auto-detect
        UDB.die('Failed to auto-detect skewing style');
    }
    else
    {
        return UDB.ScriptOptions.style;
    }
}

// Translator between UDB's and UDMF naming scheme
const SidedefPart =
{
    'upper': 'top',
    'middle': 'middle',
    'lower': 'bottom'
}

// Skewing style
const SkewingStyle =
{
    Autodetect: 0,
    Both: 1,
    GZDoom: 2,
    EternityEngine: 3
}

// Skewing only works in UDMF
if (!UDB.Map.isUDMF)
    UDB.die('Map format has to be UDMF');

// Get selected sectors and do some checks if we can work with the selected surfaces
const sectors = UDB.Map.getSelectedSectors();
if (sectors.length == 0)
    UDB.die('No sector surface selected');
if (sectors.filter(s => s.ceilingSelected && s.floorSelected).length != 0)
    UDB.die('You can not have both the floor and ceiling of a sector selected');

// Get selected sidedefs
const sidedefs = UDB.Map.getSidedefsFromSelectedLinedefs();
if (sidedefs.length == 0)
    UDB.die('No sidedefs selected');

// Make sure only one sector of the sidedef is selected
if (sidedefs.filter(sd => sd.other !== null && sectors.includes(sd.sector) && sectors.includes(sd.other.sector)).length > 0)
    UDB.die('Can not have the sectors on both sides of a linedef selected');

const skewStyle = determineSkewStyle();

// Process the selected elements
sectors.forEach(s => {
    // Get selected sidedefs that are related to the sector
    const sds = sidedefs.filter(sd => sd.sector == s || (sd.other !== null && sd.other.sector == s));

    if (skewStyle == SkewingStyle.Both || skewStyle == SkewingStyle.GZDoom)
        applyGZDoomSkewing(s, sds);

    if (skewStyle == SkewingStyle.Both || skewStyle == SkewingStyle.EternityEngine)
        applyEESkewing(s, sds);
});