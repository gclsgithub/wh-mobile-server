const {sequelize} = require("../../db");

let User = require("./m_user")(sequelize)
let Product = require("./m_porduct")(sequelize);
let PorductType = require("./m_porduct_type")(sequelize);
let Maintenance =  require("./m_maintenance")(sequelize);
let BadType =  require("./m_bad_type")(sequelize);
let MaintenanceStatus =  require("./m_maintenance_status")(sequelize);
let Template =  require("./m_info_template")(sequelize);
let SendInfoHistory =  require("./m_send_Info_history")(sequelize);


