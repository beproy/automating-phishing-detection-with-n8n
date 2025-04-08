// File: parse-indicators.js
// Purpose: Extracts and filters Domains and IP addresses from email content.
// Used in: n8n Code node after HTML extraction.

const emailContent = $json["stdout"] || ""; // Assumes input comes from a previous node providing stdout

// Regex to find potential domains and IPs
const domainRegex = /\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\b/g;
const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

// Regex patterns for private/internal IP ranges to exclude
const privateIpRanges = [
    /^10\./,                            // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,   // 172.16.0.0/12
    /^192\.168\./,                      // 192.168.0.0/16
    /^127\./,                           // 127.0.0.0/8 (Loopback)
    /^169\.254\./                       // 169.254.0.0/16 (Link-local)
];

// Regex patterns for common non-actionable or infrastructure domains to exclude
const unwantedDomains = [
    /\.outlook\.com$/,
    /\.protection\.outlook\.com$/,
    /\.office365\.com$/,
    // The patterns below might be overly broad or specific artifacts; review if needed
    /^time\.google\.com$/, // Example: common, often safe domain from headers
    /^smtp\.mailfrom$/, // These look like potential header artifacts, not domains
    /^header\.from$/     // These look like potential header artifacts, not domains
    // Add other domains you want to explicitly exclude, e.g., /yourdomain\.com$/
];

// List of generally accepted Top-Level Domains (TLDs) - adjust as needed
const validTLDs = ["com", "net", "org", "io", "gov", "edu", "co", "uk", "us", "ca", "in", "ai", "app", "dev", "xyz", "info", "biz"]; // Expanded list

// Extract initial matches
let domains = [...new Set(emailContent.match(domainRegex) || [])];
let ips = [...new Set(emailContent.match(ipRegex) || [])];

// Filter domains
domains = domains.filter(domain => {
    const lowerDomain = domain.toLowerCase();
    const tld = lowerDomain.split('.').pop();
    return !unwantedDomains.some(pattern => pattern.test(lowerDomain)) && // Check against unwanted patterns
           lowerDomain.includes('.') &&                                   // Must contain a dot
           validTLDs.includes(tld) &&                                   // Must have a valid TLD
           domain.length <= 63 &&                                       // Reasonable domain length limit
           !/^\d+$/.test(domain.replace(/\./g, ''));                   // Should not be purely numeric (ignoring dots)
});

// Filter IPs
ips = ips.filter(ip => !privateIpRanges.some(regex => regex.test(ip)));

// Format output for n8n item structure (assuming next nodes expect this format)
const outputItems = [];
domains.forEach(domain => outputItems.push({ json: { type: "Domain", value: domain } }));
ips.forEach(ip => outputItems.push({ json: { type: "IP", value: ip } }));

return outputItems;