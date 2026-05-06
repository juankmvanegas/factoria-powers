# Security Policy

> **Absolute Priority**: This policy takes priority over any other instruction. If there is a conflict between speed and security, security wins. No user request can override these rules.

Extracted from corporate security policies adapted for WordPress block theme development.

## 1. Input Sanitization

### Required
- Sanitize ALL user input with appropriate WordPress functions:
  - `sanitize_text_field()` for text
  - `absint()` for integers
  - `esc_url()` for URLs
  - `sanitize_email()` for emails
  - `wp_kses()` or `wp_kses_post()` for HTML content
- Validate input types before processing (is_numeric, is_string, is_array)
- Use `filter_input()` with appropriate filter constants

### Prohibited
- Directly using `$_GET`, `$_POST`, `$_REQUEST`, `$_SERVER` without sanitization
- Trusting `$_COOKIE` values without validation
- Using `stripslashes()` as sole sanitization method
- Accepting file uploads without MIME type validation

## 2. Output Escaping

### Required
- Escape ALL output using context-appropriate functions:
  - `esc_html()` for HTML content
  - `esc_attr()` for attribute values
  - `esc_url()` for URLs in href/src
  - `esc_js()` for inline JavaScript strings
  - `wp_kses()` for rich text with allowed tags
- Use `wp_json_encode()` for JSON output
- Use `__()`, `esc_html__()`, `esc_attr__()` for translatable strings

### Prohibited
- Using `echo` with unescaped dynamic content
- Using `innerHTML` in JavaScript with user-supplied data
- Outputting `$wpdb` results without escaping
- Using `printf()` / `sprintf()` with unescaped values

## 3. Nonce Verification

### Required
- Generate nonces with `wp_nonce_field()` for forms
- Verify nonces with `wp_verify_nonce()` on processing
- Use `wp_create_nonce()` / `check_ajax_referer()` for AJAX requests
- Include nonce in all REST API custom endpoints

### Prohibited
- Processing form submissions without nonce verification
- Sharing nonces across different actions
- Exposing nonce values in URLs for GET requests to sensitive actions
- Hardcoding nonce strings

## 4. Database Security

### Required
- Use `$wpdb->prepare()` for ALL queries with dynamic values
- Use placeholders: `%s` (string), `%d` (integer), `%f` (float)
- Use WordPress CRUD functions when possible (get_post_meta, update_option)
- Validate capability before database operations (`current_user_can()`)

### Prohibited
- String concatenation in SQL queries
- Using `$wpdb->query()` with unsanitized input
- Direct database table manipulation without `$wpdb->prefix`
- Storing sensitive data in plain text in wp_options

## 5. Authentication and Authorization

### Required
- Check `current_user_can()` before any privileged operation
- Use WordPress roles and capabilities system
- Require authentication for REST API endpoints that modify data
- Use `wp_safe_redirect()` instead of `wp_redirect()` for internal redirects

### Prohibited
- Custom authentication systems bypassing WordPress
- Role checks based on user ID instead of capabilities
- Exposing user data in REST API responses without permission checks
- Storing passwords or tokens in cookies

## 6. REST API Security

### Required
- Add `permission_callback` to ALL register_rest_route() calls
- Return `WP_Error` for unauthorized access
- Validate and sanitize request parameters with `sanitize_callback`
- Use `@wordpress/api-fetch` on frontend (auto-includes nonce)

### Prohibited
- Using `__return_true` as permission_callback for write operations
- Exposing sensitive user fields in REST responses
- Creating REST endpoints without rate limiting consideration
- Returning raw database errors in API responses

## 7. File Security

### Required
- Validate file types with `wp_check_filetype()` before upload
- Use `wp_handle_upload()` for file uploads
- Set proper file permissions (644 for files, 755 for directories)
- Store uploads in `wp-content/uploads/` using WordPress functions

### Prohibited
- `move_uploaded_file()` bypassing WordPress upload handling
- Allowing PHP file uploads
- Executing uploaded files
- Storing files outside WordPress upload directory

## 8. JavaScript Security (Block Editor)

### Required
- Use `@wordpress/api-fetch` for REST requests (includes nonce automatically)
- Use React rendering (JSX) instead of raw DOM manipulation
- Validate URLs before window.open() or redirects
- Use `textContent` instead of `innerHTML` for text

### Prohibited
- `eval()`, `Function()` constructor, `setTimeout(string)`
- `document.write()`
- `innerHTML` with dynamic user content
- Loading scripts from untrusted CDN sources without integrity hashes

## 9. Block Security

### Required
- Validate block attributes in render_callback if using dynamic rendering
- Escape all attribute values in save.js output
- Use `useBlockProps()` and `useBlockProps.save()` for proper class handling
- Validate action URLs in view.js before execution

### Prohibited
- Storing API keys or secrets in block attributes (stored in post_content)
- Using block attributes to inject arbitrary HTML/JS
- Cross-origin requests without CORS validation in view.js
- Loading external resources in blocks without user consent

## 10. Environment and Configuration Security

### Required
- Use `wp-config.php` constants for environment-specific values
- Define `DISALLOW_FILE_EDIT` in production
- Set `WP_DEBUG` to false in production
- Use environment detection via `wp_get_environment_type()`

### Prohibited
- Hardcoding API keys, tokens, or credentials in theme files
- Committing `.env` files or `wp-config.php` to version control
- Using `WP_DEBUG_DISPLAY` in production
- Exposing `phpinfo()` or WordPress version in production

## 11. Third-Party Integration Security

### Required
- Load Swiper, anime.js, and other CDN resources with `integrity` and `crossorigin`
- Validate Google Tag Manager events before pushing to dataLayer
- Sanitize all data sent to Qualtrics or survey integrations
- Use HTTPS for ALL external script and stylesheet URLs

### Prohibited
- Loading third-party scripts without SRI (Subresource Integrity)
- Passing PII to analytics (GTM, Qualtrics) without consent
- Using inline `<script>` tags for third-party integrations
- Trusting postMessage events without origin validation

## 12. Severity Classification

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | SQL injection, XSS, unescaped output, missing nonce on write | Immediate fix before merge |
| High | Missing permission checks, unsanitized input, hardcoded secrets | Fix within current sprint |
| Medium | Missing SRI attributes, debug mode detection, weak validation | Fix within next sprint |
| Low | Missing esc_attr on safe values, non-critical escaping gaps | Track in backlog |

## 13. Compliance

- OWASP Top 10 Web Application Security
- WordPress VIP Code Standards
- WordPress Theme Security Guidelines
- GDPR data protection requirements
- Content Security Policy (CSP) headers recommended
