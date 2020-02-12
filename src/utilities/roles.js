// Access controls roles
const AccessControl = require("accesscontrol");

// Init
const accessCtrl = new AccessControl();

// Roles access
// Here adding the access rules and to what we give access to a specific role
// Basic, Moderator, Admin
// Admin => Read/Write full powers
// Moderator => Read access everywhere
// Basic => Read/write own information
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
