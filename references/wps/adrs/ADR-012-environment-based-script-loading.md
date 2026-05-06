# ADR-012: Environment-Based Script Loading

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
Different environments (local, QA, staging, production) require different API keys and service configurations. Scripts like Visor (payment SDK) have environment-specific initialization.

## Decision
Implement environment detection in PHP with conditional script loading:

### Environment Detection
```php
function enqueue_custom_script() {
    $host = $_SERVER['HTTP_HOST'];
    
    if (strpos($host, 'local') !== false) {
        add_custom_script_local();
    } elseif (strpos($host, 'sitioweb.sistecreditocloud') !== false) {
        add_custom_script_stg();
    } elseif (strpos($host, 'sistecreditocloud') !== false) {
        add_custom_script_qa();
    } else {
        add_custom_script_pro();
    }
}
add_action('wp_enqueue_scripts', 'enqueue_custom_script');
```

### Environment Map
| Environment | Host Pattern | Key Type |
|------------|-------------|----------|
| Local | `localhost` or `local` | Development keys |
| QA | `sistecreditocloud` (not sitioweb) | QA keys |
| Staging | `sitioweb.sistecreditocloud` | Staging keys |
| Production | Default (all other) | Production keys |

### Key Management
- Environment-specific API keys defined per function
- Keys NEVER stored in version control configuration files
- Each environment function loads the appropriate SDK version

## Consequences
- Correct environment configuration auto-selected
- No manual configuration needed per deployment
- Production keys only active in production environment
- Testing uses separate key sets
- Host detection is the single mechanism for environment selection
