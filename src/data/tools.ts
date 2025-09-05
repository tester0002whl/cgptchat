export interface Tool {
  id: string;
  title: string;
  category: string; // e.g., "Scanning", "OSINT", "Vulnerability", "Crypto", "Premium OSINT"
  description: string;
  localizedExample?: string;
  isPremium?: boolean;
}

export const toolCategories = [
  "Network Scanning",
  "OSINT & Discovery", 
  "Vulnerability Assessment",
  "Crypto Analysis",
  "Premium OSINT",
  "Dark Web Intelligence",
  "Advanced Penetration Testing"
];

export const tools: Tool[] = [
  // Network Scanning
  { id: "nmap-tcp", title: "TCP Port Scan", category: "Network Scanning", description: "Perform comprehensive TCP port scanning to discover open services and potential attack vectors.", localizedExample: "Perform a TCP scan on hackergpt.app to identify running services" },
  { id: "nmap-udp", title: "UDP Port Scan", category: "Network Scanning", description: "Execute UDP port scanning to find UDP-based services that TCP scans might miss.", localizedExample: "Run a UDP scan on 192.168.1.1 to discover DHCP, DNS, and SNMP services" },
  { id: "nmap-syn", title: "SYN Stealth Scan", category: "Network Scanning", description: "Conduct stealthy SYN scanning to avoid detection while mapping network services.", localizedExample: "Perform stealth SYN scan on target.com without triggering IDS alerts" },
  { id: "service-detection", title: "Service & Version Detection", category: "Network Scanning", description: "Identify specific services, versions, and operating systems running on discovered ports.", localizedExample: "Detect OS and service versions for juice-shop.hackergpt.app" },
  { id: "ssl-analysis", title: "SSL/TLS Security Analysis", category: "Network Scanning", description: "Comprehensive SSL/TLS configuration analysis including cipher suites and certificate validation.", localizedExample: "Analyze SSL configuration and vulnerabilities for whitehacklabs.com" },

  // OSINT & Discovery
  { id: "subdomain-enum", title: "Subdomain Enumeration", category: "OSINT & Discovery", description: "Discover all subdomains associated with a target domain to expand attack surface.", localizedExample: "Find all subdomains for whitehacklabs.com including hidden development environments" },
  { id: "whois-lookup", title: "Domain Registration Analysis", category: "OSINT & Discovery", description: "Extract domain ownership, registration details, and DNS configuration information.", localizedExample: "Get comprehensive WHOIS data for hackergpt.app including registrar and nameservers" },
  { id: "geo-location", title: "IP Geolocation Intelligence", category: "OSINT & Discovery", description: "Determine physical location, ISP, and network details for IP addresses and domains.", localizedExample: "Fetch detailed geolocation data for IP 3.168.51.78 including ISP and threat intelligence" },
  { id: "dns-recon", title: "DNS Reconnaissance", category: "OSINT & Discovery", description: "Comprehensive DNS record analysis including hidden records and misconfigurations.", localizedExample: "Perform DNS reconnaissance on target.com to find mail servers and CDN configurations" },
  { id: "web-crawler", title: "Intelligent Web Crawling", category: "OSINT & Discovery", description: "Advanced web crawling with JavaScript execution and network traffic analysis.", localizedExample: "Crawl hackergpt.app and analyze all network requests and responses" },

  // Vulnerability Assessment  
  { id: "cve-database", title: "CVE Vulnerability Search", category: "Vulnerability Assessment", description: "Search comprehensive CVE database for known vulnerabilities in specific software versions.", localizedExample: "Find all CVEs affecting Apache 2.4.41 with CVSS scores and exploit availability" },
  { id: "exploit-finder", title: "Exploit Code Discovery", category: "Vulnerability Assessment", description: "Locate working exploit code and proof-of-concepts for identified vulnerabilities.", localizedExample: "Find exploit code for CVE-2023-12345 from multiple exploit databases" },
  { id: "web-vuln-scan", title: "Web Application Security Scan", category: "Vulnerability Assessment", description: "Automated scanning for OWASP Top 10 vulnerabilities including SQL injection and XSS.", localizedExample: "Scan juice-shop.hackergpt.app for SQL injection, XSS, and authentication bypasses" },
  { id: "ssl-vuln-check", title: "SSL/TLS Vulnerability Assessment", category: "Vulnerability Assessment", description: "Test for SSL/TLS vulnerabilities including Heartbleed, POODLE, and weak cipher suites.", localizedExample: "Check whitehacklabs.com for Heartbleed, BEAST, and other SSL vulnerabilities" },

  // Dark Web Intelligence
  { id: "darkweb-search", title: "Dark Web Monitoring", category: "Dark Web Intelligence", description: "Search .onion sites and dark web marketplaces for mentions of your organization or data.", localizedExample: "Search dark web for mentions of info@whitehacklabs.com across .onion sites" },
  { id: "onion-analysis", title: "Onion Site Analysis", category: "Dark Web Intelligence", description: "Analyze .onion websites through Tor proxy with screenshot capture and content analysis.", localizedExample: "Analyze suspicious .onion links for malicious content and data leaks" },
  { id: "breach-monitor", title: "Data Breach Monitoring", category: "Dark Web Intelligence", description: "Monitor dark web forums and marketplaces for stolen credentials and sensitive data.", localizedExample: "Monitor for leaked credentials from your organization on dark web marketplaces" },

  // Crypto Analysis
  { id: "eth-forensics", title: "Ethereum Wallet Forensics", category: "Crypto Analysis", description: "Deep analysis of Ethereum wallets including transaction history and smart contract interactions.", localizedExample: "Analyze Ethereum wallet 0xabc123... for suspicious transactions and DeFi interactions" },
  { id: "btc-tracing", title: "Bitcoin Transaction Tracing", category: "Crypto Analysis", description: "Trace Bitcoin transactions and analyze wallet clustering for investigation purposes.", localizedExample: "Trace Bitcoin wallet 1A1zP1... transactions and identify connected addresses" },
  { id: "token-security", title: "Token Security Analysis", category: "Crypto Analysis", description: "Analyze cryptocurrency tokens for security vulnerabilities and rug pull indicators.", localizedExample: "Analyze token 0x123abc... on Ethereum for honeypot and rug pull risks" },
  { id: "sanction-screening", title: "Sanctions & AML Screening", category: "Crypto Analysis", description: "Check cryptocurrency addresses against OFAC sanctions lists and known criminal wallets.", localizedExample: "Screen wallet 0xdef456... against OFAC sanctions and criminal address databases" },
  { id: "solana-forensics", title: "Solana Blockchain Analysis", category: "Crypto Analysis", description: "Comprehensive Solana wallet and token analysis including NFT tracking.", localizedExample: "Analyze Solana wallet 4Nd1mWqPuMjdLVaD... for token transfers and NFT activity", isPremium: true },

  // Premium OSINT
  { id: "phone-intel", title: "Phone Number Intelligence", category: "Premium OSINT", description: "Advanced phone number lookup with carrier info, location history, and associated accounts.", localizedExample: "Get detailed intelligence on +1-555-123-4567 including carrier and location data", isPremium: true },
  { id: "email-discovery", title: "Email Discovery & Validation", category: "Premium OSINT", description: "Find and validate email addresses associated with domains and individuals.", localizedExample: "Discover all email addresses for whitehacklabs.com with validation status", isPremium: true },
  { id: "breach-search", title: "Comprehensive Breach Search", category: "Premium OSINT", description: "Search across multiple data breach databases for compromised credentials and PII.", localizedExample: "Search for user@example.com across 500+ data breaches with detailed results", isPremium: true },
  { id: "social-osint", title: "Social Media Intelligence", category: "Premium OSINT", description: "Advanced social media reconnaissance across multiple platforms with relationship mapping.", localizedExample: "Gather intelligence on target individual across LinkedIn, Twitter, and Facebook", isPremium: true },
  { id: "vin-intelligence", title: "Vehicle Intelligence Lookup", category: "Premium OSINT", description: "Comprehensive vehicle information including ownership history and accident records.", localizedExample: "Get detailed vehicle report for VIN 1HGCM82633A004352 including ownership history", isPremium: true },

  // Advanced Penetration Testing
  { id: "payload-generator", title: "Custom Payload Generation", category: "Advanced Penetration Testing", description: "Generate custom payloads for various attack vectors including reverse shells and web exploits.", localizedExample: "Generate custom PHP reverse shell payload for target web application", isPremium: true },
  { id: "privilege-escalation", title: "Privilege Escalation Advisor", category: "Advanced Penetration Testing", description: "Identify privilege escalation vectors based on system enumeration results.", localizedExample: "Analyze Linux system enumeration for privilege escalation opportunities", isPremium: true },
  { id: "lateral-movement", title: "Lateral Movement Planning", category: "Advanced Penetration Testing", description: "Plan lateral movement strategies within compromised networks.", localizedExample: "Plan lateral movement from compromised workstation to domain controller", isPremium: true },
  { id: "persistence-techniques", title: "Persistence Mechanism Analysis", category: "Advanced Penetration Testing", description: "Analyze and implement persistence mechanisms for red team engagements.", localizedExample: "Implement registry-based persistence on Windows target system", isPremium: true }
];
