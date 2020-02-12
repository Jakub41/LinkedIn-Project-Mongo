// Access controls roles
const AccessControl = require("accesscontrol");

// Init
const accessCtrl = new AccessControl();

// Roles access
exports.roles = (() => {
    // Basic minimum access
    accessCtrl
        .grant("basic")
        .readOwn(["user", "profile"])
        .updateOwn(["user", "profile", "post", "comment"])
        .deleteOwn(["user", "profile", "post", "comment"])

    // Moderator same as basic but can read any profile
    accessCtrl
        .grant("moderator")
        .extend("basic")
        .readAny(["user", "profile", "post", "comment"]);

    // Admin superpowers
    accessCtrl
        .grant("admin")
        .extend("basic")
        .extend("moderator")
        .updateAny(["user", "profile", "post", "comment"])
        .deleteAny(["user", "profile", "post", "comment"]);

    return accessCtrl;
})();
