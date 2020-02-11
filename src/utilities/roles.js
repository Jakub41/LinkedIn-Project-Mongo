// Access controls roles
const AccessControl = require("accesscontrol");

// Init
const accessCtrl = new AccessControl();

// Roles access
exports.roles = (() => {
    // Basic minimum access
    accessCtrl
        .grant("basic")
        .readOwn("profile")
        .updateOwn("profile");

    // Moderator same as basic but can read any profile
    accessCtrl
        .grant("moderator")
        .extend("basic")
        .readAny("profile");

    // Admin superpowers
    accessCtrl
        .grant("admin")
        .extend("basic")
        .extend("moderator")
        .updateAny("profile")
        .deleteAny("profile");

    return accessCtrl;
})();
