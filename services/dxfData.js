const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getDXF() {
    const rows = await db.query(
        'select objectid, objecttype_tbl.name, json from public.building_tbl \n' +
                'left join level_tbl on level_tbl.buildingid = building_tbl.buildingid\n' +
                'left join layer_tbl on level_tbl.levelid = layer_tbl.levelid\n' +
                'left join object_tbl on object_tbl.layerid = layer_tbl.layerid\n' +
                'left join objecttype_tbl on object_tbl.objecttypeid = objecttype_tbl.objecttypeid\n' +
	    	'WHERE object_tbl.objecttypeid IS NOT NULL;'
    );
    const data = helper.emptyOrRows(rows);

    return {
        data
    }
}

module.exports = {
    getDXF
}
