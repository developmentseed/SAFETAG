---
activities:
  - Manual Reconnaissance
  - Automated Reconnaisance
  - Website Footprinting
  - DNS Enumeration
authors:
  - SAFETAG
info_provided: []
info_required: []
references:
  - Open Source Intelligence (General)
  - Organizational Information Gathering
  - Searching
  - Pastebin Searching
  - Recon-ng
title: Reconnaissance
summary: >
  The remote assessment methodology focuses on direct observation of an
  organization and their infrastructure, consisting of passive reconnaissance of
  publicly available data sources ("Open Source Intelligence") This allows the
  auditor to identify publicly available resources (such as websites, extranets,
  email servers, but also social media information) connected to the
  organization and remotely gather information about those resources.
purpose: >

  While much of SAFETAG focuses on digital security challenges within and around
  the office,  unintended information available from "open sources" can pose
  real threats and deserve significant attention.  This also builds the
  Auditor's understanding of the organization's digital presence  and will guide
  specific vulnerabilities to investigate once on site.
guiding_questions: >

  * Depending on the organization's security needs, does it "leak" any sensitive
  information online (location, staff identities, program locations?)

  * Can you identify partners or beneficiaries through the organizations sites?

  * What is the pattern for staff e-mail addresses?

  * Have any of the the organization's servers, users, or e-mail accounts been
  compromised in the past?

  * Are executive / staff social media accounts in scope, and if so, are they
  compliant with the organizational social media policies? What additional
  threats do they introduce?
approaches: >
  * **Manual OSINT:** Identify availability of partner, beneficiary, and current
  project information online using advanced Google searching and
  website-scraping. [^PETS_logical_intel]

  * **Recon-NG:** Use recon-ng to do automated web-based open source
  reconnaissance. [^recon-ng_data_flow]

  * **Social Network OSINT:** Identify availability of staff partner,
  beneficiary, and current project information by searching social networks for
  information leaked about the organization.
preparation: |-

  This Section:

    * does not require privileged access to the organization's offices, infrastructure or staff;
    * relies primarily on third-party data sources and observation and light probing of the organization’s infrastructure;
    * can generally be carried out from any secure Internet connection.
---
