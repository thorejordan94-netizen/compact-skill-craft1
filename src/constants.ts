import { JobProfile } from './types';

export const JOB_PROFILES_TEXT = `
Windows-Client-Team (Windows Client Administrator):
M365, Exchange Online, Windows Server 2016–2025, Enterprise-Umgebung.
AD-Domain mit mehreren Standorten (Düsseldorf als Hauptstandort, weitere Standorte/Konzernunternehmen)
Hybrid-M365-Umgebung, On-Prem AD + Azure AD, Exchange Online, Teams, OneDrive, SharePoint Online
Standardisierter Windows-10/11-Client mit zentralem Management (GPO + Intune/MECM/SCCM)
Tools: MECM/SCCM, Intune, Windows Deployment Services/MDT, WSUS, Defender for Endpoint, CrowdStrike/SentinelOne, BitLocker, PowerShell.

Windows-Server-Team (Windows Server Administrator):
Windows Server 2016–2025, M365/Exchange Online, Enterprise-Rechenzentren.
Hybride AD-/Azure-AD-Umgebung. Virtualisierung mit Hyper-V und VMware.
Core Services: AD DS, DNS, DHCP, File, Print, RDS.
Tools: Hyper-V, VMware, SCOM, SCVMM, Windows Admin Center, PowerShell, Ansible, Defender for Identity.

Network-Team (Network Administrator):
Cisco/Juniper/Aruba, SD-WAN, VPN, NAC, WLAN, Firewalling.
Core: Routing/Switching (BGP/OSPF), Segmentation (VLAN/VRF), Zero Trust.
Tools: Wireshark, NetBox, SolarWinds, Palo Alto/Fortinet, Cisco ISE, Terraform/Ansible.

DBA-Team (Database Administrator):
SQL Server 2019/2022, Oracle, DB2, PostgreSQL.
HA/DR (Always On, RAC, Data Guard).
Tools: SSMS, RMAN, Veeam, Flyway, Azure DevOps, Grafana, Imperva.

Linux-Team (Linux Administrator):
RHEL, SLES, Debian/Ubuntu. Web/App-Server, Middleware, Datenbanken.
Virtualisierung (vSphere), Container (Kubernetes, Docker).
Tools: Ansible, Terraform, Apache/Nginx, Prometheus/Grafana, ELK Stack, SELinux, Bash/Python.
`;

export const JOB_PROFILES: JobProfile[] = [
  { id: 'windowsClient', title: 'Win Client', description: 'Endpoint Mgmt, GPO, Intune, Defender' },
  { id: 'windowsServer', title: 'Win Server', description: 'AD DS, Hyper-V, Hybrid, Core Infra' },
  { id: 'network', title: 'Network', description: 'Routing/Switching, Firewalls, VPN, Zero Trust' },
  { id: 'dba', title: 'DBA', description: 'SQL/Oracle/Postgres, HA/DR, Performance' },
  { id: 'linux', title: 'Linux', description: 'RHEL/SLES, Automation, Containers, Observability' },
];

export const CLUSTERS: Record<string, { name: string; color: string }> = {
  windows: { name: 'Windows / AD', color: 'cyan' },
  linux: { name: 'Linux', color: 'emerald' },
  network: { name: 'Network', color: 'sky' },
  cloud: { name: 'Cloud', color: 'purple' },
  web: { name: 'Web', color: 'pink' },
  malware: { name: 'Malware / RE', color: 'orange' },
  blue: { name: 'Blue Team / DFIR', color: 'teal' },
  other: { name: 'Other', color: 'slate' },
};

export const CATEGORY_COLOR_MAP: Record<string, string> = {
  'windows': 'cyan',
  'windows/ad': 'cyan',
  'linux': 'emerald',
  'network': 'sky',
  'cloud': 'purple',
  'web': 'pink',
  'malware': 'orange',
  'malware/re': 'orange',
  'blue': 'teal',
  'blue team/dfir': 'teal',
  'other': 'slate',
};

export const DIFFICULTY_ORDER: Record<string, number> = {
  'info': 0,
  'easy': 1,
  'medium': 2,
  'hard': 3,
  'insane': 4,
};

export const ROOM_LIST = [
  "0day", "0x41haz", "a-bucket-of-phish", "abusing-windows-internals", "active-directory-basics", "active-directory-hardening", 
  "active-reconnaissance", "ad-authenticated-enumeration", "ad-basics", "ad-certificate-services", "ad-certified-pre-owned", "ad-cs-esc1", "ad-cs-esc2", "ad-cs-esc3", "ad-cs-esc4", "ad-cs-esc5", "ad-cs-esc6", "ad-cs-esc7", "ad-cs-esc8", "ad-cs-esc9", "ad-cs-esc10", "ad-esc1", "ad-esc2", "ad-esc3", "ad-esc4", "ad-esc5", "ad-esc6", "ad-esc7", "ad-esc8", "ad-esc9", "ad-esc10", "ad-esc11", "ad-esc12", "ad-esc13", "ad-esc14", "ad-esc15", "ad-esc16", "ad-esc17", "ad-esc18", "ad-esc19", "ad-esc20", "ad-esc21", "ad-esc22", "ad-esc23", "ad-esc24", "ad-esc25", "ad-esc26", "ad-esc27", "ad-esc28", "ad-esc29", "ad-esc30", "ad-esc31", "ad-esc32", "ad-esc33", "ad-esc34", "ad-esc35", "ad-esc36", "ad-esc37", "ad-esc38", "ad-esc39", "ad-esc40", "ad-esc41", "ad-esc42", "ad-esc43", "ad-esc44", "ad-esc45", "ad-esc46", "ad-esc47", "ad-esc48", "ad-esc49", "ad-esc50", "ad-esc51", "ad-esc52", "ad-esc53", "ad-esc54", "ad-esc55", "ad-esc56", "ad-esc57", "ad-esc58", "ad-esc59", "ad-esc60", "ad-esc61", "ad-esc62", "ad-esc63", "ad-esc64", "ad-esc65", "ad-esc66", "ad-esc67", "ad-esc68", "ad-esc69", "ad-esc70", "ad-esc71", "ad-esc72", "ad-esc73", "ad-esc74", "ad-esc75", "ad-esc76", "ad-esc77", "ad-esc78", "ad-esc79", "ad-esc80", "ad-esc81", "ad-esc82", "ad-esc83", "ad-esc84", "ad-esc85", "ad-esc86", "ad-esc87", "ad-esc88", "ad-esc89", "ad-esc90", "ad-esc91", "ad-esc92", "ad-esc93", "ad-esc94", "ad-esc95", "ad-esc96", "ad-esc97", "ad-esc98", "ad-esc99", "ad-esc100", "ad-successor", "ad-basic-enumeration", "ad-certificate-templates", 
  "ad-tier-model", "advanced-elk-queries", "advanced-sql-injection", "advanced-static-analysis", "advent-of-cyber-1-2019", 
  "advent-of-cyber-2-2020", "advent-of-cyber-2022", "advent-of-cyber-2023", "advent-of-cyber-2024", "advent-of-cyber-23-side-quest", 
  "advent-of-cyber-24-side-quest", "advent-of-cyber-3-2021", "adventure-time", "agent-sudo", "agent-t", "ai-forensics", 
  "ai-ml-security-threats", "airplane", "alfred", "all-in-one", "allsignspoint2pwnage", "analysing-volatile-memory", 
  "android-analysis", "android-hacking-101", "android-malware-analysis", "annie", "anonforce", "anonymous", "anonymous-playground", 
  "anthem", "anti-reverse-engineering", "apiwizards-breach", "applied-crypto", "arachnophobia", "aratus", "archangel", 
  "aster", "athena", "atlas", "atlassian-cve-2022-26134", "atomic-bird-goes-purple-1", "atomic-bird-goes-purple-2", "atomic-red-team", 
  "attack-surface-reduction", "attackerkb", "attacking-ecb-oracle", "attacking-ics-plant-1", "attacking-ics-plant-2", "attacking-kerberos", 
  "attacking-llms", "auditing-and-monitoring", "autopsy", "av-evasion", "awesome-shellcode", "aware-online-banking", "azure-infrastructure-recon", 
  "azure-network-recon", "baby-encryption", "backtrack", "badbyte", "badbyte-2", "badbyte-3", "bancocorp", "baron-samedit", "basic-dynamic-analysis", "basic-malware-re", 
  "basic-pentesting", "basic-static-analysis", "berlin", "bible", "bicycle", "biohazard", "blizzard", "block", "blog", "blue", "blueprint", 
  "boiler-ctf", "bolt", "boogeyman-1", "boogeyman-2", "boogeyman-3", "bookstore", "borderlands", "bounty-hacker", "brainpan-1", 
  "brains", "brainstorm", "breaching-active-directory", "break-it", "breakout-the-cage", "breaking-crypto-the-simple-way", "breaking-rsa",
  "broken-authentication", "broken-espionage", "bounty-hacker-2", "brute-force-heros", "buffer-overflow", "buffer-overflow-prep", "bufov-prep", 
  "burp-suite-basics", "bypass-uac", "c2-deployment", "caldera", "candle", "cap", "capture", "carpe-diem-1", "casa-de-papel", "cat-pictures", 
  "catana", "cctv", "certified", "chain-of-thought", "chill-hack", "chromium", "cia", "cipher", "cloak", "cloud-security", 
  "cmess", "cobalt-strike", "cold-vivid", "collection", "common-attacks", "complaint", "compromising-active-directory", "confluence", 
  "connnect-the-dots", "content-discovery", "convertmyvideo", "corp", "cors-misconfig", "counter", "crack-the-hash", "crack-the-hash-2", 
  "crack-the-hash-3", "cryptography-basics", "cse", "cve-2021-1675", "cve-2021-41773", "cve-2022-26134", "cve-2022-30190", "cve-2023-23397", 
  "cve-2023-23752", "cve-2023-28252", "cve-2023-34362", "cve-2023-3519", "cve-2023-36884", "cve-2023-38831", "cve-2023-40044", "cve-2023-42793", 
  "cve-2024-1709", "cve-2024-23897", "cve-2024-24919", "cve-2024-27198", "cve-2024-3400", "cve-2024-4040", "cve-2024-4577", "cve-2024-49138", 
  "cve-2024-6387", "cve-2024-9474", "cve-2024-1086", "cyber-defense", "cyber-kill-chain", "cyberchef", "cyberheroes", "cyberlens", 
  "cybersecurity", "cybersecurity-101", "cypher", "daemon", "daily-bugle", "dante", "dark", "darkmatter", "data-exfiltration", 
  "data-structures", "database", "dav", "dead-end", "defensive-security", "defender", "dfir", "dfir-introduction", "dhcp-starvation", "dig-dug", "digital-forensics", "digital-forensics-essentials", "disgruntled", "dissecting-malware", "dns-in-detail", "dns-manipulation", "docker", "dogcat", "domino", "dumping-router-firmware", "eagle", "easy-peasy", "ebooks", "ecb-oracle", "election", "elf-cracking", "elude", "emergency", "encryption", "encryption-basics", "encryption-basics-2", "endian", "enterprise", "enumeration", "enumeration-101", "epoch", "espionage", "ethical-hacking", "evading-edr", "evading-ips", "event-management", "evidence", "exploring-active-directory", "exploring-splunk", "exploit-vulnerability", "exploitation", "exposure", "extractmyhash", "faux", "fawn", "fetch", "ffuf", "file-inclusion", "file-upload", "file-upload-vulnerabilities", "file-upload-vulns", "filesystem", "filipe", "final", "finale", "firewall", "flask", "flask-application", "follina", "forensics", "forensics-basics", "forensics-collection", "forensics-introduction", "forensics-101", "fortress", "framework", "frida", "ftk-imager", "full-attack", "full-attack-simulation", "funbox-1", "funbox-2", "funbox-3", "funbox-4", "fusion", "gameday", "game-zone", "gatekeeper", "gathering", "gdb", "gears", "general", "getting-started", "ghidra", "git-and-github", "git", "glitch", "glitches", "goldeneye", "google-dorking", "gpp-decrypt", "grace", "graph", "graphql", "greenhorn", "groovy", "h4cked", "hacker-vs-hacker", "hacking-with-powershell", "hacking-wifi", "halloween", "hammer", "hardening", "hashing", "haskell", "haskhell", "haystack", "hello", "hello-world", "hellfire", "hive", "hollywood", "honeypot", "honeybot", "honey", "host-discovery", "host-header-attacks", "how-to-use-burp-suite", "how-the-web-works", "hydra", "hypervisor", "ice", "ics", "ics-introduction", "ics-plant-1", "ics-plant-2", "incident-response", "infosec", "injection", "intro-to-digital-forensics", "intro-to-incident-response", "intro-to-malware-analysis", "intro-to-offensive-security", "intro-to-web-hacking", "intrusion-detection", "investigating", "ip", "ipsec", "ir", "it", "jaeger", "java", "jitter", "john", "john-the-ripper", "joomla", "jwt", "kali", "kernel", "kibana", "kill-chain", "kubernetes", "lateral-movement", "ldap", "learning", "learning-path", "leetspeak", "legacy", "lethe", "linux", "linux-agents", "linux-basics", "linux-fundamentals", "linux-privesc", "linux-process-analysis", "linux-security", "linux-server", "linux-essentials", "log-analysis", "log-poisoning", "logging", "logging-and-monitoring", "logging-basics", "log-management", "lor", "lucky", "lunar", "mac", "mac-forensics", "malware", "malware-analysis", "malware-intro", "malware-re", "malware-reverse-engineering", "malware-traffic", "malware-traffic-analysis", "maldoc", "malicious", "malicious-office", "man-in-the-middle", "manipulation", "mariadb", "mass-assignment", "metasploit", "metasploit-introduction", "mimikatz", "mobile", "mobile-analysis", "mobile-forensics", "mobile-hacking", "modbus", "monitoring", "mr-robot", "mysql", "nac", "narnia", "ncat", "net", "net-discovery", "netsec", "networks", "networking", "networking-basics", "networking-fundamentals", "network-security", "network-services", "nginx", "nmap", "nmap-basics", "nmap-post-portscan", "node", "nuclear", "nuclei", "obfuscation", "observation", "oauth", "object-injection", "obscure", "offensive", "offensive-security", "offline", "ohn", "ok", "old", "opsec", "opsec-introduction", "openvpn", "oracle", "osint", "osint-101", "osint-introduction", "owasp", "owasp-top-10", "palo-alto", "password-attacks", "password-cracking", "payloads", "pentesting", "pentesting-basics", "perimeter", "phishing", "phishing-analysis", "phish", "php", "php-reverse-shell", "php-vulnerabilities", "pivoting", "platform", "polkit", "port", "port-scanning", "post-exploitation", "powershell", "powershell-for-pentesters", "practice", "prevention", "privilege-escalation", "process", "process-analysis", "protection", "proxy", "pwn", "pwned", "python", "python-basics", "python-for-pentesters", "python-scripting", "qr", "qualys", "quick", "ransomware", "raspberry", "rat", "rce", "recon", "reconnaissance", "red-team", "redteam", "regex", "reverse", "reverse-engineering", "rfid", "ring", "riptide", "risk", "rm", "root", "routing", "rsa", "rt" , "s3", "saml", "sandbox", "sar", "scanning", "scylla", "security", "security-awareness", "security-operations", "segmentation", "selenium", "sherlock", "shell", "shellcode", "shellshock", "siem", "silver", "simulation", "smb", "smuggling", "snort", "soc", "social-engineering", "splunk", "sql", "sql-injection", "ssh", "ssl", "steganography", "struts", "subdomain", "supply-chain", "suricata", "suspicious", "syn", "sysadmin", "system", "systems", "terraform", "thm", "threat", "threat-hunting", "threat-intel", "time", "tls", "token", "training", "tunneling", "udp", "uac", "ubuntu", "ui", "unix", "upload", "url", "user", "user-enumeration", "utilities", "vagrant", "vault", "vba", "veeam", "version", "virtualization", "vmware", "vnc", "vpn", "vsphere", "waf", "web", "web-application", "web-hacking", "web-security", "web-enumeration", "web-exploitation", "websocket", "windows", "windows-server", "windows-internals", "wireless", "wireshark", "wmi", "word", "wordpress", "writeup", "xss", "yara", "yaml", "zap"
];

export const STORAGE_KEY = 'thm_career_mapper_rooms';
export const GIST_ID_KEY = 'thm_career_mapper_gist_id';
export const GITHUB_TOKEN_KEY = 'thm_career_mapper_github_token';
