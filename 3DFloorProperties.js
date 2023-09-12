`#version 4`;

`#name 3D floor properties`;

`#description Modifies properties of the currently selected sectors' 3D floors`;

`#scriptoptions

/*
TAGS OF THE SECTORS TO MODIFY - Leave it as 0 if you want to modify every 3D floor. Add any tag separated by a comma to
only modify 3D floors of those tags. (e.g "1,53,16"). Quotes and spaces don't matter.
PROPERTIES TO MODIFY - When the script is executed, it will only modify the selected property and ignore the rest. If
you don't want to modify specific properties with option "All", change the settings with options to blank and settings with integers to -1.
FLAGS - Select a flag and run the script to set it. Run it again to unset it. You can only change a single flag at a time. Select the "Clear flags"
option and run the script to remove all the flags.
*/

tags
{
    description = "Tags of the sectors to modify";
    default = "0";
    type = 2;
}

property
{
    description = "Properties to modify";
    default = 0;
    type = 11;
    enumvalues
    {
        0 = "All";
        1 = "Type";
        2 = "Type Flags";
        3 = "Flags";
        4 = "Alpha";
        5 = "Brightness";
        6 = "Tag";
    }
}

type
{
    description = "Type";
    default = -1;
    type = 11;
    enumvalues
    {
        -1 = "";
        0 = "Vavoom-Style";
        1 = "Solid";
        2 = "Swimmable";
        3 = "Non-Solid";
    }
}

typeflags
{
    description = "Type Flag";
    default = -1;
    type = 11;
    enumvalues
    {
        -1 = "";
        0 = "Clear flags";
        4 = "Render-Inside";
        16 = "Invert Visibility Rules";
        32 = "Invert Shootability Rules";
    }
}

flags
{
    description = "Flag";
    default = -1;
    type = 11;
    enumvalues
    {
        -1 = "";
        0 = "Clear flags";
        1 = "Disable light effects";
        2 = "Restrict light inside";
        4 = "Fog effect (GZDoom only)";
        8 = "Ignore bottom height";
        16 = "Use upper texture";
        32 = "Use lower texture";
        64 = "Additive translucency";
        512 = "Fade effect (no view blend)";
        1024 = "Reset light effects";
    }
}

alpha
{
    description = "Alpha";
    default = 255;
    type = 0;
}

brightness
{
    description = "Brightness";
    default = 192;
    type = 0;
}

tag
{
    description = "Tag";
    default = 0;
    type = 0;
}
`;

let selectedSectors = UDB.Map.getSelectedSectors();
let lines3D = UDB.Map.getLinedefs().filter(l => l.action == 160);
let tags = UDB.ScriptOptions.tags.replace(/ /g, '').split(",");

selectedSectors.forEach(s => {
    let selectedTags = s.getTags();
    if (tags[0] == 0)
        tags = selectedTags;

    selectedTags.forEach(t => {
        tags.forEach(tg => {
            if (tg == t)
            {
                SetProperties(t);
            }
        });
    });
});

function SetProperties(tag)
{
    for (let i = 0; i < lines3D.length; i++)
    {
        if (lines3D[i].args[0] == tag)
        {
            switch (UDB.ScriptOptions.property)
            {
                case 0:
                    SetType(i);
                    SetTypeFlags(i);
                    SetFlags(i);
                    SetAlpha(i);
                    SetBrightness(i);
                    SetTag(i);
                case 1:
                    SetType(i);
                    break;
                case 2:
                    SetTypeFlags(i);
                    break;
                case 3:
                    SetFlags(i);
                    break;
                case 4:
                    SetAlpha(i);
                    break;
                case 5:
                    SetBrightness(i);
                    break;
                case 6:
                    SetTag(i);
                    break;
            }
        }
    }
}

function SetType(index)
{
    if (UDB.ScriptOptions.type == -1)
        return;

    lines3D[index].args[1] &= ~3;
    lines3D[index].args[1] += UDB.ScriptOptions.type;
}

function SetTypeFlags(index)
{
    if (UDB.ScriptOptions.typeflags == -1)
        return;

    if (UDB.ScriptOptions.typeflags == 0)
    {
        lines3D[index].args[1] &= ~32 & ~16 & ~4;
        return;
    }

    if (!(lines3D[index].args[1] & UDB.ScriptOptions.typeflags))
    {
        lines3D[index].args[1] += UDB.ScriptOptions.typeflags;
    }
    else
    {
        lines3D[index].args[1] -= UDB.ScriptOptions.typeflags;
    }
}

function SetFlags(index)
{
    if (UDB.ScriptOptions.flags == -1)
        return;

    if (UDB.ScriptOptions.flags == 0)
    {
        lines3D[index].args[2] = 0;
        return;
    }

    if (!(lines3D[index].args[2] & UDB.ScriptOptions.flags))
    {
        lines3D[index].args[2] += UDB.ScriptOptions.flags;
    }
    else
    {
        lines3D[index].args[2] -= UDB.ScriptOptions.flags;
    }
}

function SetAlpha(index)
{
    if (UDB.ScriptOptions.alpha == -1)
        return;

    lines3D[index].args[3] = UDB.ScriptOptions.alpha;
}

function SetBrightness(index)
{
    if (UDB.ScriptOptions.brightness == -1)
        return;

    lines3D[index].front.sector.brightness = UDB.ScriptOptions.brightness;
}

function SetTag(index)
{
    if (UDB.ScriptOptions.tag == -1)
        return;

    lines3D[index].front.sector.tag = UDB.ScriptOptions.tag;
}