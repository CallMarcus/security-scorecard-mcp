Backwards Compatibility
=======================

Our policy about versioning and backwards compatibility

/\*! tailwindcss v4.1.6 | MIT License | https://tailwindcss.com \*/ @layer theme, base, components, utilities; @layer utilities;

Overview

[](#overview)
=========================

Welcome to our API backward compatibility policy! This guide helps you understand how we maintain stable integrations while continually improving our API.

How We Version Our API

[](#how-we-version-our-api)
=====================================================

### 

Major Versions (Global Versioning)

[](#major-versions-global-versioning)

We use major version numbers directly in our API URLs (e.g., `/v1`, `/v2`). A new major version indicates breaking changes that are not backward compatible.

### 

Minor and Patch Versions (Granular Versioning)

[](#minor-and-patch-versions-granular-versioning)

Within each major version, we use minor and patch versions. We follow Semantic Versioning (SEMVER):

*   **MAJOR**: Breaking changes (requires new global version).
*   **MINOR**: New features that are backward compatible.
*   **PATCH**: Bug fixes and small improvements that are backward compatible.

You can specify the version you want using the `Accepts-Version` header.

* * *

Changes We Consider Backward Compatible

[](#changes-we-consider-backward-compatible)
=======================================================================================

These changes won’t break your existing integrations:

*   **New endpoints**: Adding completely new methods or resources.
*   **Optional request parameters**: Adding parameters that you can ignore if you don’t need them.
*   **New response fields**: Adding fields to responses that won’t affect existing fields.
*   **Internal logic updates**: As long as inputs and outputs remain the same.
*   **Reordered response fields**: Fields are accessed by name, not position, so this doesn’t impact you.
*   **New webhook event types**: Unknown events are safe to ignore.

Changes We Consider Breaking

[](#changes-we-consider-breaking)
=================================================================

These changes require a new major version, as they may disrupt your current integrations:

*   **Removing response fields**: Eliminating fields you might depend on.
*   **Renaming or changing response fields**: Modifying names or structures.
*   **Changing field data types**: For example, switching from string to integer.
*   **New mandatory parameters**: Adding parameters you must now include in your requests.

* * *

API Deprecation Process

[](#api-deprecation-process)
=======================================================

We follow a three-phase process when deprecating features:

### 

Announcement Phase

[](#announcement-phase)

*   **Notice**: At least 6 months in advance.
*   **Communication**: Email, dashboard notifications, and API documentation.

### 

Support Phase

[](#support-phase)

*   **Duration**: At least 6 months.
*   **Behavior**: Features continue to work but include deprecation warnings in responses.

### 

Sunset Phase

[](#sunset-phase)

*   **End of Support**: Features are permanently removed.
*   **Behavior**: Requests return an error indicating the feature is gone.

Stay Updated with Our Changelog

[](#stay-updated-with-our-changelog)
=======================================================================

We regularly update our Changelog to keep you informed. It includes:

*   Breaking Changes
*   New Features
*   Deprecations
*   Fixes

We recommend regularly checking the Changelog for updates.

Best Practices for Using Our API

[](#best-practices-for-using-our-api)
=========================================================================

*   _Handle gracefully_: Ignore unknown fields or parameters.
*   _Specify versions_: Use the `Accepts-Version` header for predictable responses.
*   _Monitor deprecations_: Stay aware of upcoming changes to prepare in advance.

Updated about 2 months ago

* * *

Did this page help you?

Yes

No

Updated about 2 months ago

* * *

Did this page help you?

Yes

No