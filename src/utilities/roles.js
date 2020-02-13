// Access controls roles
const AccessControl = require("accesscontrol");

let grantsObject = {
    admin: {
        user: {
            "create:any": ["*"],
            "read:any": ["*"],
            "update:any": ["*"],
            "delete:any": ["*"]
        }
    },
    basic: {
        user: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"],
            "delete:own": ["*"],
        }
    }
};

// Init
const accessCtrl = new AccessControl();

// Roles access
// Here adding the access rules and to what we give access to a specific role
// Basic, Moderator, Admin
// Admin => Read/Write full powers
// Moderator => Read access everywhere
// Basic => Read/write own information
exports.roles = (() => {
    accessCtrl.setGrants(grantsObject);

    return accessCtrl;
})();
