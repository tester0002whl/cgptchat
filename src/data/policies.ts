export interface Policy {
  id: string;
  category: string;
  title: string;
  description: string;
  localizedExample: string;
}

export const policyCategories = [
  "Mission & Accountability",
  "Direct Democracy",
  "Legislative Renewal",
  "Economic Development & Jobs",
  "Healthcare Access",
  "Cost of Living Relief",
  "Transportation",
  "Environmental Protection",
  "Economic Guarantees",
  "Healthcare & Public Health",
  "Education & Opportunity",
  "Democracy & Government Reform",
  "Public Safety & Wellbeing",
  "Sustainable Future",
  "Digital Equity",
  "Veterans & Institutions",
  "Housing & Family Support",
  "Proven Models",
  "Foreign Policy",
  "Institutional Restoration & Accountability",
  "Civil Rights & Equality",
];

export const policies: Policy[] = [
  // Mission & Accountability
  {
    id: "I.1",
    category: "Mission & Accountability",
    title: "Mission: Reversing Decades of Damage",
    description: "Zero-donor, people-powered campaign",
    localizedExample: "Zero-donor, people-powered campaign",
  },
  {
    id: "I.2",
    category: "Mission & Accountability",
    title: "Accountability Pledge: Zero Corporate Influence",
    description: "No PAC/corporate donations, no stock trading",
    localizedExample: "No PAC/corporate donations, no stock trading",
  },
  {
    id: "I.3",
    category: "Mission & Accountability",
    title: "Accountability Pledge: Direct Democracy",
    description: "Fraud-proof district polling guides major votes",
    localizedExample: "Fraud-proof district polling guides major votes",
  },
  {
    id: "I.4",
    category: "Mission & Accountability",
    title: "Accountability Pledge: Term Commitment",
    description: "No career politics; focus on governing not fundraising",
    localizedExample: "No career politics; focus on governing not fundraising",
  },

  // Direct Democracy
  {
    id: "II.1",
    category: "Direct Democracy",
    title: "24/7 Digital Townhall (District-Only Input)",
    description: "Verified NJ-12 constituents only",
    localizedExample: "Verified NJ-12 constituents only",
  },
  {
    id: "II.2",
    category: "Direct Democracy",
    title: "Real-Time Democracy",
    description:
      "Constituents review bills, cast votes, see results before Congress votes",
    localizedExample:
      "Constituents review bills, cast votes, see results before Congress votes",
  },
  {
    id: "II.3",
    category: "Direct Democracy",
    title: "Transparency",
    description:
      "Explanations if Winston's vote ever diverges from NJ-12 consensus",
    localizedExample:
      "Explanations if Winston's vote ever diverges from NJ-12 consensus",
  },

  // Legislative Renewal
  {
    id: "III.1",
    category: "Legislative Renewal",
    title: "Repeal Harmful Laws",
    description: "Remove laws undermining middle-class prosperity",
    localizedExample: "Remove laws undermining middle-class prosperity",
  },
  {
    id: "III.2",
    category: "Legislative Renewal",
    title: "Direct Economic Compensation",
    description: "Compensate families harmed by failed policies",
    localizedExample: "Compensate families harmed by failed policies",
  },
  {
    id: "III.3",
    category: "Legislative Renewal",
    title: "Enforce Founding Promise",
    description:
      "Make 'Life, Liberty, Pursuit of Happiness' measurable economic standards",
    localizedExample:
      "Make 'Life, Liberty, Pursuit of Happiness' measurable economic standards",
  },
  {
    id: "III.4",
    category: "Legislative Renewal",
    title: "Fraud-Proof Oversight",
    description: "Townhall ensures accountability",
    localizedExample: "Townhall ensures accountability",
  },

  // Economic Development & Jobs
  {
    id: "IV.1.1",
    category: "Economic Development & Jobs",
    title: "Protect & Expand Small Businesses",
    description: "Support NJ-12 local businesses",
    localizedExample: "Support NJ-12 local businesses",
  },
  {
    id: "IV.1.2",
    category: "Economic Development & Jobs",
    title: "Infrastructure Investment",
    description: "Roads, bridges, broadband, water systems",
    localizedExample: "Roads, bridges, broadband, water systems",
  },
  {
    id: "IV.1.3",
    category: "Economic Development & Jobs",
    title: "College Affordability",
    description: "Student debt solutions",
    localizedExample: "Student debt solutions",
  },
  {
    id: "IV.1.4",
    category: "Economic Development & Jobs",
    title: "Support Working Families",
    description: "Youth employment and family support",
    localizedExample: "Youth employment and family support",
  },

  // Healthcare Access
  {
    id: "IV.2.1",
    category: "Healthcare Access",
    title: "Strengthen Medicare & Medicaid",
    description: "Expand access in NJ-12",
    localizedExample: "Expand access in NJ-12",
  },
  {
    id: "IV.2.2",
    category: "Healthcare Access",
    title: "Support Local Hospitals",
    description: "Trenton, New Brunswick, Princeton, Plainsboro",
    localizedExample: "Trenton, New Brunswick, Princeton, Plainsboro",
  },
  {
    id: "IV.2.3",
    category: "Healthcare Access",
    title: "Expand Mental Health Services",
    description: "Focus on underserved NJ-12 communities",
    localizedExample: "Focus on underserved NJ-12 communities",
  },
  {
    id: "IV.2.4",
    category: "Healthcare Access",
    title: "Cap Prescription Drug Prices",
    description: "Ensure affordability",
    localizedExample: "Ensure affordability",
  },

  // Cost of Living Relief
  {
    id: "IV.3.1",
    category: "Cost of Living Relief",
    title: "Address Property Tax Burden",
    description: "Ease NJ residents' costs",
    localizedExample: "Ease NJ residents' costs",
  },
  {
    id: "IV.3.2",
    category: "Cost of Living Relief",
    title: "Strengthen Social Security",
    description: "Double payments for livable retirements",
    localizedExample: "Double payments for livable retirements",
  },
  {
    id: "IV.3.3",
    category: "Cost of Living Relief",
    title: "Protect Retirement Security",
    description: "Guarantee stability for NJ-12 seniors",
    localizedExample: "Guarantee stability for NJ-12 seniors",
  },
  {
    id: "IV.3.4",
    category: "Cost of Living Relief",
    title: "Utility Rate Oversight",
    description: "Regulate NJ energy companies",
    localizedExample: "Regulate NJ energy companies",
  },
  {
    id: "IV.3.5",
    category: "Cost of Living Relief",
    title: "Affordable Housing Initiatives",
    description: "Middlesex, Mercer, Somerset counties",
    localizedExample: "Middlesex, Mercer, Somerset counties",
  },

  // Transportation
  {
    id: "IV.4.1",
    category: "Transportation",
    title: "Fix NJ Transit Reliability",
    description: "Improve on-time performance",
    localizedExample: "Improve on-time performance",
  },
  {
    id: "IV.4.2",
    category: "Transportation",
    title: "Safer Roads & Traffic",
    description: "Upgrade NJ-12 infrastructure",
    localizedExample: "Upgrade NJ-12 infrastructure",
  },
  {
    id: "IV.4.3",
    category: "Transportation",
    title: "Expand EV Charging",
    description: "Route 1 corridor & transit hubs",
    localizedExample: "Route 1 corridor & transit hubs",
  },
  {
    id: "IV.4.4",
    category: "Transportation",
    title: "Climate-Resilient Upgrades",
    description: "Flood-prone areas in NJ-12",
    localizedExample: "Flood-prone areas in NJ-12",
  },

  // Environmental Protection
  {
    id: "IV.5.1",
    category: "Environmental Protection",
    title: "Clean Energy Incentives",
    description: "Expand solar and wind in NJ-12",
    localizedExample: "Expand solar and wind in NJ-12",
  },
  {
    id: "IV.5.2",
    category: "Environmental Protection",
    title: "Protect Local Waterways",
    description: "Raritan River, Delaware River, Carnegie Lake",
    localizedExample: "Raritan River, Delaware River, Carnegie Lake",
  },
  {
    id: "IV.5.3",
    category: "Environmental Protection",
    title: "Climate Resiliency",
    description: "Protect against flooding and heat waves",
    localizedExample: "Protect against flooding and heat waves",
  },
  {
    id: "IV.5.4",
    category: "Environmental Protection",
    title: "Green Jobs Creation",
    description: "Solar, wind, efficiency industries",
    localizedExample: "Solar, wind, efficiency industries",
  },

  // Economic Opportunity
  { id: "V.1", category: "Economic Opportunity", title: "Raise Wages & Enforce Fair Pay", description: "Protect NJ-12 workers", localizedExample: "Protect NJ-12 workers" },
  { id: "V.2", category: "Economic Opportunity", title: "Expand Small-Business Support", description: "Strengthen NJ-12 downtowns and corridors", localizedExample: "Strengthen NJ-12 downtowns and corridors" },
  { id: "V.3", category: "Economic Opportunity", title: "Modernize Infrastructure & Create Jobs", description: "NJ-based infrastructure programs", localizedExample: "NJ-based infrastructure programs" },
  { id: "V.4", category: "Economic Opportunity", title: "Financial Protections", description: "Protect against predatory lending & price gouging", localizedExample: "Protect against predatory lending & price gouging" },
  { id: "V.5", category: "Economic Opportunity", title: "Workforce Development Pipelines", description: "Tech, clean energy, advanced manufacturing", localizedExample: "Tech, clean energy, advanced manufacturing" },
  { id: "V.6", category: "Economic Opportunity", title: "Student Loan Solutions", description: "Relief for NJ-12 students", localizedExample: "Relief for NJ-12 students" },
  { id: "V.7", category: "Economic Opportunity", title: "Close Corporate Tax Loopholes", description: "Tie incentives to NJ job creation", localizedExample: "Tie incentives to NJ job creation" },
  { id: "V.8", category: "Economic Opportunity", title: "Protect Unions & Labor Rights", description: "Strengthen NJ-12 workforce", localizedExample: "Strengthen NJ-12 workforce" },
  { id: "V.9", category: "Economic Opportunity", title: "Public Banking Model", description: "NJ-style public bank for small business loans", localizedExample: "NJ-style public bank for small business loans" },
  { id: "V.10", category: "Economic Opportunity", title: "Civil Service Protections", description: "Defend government workforce", localizedExample: "Defend government workforce" },
  { id: "V.11", category: "Economic Opportunity", title: "Criminalize Supply Side Economics", description: "50-year clawback of Reaganomics failed trickle-down wealth concentration", localizedExample: "Reverse wealth transfer from criminal trickle-down economics to un-billionaire wealth concentration kingpins" },

  // Healthcare & Public Health
  { id: "VI.1", category: "Healthcare & Public Health", title: "Single-Payer (Medicare-for-All)", description: "Universal, comprehensive coverage with no premiums or copays at point of care; free provider choice; negotiated drug and provider rates; funded via progressive taxes.", localizedExample: "Guarantee care for every NJ-12 resident while lowering total costs through simplified administration and bulk negotiation." },
  { id: "VI.2", category: "Healthcare & Public Health", title: "Cap Prescription Drug Prices", description: "Negotiate lower prices", localizedExample: "Negotiate lower prices" },
  { id: "VI.3", category: "Healthcare & Public Health", title: "Expand Preventive Care & Clinics", description: "NJ-12 communities", localizedExample: "NJ-12 communities" },
  { id: "VI.4", category: "Healthcare & Public Health", title: "Restore CDC/NIH Funding", description: "Strengthen research & preparedness", localizedExample: "Strengthen research & preparedness" },
  { id: "VI.5", category: "Healthcare & Public Health", title: "Pandemic Preparedness", description: "Invest in immunization programs", localizedExample: "Invest in immunization programs" },
  { id: "VI.6", category: "Healthcare & Public Health", title: "Protect Reproductive Health", description: "Guarantee abortion access", localizedExample: "Guarantee abortion access" },
  { id: "VI.7", category: "Healthcare & Public Health", title: "Expand Vaccine Access", description: "Local education & outreach in NJ-12", localizedExample: "Local education & outreach in NJ-12" },

  // Education & Opportunity
  { id: "VII.1", category: "Education & Opportunity", title: "Increase Teacher Pay", description: "Enforce pay equity in NJ schools", localizedExample: "Enforce pay equity in NJ schools" },
  { id: "VII.2", category: "Education & Opportunity", title: "Protect K–12 Public School Funding", description: "Stop cuts in NJ-12 districts", localizedExample: "Stop cuts in NJ-12 districts" },
  { id: "VII.3", category: "Education & Opportunity", title: "Expand Pre-K & Childcare Access", description: "NJ-12 families", localizedExample: "NJ-12 families" },
  { id: "VII.4", category: "Education & Opportunity", title: "College Affordability & Loan Reform", description: "Reduce NJ-12 student debt", localizedExample: "Reduce NJ-12 student debt" },
  { id: "VII.5", category: "Education & Opportunity", title: "Expand Community College & Vocational Training", description: "Middlesex, Mercer, Somerset programs", localizedExample: "Middlesex, Mercer, Somerset programs" },
  { id: "VII.6", category: "Education & Opportunity", title: "Protect TRIO & GEAR UP Programs", description: "Support disadvantaged students", localizedExample: "Support disadvantaged students" },
  { id: "VII.7", category: "Education & Opportunity", title: "Expand Digital Literacy Programs", description: "NJ-12 schools & libraries", localizedExample: "NJ-12 schools & libraries" },
  { id: "VII.8", category: "Education & Opportunity", title: "Protect DEI Initiatives", description: "Block federal rollbacks", localizedExample: "Block federal rollbacks" },

  // Democracy & Government Reform
  { id: "VIII.1", category: "Democracy & Government Reform", title: "Right to Vote Amendment", description: "Guarantee nationwide voting rights", localizedExample: "Guarantee nationwide voting rights" },
  { id: "VIII.2", category: "Democracy & Government Reform", title: "Strengthen Voting Rights Act", description: "Restore protections", localizedExample: "Restore protections" },
  { id: "VIII.3", category: "Democracy & Government Reform", title: "Make Voting Easier", description: "Early voting, registration, holiday, language, Voatz - Blockchain/Mobile", localizedExample: "Early voting, registration, holiday, language, Voatz - Blockchain/Mobile" },
  { id: "VIII.4", category: "Democracy & Government Reform", title: "Independent Redistricting", description: "End gerrymandering", localizedExample: "End gerrymandering" },
  { id: "VIII.5", category: "Democracy & Government Reform", title: "Overturn Citizens United", description: "Ban dark money", localizedExample: "Ban dark money" },
  { id: "VIII.6", category: "Democracy & Government Reform", title: "Support Ranked-Choice Voting", description: "Fairer elections", localizedExample: "Fairer elections" },
  { id: "VIII.7", category: "Democracy & Government Reform", title: "Abolish/Neutralize Electoral College", description: "National Popular Vote Interstate Compact", localizedExample: "National Popular Vote Interstate Compact" },
  { id: "VIII.8", category: "Democracy & Government Reform", title: "Term Limits", description: "18-year limits for Congress & Supreme Court", localizedExample: "18-year limits for Congress & Supreme Court" },
  { id: "VIII.9", category: "Democracy & Government Reform", title: "Statehood for DC & Puerto Rico", description: "Equal representation", localizedExample: "Equal representation" },
  { id: "VIII.10", category: "Democracy & Government Reform", title: "DOJ Independence", description: "Limit presidential immunity", localizedExample: "Limit presidential immunity" },

  // Public Safety & Wellbeing
  { id: "IX.1", category: "Public Safety & Wellbeing", title: "24/7 Mental-Health Crisis Response", description: "NJ-12 counties", localizedExample: "NJ-12 counties" },
  { id: "IX.2", category: "Public Safety & Wellbeing", title: "Gun Violence Prevention", description: "Public health approach", localizedExample: "Public health approach" },
  { id: "IX.3", category: "Public Safety & Wellbeing", title: "Community-Centered Policing", description: "Civilian oversight in NJ-12", localizedExample: "Civilian oversight in NJ-12" },
  { id: "IX.4", category: "Public Safety & Wellbeing", title: "Trauma Recovery Support", description: "Survivor assistance programs", localizedExample: "Survivor assistance programs" },
  { id: "IX.5", category: "Public Safety & Wellbeing", title: "Neighborhood Investment", description: "Parks, walkable streets, food access in NJ-12", localizedExample: "Parks, walkable streets, food access in NJ-12" },

  // Sustainable Future
  { id: "X.1", category: "Sustainable Future", title: "Clean Energy Job Pipelines", description: "Rutgers & Mercer County College programs", localizedExample: "Rutgers & Mercer County College programs" },
  { id: "X.2", category: "Sustainable Future", title: "Lower Utility Bills", description: "Efficiency & weatherization programs", localizedExample: "Efficiency & weatherization programs" },
  { id: "X.3", category: "Sustainable Future", title: "Expand Solar & Wind", description: "New Jersey renewables", localizedExample: "New Jersey renewables" },
  { id: "X.4", category: "Sustainable Future", title: "Heat Resilience", description: "Tree canopy & cooling centers in NJ-12 cities", localizedExample: "Tree canopy & cooling centers in NJ-12 cities" },
  { id: "X.5", category: "Sustainable Future", title: "Replace Lead Service Lines", description: "NJ-12 schools & homes", localizedExample: "NJ-12 schools & homes" },
  { id: "X.6", category: "Sustainable Future", title: "Pollution Enforcement", description: "Hold NJ polluters accountable", localizedExample: "Hold NJ polluters accountable" },
  { id: "X.7", category: "Sustainable Future", title: "Transit Electrification", description: "NJ Transit buses & trains", localizedExample: "NJ Transit buses & trains" },
  { id: "X.8", category: "Sustainable Future", title: "Flood-Resilient Infrastructure", description: "Bound Brook, Manville retrofits", localizedExample: "Bound Brook, Manville retrofits" },
  { id: "X.9", category: "Sustainable Future", title: "Upgrade NJ Electric Grid", description: "Battery storage & microgrids", localizedExample: "Battery storage & microgrids" },
  { id: "X.10", category: "Sustainable Future", title: "Protect NJ Water Rights", description: "Ensure affordability & access", localizedExample: "Ensure affordability & access" },

  // Digital Equity
  { id: "XI.1", category: "Digital Equity", title: "Expand Broadband Access", description: "Underserved NJ-12 neighborhoods", localizedExample: "Underserved NJ-12 neighborhoods" },
  { id: "XI.2", category: "Digital Equity", title: "Digital Equity Grants", description: "Low-income NJ-12 families  - digital inclusion for all", localizedExample: "Low-income NJ-12 families  - digital inclusion for all" },
  { id: "XI.3", category: "Digital Equity", title: "Municipal Broadband Options", description: "NJ local models", localizedExample: "NJ local models" },

  // Veterans & Institutions
  { id: "XII.1", category: "Veterans & Institutions", title: "Protect VA Staffing & Services", description: "NJ veterans", localizedExample: "NJ veterans" },
  { id: "XII.2", category: "Veterans & Institutions", title: "Guarantee VA Healthcare Quality", description: "Improve NJ facilities", localizedExample: "Improve NJ facilities" },
  { id: "XII.3", category: "Veterans & Institutions", title: "Oppose USPS Privatization", description: "Protect universal service", localizedExample: "Protect universal service" },
  { id: "XII.4", category: "Veterans & Institutions", title: "Defend Public Institutions", description: "Block privatization schemes", localizedExample: "Block privatization schemes" },

  // Housing & Family Support
  { id: "XIII.1", category: "Housing & Family Support", title: "Expand Affordable Housing", description: "NJ-12 projects", localizedExample: "NJ-12 projects" },
  { id: "XIII.2", category: "Housing & Family Support", title: "Strengthen Renter Protections", description: "Tenant rights in NJ", localizedExample: "Tenant rights in NJ" },
  { id: "XIII.3", category: "Housing & Family Support", title: "Support First-Time Homebuyers", description: "Fair financing for NJ-12 families", localizedExample: "Fair financing for NJ-12 families" },
  { id: "XIII.4", category: "Housing & Family Support", title: "Paid Family & Medical Leave", description: "Federal standard for all NJ families", localizedExample: "Federal standard for all NJ families" },
  { id: "XIII.5", category: "Housing & Family Support", title: "Expand Medicare Home & Community Services", description: "Tax relief for NJ family caregivers", localizedExample: "Tax relief for NJ family caregivers" },
  { id: "XIII.6", category: "Housing & Family Support", title: "Double Social Security Payments", description: "Guarantee livable retirement income", localizedExample: "Guarantee livable retirement income" },

  // Proven Models
  { id: "XIV.1", category: "Proven Models", title: "Participatory Budgeting", description: "Adapt NYC/Chicago models for NJ-12 townhall", localizedExample: "Adapt NYC/Chicago models for NJ-12 townhall" },
  { id: "XIV.2", category: "Proven Models", title: "Universal Pre-K", description: "Tulsa-inspired expansion for NJ-12", localizedExample: "Tulsa-inspired expansion for NJ-12" },
  { id: "XIV.3", category: "Proven Models", title: "Municipal Broadband", description: "Chattanooga-style for NJ towns", localizedExample: "Chattanooga-style for NJ towns" },
  { id: "XIV.4", category: "Proven Models", title: "Guaranteed Basic Income Pilots", description: "Tested in Oakland/Minneapolis; adapt for NJ-12", localizedExample: "Tested in Oakland/Minneapolis; adapt for NJ-12" },
  { id: "XIV.5", category: "Proven Models", title: "Scandinavian Health & Leave Models", description: "Benchmark parental leave & care policies", localizedExample: "Benchmark parental leave & care policies" },
  { id: "XIV.6", category: "Proven Models", title: "NYC Care Model", description: "Adapt for NJ-12 uninsured families", localizedExample: "Adapt for NJ-12 uninsured families" },

  // Foreign Policy
  { id: "XV.1", category: "Foreign Policy", title: "End Endless Wars & Reassert War Powers", description: "No unauthorized wars; repeal outdated AUMFs; Congress must authorize force", localizedExample: "Constituent-guided votes to end unauthorized conflicts" },
  { id: "XV.2", category: "Foreign Policy", title: "Ceasefire & Diplomacy-First in the Middle East", description: "Immediate ceasefires, surge humanitarian aid, and robust diplomacy to save lives", localizedExample: "Back UN-led ceasefires and protected aid corridors" },
  { id: "XV.3", category: "Foreign Policy", title: "Two-State Solution on 1967 Borders", description: "Rights-respecting two-state solution with security, equality, and an end to settlement expansion", localizedExample: "Oppose annexation; support negotiations grounded in international law" },
  { id: "XV.4", category: "Foreign Policy", title: "Condition Military Aid on Human Rights", description: "Enforce Leahy Laws; no blank checks for rights violators", localizedExample: "Human-rights benchmarks tied to any military assistance" },
  { id: "XV.5", category: "Foreign Policy", title: "Revive Nuclear Diplomacy with Iran", description: "Return to verifiable non-proliferation agreements via diplomacy, not war", localizedExample: "Compliance-for-sanctions relief framework (JCPOA-style)" },
  { id: "XV.6", category: "Foreign Policy", title: "End U.S. Support for the Yemen War", description: "Halt arms and logistical support for offensive operations; push for inclusive peace talks", localizedExample: "War Powers votes to end participation in hostilities" },
  { id: "XV.7", category: "Foreign Policy", title: "Audit the Pentagon & Cut Waste", description: "Independent audit, rein in contractor price-gouging, redirect savings to people-first investments", localizedExample: "Savings to healthcare, housing, and education in NJ-12" },
  { id: "XV.8", category: "Foreign Policy", title: "Nuclear Arms Reduction & No-First-Use", description: "Revive arms control, reduce stockpiles, and adopt a no-first-use policy", localizedExample: "Extend and expand New START-style agreements" },
  { id: "XV.9", category: "Foreign Policy", title: "Invest in Development Over Regime Change", description: "Scale global health, education, and climate finance instead of militarized interventions", localizedExample: "Green Climate Fund contributions and debt relief" },
  { id: "XV.10", category: "Foreign Policy", title: "Refugee Resettlement & Human Rights", description: "Restore asylum, expand resettlement, and protect dissidents and journalists", localizedExample: "Faster family reunification for NJ-12 residents" },
  { id: "XV.11", category: "Foreign Policy", title: "Stop Arms Sales to Rights Abusers", description: "Block exports to governments committing war crimes or severe repression", localizedExample: "Tighten end-use monitoring and accountability" },
  { id: "XV.12", category: "Foreign Policy", title: "Trade for Workers & the Climate", description: "High labor and climate standards; oppose ISDS that undermines democracy", localizedExample: "Align trade with clean energy supply chains and fair wages" },
  { id: "XV.13", category: "Foreign Policy", title: "Ukraine: Support with Oversight & Diplomacy", description: "Aid paired with anti-corruption oversight, full border integrity including Crimea, NATO membership path, harsh Russia sanctions", localizedExample: "Transparency safeguards, sovereignty support, and containment strategy" },
  { id: "XV.14", category: "Foreign Policy", title: "Global Digital Rights & Privacy", description: "Defend privacy, human rights, and prevent export of mass-surveillance tools", localizedExample: "Human-rights due diligence for U.S. technology exports" },

  // Institutional Restoration & Accountability
  { id: "XVI.1", category: "Institutional Restoration & Accountability", title: "Post-Authoritarian Government Restoration", description: "Comprehensive institutional cleanup and democratic renewal following authoritarian damage", localizedExample: "Truth & reconciliation commission to document institutional corruption" },
  { id: "XVI.2", category: "Institutional Restoration & Accountability", title: "Congressional Accountability Hearings", description: "Full investigation of institutional failures and democratic backsliding", localizedExample: "House & Senate hearings on regulatory capture and corruption" },
  { id: "XVI.3", category: "Institutional Restoration & Accountability", title: "Judicial System Restoration", description: "Restore independence and accountability to federal courts", localizedExample: "Ethics enforcement for Supreme Court and federal judiciary" },
  { id: "XVI.4", category: "Institutional Restoration & Accountability", title: "DOJ Independence & Reform", description: "Restore Department of Justice independence and prosecutorial integrity", localizedExample: "Strengthen special counsel protections and civil rights enforcement" },
  { id: "XVI.5", category: "Institutional Restoration & Accountability", title: "Regulatory Agency Restoration", description: "Rebuild captured agencies and restore public interest mission", localizedExample: "Purge industry influence from EPA, FCC, and financial regulators" },
  { id: "XVI.6", category: "Institutional Restoration & Accountability", title: "Government Ethics Enforcement", description: "Strengthen ethics rules and enforcement mechanisms", localizedExample: "Mandatory financial disclosure and conflict-of-interest penalties" },
  { id: "XVI.7", category: "Institutional Restoration & Accountability", title: "Democracy Protection Laws", description: "Legislation to prevent future authoritarian capture", localizedExample: "Anti-corruption amendments and democracy protection acts" },

  // Civil Rights & Equality
  { id: "XVII.1", category: "Civil Rights & Equality", title: "EEOC-Rooted Civil Rights & Equality Enforcement (Disparate Impact)", description: "Aggressive statutory EEOC enforcement using the Disparate Impact framework; proactive investigations and audits; meaningful penalties; expand and explicitly protect LGBTQ+ people across employment, housing, education, and healthcare; align DEI practices to enforceable EEOC standards with real teeth, not voluntary vibes.", localizedExample: "Launch proactive EEOC audits for major NJ-12 employers and institutions; require disparate-impact reporting; codify LGBTQ+ equal protection across workplaces, housing, schools, and healthcare access." },
];
