const sampleTarget = "example.com";

const rawDorks = [
  ["dir-listing", "Directory listing", "Exposure", "Google", "Medium", "Browsable directory indexes and exposed file trees.", "google", "{scope} intitle:\"index of\" -inurl:wp-content -inurl:plugins"],
  ["config-files", "Configuration files", "Exposure", "Google", "High", "Indexed configuration files and environment settings.", "google", "{scope} (ext:xml OR ext:conf OR ext:cnf OR ext:ini OR ext:cfg OR ext:properties OR ext:toml)"],
  ["env-files", "Environment files", "Code & Secrets", "Google", "High", "Environment files with common secret names.", "google", "{scope} (filetype:env OR ext:env) (DB_PASSWORD OR DATABASE_URL OR SECRET_KEY OR AWS_SECRET_ACCESS_KEY)"],
  ["database-files", "Database files", "Exposure", "Google", "High", "Database dumps and local database files.", "google", "{scope} (ext:sql OR ext:db OR ext:sqlite OR ext:mdb OR ext:dbf)"],
  ["log-files", "Application logs", "Exposure", "Google", "Medium", "Logs that may expose paths, errors, and stack traces.", "google", "{scope} (ext:log OR inurl:log) (error OR warning OR stack OR trace)"],
  ["backup-archives", "Backup archives", "Exposure", "Google", "High", "Backup archives, dumps, and compressed copies.", "google", "{scope} (ext:bak OR ext:backup OR ext:old OR ext:zip OR ext:tar OR ext:gz OR ext:7z OR ext:rar) (backup OR dump OR database OR config)"],
  ["sql-errors", "SQL error messages", "Exposure", "Google", "High", "Indexed database error messages.", "google", "{scope} (\"SQL syntax\" OR \"mysql_fetch\" OR \"ORA-\" OR \"PostgreSQL query failed\" OR \"Warning: pg_\" OR \"Microsoft OLE DB Provider\")"],
  ["sensitive-text", "Credential text files", "Exposure", "Google", "High", "Text and CSV files containing credential keywords.", "google", "{scope} (ext:txt OR ext:csv) (password OR username OR credentials OR token OR secret)"],
  ["public-docs", "Public documents", "Documents", "Google", "Medium", "Documents and spreadsheets exposed in search results.", "google", "{scope} (filetype:pdf OR filetype:doc OR filetype:docx OR filetype:xls OR filetype:xlsx OR filetype:ppt OR filetype:pptx OR filetype:csv)"],
  ["confidential-docs", "Confidential documents", "Documents", "Google", "Medium", "Documents with internal or confidential wording.", "google", "{scope} (filetype:pdf OR filetype:doc OR filetype:docx OR filetype:xlsx) (confidential OR internal OR restricted OR private)"],
  ["spreadsheets", "Spreadsheets", "Documents", "Google", "Medium", "Spreadsheet files that often contain lists or exports.", "google", "{scope} (filetype:xls OR filetype:xlsx OR filetype:csv)"],
  ["git-directories", "Exposed .git directories", "Code & Secrets", "Google", "High", "Indexed Git repositories and metadata paths.", "google", "{scope} (inurl:/.git OR intitle:\"index of .git\") -github.com"],
  ["private-keys", "Private key files", "Code & Secrets", "Google", "High", "Private key and certificate material.", "google", "{scope} (filetype:pem OR filetype:key OR filetype:ppk OR filetype:crt) (\"PRIVATE KEY\" OR \"BEGIN RSA\" OR \"BEGIN OPENSSH\")"],
  ["aws-keys", "AWS key strings", "Code & Secrets", "Google", "High", "AWS key and secret indicators.", "google", "{scope} (\"AWS_ACCESS_KEY_ID\" OR \"AWS_SECRET_ACCESS_KEY\" OR \"AKIA\")"],
  ["api-keys", "API key strings", "Code & Secrets", "Google", "High", "Common API key and token names.", "google", "{scope} (\"api_key\" OR \"apikey\" OR \"client_secret\" OR \"access_token\" OR \"auth_token\")"],
  ["docker-compose", "Docker Compose files", "Code & Secrets", "Google", "High", "Indexed docker-compose manifests.", "google", "{scope} intitle:\"index of\" \"docker-compose.yml\""],
  ["kubernetes-secrets", "Kubernetes YAML secrets", "Code & Secrets", "Google", "High", "Kubernetes YAML files with secret-like markers.", "google", "{scope} (filetype:yml OR filetype:yaml) (\"kind: Secret\" OR \"apiVersion:\")"],
  ["npmrc-files", "NPM config files", "Code & Secrets", "Google", "High", "NPM registry tokens and config files.", "google", "{scope} (inurl:.npmrc OR intitle:\"index of\" \".npmrc\")"],
  ["htpasswd-files", "Password files", "Code & Secrets", "Google", "High", "htpasswd and htaccess files.", "google", "{scope} (inurl:.htpasswd OR inurl:.htaccess OR intitle:\"index of\" \".htpasswd\")"],
  ["source-maps", "JavaScript source maps", "Code & Secrets", "Google", "Medium", "Source maps that can reveal bundled source.", "google", "{scope} (ext:map OR filetype:map) inurl:js"],
  ["package-lock", "Node dependency manifests", "Code & Secrets", "Google", "Medium", "Node package manifests and lockfiles.", "google", "{scope} (\"package-lock.json\" OR \"yarn.lock\" OR \"package.json\") intitle:\"index of\""],
  ["composer-lock", "PHP dependency manifests", "Code & Secrets", "Google", "Medium", "Composer manifests and lockfiles.", "google", "{scope} (\"composer.json\" OR \"composer.lock\") intitle:\"index of\""],
  ["main-yml", "CI workflow files", "Code & Secrets", "Google", "Medium", "Indexed CI workflow and action files.", "google", "{scope} intitle:\"index of\" (\"main.yml\" OR \".github\" OR \"gitlab-ci.yml\")"],
  ["jwks-rsa", "JWKS and key material", "Code & Secrets", "Google", "Medium", "JWKS paths and key metadata.", "google", "{scope} (inurl:jwks OR inurl:jwks-rsa OR inurl:.well-known/jwks.json)"],
  ["subdomains", "Subdomain search", "Infrastructure", "Google", "Info", "Wildcard site search for subdomains.", "google", "{each:site:*.$t}"],
  ["sub-subdomains", "Deep subdomain search", "Infrastructure", "Google", "Info", "Two-level wildcard site search.", "google", "{each:site:*.*.$t}"],
  ["ports", "Indexed non-standard ports", "Infrastructure", "Google", "Info", "Indexed URLs on common alternate web ports.", "google", "{scope} (inurl:\":8080\" OR inurl:\":8443\" OR inurl:\":8000\" OR inurl:\":9000\" OR inurl:\":5601\")"],
  ["robots-sitemap", "Robots and sitemaps", "Infrastructure", "Google", "Info", "Robots and sitemap files.", "google", "{scope} (inurl:robots.txt OR inurl:sitemap.xml)"],
  ["status-pages", "Status and health pages", "Infrastructure", "Google", "Medium", "Status, metrics, and health endpoints.", "google", "{scope} (inurl:status OR inurl:health OR inurl:metrics OR intitle:status)"],
  ["default-pages", "Default server pages", "Infrastructure", "Google", "Low", "Default Apache and Nginx landing pages.", "google", "{scope} (intitle:\"Apache2 Ubuntu Default Page\" OR intitle:\"Welcome to nginx\" OR intitle:\"IIS Windows Server\")"],
  ["old-paths", "Old and archived paths", "Archive", "Google", "Medium", "Old, backup, archive, and deprecated URL paths.", "google", "{scope} (inurl:old OR inurl:backup OR inurl:archive OR inurl:deprecated OR inurl:staging)"],
  ["parameterized-urls", "Parameterized URLs", "Archive", "Google", "Medium", "URLs with parameters often useful for manual review.", "google", "{scope} (inurl:\"?id=\" OR inurl:\"?file=\" OR inurl:\"?page=\" OR inurl:\"?url=\" OR inurl:\"?redirect=\")"],
  ["swf-files", "SWF files", "Archive", "Google", "Medium", "Legacy SWF files still indexed.", "google", "{scope} (ext:swf OR filetype:swf)"],
  ["cacheable-files", "Cacheable static files", "Archive", "Google", "Low", "Indexed static file types that may reveal old assets.", "google", "{scope} (filetype:js OR filetype:css OR filetype:map)"],
  ["wordpress", "WordPress footprint", "Stack", "Google", "Info", "WordPress core paths, themes, plugins, and uploads.", "google", "{scope} (inurl:wp-content OR inurl:wp-includes OR inurl:wp-admin OR inurl:plugins OR inurl:uploads)"],
  ["wp-config-index", "WordPress config exposure", "Stack", "Google", "High", "Indexed wp-config.php references.", "google", "{scope} inurl:\"wp-content\" intitle:\"index of\" \"wp-config.php\""],
  ["wp-uploads-backup", "WordPress upload backups", "Stack", "Google", "High", "WordPress backup files in upload paths.", "google", "{scope} inurl:\"wp-content/uploads\" (backup OR dump OR zip OR sql OR old)"],
  ["contact-form-7", "Contact Form 7 path", "Stack", "Google", "Info", "Contact Form 7 plugin paths.", "google", "{scope} inurl:\"/wp-content/plugins/contact-form-7/\""],
  ["drupal-login", "Drupal login", "Stack", "Google", "Medium", "Drupal login surfaces.", "google", "{scope} inurl:user intitle:\"Drupal\" intext:\"Log in\" -\"powered by\""],
  ["joomla-db", "Joomla database path", "Stack", "Google", "High", "Joomla database library path exposure.", "google", "{scope} inurl:\"/libraries/joomla/database/\""],
  ["struts", "Struts actions", "Stack", "Google", "High", "Apache Struts action endpoints.", "google", "{scope} (ext:action OR ext:struts OR ext:do)"],
  ["phpinfo", "phpinfo pages", "Stack", "Google", "High", "Public PHP environment disclosure pages.", "google", "{scope} ext:php intitle:phpinfo \"published by the PHP Group\""],
  ["laravel-debug", "Laravel debug pages", "Stack", "Google", "High", "Laravel debug and exception output.", "google", "{scope} (\"Whoops! There was an error\" OR \"Laravel\" \"APP_KEY\")"],
  ["django-debug", "Django debug pages", "Stack", "Google", "High", "Django debug and traceback output.", "google", "{scope} (\"Django DEBUG\" OR \"DisallowedHost\" OR \"Traceback\" \"Django\")"],
  ["rails-errors", "Rails error pages", "Stack", "Google", "Medium", "Rails exception output.", "google", "{scope} (\"Ruby on Rails\" \"Action Controller: Exception caught\" OR \"Rails.root\")"],
  ["spring-actuator", "Spring Boot actuator", "Stack", "Google", "High", "Spring Boot actuator and environment endpoints.", "google", "{scope} (inurl:/actuator OR inurl:/env OR inurl:/health) \"spring\""],
  ["geoserver", "GeoServer WFS", "Stack", "Google", "High", "GeoServer WFS service endpoints.", "google", "{scope} inurl:\"/geoserver/ows?service=wfs\""],
  ["arcgis", "ArcGIS services", "Stack", "Google", "Medium", "ArcGIS REST service directories.", "google", "{scope} intext:\"ArcGIS REST Services Directory\" intitle:\"Folder: /\""],
  ["login-pages", "Login pages", "Access Points", "Google", "Low", "Common login and sign-in pages.", "google", "{scope} (inurl:login OR inurl:signin OR intitle:\"login\")"],
  ["admin-panels", "Admin panels", "Access Points", "Google", "Medium", "Admin panels and dashboards.", "google", "{scope} (inurl:admin OR intitle:\"admin\" OR inurl:dashboard) -github"],
  ["admin-aspx", "ASP.NET admin portals", "Access Points", "Google", "Medium", "ASP.NET admin portal paths.", "google", "{scope} inurl:/admin.aspx"],
  ["upload-forms", "Upload endpoints", "Access Points", "Google", "Medium", "Upload and file manager endpoints.", "google", "{scope} (inurl:upload OR inurl:filemanager OR inurl:assets) (upload OR file)"],
  ["download-file", "Download handlers", "Access Points", "Google", "Medium", "Download handlers with file parameters.", "google", "{scope} (inurl:\"download.php?file=\" OR inurl:\"?file=\" OR inurl:\"download=\")"],
  ["open-redirects", "Redirect parameters", "Access Points", "Google", "Medium", "Common redirect parameter names.", "google", "{scope} (inurl:redirect= OR inurl:return= OR inurl:next= OR inurl:url= OR inurl:continue=)"],
  ["setup-files", "Setup and install pages", "Access Points", "Google", "Medium", "Installer, setup, readme, and license files.", "google", "{scope} (inurl:install OR inurl:setup OR inurl:readme OR inurl:license)"],
  ["common-endpoints", "Common endpoint index", "Endpoint Discovery", "Google", "Info", "API, admin, dashboard, portal, and account routes indexed for the target.", "google", "{scope} (inurl:/api/ OR inurl:/rest/ OR inurl:/v1/ OR inurl:/v2/ OR inurl:/admin/ OR inurl:/dashboard/ OR inurl:/portal/ OR inurl:/account/)"],
  ["api-docs-expanded", "API docs and consoles", "Endpoint Discovery", "Google", "High", "OpenAPI, Swagger UI, Redoc, and generated API documentation.", "google", "{scope} (inurl:/swagger-ui OR inurl:/swagger/ OR inurl:/api-docs OR inurl:/openapi OR inurl:/redoc OR \"OpenAPI\")"],
  ["well-known-endpoints", "Well-known endpoints", "Endpoint Discovery", "Google", "Medium", "Security, identity, app link, and key discovery under .well-known.", "google", "{scope} inurl:/.well-known (security.txt OR openid-configuration OR assetlinks.json OR apple-app-site-association OR jwks.json)"],
  ["endpoint-sitemaps", "Sitemap endpoint hints", "Endpoint Discovery", "Google", "Info", "Sitemaps and robots entries that mention sensitive route families.", "google", "{scope} (inurl:sitemap.xml OR inurl:sitemap_index.xml OR inurl:robots.txt) (api OR admin OR login OR portal OR upload)"],
  ["js-endpoint-mining", "JavaScript endpoint mining", "Endpoint Discovery", "Google", "Medium", "Client JavaScript that may reveal API routes, GraphQL paths, and request code.", "google", "{scope} (filetype:js OR ext:js) (\"/api/\" OR \"api/v1\" OR \"api/v2\" OR \"graphql\" OR \"fetch(\" OR \"axios\")"],
  ["source-map-endpoints", "Source map route mining", "Endpoint Discovery", "Google", "Medium", "Source maps and bundled source that may reveal routes and internal API names.", "google", "{scope} (ext:map OR filetype:map) (\"sourcesContent\" OR \"webpack\" OR \"/api/\" OR \"routes\")"],
  ["parameter-hunting", "Parameterized URLs", "Endpoint Discovery", "Google", "Medium", "Common id, file, page, search, and redirect parameters for manual review.", "google", "{scope} (inurl:\"?id=\" OR inurl:\"?page=\" OR inurl:\"?file=\" OR inurl:\"?category=\" OR inurl:\"?q=\" OR inurl:\"?search=\" OR inurl:\"?redirect=\" OR inurl:\"?url=\")"],
  ["callback-webhook", "Callback and webhook paths", "Endpoint Discovery", "Google", "Medium", "Callback, webhook, notify, and return URL routes.", "google", "{scope} (inurl:webhook OR inurl:callback OR inurl:notify OR inurl:returnUrl OR inurl:redirect_uri OR inurl:relaystate)"],
  ["upload-download-combo", "Upload and download paths", "Endpoint Discovery", "Google", "Medium", "Upload, import, export, file manager, and download endpoints.", "google", "{scope} (inurl:upload OR inurl:filemanager OR inurl:import OR inurl:export OR inurl:download OR inurl:attachment)"],
  ["legacy-script-endpoints", "Legacy script endpoints", "Endpoint Discovery", "Google", "Medium", "Older PHP, ASP, JSP, and CGI endpoints with parameters.", "google", "{scope} (inurl:.php?id= OR inurl:.asp?id= OR inurl:.aspx?id= OR inurl:.jsp?id= OR inurl:/cgi-bin/ OR ext:do OR ext:action)"],
  ["route-definition-files", "Route definition files", "Endpoint Discovery", "Google", "Medium", "Indexed JSON/YAML route, endpoint, and API definition files.", "google", "{scope} (filetype:json OR filetype:yml OR filetype:yaml OR filetype:txt) (\"routes\" OR \"endpoints\" OR \"openapi\" OR \"swagger\")"],
  ["admin-subdomains", "Admin and portal subdomains", "Endpoint Discovery", "Google", "Medium", "Common admin, portal, account, user, and login subdomain names.", "google", "{each:(site:admin.$t OR site:portal.$t OR site:login.$t OR site:accounts.$t OR site:user.$t) (intitle:login OR inurl:login)}"],
  ["staging-subdomains", "Dev and staging subdomains", "Endpoint Discovery", "Google", "Medium", "Development, staging, QA, UAT, and test hostnames in scope.", "google", "{each:(site:dev.$t OR site:staging.$t OR site:test.$t OR site:qa.$t OR site:uat.$t OR site:beta.$t)}"],
  ["mobile-app-links", "Mobile app link files", "Endpoint Discovery", "Google", "Info", "Android and iOS association files that can reveal app package and route ownership.", "google", "{scope} (inurl:assetlinks.json OR inurl:apple-app-site-association)"],
  ["auth-basic", "Auth and account routes", "Auth & SSO", "Google", "Low", "Login, sign-up, password reset, and account recovery pages.", "google", "{scope} (inurl:/login OR inurl:/signin OR inurl:/signup OR inurl:/register OR inurl:/password OR inurl:/reset OR inurl:/forgot)"],
  ["oauth-authorize", "OAuth authorize flows", "Auth & SSO", "Google", "Medium", "OAuth and OpenID authorize endpoints for redirect URI review.", "google", "{scope} (inurl:/oauth/authorize OR inurl:/oauth2/authorize OR inurl:/authorize? OR inurl:/connect/authorize OR inurl:redirect_uri=)"],
  ["saml-adfs", "SAML and ADFS flows", "Auth & SSO", "Google", "Medium", "SAML, ADFS, wctx, wtrealm, and identity provider routes.", "google", "{scope} (inurl:/adfs/ls OR inurl:SAMLRequest OR inurl:wtrealm OR inurl:wctx OR inurl:/saml OR inurl:/sso) -microsoft.com"],
  ["oidc-idp", "OIDC and IDP endpoints", "Auth & SSO", "Google", "Medium", "OIDC discovery, authorization, and identity provider paths.", "google", "{scope} (inurl:/.well-known/openid-configuration OR inurl:/oidc/authorize OR inurl:/idp/Authn/UserPassword OR inurl:/idp/prp.wsf OR inurl:/nidp/idff/sso OR inurl:authorization.ping)"],
  ["logout-callbacks", "Logout and return callbacks", "Auth & SSO", "Google", "Medium", "Return URL, logout redirect, and callback parameters.", "google", "{scope} (inurl:returnUrl= OR inurl:callback= OR inurl:redirect_uri= OR inurl:post_logout_redirect_uri= OR inurl:RelayState=)"],
  ["service-desk-login", "Service desk portals", "Auth & SSO", "Google", "Medium", "Customer portal, helpdesk, Jira service desk, and support logins.", "google", "{scope} (inurl:\"servicedesk/customer/user/login\" OR inurl:/helpdesk OR inurl:/support/login OR inurl:/jira/servicedesk OR inurl:/customer/user/login)"],
  ["vpn-web-login", "VPN and web login pages", "Auth & SSO", "Google", "Medium", "VPN, web login, and protected remote access login surfaces.", "google", "{scope} (inurl:/weblogin OR intitle:\"web client: login\" OR intitle:\"Exchange Log In\" OR intitle:\"Xenmobile Console Logon\" OR intitle:\"Please Login\")"],
  ["swagger-openapi", "Swagger and OpenAPI", "Cloud & APIs", "Google", "High", "Swagger UI, OpenAPI specs, and API docs.", "google", "{scope} (inurl:swagger OR inurl:api-docs OR inurl:openapi OR filetype:json \"swagger\")"],
  ["graphql", "GraphQL consoles", "Cloud & APIs", "Google", "High", "GraphQL endpoints and GraphiQL consoles.", "google", "{scope} (inurl:graphql OR inurl:graphiql OR intitle:GraphiQL)"],
  ["api-js", "API paths in JavaScript", "Cloud & APIs", "Google", "Medium", "JavaScript files that reference API paths.", "google", "{scope} (filetype:js OR ext:js) (\"/api/\" OR \"api/v1\" OR \"api/v2\")"],
  ["postman", "Postman collections", "Cloud & APIs", "Google", "Medium", "Postman collection files and mentions.", "google", "{scope} (\"postman_collection\" OR inurl:postman)"],
  ["firebase", "Firebase exposure", "Cloud & APIs", "Google", "High", "Firebase config and database references.", "google", "{scope} (\"firebaseio.com\" OR \"firebaseapp.com\" OR \"firebaseConfig\")"],
  ["cloud-buckets", "Cloud storage buckets", "Cloud & APIs", "Google", "High", "Public cloud storage bucket mentions.", "google", "(site:s3.amazonaws.com OR site:storage.googleapis.com OR site:blob.core.windows.net) \"{first}\""],
  ["jwt-bearer", "JWT and bearer tokens", "Cloud & APIs", "Google", "High", "JWT, bearer token, and authorization strings.", "google", "{scope} (\"jwt\" OR \"bearer\") (\"secret\" OR \"token\" OR \"Authorization\")"],
  ["azure-strings", "Azure storage strings", "Cloud & APIs", "Google", "High", "Azure storage connection string indicators.", "google", "{scope} (\"DefaultEndpointsProtocol=\" OR \"AccountKey=\" OR \"SharedAccessSignature\")"],
  ["gcp-service-account", "GCP service accounts", "Cloud & APIs", "Google", "High", "Google Cloud service account JSON indicators.", "google", "{scope} (\"service_account\" OR \"private_key_id\" OR \"client_email\")"],
  ["phpmyadmin", "phpMyAdmin panels", "Access Points", "Google", "Medium", "phpMyAdmin login and setup surfaces.", "google", "{scope} (inurl:phpmyadmin OR intitle:phpMyAdmin)"],
  ["adminer", "Adminer panels", "Access Points", "Google", "Medium", "Adminer database administration panels.", "google", "{scope} (inurl:adminer.php OR intitle:Adminer)"],
  ["jenkins", "Jenkins dashboards", "Stack", "Google", "High", "Jenkins dashboards and login pages.", "google", "{scope} (intitle:\"Dashboard [Jenkins]\" OR inurl:/jenkins/login OR intitle:Jenkins)"],
  ["grafana", "Grafana dashboards", "Stack", "Google", "Medium", "Grafana login and dashboard pages.", "google", "{scope} (intitle:Grafana OR inurl:/grafana/login OR inurl:/login) \"Grafana\""],
  ["prometheus", "Prometheus endpoints", "Infrastructure", "Google", "Medium", "Prometheus graph and target endpoints.", "google", "{scope} (inurl:/graph OR inurl:/targets OR intitle:Prometheus) \"Prometheus\""],
  ["kibana", "Kibana dashboards", "Infrastructure", "Google", "Medium", "Kibana dashboard and app pages.", "google", "{scope} (intitle:Kibana OR inurl:/app/kibana OR inurl:/app/discover)"],
  ["server-status", "Apache server-status", "Infrastructure", "Google", "High", "Apache server-status pages.", "google", "{scope} (inurl:/server-status OR intitle:\"Apache Status\")"],
  ["web-config-ftp", "web.config FTP references", "Code & Secrets", "Google", "High", "Indexed ASP.NET web.config files with FTP-related configuration.", "google", "{scope} filetype:config inurl:web.config inurl:ftp"],
  ["iis-log-files", "IIS log disclosure", "Exposure", "Google", "Medium", "IIS log files and server software markers.", "google", "{scope} ext:log \"Software: Microsoft Internet Information Services\""],
  ["phpmyadmin-dumps", "phpMyAdmin dumps", "Exposure", "Google", "High", "phpMyAdmin SQL dumps and exported database content.", "google", "{scope} (\"phpMyAdmin SQL Dump\" OR \"-- phpMyAdmin SQL Dump --\" OR \"phpMyAdmin MySQL-Dump\") (ext:sql OR ext:txt OR ext:log)"],
  ["postgres-dumps", "PostgreSQL dumps", "Exposure", "Google", "High", "PostgreSQL dump files and pg_dump export markers.", "google", "{scope} (\"-- Dumped from database version\" OR \"-- Dumped by pg_dump version\") (ext:sql OR ext:txt OR ext:log OR ext:env)"],
  ["sql-admin-inserts", "Admin SQL inserts", "Exposure", "Google", "High", "SQL dump rows that mention admin table inserts.", "google", "{scope} (\"-- Dumping data for table `admin`\" OR \"-- INSERT INTO `admin`\" OR \"insert into\") (pass OR passwd OR password) (ext:sql OR ext:txt OR ext:log)"],
  ["db-credential-configs", "Database credential configs", "Code & Secrets", "Google", "High", "YAML, properties, INI, and env files with database connection strings.", "google", "{scope} (filetype:properties OR ext:yml OR ext:yaml OR ext:ini OR ext:env OR ext:txt) (jdbc: OR \"Database Connection Information\" OR \"DB_PASSWORD\" OR \"DATABASE_URL\" OR \"password:\")"],
  ["wordpress-config-keys", "WordPress config keys", "Code & Secrets", "Google", "High", "WordPress database credentials and auth salts in indexed text files.", "google", "{scope} (\"define('DB_USER',\" OR \"define('DB_PASSWORD',\" OR \"define('SECURE_AUTH_KEY'\" OR \"define('LOGGED_IN_KEY'\") (ext:txt OR ext:cfg OR ext:env OR ext:ini)"],
  ["rails-laravel-secrets", "Rails and Laravel secrets", "Code & Secrets", "Google", "High", "Rails secret_key_base, Laravel APP_KEY, and debug configuration leaks.", "google", "{scope} (\"secret_key_base:\" OR \"APP_KEY=\" OR \"APP_DEBUG=true\" OR \"Whoops! There was an error\") (ext:env OR ext:yml OR ext:yaml OR ext:txt OR ext:log)"],
  ["mail-secrets", "Mailer and SMTP secrets", "Code & Secrets", "Google", "High", "Mailer host, SMTP password, and application mail credentials.", "google", "{scope} (\"mailer_password:\" OR \"mailer_host:\" OR \"MAIL_PASSWORD\" OR \"SMTP_PASSWORD\" OR \"smtp_pass\") (ext:yml OR ext:yaml OR ext:env OR ext:txt OR ext:cfg)"],
  ["keystore-passwords", "Keystore passwords", "Code & Secrets", "Google", "High", "Java keystore password entries in XML or text configuration.", "google", "{scope} \"keystorePass=\" (ext:xml OR ext:txt OR ext:properties OR ext:cfg) -git -gitlab"],
  ["filezilla-credentials", "FileZilla credential files", "Code & Secrets", "Google", "High", "FileZilla recent servers and site manager files.", "google", "{scope} intitle:\"index of\" (\"filezilla.xml\" OR \"sitemanager.xml\" OR \"recentservers.xml\")"],
  ["frontpage-pwd", "FrontPage password files", "Code & Secrets", "Google", "High", "Legacy FrontPage password files in indexed service paths.", "google", "{scope} intext:\"-FrontPage-\" ext:pwd inurl:(service OR authors OR administrators OR users)"],
  ["xdebug-session", "Xdebug session trigger", "Stack", "Google", "Medium", "Indexed Xdebug session start URLs.", "google", "{scope} inurl:?XDEBUG_SESSION_START=phpstorm"],
  ["xprober-pages", "XProber pages", "Stack", "Google", "High", "Public XProber PHP environment pages.", "google", "{scope} inurl:/xprober ext:php"],
  ["xampp-htdocs", "XAMPP web roots", "Stack", "Google", "High", "Indexed XAMPP htdocs directories and local web roots.", "google", "{scope} intitle:\"index of\" (\"/xampp/htdocs\" OR \"C:/xampp/htdocs/\")"],
  ["jboss-default", "JBoss default console", "Stack", "Google", "High", "JBoss welcome and management console pages.", "google", "{scope} intitle:\"Welcome to JBoss\""],
  ["plesk-default", "Plesk default page", "Infrastructure", "Google", "Low", "Default Plesk-hosted web server pages.", "google", "{scope} intitle:\"Web Server's Default Page\" intext:\"hosting using Plesk\""],
  ["sonarqube", "SonarQube panels", "Stack", "Google", "High", "Public SonarQube dashboards and project pages.", "google", "{scope} intext:\"SonarQube\" \"by SonarSource SA.\""],
  ["monsta-ftp", "Monsta FTP login", "Access Points", "Google", "Medium", "Monsta FTP web login pages.", "google", "{scope} intitle:\"Monsta ftp\" intext:\"Lock session to IP\""],
  ["github-secrets", "GitHub indexed secrets", "External Intel", "Google", "High", "Target mentions with secret keywords on GitHub.", "google", "site:github.com \"{first}\" (password OR secret OR token OR apikey OR \"api_key\")"],
  ["gitlab-secrets", "GitLab indexed secrets", "External Intel", "Google", "High", "Target mentions with secret keywords on GitLab.", "google", "site:gitlab.com \"{first}\" (password OR secret OR token OR apikey OR \"api_key\")"],
  ["paste-sites", "Paste site mentions", "External Intel", "Google", "Medium", "Target mentions on paste sites.", "google", "(site:pastebin.com OR site:paste.ee OR site:ghostbin.co) \"{first}\""],
  ["linkedin-people", "LinkedIn people", "External Intel", "Google", "Info", "People and company mentions on LinkedIn.", "google", "site:linkedin.com/in \"{first}\""],
  ["reddit-mentions", "Reddit mentions", "External Intel", "Google", "Info", "Target mentions on Reddit.", "google", "site:reddit.com \"{first}\""],
  ["stackoverflow-mentions", "Stack Overflow mentions", "External Intel", "Google", "Info", "Target mentions in developer questions.", "google", "site:stackoverflow.com \"{first}\""]
];

const rawHelpers = [
  ["crtsh", "crt.sh", "Certificates", "Certificate transparency lookup.", "https://crt.sh/?q=%25.{firstEnc}", true],
  ["wayback", "Wayback Machine", "Archive", "Archived URL snapshots.", "https://web.archive.org/web/*/{firstEnc}/*", true],
  ["urlscan", "urlscan.io", "Traffic Intel", "Indexed scans and observed URLs.", "https://urlscan.io/search/#domain:{firstEnc}", true],
  ["github", "GitHub Code", "Code Search", "Repository code search for the target.", "https://github.com/search?q={firstEnc}&type=code", true],
  ["publicwww", "PublicWWW", "Source Search", "Source search for target strings.", "https://publicwww.com/websites/{firstEnc}/", true],
  ["shodan", "Shodan", "Internet Assets", "Internet-exposed host search.", "https://www.shodan.io/search?query={firstEnc}", true],
  ["censys", "Censys", "Internet Assets", "Internet intelligence search.", "https://search.censys.io/?q={firstEnc}", true],
  ["virustotal", "VirusTotal", "Domain Intel", "Passive DNS and domain relations.", "https://www.virustotal.com/gui/domain/{firstEnc}", true],
  ["securitytrails", "SecurityTrails", "DNS Intel", "DNS and historical domain data.", "https://securitytrails.com/domain/{firstEnc}/dns", true],
  ["builtwith", "BuiltWith", "Tech Stack", "Technology stack fingerprinting.", "https://builtwith.com/{firstEnc}", true]
];

const dorks = rawDorks.map(rowToDork);
const helpers = rawHelpers.map(rowToHelper);

const workflows = [
  {
    id: "endpoints",
    title: "Endpoint Mapper",
    kicker: "common routes, docs, parameters, callbacks",
    brief: "API docs, JS routes, params, uploads, staging.",
    categories: ["Endpoint Discovery"],
    priority: ["common-endpoints", "api-docs-expanded", "well-known-endpoints", "js-endpoint-mining", "parameter-hunting", "callback-webhook", "upload-download-combo", "admin-subdomains", "staging-subdomains"]
  },
  {
    id: "leaks",
    title: "Leak Hunter",
    kicker: "public leaks and indexed exposure",
    brief: "Config, backups, DB files, logs, secrets.",
    categories: ["Exposure", "Documents", "Code & Secrets"],
    priority: ["env-files", "config-files", "database-files", "backup-archives", "phpmyadmin-dumps", "db-credential-configs", "wordpress-config-keys", "private-keys", "aws-keys", "api-keys", "sql-errors"]
  },
  {
    id: "auth",
    title: "Auth & SSO",
    kicker: "login, identity, reset, redirect flows",
    brief: "Login, OAuth, SAML, OIDC, service desks.",
    categories: ["Auth & SSO"],
    priority: ["auth-basic", "oauth-authorize", "saml-adfs", "oidc-idp", "logout-callbacks", "service-desk-login", "vpn-web-login", "admin-subdomains"]
  },
  {
    id: "surface",
    title: "Attack Surface",
    kicker: "subdomains, certificates, internet assets",
    brief: "Subdomains, indexed ports, status pages, old paths.",
    categories: ["Infrastructure", "Archive"],
    priority: ["subdomains", "sub-subdomains", "ports", "server-status", "prometheus", "kibana", "status-pages", "robots-sitemap"]
  },
  {
    id: "stack",
    title: "Stack Fingerprint",
    kicker: "cms, frameworks, exposed components",
    brief: "WordPress, Drupal, Joomla, Struts, ArcGIS.",
    categories: ["Stack"],
    priority: ["wordpress", "wp-config-index", "jenkins", "grafana", "sonarqube", "phpinfo", "xdebug-session", "xprober-pages", "laravel-debug", "django-debug", "struts"]
  },
  {
    id: "apis",
    title: "Cloud & APIs",
    kicker: "api docs, tokens, buckets, client-side endpoints",
    brief: "Swagger, GraphQL, JS APIs, Firebase, cloud buckets.",
    categories: ["Cloud & APIs"],
    priority: ["swagger-openapi", "api-docs-expanded", "graphql", "api-js", "js-endpoint-mining", "firebase", "cloud-buckets", "jwt-bearer", "azure-strings", "gcp-service-account"]
  },
  {
    id: "entry",
    title: "Entry Points",
    kicker: "login, admin, upload, redirect paths",
    brief: "Login portals, setup files, upload endpoints.",
    categories: ["Access Points"],
    priority: ["login-pages", "admin-panels", "auth-basic", "phpmyadmin", "adminer", "admin-aspx", "service-desk-login", "upload-forms", "download-file", "open-redirects", "monsta-ftp"]
  },
  {
    id: "mentions",
    title: "Mentions Intel",
    kicker: "code hosts, paste sites, people, forums",
    brief: "GitHub, GitLab, paste sites, LinkedIn, Reddit.",
    categories: ["External Intel"],
    priority: ["github-secrets", "gitlab-secrets", "paste-sites", "linkedin-people", "reddit-mentions", "stackoverflow-mentions"]
  },
  {
    id: "all",
    title: "Full Arsenal",
    kicker: "all curated google dorks",
    brief: "Every curated query in one list.",
    categories: [],
    priority: []
  }
];

const state = {
  mission: "endpoints",
  search: "",
  selectedId: "common-endpoints",
  toastTimer: null
};

const els = {
  targetInput: document.getElementById("targetInput"),
  scopeForm: document.getElementById("scopeForm"),
  targetChips: document.getElementById("targetChips"),
  missionRail: document.getElementById("missionRail"),
  actionList: document.getElementById("actionList"),
  helperList: document.getElementById("helperList"),
  searchInput: document.getElementById("searchInput"),
  statDorks: document.getElementById("statDorks"),
  statMissions: document.getElementById("statMissions"),
  statTargets: document.getElementById("statTargets"),
  missionTitle: document.getElementById("missionTitle"),
  missionKicker: document.getElementById("missionKicker"),
  signalMission: document.getElementById("signalMission"),
  signalCount: document.getElementById("signalCount"),
  actionCount: document.getElementById("actionCount"),
  activeEngine: document.getElementById("activeEngine"),
  activeTitle: document.getElementById("activeTitle"),
  activeDescription: document.getElementById("activeDescription"),
  queryOutput: document.getElementById("queryOutput"),
  openSelectedBtn: document.getElementById("openSelectedBtn"),
  copySelectedBtn: document.getElementById("copySelectedBtn"),
  copyMissionBtn: document.getElementById("copyMissionBtn"),
  copyHelpersBtn: document.getElementById("copyHelpersBtn"),
  resetBtn: document.getElementById("resetBtn"),
  toast: document.getElementById("toast")
};

function rowToDork([id, title, category, engine, severity, description, type, template]) {
  return { id, title, category, engine, severity, description, type, template, source: "Core" };
}

function rowToHelper([id, title, category, description, template, needsTarget]) {
  return { id, title, category, description, template, needsTarget };
}

function parseTargets(value, fallback = false) {
  const raw = value.split(/[\s,]+/).map(part => part.trim()).filter(Boolean);
  if (!raw.length && fallback) return [sampleTarget];
  return raw.map(normalizeTarget).filter(Boolean).filter((target, index, list) => list.indexOf(target) === index);
}

function normalizeTarget(value) {
  let target = value.trim().replace(/^\*\./, "");
  if (!target) return "";
  try {
    const withScheme = /^[a-z]+:\/\//i.test(target) ? target : `https://${target}`;
    target = new URL(withScheme).hostname || target;
  } catch {
    target = target.replace(/^[a-z]+:\/\//i, "").split("/")[0].split("?")[0].split("#")[0];
  }
  const cleaned = target.replace(/^www\./i, "").replace(/\.$/, "").toLowerCase();
  const isHostname = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(cleaned);
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(cleaned);
  return isHostname || isIpv4 ? cleaned : "";
}

function context() {
  const realTargets = parseTargets(els.targetInput.value);
  const targets = realTargets.length ? realTargets : parseTargets("", true);
  const scope = targets.length > 1 ? `(${targets.map(target => `site:${target}`).join(" OR ")})` : `site:${targets[0]}`;
  const hasRealTarget = realTargets.length > 0;
  return { targets, realTargets, first: targets[0], scope, targetsText: targets.join(" "), hasRealTarget, isSample: !hasRealTarget };
}

function expand(template, ctx) {
  return template
    .replace(/\{each:([^}]+)\}/g, (_, pattern) => ctx.targets.map(target => pattern.replace(/\$t/g, target).replace(/\$e/g, encodeURIComponent(target))).join(" OR "))
    .replace(/\{scope\}/g, ctx.scope)
    .replace(/\{targets\}/g, ctx.targetsText)
    .replace(/\{firstEnc\}/g, encodeURIComponent(ctx.first))
    .replace(/\{first\}/g, ctx.first);
}

function queryText(item, ctx) {
  return expand(item.template, ctx);
}

function engineUrl(item, ctx) {
  const query = queryText(item, ctx);
  if (item.type === "url") return query;
  if (item.type === "github") return `https://github.com/search?q=${encodeURIComponent(query)}&type=code`;
  if (item.type === "yandex") return `https://yandex.com/search/?text=${encodeURIComponent(query)}`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function currentWorkflow() {
  return workflows.find(workflow => workflow.id === state.mission) || workflows[0];
}

function actionKey(item) {
  return `${item.type}|${item.template}`;
}

function dedupeActions(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = actionKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function actionMatchesSearch(item) {
  if (!state.search) return true;
  const haystack = `${item.title} ${item.category} ${item.description} ${item.engine} ${item.severity} ${item.source}`.toLowerCase();
  return haystack.includes(state.search.toLowerCase());
}

function workflowActions(workflow = currentWorkflow(), ignoreSearch = false) {
  let items;
  if (workflow.id === "all") {
    items = dorks.slice();
  } else if (workflow.id === "community") {
    items = dorks.filter(item => item.source === "Community");
  } else {
    items = dorks.filter(item => workflow.categories.includes(item.category) || workflow.priority.includes(item.id));
  }

  items = dedupeActions(items);
  if (!ignoreSearch) items = items.filter(actionMatchesSearch);

  const priority = workflow.priority || [];
  const severityRank = { High: 0, Medium: 1, Low: 2, Info: 3 };
  return items.sort((a, b) => {
    const ap = priority.includes(a.id) ? priority.indexOf(a.id) : 999;
    const bp = priority.includes(b.id) ? priority.indexOf(b.id) : 999;
    if (ap !== bp) return ap - bp;
    return (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9) || a.title.localeCompare(b.title);
  });
}

function selectedAction() {
  const visible = workflowActions();
  const selected = visible.find(item => item.id === state.selectedId);
  return selected || visible[0] || dorks[0];
}

function ensureSelection() {
  const visible = workflowActions();
  if (!visible.length) return;
  if (!visible.some(item => item.id === state.selectedId)) {
    state.selectedId = visible[0].id;
  }
}

function severityPill(severity) {
  if (severity === "High") return "pill hot";
  if (severity === "Info") return "pill info";
  return "pill";
}

function renderTargets() {
  const ctx = context();
  els.targetChips.innerHTML = "";
  if (ctx.hasRealTarget) {
    ctx.realTargets.forEach(target => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = target;
      els.targetChips.appendChild(chip);
    });
  } else {
    const chip = document.createElement("span");
    chip.className = "chip empty";
    chip.textContent = `Previewing ${sampleTarget}. Enter authorized scope before opening or copying.`;
    els.targetChips.appendChild(chip);
  }
  els.statTargets.textContent = String(ctx.realTargets.length);
}

function renderStats() {
  els.statDorks.textContent = String(dorks.length);
  els.statMissions.textContent = String(workflows.length);
}

function renderMissions() {
  els.missionRail.innerHTML = "";
  workflows.forEach(workflow => {
    const count = workflowActions(workflow, true).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mission-btn";
    button.dataset.mission = workflow.id;
    button.setAttribute("aria-pressed", String(workflow.id === state.mission));
    button.innerHTML = `
      <span><strong>${escapeHtml(workflow.title)}</strong><small>${escapeHtml(workflow.brief)}</small></span>
      <b>${count}</b>`;
    els.missionRail.appendChild(button);
  });
}

function renderActions() {
  ensureSelection();
  const workflow = currentWorkflow();
  const visible = workflowActions();
  els.actionList.innerHTML = "";
  els.missionTitle.textContent = workflow.title;
  els.missionKicker.textContent = workflow.kicker;
  els.signalMission.textContent = workflow.title;
  els.signalCount.textContent = `${visible.length} actions armed`;
  els.actionCount.textContent = `${visible.length} visible`;

  if (!visible.length) {
    els.actionList.innerHTML = `<div class="empty-state">No action matched this filter.</div>`;
    return;
  }

  visible.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = `action-row${item.id === state.selectedId ? " is-active" : ""}`;
    row.dataset.id = item.id;
    row.innerHTML = `
      <div class="action-index">${String(index + 1).padStart(2, "0")}</div>
      <div class="action-main">
        <div class="action-title">
          <strong>${escapeHtml(item.title)}</strong>
          <span class="${severityPill(item.severity)}">${item.severity}</span>
          <span class="pill info">${item.engine}</span>
          <span class="pill">${item.category}</span>
        </div>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <div class="row-actions">
        <button type="button" data-action="open" data-id="${item.id}">open</button>
        <button type="button" data-action="copy" data-id="${item.id}">copy</button>
      </div>`;
    els.actionList.appendChild(row);
  });
}

function renderQuery() {
  const item = selectedAction();
  const ctx = context();
  els.activeTitle.textContent = item.title;
  els.activeDescription.textContent = item.description;
  els.activeEngine.textContent = item.engine;
  const queryLabel = ctx.isSample ? "sample query" : "query";
  const openLabel = ctx.isSample ? "sample open" : "open";
  els.queryOutput.textContent = `${queryLabel}:\n${queryText(item, ctx)}\n\n${openLabel}:\n${engineUrl(item, ctx)}`;
  els.openSelectedBtn.textContent = "Scan Keyword";
}

function renderHelpers() {
  const ctx = context();
  els.helperList.innerHTML = "";
  helpers.forEach(item => {
    const helper = document.createElement("div");
    helper.className = "helper-item";
    helper.innerHTML = `
      <span><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.category)}</span></span>
      <button type="button" data-helper="${item.id}">open</button>`;
    els.helperList.appendChild(helper);
  });
}

function render() {
  renderStats();
  renderTargets();
  renderMissions();
  renderActions();
  renderQuery();
  renderHelpers();
}

function requireTarget() {
  if (context().hasRealTarget) return true;
  showToast("Enter an authorized target domain first.");
  els.targetInput.focus();
  return false;
}

function openExternal(url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function openDork(id) {
  if (!requireTarget()) return;
  const item = dorks.find(dork => dork.id === id);
  if (!item) return;
  openExternal(engineUrl(item, context()));
  selectDork(item.id);
}

function copyDork(id) {
  if (!requireTarget()) return;
  const item = dorks.find(dork => dork.id === id);
  if (item) copyText(queryText(item, context()));
}

function openHelper(id) {
  const item = helpers.find(helper => helper.id === id);
  if (!item) return;
  if (item.needsTarget && !requireTarget()) return;
  openExternal(expand(item.template, context()));
}

function copyHelper(id) {
  const item = helpers.find(helper => helper.id === id);
  if (item && item.needsTarget && !requireTarget()) return;
  if (item) copyText(expand(item.template, context()));
}

function selectDork(id, rerender = true) {
  state.selectedId = id;
  if (rerender) renderActions();
  renderQuery();
}

function copyMission() {
  if (!requireTarget()) return;
  const ctx = context();
  const lines = workflowActions().map(item => `${item.title}\n${queryText(item, ctx)}\n${engineUrl(item, ctx)}`);
  if (!lines.length) return showToast("No mission actions to copy.");
  copyText(lines.join("\n\n"));
}

function copyHelpers() {
  if (!requireTarget()) return;
  const ctx = context();
  const lines = helpers.map(item => `${item.title}\n${expand(item.template, ctx)}`);
  copyText(lines.join("\n\n"));
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("Copied to clipboard.");
}

function showToast(message) {
  clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function resetFilters() {
  state.mission = "endpoints";
  state.search = "";
  state.selectedId = "common-endpoints";
  els.searchInput.value = "";
  render();
}

els.scopeForm.addEventListener("submit", event => {
  event.preventDefault();
  openDork(state.selectedId);
});

els.targetInput.addEventListener("input", render);
els.searchInput.addEventListener("input", event => {
  state.search = event.target.value.trim();
  renderActions();
  renderQuery();
});

els.missionRail.addEventListener("click", event => {
  const button = event.target.closest("[data-mission]");
  if (!button) return;
  state.mission = button.dataset.mission;
  state.search = "";
  els.searchInput.value = "";
  const first = workflowActions()[0];
  if (first) state.selectedId = first.id;
  render();
});

els.actionList.addEventListener("click", event => {
  const actionButton = event.target.closest("[data-action]");
  const row = event.target.closest(".action-row[data-id]");
  if (actionButton) {
    const { action, id } = actionButton.dataset;
    if (action === "open") openDork(id);
    if (action === "copy") copyDork(id);
    return;
  }
  if (row) {
    state.selectedId = row.dataset.id;
    renderActions();
    renderQuery();
  }
});

els.helperList.addEventListener("click", event => {
  const openButton = event.target.closest("[data-helper]");
  if (openButton) openHelper(openButton.dataset.helper);
});

els.openSelectedBtn.addEventListener("click", () => openDork(state.selectedId));
els.copySelectedBtn.addEventListener("click", () => copyDork(state.selectedId));
els.copyMissionBtn.addEventListener("click", copyMission);
els.copyHelpersBtn.addEventListener("click", copyHelpers);
els.resetBtn.addEventListener("click", resetFilters);

render();
