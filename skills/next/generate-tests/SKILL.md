---
name: next-generate-tests
description: "Use when new code has been written and tests need to be generated or a service/component needs full test coverage"
---

---
name: generate-tests
description: "Generar suite de tests Jest + RTL para services, adapters, componentes y route handlers en Next.js 14"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate Tests

## Proposito

Generar suite completa de tests automatizados para un servicio, adapter,
componente o route handler de Next.js 14, siguiendo los patrones de testing
definidos en la testing-policy de Factoria-Next.

## Input

El usuario indica que quiere testear. Puede ser:
- Un servicio: `src/application/services/<nombre>.service.ts`
- Un adapter: `src/infrastructure/adapters/<nombre>.adapter.ts`
- Un componente: `src/presentation/components/<nombre>.tsx`
- Un route handler: `src/presentation/app/api/<ruta>/route.ts`
- Un hook: `src/presentation/hooks/use<nombre>.ts`
- Un modulo completo: directorio con multiples archivos

## Patron AAA (Arrange-Act-Assert)

Todos los tests siguen el patron AAA:

```typescript
describe('NombreDelModulo', () => {
  // Arrange comun en beforeEach si aplica

  it('should <comportamiento esperado> when <condicion>', () => {
    // Arrange — preparar datos y mocks
    // Act — ejecutar la accion
    // Assert — verificar resultado
  });
});
```

## Patrones por Tipo

### Services (Jest puro)
- Mock de adapters abstractos con `jest.fn()`
- Testear cada metodo del use case
- Cubrir: happy path, error handling, edge cases
- Verificar que se llama al adapter correcto con los parametros correctos

### Adapters (Jest + fetch mock)
- Mock de `fetch` global o `jest.spyOn(global, 'fetch')`
- Testear: respuesta exitosa, error HTTP, network error, timeout
- Verificar headers, URL, body enviados
- Testear transformacion de response a DTO

### Components (Jest + RTL)
- `render()` + `screen` para queries
- Server Components: testear output HTML
- Client Components: testear interactividad con `userEvent`
- Testear estados: loading, error, empty, populated
- NO testear implementacion interna — testear comportamiento visible

### Route Handlers (Jest + NextRequest mock)
- Crear `NextRequest` mock con los datos necesarios
- Testear: respuesta exitosa, validacion fallida, error de servidor
- Verificar status codes, headers, body de respuesta
- Testear autenticacion si la ruta es protegida

### Hooks (Jest + renderHook)
- `renderHook()` de @testing-library/react
- Testear estado inicial, actualizaciones, cleanup
- Mock de dependencias externas (context, fetch)

## Edge Cases Obligatorios

Para TODOS los tipos de test, incluir:
- Datos vacios o nulos
- Errores HTTP (400, 401, 403, 404, 500)
- Promise rejection / network failure
- Estados de autenticacion (logueado, no logueado, token expirado)
- Inputs invalidos o malformados
- Listas vacias vs listas con datos vs listas grandes

## Output

- Archivo `.test.ts` o `.test.tsx` junto al archivo testeado
- Naming: `<nombre>.test.ts` o `<nombre>.test.tsx`
- Ejecutar tests al finalizar: `npx jest <archivo.test>`
- Reportar cobertura del archivo testeado

## Reglas

- Un comportamiento por test (un `it()` = una asercion logica)
- NUNCA usar `any` en tests — tipar correctamente
- NUNCA testear implementacion interna — solo comportamiento observable
- SIEMPRE mock de dependencias externas (fetch, APIs, providers)
- Cobertura minima: 80% del archivo testeado
- Si el test falla: corregir el test O reportar bug en el codigo
