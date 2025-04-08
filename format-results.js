// File: format-results.js
// Purpose: Processes scan results (e.g., from VirusTotal) and formats malicious entries.
// Used in: n8n Code node after merging scan results.

// Assumes 'items' is an array of inputs from previous nodes (e.g., VirusTotal results)
const maliciousEntries = [];

for (const entry of items) {
    try {
        // Access data safely, assuming structure from VirusTotal URL/File report API v3
        const data = entry.json?.data; // Use optional chaining
        if (!data) continue; // Skip if data is missing

        const attributes = data.attributes;
        if (!attributes) continue; // Skip if attributes are missing

        const stats = attributes.last_analysis_stats || {};
        const scanResults = attributes.last_analysis_results || {}; // Use results instead of deprecated details

        // Determine if malicious based on stats or positive results
        const isMaliciousStat = (stats.malicious || 0) > 0;
        const positiveDetections = Object.values(scanResults).filter(r => r && r.category === 'malicious').length; // Count positive malicious results

        if (isMaliciousStat || positiveDetections > 0) {
            // Identify the value scanned (URL, IP, File Hash) - often the 'id' in VT results
            const scannedValue = data.id || entry.json?.value || 'unknown'; // Fallback if id is not present
            const itemType = data.type || entry.json?.type || 'unknown'; // e.g., 'url', 'file', 'ip_address'

            maliciousEntries.push({
                json: { // Ensure output matches expected n8n structure
                    type: itemType,
                    value: scannedValue,
                    malicious_count: stats.malicious || positiveDetections, // Report count based on stats or detected positives
                    // Consider adding a summary of detections if needed, last_analysis_results can be very large
                    // Example: detection_summary: Object.entries(scanResults)
                    //                              .filter(([k, v]) => v.category === 'malicious')
                    //                              .map(([k, v]) => `${k}: ${v.result}`)
                    //                              .join(', ')
                }
            });
        }
    } catch (error) {
        // Log error for debugging within n8n execution log
        console.error(`Error processing entry: ${error.message}. Input item: ${JSON.stringify(entry)}`);
        // Optionally, push an error item to the output if needed downstream
        // maliciousEntries.push({ json: { error: `Processing failed for an item: ${error.message}` } });
    }
}

// Return only the malicious entries, formatted as n8n items
return maliciousEntries;
// If you need to pass through non-malicious items too, adjust logic accordingly.