const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getDXF() {
    const rows = await db.query(
        'select \n' + 
	    	//'objectid, \n' + 
	    	'objecttype_tbl.name AS type, json from public.building_tbl \n' +
                'left join level_tbl on level_tbl.buildingid = building_tbl.buildingid\n' +
                'left join layer_tbl on level_tbl.levelid = layer_tbl.levelid\n' +
                'left join object_tbl on object_tbl.layerid = layer_tbl.layerid\n' +
                'left join objecttype_tbl on object_tbl.objecttypeid = objecttype_tbl.objecttypeid\n' +
	    	'WHERE object_tbl.objecttypeid IS NOT NULL \n' + 
	    	'AND objecttype_tbl.name LIKE \'LINE\';'
    );
    const dbData = helper.emptyOrRows(rows);
    
    let dxfData = [];
    dbData.forEach(element => { 
	dxfData.push(Object.assign({type: element.type},JSON.parse(element.json)));
    });

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
		'entities': dxfData
	}
}

module.exports = {
    getDXF
}

