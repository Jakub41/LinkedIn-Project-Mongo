// Access controls roles
const AccessControl = require("accesscontrol");

// Init
const accessCtrl = new AccessControl();

// Roles access
exports.roles = (() => {
    // Basic minimum access
    accessCtrl
        .grant("basic")
        .readOwn("user")
        .updateOwn("user")
        .deleteOwn("user")

    // Moderator same as basic but can read any profile
    accessCtrl
        .grant("moderator")
        .extend("basic")
        .readAny("user");

    // Admin superpowers
    accessCtrl
        .grant("admin")
        .extend("basic")
        .extend("moderator")
        .updateAny("user")
        .deleteAny("user");

    return accessCtrl;
})();
