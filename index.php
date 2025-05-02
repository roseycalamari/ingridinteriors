<?php
/**
 * Mobile Detection and Redirection
 * This file automatically detects mobile devices and redirects them to the mobile-specific version.
 */

// Simple mobile detection
function isMobile() {
    return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
}

// Redirect mobile users to mobile.html
if (isMobile()) {
    header("Location: mobile.html");
    exit;
} else {
    // Include the desktop version
    include 'desktop.html';
}
?> 