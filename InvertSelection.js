`#version 4`;
`#name Invert sector selection`;
`#description Inverts the selection of all sectors in the map.`

UDB.Map.getSectors().forEach(s => s.selected ^= true);
