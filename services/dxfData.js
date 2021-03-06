const db = require('./db');
const helper = require('../helper');
const config = require('../config');


async function getEntitiesByLevelId(levelId){
    const entityRows = await db.query(
        'select \n' + 
	//'objectid, \n' + 
	'objecttypes.name AS type, json_data from public.buildings \n' +
	'left join levels on levels.building_id = buildings.building_id\n' +
	'left join layers on levels.level_id = layers.level_id\n' +
	'left join objects on objects.layer_id = layers.layer_id\n' +
	'left join objecttypes on objects.objecttype_id = objecttypes.objecttype_id\n' +
	'WHERE objects.objecttype_id IS NOT NULL ;' 
	//'AND objecttype_tbl.name NOT LIKE \'LINE\';'
    );
    const dbData = helper.emptyOrRows(entityRows);
	
    let dxfData = [];
    dbData.forEach(element => { 
	dxfData.push(Object.assign({type: element.type},JSON.parse(element.json_data)));
    });

    return dxfData;
}


async function getBlocksByLevelId(levelId){
    const blockRows = await db.query(
        'select blocks.name as name, objecttypes.name as type, blockobjects.json_data from public.buildings \n' +
	'left join levels on levels.building_id = buildings.building_id \n' +
	'left join layers on levels.level_id = layers.level_id \n' +
	'left join blockobjects on blockobjects.layer_id = layers.layer_id \n' +
	'left join objecttypes on blockobjects.objecttype_id = objecttypes.objecttype_id \n' +
	'left join blocks on blockobjects.block_id = blocks.block_id \n' +
	'WHERE blockobjects.objecttype_id IS NOT NULL;'
    );
     const dbBlockData = helper.emptyOrRows(blockRows);
	
    let dxfBlockData = {};
    dbBlockData.forEach(element => {
	if(!dxfBlockData[element.name])
	    dxfBlockData[element.name] = {entities:[]}  // Here can the block statement be feed with more informations if available

	dxfBlockData[element.name].entities.push(Object.assign({type: element.type},JSON.parse(element.json_data)));
    });


    return dxfBlockData;
}

async function getDXF(layerId = 0) {
	
    let dxfEntities = await getEntitiesByLevelId(layerId);
    let dxfBlocks = await getBlocksByLevelId(layerId);

    return {
		'tables': {
			"lineType": {
				"handle": "5",
				"ownerHandle": "0",
				"lineTypes": {
					"ByBlock": {
						"name": "ByBlock",
						"description": "",
						"patternLength": 0
					},
					"ByLayer": {
						"name": "ByLayer",
						"description": "",
						"patternLength": 0
					},
					"Continuous": {
						"name": "Continuous",
						"description": "Solid line",
						"patternLength": 0
					}
				}
			},
		},
		'entities': dxfEntities,
	    	'blocks': dxfBlocks
	}
}

module.exports = {
    getDXF
}

