# Platform Detector

This is a POC browser extension project for notifying about the presence of specific cookies indicating the use of a specific platform on the site in the current browser tab.

## Installation

Download, extract to a folder and load the extension in develope mode.

## Usage

When the extension icon shows a badge, it indicates that it found something. Click on the icon to see what.

## Configuration Example

Provide a list of platforms named by the key and identified by one of the cookies found in the corresponding array of cookie names.
The cookie names provided here are matched as a regular expression against the site cookies.
Therefore a cookie name defined as `ga_.*` will match `ga_123`, `ga_ABC`, `ga_` and `___ga___`.

A simple example:

```JSON
{
    "Drupal": ["drupal_cookie_name"],
    "Word Press": ["wp_cookie_name"]
}
```
