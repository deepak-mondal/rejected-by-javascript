/**
 * Package.json vs. package-lock.json & npm Versioning
 *
 * This document briefly explains the core differences between package.json
 * and package-lock.json, the meaning of `~` and `^` in dependency versions,
 * and common metadata found in package.json.
 */

// --- 1. package.json vs. package-lock.json ---

/**
 * package.json:
 * - The manifest file for your project.
 * - Declares direct dependencies with *version ranges* (e.g., "^1.0.0").
 * - Contains project metadata (name, version, scripts, author, etc.).
 * - Manually edited by developers.
 * - Essential for defining what your project *wants* in terms of dependencies.
 * - Always committed to version control.
 */

/**
 * package-lock.json:
 * - Automatically generated and updated by npm (since npm v5).
 * - Locks the *exact versions* of ALL dependencies (direct and nested).
 * - Ensures reproducible builds across different environments and times.
 * - Contains integrity hashes for packages.
 * - NOT meant for manual editing; npm manages it.
 * - Always committed to version control (crucial for consistency).
 */

// --- 2. Difference between ~ and ^ in package versions ---

/**
 * ^ (Caret):
 * - Allows updates that do not change the left-most non-zero digit in the version number.
 * - Example: "^1.2.3" will match 1.x.x (e.g., 1.2.4, 1.9.0) but NOT 2.0.0.
 * - This is npm's default behavior for `npm install <package>`.
 * - Generally safe for non-breaking changes (minor and patch updates).
 */

/**
 * ~ (Tilde):
 * - Allows only patch-level updates.
 * - Example: "~1.2.3" will match 1.2.x (e.g., 1.2.4, 1.2.9) but NOT 1.3.0.
 * - More restrictive than `^`.
 * - Useful when you want to minimize the risk of even minor changes.
 */

// --- 3. Various Metadata in package.json ---

/**
 * Common metadata fields in package.json:
 *
 * - `name`: The name of the package.
 * - `version`: The current version of the package.
 * - `description`: A brief description of the package.
 * - `main`: The primary entry point to your package (e.g., "index.js").
 * - `scripts`: An object containing script commands that can be run via `npm run`.
 * - `keywords`: An array of keywords describing the package.
 * - `author`: The author of the package (e.g., "Your Name <email@example.com>").
 * - `license`: The license under which your package is distributed (e.g., "MIT").
 * - `dependencies`: An object listing production dependencies required by your package.
 * - `devDependencies`: An object listing development dependencies (e.g., testing frameworks, build tools).
 * - `repository`: Specifies where the code repository is located.
 * - `homepage`: The URL to the project homepage.
 * - `bugs`: The URL to your project's issue tracker.
 */
