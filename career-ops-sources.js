const careerOpsSources = [
  {
    "id": "career_ops_us_indeed_remote_ai_implementation",
    "name": "Indeed — US Remote AI Implementation",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:indeed.com/jobs \"remote\" \"AI\" \"implementation\" OR \"solutions engineer\" OR \"customer engineer\" US",
    "country": "US",
    "notes": "US mainstream job board. Uses site-scoped search because direct board scraping can be fragile. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_dice_ai_cloud_devops",
    "name": "Dice — US Tech / Cloud / AI",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:dice.com/jobs \"remote\" \"AI\" OR \"cloud\" OR \"DevOps\" OR \"solutions engineer\" US",
    "country": "US",
    "notes": "US tech job board. Dice supports search by title, skills, location, and remote work settings. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_glassdoor_ai_implementation",
    "name": "Glassdoor — US AI Implementation",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:glassdoor.com/Job \"remote\" \"AI\" \"implementation\" OR \"solutions architect\" OR \"systems engineer\" US",
    "country": "US",
    "notes": "US mainstream job board and company review site. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_linkedin_ai_solutions",
    "name": "LinkedIn Jobs — US AI Solutions",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:linkedin.com/jobs \"remote\" \"AI\" \"solutions engineer\" OR \"implementation specialist\" OR \"customer engineer\" US",
    "country": "US",
    "notes": "US LinkedIn Jobs results. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_ziprecruiter_ai_implementation",
    "name": "ZipRecruiter — US AI Implementation",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:ziprecruiter.com/jobs \"remote\" \"AI\" \"implementation\" OR \"solutions engineer\" OR \"DevOps\" US",
    "country": "US",
    "notes": "US mainstream job board. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_monster_tech_remote",
    "name": "Monster — US Remote Tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:monster.com/job-openings \"remote\" \"AI\" OR \"cloud\" OR \"systems engineer\" OR \"solutions engineer\" US",
    "country": "US",
    "notes": "US mainstream job board. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_careerbuilder_tech_remote",
    "name": "CareerBuilder — US Remote Tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:careerbuilder.com/job \"remote\" \"AI\" OR \"cloud\" OR \"DevOps\" OR \"implementation\" US",
    "country": "US",
    "notes": "US mainstream job board. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_builtin_ai_cloud",
    "name": "Built In — US AI / Cloud",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:builtin.com/jobs \"remote\" \"AI\" OR \"cloud\" OR \"solutions engineer\" OR \"implementation\" US",
    "country": "US",
    "notes": "US tech/startup job board. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_wellfound_ai_startups",
    "name": "Wellfound — US AI Startups",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:wellfound.com/jobs \"remote\" \"AI\" \"implementation\" OR \"solutions engineer\" OR \"founding\" US",
    "country": "US",
    "notes": "US startup job marketplace. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_flexjobs_remote_tech",
    "name": "FlexJobs — US Remote Tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:flexjobs.com \"remote\" \"AI\" OR \"DevOps\" OR \"cloud\" OR \"implementation\" US",
    "country": "US",
    "notes": "Remote-focused US job board. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_simplyhired_remote_tech",
    "name": "SimplyHired — US Remote Tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:simplyhired.com/search \"remote\" \"AI\" OR \"DevOps\" OR \"cloud\" OR \"implementation\" US",
    "country": "US",
    "notes": "US mainstream job search site. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_themuse_ai_tech",
    "name": "The Muse — US AI / Tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:themuse.com/jobs \"remote\" \"AI\" OR \"cloud\" OR \"solutions engineer\" OR \"implementation\" US",
    "country": "US",
    "notes": "US job and company discovery site. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_levels_fyi_tech",
    "name": "Levels.fyi Jobs — US Tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:levels.fyi/jobs \"remote\" \"AI\" OR \"cloud\" OR \"DevOps\" OR \"systems\" US",
    "country": "US",
    "notes": "US tech job listings and compensation-oriented job search. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_usajobs_2210_it_remote",
    "name": "USAJOBS — 2210 IT / Remote",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:usajobs.gov/job \"2210\" \"remote\" OR \"information technology specialist\" OR \"IT specialist\"",
    "country": "US",
    "notes": "Official US federal job portal. USAJOBS supports keyword/location search and remote filtering. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_usajobs_ai_automation",
    "name": "USAJOBS — AI / Automation",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:usajobs.gov/job \"artificial intelligence\" OR \"automation\" OR \"cloud\" OR \"DevOps\" \"remote\"",
    "country": "US",
    "notes": "Official US federal job portal. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_usajobs_cyber_cloud",
    "name": "USAJOBS — Cyber / Cloud",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:usajobs.gov/job \"cybersecurity\" OR \"cloud\" OR \"systems administrator\" OR \"DevOps\" \"remote\"",
    "country": "US",
    "notes": "Official US federal job portal for cyber, cloud, and systems roles. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_intelligence_careers_tech",
    "name": "Intelligence Careers — US Tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:intelligencecareers.gov \"information technology\" OR \"systems\" OR \"cloud\" OR \"cyber\"",
    "country": "US",
    "notes": "Official US intelligence community careers site. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_cisa_careers_cyber",
    "name": "CISA Careers — Cyber / Infrastructure",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:cisa.gov/careers \"cyber\" OR \"cloud\" OR \"infrastructure\" OR \"information technology\"",
    "country": "US",
    "notes": "Official CISA careers source for US cyber and infrastructure roles. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_dhs_careers_tech",
    "name": "DHS Careers — Tech / Cyber",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:dhs.gov/homeland-security-careers \"cyber\" OR \"information technology\" OR \"cloud\" OR \"systems\"",
    "country": "US",
    "notes": "Official DHS careers source. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_gsa_tts_careers",
    "name": "GSA / TTS — Digital Government",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:gsa.gov OR site:tts.gsa.gov \"careers\" \"cloud\" OR \"DevOps\" OR \"digital services\" OR \"automation\"",
    "country": "US",
    "notes": "Official US government digital services and GSA/TTS career searches. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_us_va_oit_careers",
    "name": "VA OIT — US Tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:va.gov OR site:digital.va.gov \"careers\" \"information technology\" OR \"cloud\" OR \"DevOps\" OR \"systems\"",
    "country": "US",
    "notes": "Official VA technology and digital careers search. Search method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_query_ashby_ai_pm",
    "name": "Ashby — AI PM",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:jobs.ashbyhq.com \"AI Product Manager\" OR \"Senior Product Manager AI\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_ashby_solutions_architect",
    "name": "Ashby — Solutions Architect",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:jobs.ashbyhq.com \"Solutions Architect\" AI OR automation remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_ashby_ai_engineer",
    "name": "Ashby — AI Engineer",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:jobs.ashbyhq.com \"AI Engineer\" OR \"LLM Engineer\" OR \"Forward Deployed\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_ashby_agentic",
    "name": "Ashby — Agentic",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:jobs.ashbyhq.com \"Agentic\" OR \"AI Agent\" OR \"Automation Architect\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_greenhouse_ai_pm",
    "name": "Greenhouse — AI PM",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:boards.greenhouse.io OR site:job-boards.greenhouse.io \"AI Product Manager\" OR \"Senior Product Manager\" AI remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_greenhouse_sa_fde",
    "name": "Greenhouse — SA & FDE",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:boards.greenhouse.io OR site:job-boards.greenhouse.io \"Solutions Architect\" OR \"Forward Deployed\" AI remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_greenhouse_ai_engineer",
    "name": "Greenhouse — AI Engineer",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:boards.greenhouse.io OR site:job-boards.greenhouse.io \"AI Engineer\" OR \"LLM\" OR \"Agentic\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_workable_ai_roles",
    "name": "Workable — AI Roles",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:apply.workable.com \"AI\" \"Product Manager\" OR \"Solutions Architect\" OR \"AI Engineer\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_ashby_no_code_automation",
    "name": "Ashby — No-Code & Automation",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:jobs.ashbyhq.com \"no-code\" OR \"low-code\" OR \"automation engineer\" OR \"n8n\" OR \"Make\" OR \"Airtable\" remote senior",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_greenhouse_no_code_automation",
    "name": "Greenhouse — No-Code & Automation",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:job-boards.greenhouse.io \"no-code\" OR \"low-code\" OR \"automation engineer\" OR \"business systems\" senior remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_gtm_engineer_all_portals",
    "name": "GTM Engineer — All portals",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "\"GTM Engineer\" OR \"RevOps Engineer\" OR \"Growth Engineer\" automation Airtable OR Make OR Clay remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_voice_ai_fde_sa",
    "name": "Voice AI — FDE & SA",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:job-boards.greenhouse.io OR site:jobs.ashbyhq.com \"Voice AI\" OR \"Conversational AI\" OR \"Speech\" \"Solutions\" OR \"Forward Deployed\" OR \"Customer Engineer\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_voice_ai_ai_engineer",
    "name": "Voice AI — AI Engineer",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:job-boards.greenhouse.io OR site:jobs.ashbyhq.com \"Voice\" OR \"Speech\" \"AI Engineer\" OR \"Deployment\" OR \"Integration\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_contact_center_ai_sa_se",
    "name": "Contact Center AI — SA & SE",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "\"contact center\" OR \"customer service\" \"AI\" \"Solutions Architect\" OR \"Solutions Engineer\" OR \"Forward Deployed\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_fde_deployed_engineer_all_portals",
    "name": "FDE & Deployed Engineer — All portals",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "\"Forward Deployed Engineer\" OR \"Deployed Engineer\" OR \"Deployment Engineer\" AI site:job-boards.greenhouse.io OR site:jobs.ashbyhq.com OR site:jobs.lever.co",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_remotive_ai_devrel_sa_fde",
    "name": "Remotive — AI/DevRel/SA/FDE",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:remotive.com \"AI Engineer\" OR \"Developer Advocate\" OR \"Solutions Architect\" OR \"Forward Deployed\" OR \"DevRel\" Europe",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_weworkremotely_ai_dx",
    "name": "WeWorkRemotely — AI & DX",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:weworkremotely.com \"AI\" OR \"DevRel\" OR \"Solutions Engineer\" OR \"Forward Deployed\" OR \"Founding Engineer\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_working_nomads_ai_devrel_sa",
    "name": "Working Nomads — AI/DevRel/SA",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:workingnomads.com \"AI Engineer\" OR \"Developer Advocate\" OR \"Solutions Architect\" OR \"Forward Deployed\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_eu_remote_jobs_ai_devrel_sa",
    "name": "EU Remote Jobs — AI/DevRel/SA",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:euremotejobs.com \"AI\" OR \"DevRel\" OR \"Solutions Architect\" OR \"Forward Deployed\" OR \"Founding Engineer\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_remoteok_ai_devrel_sa",
    "name": "RemoteOK — AI/DevRel/SA",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:remoteok.com \"AI Engineer\" OR \"Developer Advocate\" OR \"Solutions Architect\" OR \"Forward Deployed\" OR \"Founding Engineer\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_ai_jobs_net_devrel_sa_fde",
    "name": "ai-jobs.net — DevRel/SA/FDE",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:ai-jobs.net \"Developer Advocate\" OR \"Solutions Architect\" OR \"Forward Deployed\" OR \"DevRel\" remote Europe",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_ai_jobs_net_founding_applied_ai",
    "name": "ai-jobs.net — Founding/Applied AI",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:ai-jobs.net \"Founding Engineer\" OR \"Applied AI Engineer\" OR \"Founding\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_fwddeploy_com_forward_deployed_roles",
    "name": "fwddeploy.com — Forward Deployed roles",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:fwddeploy.com \"Forward Deployed\" OR \"Deployed Engineer\" remote Europe OR EMEA",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_yc_jobs_devrel_sa_fde_founding",
    "name": "YC Jobs — DevRel/SA/FDE/Founding",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:ycombinator.com/jobs OR site:workatastartup.com \"Forward Deployed\" OR \"Developer Advocate\" OR \"Founding Engineer\" OR \"Solutions Architect\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_yc_jobs_applied_ai",
    "name": "YC Jobs — Applied AI",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:workatastartup.com \"Applied AI\" OR \"AI Engineer\" OR \"AI Agent\" remote Europe",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_manfred_tech_senior_espa_a",
    "name": "Manfred — Tech Senior España",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:getmanfred.com/en/job-offers \"Solutions Architect\" OR \"DevRel\" OR \"Forward Deployed\" OR \"AI Engineer\" OR \"Founding\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_manfred_remote_ai_senior",
    "name": "Manfred — Remote AI/Senior",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:getmanfred.com \"remote\" \"AI\" OR \"Senior\" OR \"Staff\" OR \"Lead\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_tecnoempleo_espa_a_it",
    "name": "Tecnoempleo — España IT",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:tecnoempleo.com \"AI Engineer\" OR \"Solutions Architect\" OR \"DevRel\" OR \"Forward Deployed\" OR \"Founding Engineer\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_tecnoempleo_remoto_senior",
    "name": "Tecnoempleo — Remoto Senior",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:tecnoempleo.com \"remoto\" OR \"remote\" Senior \"AI\" OR \"Architect\" OR \"Lead\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_jobfluent_spain_startups",
    "name": "JobFluent — Spain startups",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:jobfluent.com Madrid OR Barcelona \"AI\" OR \"Engineer\" OR \"Solutions\" OR \"DevRel\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_welcome_to_the_jungle_spain_tech",
    "name": "Welcome to the Jungle — Spain tech",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:welcometothejungle.com Spain OR Madrid OR Barcelona \"AI Engineer\" OR \"Solutions Architect\" OR \"DevRel\" OR \"Forward Deployed\"",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_devrelx_jobs",
    "name": "DevRelX Jobs",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:devrelx.com/jobs remote OR Europe OR EMEA",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_trueup_devrel_roles",
    "name": "TrueUp — DevRel roles",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:trueup.io/devrel OR site:trueup.io \"Developer Advocate\" OR \"DevRel\" remote Europe",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_remote_rocketship_devrel",
    "name": "Remote Rocketship — DevRel",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:remoterocketship.com/jobs/developer-relations OR site:remoterocketship.com \"DevRel\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_devrel_job_board",
    "name": "DevRel Job board",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:devreljob.com remote OR Europe OR EMEA",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_himalayas_remote_ai_dev_tools",
    "name": "Himalayas — Remote AI/Dev-tools",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:himalayas.app \"AI Engineer\" OR \"Solutions Architect\" OR \"Developer Advocate\" OR \"Forward Deployed\" OR \"Founding Engineer\" Europe",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_jooble_espa_a_tech_senior",
    "name": "Jooble — España Tech Senior",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:jooble.org \"AI Engineer\" OR \"Solutions Architect\" OR \"DevRel\" Madrid OR remote España",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_eu_data_jobs_ai_ml_europe",
    "name": "EU Data Jobs — AI/ML Europe",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:eudatajobs.com \"AI\" OR \"ML\" OR \"Data\" \"Engineer\" OR \"Architect\" remote Europe",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_query_hn_who_s_hiring_remote_ai",
    "name": "HN Who's Hiring — Remote AI",
    "type": "Search",
    "url": "https://www.google.com/search?q={query}",
    "query": "site:news.ycombinator.com OR site:hnrss.org \"AI Engineer\" OR \"Forward Deployed\" OR \"DevRel\" OR \"Founding Engineer\" remote",
    "notes": "Career-Ops search query.",
    "enabled": true
  },
  {
    "id": "career_ops_company_anthropic",
    "name": "Anthropic",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/anthropic",
    "query": "Anthropic careers",
    "notes": "API: https://boards-api.greenhouse.io/v1/boards/anthropic/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_openai",
    "name": "OpenAI",
    "type": "Company",
    "url": "https://openai.com/careers",
    "query": "site:openai.com/careers \"Solutions\" OR \"Forward Deployed\" OR \"AI Engineer\"",
    "notes": "Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_polyai",
    "name": "PolyAI",
    "type": "ATS",
    "url": "https://job-boards.eu.greenhouse.io/polyai",
    "query": "PolyAI careers",
    "notes": "UK. Voice AI for enterprise contact centers. API: https://boards-api.greenhouse.io/v1/boards/polyai/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_parloa",
    "name": "Parloa",
    "type": "Company",
    "url": "https://www.parloa.com/company/careers/",
    "query": "site:www.parloa.com careers Parloa",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_intercom",
    "name": "Intercom",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/intercom",
    "query": "Intercom careers",
    "notes": "Dublin EMEA. Fin AI agent. API: https://boards-api.greenhouse.io/v1/boards/intercom/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_hume_ai",
    "name": "Hume AI",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/humeai",
    "query": "Hume AI careers",
    "notes": "NYC. Empathic voice AI. API: https://boards-api.greenhouse.io/v1/boards/humeai/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_elevenlabs",
    "name": "ElevenLabs",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/elevenlabs",
    "query": "site:jobs.ashbyhq.com/elevenlabs",
    "notes": "Voice AI TTS leader. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_deepgram",
    "name": "Deepgram",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/deepgram",
    "query": "site:deepgram.com/careers OR \"deepgram\" \"Solutions\" OR \"AI Engineer\" site:jobs.ashbyhq.com",
    "notes": "STT/TTS APIs. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_vapi",
    "name": "Vapi",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/vapi",
    "query": "site:jobs.ashbyhq.com/vapi",
    "notes": "Voice AI infrastructure. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_bland_ai",
    "name": "Bland AI",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/bland",
    "query": "site:jobs.ashbyhq.com/bland",
    "notes": "Voice phone agents. $65M Series B. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_retool",
    "name": "Retool",
    "type": "Company",
    "url": "https://retool.com/careers",
    "query": "site:retool.com/careers \"Deployed\" OR \"AI\" OR \"Solutions\"",
    "notes": "London. Popularized Deployed Engineer role. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_airtable",
    "name": "Airtable",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/airtable",
    "query": "Airtable careers",
    "notes": "No-code + AI platform. API: https://boards-api.greenhouse.io/v1/boards/airtable/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_vercel",
    "name": "Vercel",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/vercel",
    "query": "Vercel careers",
    "notes": "AI SDK, v0.dev. Frontend AI tooling. API: https://boards-api.greenhouse.io/v1/boards/vercel/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_temporal",
    "name": "Temporal",
    "type": "Company",
    "url": "https://temporal.io/careers",
    "query": "site:temporal.io careers Temporal",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_arize_ai",
    "name": "Arize AI",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/arizeai",
    "query": "Arize AI careers",
    "notes": "LLMOps / AI observability. API: https://boards-api.greenhouse.io/v1/boards/arizeai/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_runpod",
    "name": "RunPod",
    "type": "Company",
    "url": "https://www.runpod.io/careers",
    "query": "site:www.runpod.io careers RunPod",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_glean",
    "name": "Glean",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/gleanwork",
    "query": "Glean careers",
    "notes": "Enterprise AI search. API: https://boards-api.greenhouse.io/v1/boards/gleanwork/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_ada",
    "name": "Ada",
    "type": "Company",
    "url": "https://job-boards.greenhouse.io/ada18",
    "query": "\"ada.cx\" OR \"ada\" \"AI\" \"Solutions\" OR \"Engineer\" site:jobs.ashbyhq.com OR site:job-boards.greenhouse.io",
    "notes": "Greenhouse API and jobs array verified 2026-11-06: https://boards-api.greenhouse.io/v1/boards/ada18/jobs. Source slug migrated from the previous board.",
    "enabled": true
  },
  {
    "id": "career_ops_company_liveperson",
    "name": "LivePerson",
    "type": "Company",
    "url": "https://liveperson.com/company/careers",
    "query": "site:liveperson.com/careers OR \"liveperson\" \"Solutions\" OR \"AI\" site:job-boards.greenhouse.io",
    "notes": "Remote EMEA. Conversational AI enterprise. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_sierra",
    "name": "Sierra",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/sierra",
    "query": "\"sierra.ai\" \"AI\" \"Forward Deployed\" OR \"Applied\" OR \"Solutions\" site:jobs.ashbyhq.com",
    "notes": "Bret Taylor (ex-CEO Salesforce). AI customer agents. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_decagon",
    "name": "Decagon",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/decagon",
    "query": "\"decagon\" \"AI\" \"Forward Deployed\" OR \"Solutions\" site:jobs.ashbyhq.com",
    "notes": "AI customer support agents. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_talkdesk",
    "name": "Talkdesk",
    "type": "Company",
    "url": "https://www.talkdesk.com/careers",
    "query": "site:talkdesk.com/careers \"AI\" OR \"Solutions Architect\" OR \"AI Engineer\"",
    "notes": "Lisbon. Contact center AI. EMEA friendly. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_twilio",
    "name": "Twilio",
    "type": "Company",
    "url": "https://www.twilio.com/en-us/company/jobs",
    "query": "site:twilio.com/company/jobs \"AI\" OR \"Voice\" \"Solutions\" OR \"Architect\"",
    "notes": "Voice/messaging infrastructure. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_dialpad",
    "name": "Dialpad",
    "type": "Company",
    "url": "https://www.dialpad.com/careers",
    "query": "\"dialpad\" \"AI\" \"Solutions\" OR \"Engineer\" site:job-boards.greenhouse.io OR site:jobs.ashbyhq.com",
    "notes": "Voice AI for business comms. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_gong",
    "name": "Gong",
    "type": "Company",
    "url": "https://www.gong.io/careers",
    "query": "site:gong.io/careers \"AI\" OR \"Solutions\" OR \"Architect\"",
    "notes": "Revenue intelligence with voice AI. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_genesys",
    "name": "Genesys",
    "type": "Company",
    "url": "https://www.genesys.com/careers",
    "query": "site:genesys.com/careers \"AI\" \"Solutions Architect\" OR \"AI Engineer\"",
    "notes": "Contact center cloud + AI. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_salesforce",
    "name": "Salesforce",
    "type": "Company",
    "url": "https://careers.salesforce.com",
    "query": "site:careers.salesforce.com \"Forward Deployed\" OR \"AI Engineer\" OR \"Agentforce\"",
    "notes": "Agentforce = AI agents platform. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_langfuse",
    "name": "Langfuse",
    "type": "Company",
    "url": "https://langfuse.com/careers",
    "query": "\"langfuse\" careers OR jobs \"engineer\" OR \"solutions\"",
    "notes": "Berlin. LLMOps / observability. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_lindy",
    "name": "Lindy",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/lindy",
    "query": "\"lindy.ai\" \"AI\" \"Forward Deployed\" OR \"Solutions\" site:jobs.ashbyhq.com",
    "notes": "AI agent management platform. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_cognigy",
    "name": "Cognigy",
    "type": "Company",
    "url": "https://careers.cognigy.com",
    "query": "\"cognigy\" careers \"AI\" OR \"Solutions\" OR \"Engineer\"",
    "notes": "Dusseldorf EMEA. Conversational AI enterprise. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_speechmatics",
    "name": "Speechmatics",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/speechmatics",
    "query": "Speechmatics careers",
    "notes": "Cambridge UK. Speech recognition platform. API: https://boards-api.greenhouse.io/v1/boards/speechmatics/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_n8n",
    "name": "n8n",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/n8n",
    "query": "site:jobs.ashbyhq.com/n8n",
    "notes": "Berlin + remote EU/US. Workflow automation. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_zapier",
    "name": "Zapier",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/zapier",
    "query": "site:jobs.ashbyhq.com/zapier",
    "notes": "Remote-first. Automation platform leader. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_make_com_celonis",
    "name": "Make.com (Celonis)",
    "type": "Company",
    "url": "https://www.make.com/en/careers",
    "query": "site:make.com/en/careers OR \"make.com\" \"engineer\" OR \"solutions\" site:jobs.ashbyhq.com",
    "notes": "Celonis parent company. Automation platform. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_boomi",
    "name": "Boomi",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/boomilp",
    "query": "Boomi careers",
    "notes": "Integration and automation platform. API: https://boards-api.greenhouse.io/v1/boards/boomilp/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_cohere",
    "name": "Cohere",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/cohere",
    "query": "Cohere careers",
    "notes": "AI/LLM provider. Toronto + remote.",
    "enabled": true
  },
  {
    "id": "career_ops_company_langchain",
    "name": "LangChain",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/langchain",
    "query": "LangChain careers",
    "notes": "LangChain/LangSmith framework.",
    "enabled": true
  },
  {
    "id": "career_ops_company_pinecone",
    "name": "Pinecone",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/pinecone",
    "query": "Pinecone careers",
    "notes": "Vector database.",
    "enabled": true
  },
  {
    "id": "career_ops_company_mistral_ai",
    "name": "Mistral AI",
    "type": "Company",
    "url": "https://mistral.ai/careers/",
    "query": "site:mistral.ai careers Mistral AI",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_weights_biases",
    "name": "Weights & Biases",
    "type": "Company",
    "url": "https://job-boards.greenhouse.io/coreweave",
    "query": "site:www.coreweave.com careers Weights & Biases",
    "notes": "Greenhouse API and jobs array verified 2026-11-06: https://boards-api.greenhouse.io/v1/boards/coreweave/jobs. Source slug migrated from the previous board.",
    "enabled": true
  },
  {
    "id": "career_ops_company_palantir",
    "name": "Palantir",
    "type": "ATS",
    "url": "https://jobs.lever.co/palantir",
    "query": "Palantir careers",
    "notes": "FDE roles. Mostly US/London.",
    "enabled": true
  },
  {
    "id": "career_ops_company_later",
    "name": "Later",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/later",
    "query": "Later careers",
    "notes": "Vancouver/Toronto. Social media and creator platform. API: https://boards-api.greenhouse.io/v1/boards/later/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_safari_ai",
    "name": "Safari AI",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/safariai",
    "query": "Safari AI careers",
    "notes": "Miami HQ / Vancouver engineering. Computer vision AI for operations in the physical economy. API: https://boards-api.greenhouse.io/v1/boards/safariai/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_hootsuite",
    "name": "Hootsuite",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/hootsuite",
    "query": "Hootsuite careers",
    "notes": "Vancouver. Social media management platform. API: https://boards-api.greenhouse.io/v1/boards/hootsuite/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_klue",
    "name": "Klue",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/klue",
    "query": "Klue careers",
    "notes": "Vancouver. Competitive intelligence SaaS.",
    "enabled": true
  },
  {
    "id": "career_ops_company_glacis_ai",
    "name": "Glacis AI",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/glacis-ai",
    "query": "Glacis AI careers",
    "notes": "Ho Chi Minh City. AI agents for supply chain and logistics workflows.",
    "enabled": true
  },
  {
    "id": "career_ops_company_sanctuary_ai",
    "name": "Sanctuary AI",
    "type": "Company",
    "url": "https://sanctuary.ai/careers/",
    "query": "site:sanctuary.ai careers Sanctuary AI",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_semios",
    "name": "Semios",
    "type": "ATS",
    "url": "https://apply.workable.com/semios/",
    "query": "site:apply.workable.com/semios",
    "notes": "Vancouver. Agtech and crop intelligence platform. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_factorial",
    "name": "Factorial",
    "type": "Company",
    "url": "https://careers.factorial.com/",
    "query": "site:careers.factorial.com careers Factorial",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_attio",
    "name": "Attio",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/attio",
    "query": "site:attio.com/careers OR site:jobs.ashbyhq.com/attio",
    "notes": "Remote EU. AI-native CRM. Series B $52M. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_tinybird",
    "name": "Tinybird",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/tinybird",
    "query": "site:tinybird.co/careers OR site:jobs.ashbyhq.com/tinybird",
    "notes": "Remote. Real-time data platform. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_clarity_ai",
    "name": "Clarity AI",
    "type": "ATS",
    "url": "https://jobs.lever.co/clarity-ai",
    "query": "site:clarity.ai/careers OR site:jobs.lever.co/clarity-ai",
    "notes": "Direct ATS endpoint returned 404 on 2026-11-06; replacement could not be verified because the careers site blocked automated access. Disabled by default; review the company careers page manually.",
    "enabled": false
  },
  {
    "id": "career_ops_company_travelperk",
    "name": "Travelperk",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/travelperk",
    "query": "site:jobs.ashbyhq.com/travelperk",
    "notes": "Barcelona. Business travel unicorn. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_aleph_alpha",
    "name": "Aleph Alpha",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/AlephAlpha",
    "query": "site:jobs.ashbyhq.com/AlephAlpha",
    "notes": "Heidelberg DE. Sovereign European LLM provider, enterprise & government focus. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_deepl",
    "name": "DeepL",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/DeepL",
    "query": "site:jobs.ashbyhq.com/DeepL",
    "notes": "Cologne DE. Translation & language AI. 60+ open roles, EU/DACH heavy. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_black_forest_labs",
    "name": "Black Forest Labs",
    "type": "Company",
    "url": "https://bfl.ai/careers",
    "query": "site:bfl.ai careers Black Forest Labs",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_helsing",
    "name": "Helsing",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/helsing",
    "query": "Helsing careers",
    "notes": "Munich / Berlin / London / Paris. Defence AI unicorn. 100+ roles, ML & FDE. API: https://boards-api.greenhouse.io/v1/boards/helsing/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_celonis",
    "name": "Celonis",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/celonis",
    "query": "Celonis careers",
    "notes": "Munich / NYC. Process intelligence, Applied AI Engineer roles, Field CTOs. API: https://boards-api.greenhouse.io/v1/boards/celonis/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_contentful",
    "name": "Contentful",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/contentful",
    "query": "Contentful careers",
    "notes": "Berlin / Denver. Headless CMS, AI content workflows. API: https://boards-api.greenhouse.io/v1/boards/contentful/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_getyourguide",
    "name": "GetYourGuide",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/getyourguide",
    "query": "GetYourGuide careers",
    "notes": "Berlin. Travel marketplace, ML & data platform roles. API: https://boards-api.greenhouse.io/v1/boards/getyourguide/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_hellofresh",
    "name": "HelloFresh",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/hellofresh",
    "query": "HelloFresh careers",
    "notes": "Berlin. Meal kit unicorn, large data/ML org. API: https://boards-api.greenhouse.io/v1/boards/hellofresh/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_n26",
    "name": "N26",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/n26",
    "query": "N26 careers",
    "notes": "Berlin / Barcelona. Mobile bank, ~50 roles, ML & risk. API: https://boards-api.greenhouse.io/v1/boards/n26/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_trade_republic",
    "name": "Trade Republic",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/traderepublicbank",
    "query": "Trade Republic careers",
    "notes": "Berlin / London / Paris. Neobroker, ~50 roles, platform & data. API: https://boards-api.greenhouse.io/v1/boards/traderepublicbank/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_sumup",
    "name": "SumUp",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/sumup",
    "query": "SumUp careers",
    "notes": "Berlin / London. Payments fintech, EU + LATAM hiring. API: https://boards-api.greenhouse.io/v1/boards/sumup/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_qonto",
    "name": "Qonto",
    "type": "ATS",
    "url": "https://jobs.lever.co/qonto",
    "query": "Qonto careers",
    "notes": "Paris / Berlin / Barcelona / Milan. SMB neobank, MLOps for AI Product roles.",
    "enabled": true
  },
  {
    "id": "career_ops_company_forto",
    "name": "Forto",
    "type": "Company",
    "url": "https://careers.forto.com/",
    "query": "site:careers.forto.com careers Forto",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_lakera",
    "name": "Lakera",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/lakera.ai",
    "query": "site:jobs.ashbyhq.com/lakera.ai",
    "notes": "Zurich CH / SF. AI security & guardrails. Has Forward Deployed Engineer roles. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_scandit",
    "name": "Scandit",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/scandit",
    "query": "Scandit careers",
    "notes": "Zurich CH. Computer vision / smart data capture, ML roles. API: https://boards-api.greenhouse.io/v1/boards/scandit/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_cradle",
    "name": "Cradle",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/cradlebio",
    "query": "site:jobs.ashbyhq.com/cradlebio",
    "notes": "Zurich CH / Amsterdam. AI-guided protein design, ML researcher roles. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_hugging_face",
    "name": "Hugging Face",
    "type": "ATS",
    "url": "https://apply.workable.com/huggingface/",
    "query": "site:apply.workable.com/huggingface",
    "notes": "Paris / NYC / Remote. ML hub & open-source models. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_photoroom",
    "name": "Photoroom",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/photoroom",
    "query": "site:jobs.ashbyhq.com/photoroom",
    "notes": "Paris FR. AI photo editor, Head of CV / Head of ML roles. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_pigment",
    "name": "Pigment",
    "type": "ATS",
    "url": "https://jobs.lever.co/pigment",
    "query": "Pigment careers",
    "notes": "Paris FR / NYC / London. AI-powered FP&A planning platform.",
    "enabled": true
  },
  {
    "id": "career_ops_company_wayve",
    "name": "Wayve",
    "type": "Company",
    "url": "https://wayve.ai/careers/",
    "query": "site:wayve.ai careers Wayve",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_isomorphic_labs",
    "name": "Isomorphic Labs",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/isomorphiclabs",
    "query": "Isomorphic Labs careers",
    "notes": "London / Lausanne / Cambridge MA. DeepMind spin-out for drug discovery AI. API: https://boards-api.greenhouse.io/v1/boards/isomorphiclabs/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_physicsx",
    "name": "PhysicsX",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/physicsx",
    "query": "PhysicsX careers",
    "notes": "London UK. Physics-informed ML for engineering, ~40 roles. API: https://boards-api.greenhouse.io/v1/boards/physicsx/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_stability_ai",
    "name": "Stability AI",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/stabilityai",
    "query": "Stability AI careers",
    "notes": "London / SF. Generative AI image/video research lab. API: https://boards-api.greenhouse.io/v1/boards/stabilityai/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_synthesia",
    "name": "Synthesia",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/synthesia",
    "query": "site:jobs.ashbyhq.com/synthesia OR site:job-boards.greenhouse.io/synthesia",
    "notes": "London UK. AI video generation for enterprise, $4B valuation. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_faculty",
    "name": "Faculty",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/faculty",
    "query": "site:jobs.ashbyhq.com/faculty",
    "notes": "London UK. Applied AI consultancy. 80+ roles, AI Safety / MLE / Delivery. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_causaly",
    "name": "Causaly",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/causaly",
    "query": "site:jobs.ashbyhq.com/causaly",
    "notes": "London / Athens. Biomedical knowledge graph + AI. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_lovable",
    "name": "Lovable",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/lovable",
    "query": "site:jobs.ashbyhq.com/lovable",
    "notes": "Stockholm SE. AI app builder (text-to-app), 80+ open roles. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_legora",
    "name": "Legora",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/legora",
    "query": "site:jobs.ashbyhq.com/legora",
    "notes": "Stockholm SE / NYC / London. AI-native legal workspace. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_spotify",
    "name": "Spotify",
    "type": "ATS",
    "url": "https://jobs.lever.co/spotify",
    "query": "Spotify careers",
    "notes": "Stockholm SE / NYC / London. Audio platform, large ML/personalization org.",
    "enabled": true
  },
  {
    "id": "career_ops_company_vinted",
    "name": "Vinted",
    "type": "Company",
    "url": "https://careers.vinted.com/",
    "query": "site:careers.vinted.com careers Vinted",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_amplemarket",
    "name": "Amplemarket",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/amplemarket",
    "query": "Amplemarket careers",
    "notes": "Lisbon PT / Remote. AI-native sales platform. API: https://boards-api.greenhouse.io/v1/boards/amplemarket/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_perplexity",
    "name": "Perplexity",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/perplexity",
    "query": "‘site:jobs.ashbyhq.com/perplexity \"AI\" OR \"Applied AI\" OR \"Forward Deployed\" OR \"Engineer\"’",
    "notes": "AI-native search and enterprise AI platform. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_clay_labs",
    "name": "Clay Labs",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/claylabs",
    "query": "site:jobs.ashbyhq.com/claylabs \"AI\" OR \"Developer Experience\" OR \"Growth\" OR \"Engineer\"",
    "notes": "AI-native GTM and workflow automation platform. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_runway",
    "name": "Runway",
    "type": "Company",
    "url": "https://runway.com/careers",
    "query": "site:runway.com careers Runway",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_hightouch",
    "name": "Hightouch",
    "type": "Company",
    "url": "https://hightouch.com/careers",
    "query": "site:hightouch.com careers Hightouch",
    "notes": "Careers URL rechecked 2026-11-06. Previous direct ATS endpoint returned 404. Use manual web search until this ATS is supported. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_workos",
    "name": "WorkOS",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/workos",
    "query": "site:jobs.ashbyhq.com/workos \"Solutions Engineer\" OR \"Developer Success\" OR \"Engineer\"",
    "notes": "Developer tools and enterprise-ready auth/platform APIs. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_supabase",
    "name": "Supabase",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/supabase",
    "query": "site:jobs.ashbyhq.com/supabase",
    "notes": "Open-source Firebase alternative. Remote-first. Postgres + Auth + Storage. Strong DevRel/DX hiring. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_resend",
    "name": "Resend",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/resend",
    "query": "site:jobs.ashbyhq.com/resend",
    "notes": "Email API for developers. Remote-first. DX/DevRel focused. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_clerk",
    "name": "Clerk",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/clerk",
    "query": "site:jobs.ashbyhq.com/clerk",
    "notes": "Auth & user management for developers. SE / TAM / PM roles. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_inngest",
    "name": "Inngest",
    "type": "ATS",
    "url": "https://jobs.ashbyhq.com/inngest",
    "query": "site:jobs.ashbyhq.com/inngest",
    "notes": "Durable workflow engine for serverless. DX/DevRel/Engineering hiring. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_planetscale",
    "name": "PlanetScale",
    "type": "ATS",
    "url": "https://job-boards.greenhouse.io/planetscale",
    "query": "PlanetScale careers",
    "notes": "Serverless MySQL platform. Customer Engineering, Engineering, Sales. API: https://boards-api.greenhouse.io/v1/boards/planetscale/jobs",
    "enabled": true
  },
  {
    "id": "career_ops_company_zep_ai",
    "name": "Zep AI",
    "type": "Company",
    "url": "https://www.getzep.com/careers",
    "query": "\"Zep\" \"Forward Deployed\" OR \"Developer Relations\" OR \"Founding\" site:workatastartup.com OR site:getzep.com",
    "notes": "Context engineering platform for AI agents. YC W24. Lead FDE + DevRel Lead roles. US-only currently. Scan method: websearch",
    "enabled": true
  },
  {
    "id": "career_ops_company_maxim_ai",
    "name": "Maxim AI",
    "type": "Company",
    "url": "https://www.getmaxim.ai/careers",
    "query": "\"Maxim AI\" OR \"getmaxim\" careers \"engineer\" OR \"product\"",
    "notes": "AI evaluation and observability platform. Bangalore-based, mostly on-site. Scan method: websearch",
    "enabled": true
  }
];
