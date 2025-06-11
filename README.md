# Automating Phishing Detection with n8n

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

This repository contains the n8n workflow and instructions for the automated phishing detection system described in the Medium article:
**[Automating Phishing Detection with n8n: A Step-by-Step Implementation Guide](https://medium.com/@beproy92/automating-phishing-detection-with-n8n-a-step-by-step-implementation-guide-67e606431ea4)**

## Overview
This workflow automates the process of analyzing suspicious emails forwarded to a dedicated inbox. It extracts URLs and attachments, scans them using VirusTotal and URLScan.io, and sends a summary report via email.

## Features

* Extracts URLs from emails.
* Submits URLs to VirusTotal for further analysis.
* Submits attachments to VirusTotal for analysis.
* Generates a consolidated report with scan results.

## Prerequisites
¤ n8n Installation: Ensure n8n is installed on your system. If not, refer to the n8n installation guide.​ I used a local installation running n8n on Docker Desktop.

¤ VirusTotal API Key: Sign up at VirusTotal to obtain a free API key for scanning domains and IPs.​

¤ Email Sample: Have sample .eml files ready for testing.

## Setup Instructions

1.  **Download the Workflow:** Download the `phishing-detection-workflow.json` file from this repository.
2.  **Import into n8n:** Open your n8n instance, go to "Workflows", click "Import from File", and select the downloaded `.json` file.
3.  **Configure Credentials:**
    * Set up n8n credentials for VirusTotal using your API key.
    * Link these credentials within the respective nodes in the imported workflow.
4.  **Activate Workflow:** Save and activate the workflow in n8n.

## How It Works

1.  **HTML Extract:** Extracts content from the email body.
2.  **URL Extraction:** Identifies URLs in the email body/subject.
3.  **Scanning Nodes (VirusTotal):** Sends URLs/attachments to external services for analysis.
4.  **Data Formatting & Merging:** Consolidates results.


*For a detailed explanation of each step and node configuration, please refer to the [Medium article](https://medium.com/@beproy92/automating-phishing-detection-with-n8n-a-step-by-step-implementation-guide-67e606431ea4).*

## Disclaimer

This workflow is provided as-is for educational purposes. Always exercise caution when handling potentially malicious emails and files. Scanning services may have limitations or usage quotas. Ensure compliance with the terms of service for all integrated APIs (VirusTotal).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. *(This line assumes you added an MIT license in Step 2)*
