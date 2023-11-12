`#version 4`;

`#name Remove Tag`;

`#description Removes specified tag from selected sectors.`;

`#scriptoptions

tag
{
    description = "Tag";
    default = -1;
    type = 0;
}
`;

const sectors = UDB.Map.getSelectedSectors();

if(sectors.length > 0 && UDB.ScriptOptions.tag > 0)
{
    const tag = UDB.ScriptOptions.tag;
    sectors.forEach(sec => sec.removeTag(tag));
}