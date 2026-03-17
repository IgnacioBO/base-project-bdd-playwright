# Playwright-BDD
Tanto Playwright como Cucumber tienen sus propios test runners. Si se usa Cucumber como runner, Playwright se usaría solo como biblioteca para ejecutar lso escenarios BDD. 

Con **playwright-bdd** es posible convertir los escenarios BDD a archivos test directo a Playwright, permitiendo usarlo como runner, lo que de ventajas sobre usar el runner de cucumber:
- Inicialización y limpieza automática de los browsers
- Captura automática de screenshots, videos y traces
- Paralelización usando sharding
- Auto-wait de elementos page
- Comparación visual incluida de los test
- Uso de fixture que permite entre otras funciones, manejar flujos de los test (similar a los hooks) y variables entre los steps
- Aserciones incluidas

[Mas info de las ventajas](https://playwright.dev/docs/library#key-differences)

Ademas las ventajas propias de cucumber:
- Usar archivos .feature con sus steps
- Uso de sistemas de tags con la lógica de cucumber
- Reportes cucumber
- Reutilización de steps
- Subir los reportes a reports.cucumber.io

## Como empezar a usarlo
1. Tener instalado un IDE (ej Visual Studio Code `VSCode`)
2. Instalar NodeJS
3. Instalar idealmente los plugins de Playwright y Cucumber en VSCode
4. Clonar el repositorio
5. Instalar las dependencias y luego los browser soportados desde la linea de comandos

    ```bash
    npm install
    npx playwright install
    ```
6. Revisar `.env.example` para poder crear los archivos `env.pais.ambiente.local`, como puede ser `env.cl.qa.local` con las **variables sensibles** como `USER` o `PASSWORD`[ver mas detalles](#env-example-y-env-local)
7. Es importante siempre usar npx bddgen primero para generar los test basados en cucumber. Para ejecutar todos los casos

    Windows
    ```
    npx bddgen; npx playwright test
    ```
    bash
    ```bash
    npx bddgen && npx playwright test
    ```

### Si es un proyecto nuevo de cero generalmente se instalan estas librearias separadas
Iniciar e instalar lib del proyecto
1. `npm init playwright@latest`
2. `npm install -D dotenv`
3. `npm install -D winston`
4. `npm install -D envalid`

Instalar playwright-bdd
1. `npm i -D playwright-bdd`

## Environment variables
Las variables de entorno deben guardarse dentro de los archivos `.env.ambiente.pais` como por ejemplo `.env.qa.cl`
Dentro de config/env.ts pueden configurarse en mas detalles para poder controlar el tipo de dato de cada uno, si tiene valores por defecto o tiene valores especifico, etc. Para usarse dentro de los test solo se importa env y se usa:import 
```ts
{ env } from '../../../config/env'
Given('Estoy logueado', async ({ /*...*/ }) => {
    const user = env.TEST_USER; 
    const pass = env.TEST_PASS;
    const url = env.URL;
})
```
### env example y env local
Dentro de `env.example` están unos ejemplos de las variables sensibles que se usan, al ser sensibles estas deben definirse dentro del repositorio como secrets por ambiente. Para que pueda probarse en **local** debe crearse archivos locales con esta norma `.env.ambiente.pais.local` con los secrets.
Ejemplo de env.qa.cl.local
```properties
TEST_USER=mi_user
TEST_PASS=mi_pass
```
## Algunos comandos útiles
1. Ejecutar según país, ambiente y browser (por defecto solo viene para Chrome, habilitar los demás en `playwright.config.ts`)
 - bash: 

    ```
    APP_ENV=qa COUNTRY=cl npx bddgen npx playwright test --project "chromium"
    ```
 - powershell: 
    
    ```
    $env:APP_ENV="qa"; $env:COUNTRY="cl"; npx bddgen ; npx playwright test --project "chromium"
    ```
 - cmd windows: 
    
    ```
    set "APP_ENV=qa" && set "COUNTRY=cl" && npx bddgen && npx playwright test --project "chromium"
    ```
2. `HEADED="false"` por defecto se ejecutan de manera headed, si quiere ejecutarse headless poner la variable de entorno en false
3. Ejecutar test específicos
 - `--tags "@tag"` Por tags  (el mas recomendado si se usa Cucumber), permite usar conectores lógicos (and, or, not)
    
    ```
    npx bddgen --tags "@POM or @POM2"  ; npx playwright test
    ```

 - `-g "parte del titulo"` Por parte del nombre del escenario, usando 
    
     ```
    npx bddgen ; npx playwright test -g "Compra de productos2"
    ```

 - `--grep-invert "2"` Los escenarios que no tienen parte de un texto 
    
    ```
    npx bddgen ; npx playwright test --grep-invert "2"
    ```

4. `--repeat-each x` Donde x es un numero, permite repetir las pruebas x cantidad de veces
    
    ```
    npx bddgen ; npx playwright test --repeat-each 2
    ```

5. `test --ui` Ejecutar en modo UI, muy util para depurar y ejecutar cada test de manera aislada y poder inspeccionar elementos, locators, logs internos, DOM, errors, network, etc.
    
    ```
    npx bddgen ; npx playwright test --ui
    ```
    
6. `test --trace on` Ejecuta los test en modo trace, es decir registra toda la actividad (genera archivos pesados) similar al modo UI, pero ya con los test ejecutados. Luego de ejecutarse en modo trace, debe abrirse el reporte usando `npx playwright show-report` y buscar donde dice ***view trace***
    
    ```
    npx bddgen ; npx playwright test --trace on
    npx playwright show-report reports\cucumber-report
    ```




## Algunas configuraciones
Si se quiere cambiar la dirección de los archivos feature, steps y support (fixtures, hooks), se puede ir a playwright.config.ts y modificar las ruta en estas lineas
```ts
const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: [
    'tests/features/steps/**/*.ts',
    'tests/features/support/**/*.ts',
  ],
});
```

**Si el plugin de cucumber no reconoce los steps**
1. Ir a la extension de Cucumber
2. Ir a settings y agregar los path de steps y features en "cucumber.features" y "cucumber.glue".
    ```json
    "cucumber.features": [
            "**/*.feature",
        ...
    ],
    "cucumber.glue": [
            "**/features/**/*.ts",
            ....
    ]
    ```

## Como generar los steps
Se puede directamente con el plugin de Cucumber de VSCode sin embargo, puede generarlo en un formato no compatible con el proyecto (que es formato playwright-bdd a diferencia del formato cucumber que podría generar), para eso se recomienda usar el siguiente 
```
npx bddgen
```


## Fixtures vs Hooks
Este proyecto soporta tanto hooks como fixtures para controlar los flujos. Ambos sirve para poder ejecutar código antes o después de la ejecuciones de workers, escenarios, steps, etc. Los fixtures generalmente se recomiendan porque permiten mayor control una vez dominados.

Los fixture ademas permiten inyectar de manera sencilla los page-objects a los steps, asi como también permiten inyectar variables que pueden ser compartidas entre los steps de un test sin problemas


### Algunos fixtures útiles

- `$test` permite usar funciones que manejan el test, como .skip() para saltar el test
- `$testInfo` permite generar cierta info para los test como hacer adjuntos con .attach(), también permite obtener el nombre del escenario 
- `$step` permite obtener información del step como el titulo con .title
- `$tags` permite manejar y obtener los tags

Estos se usan como parámetro dentro de los test, por ejemplo:
```ts
Given('I do something', async ({ browserName, $test, $tags }) => { 
  if (browserName === 'firefox') $test.skip();
    console.log($tags)
  // ...
});
```


### Pasar datos entre steps usando fixtures (`ctx`, `world`)
- Se puede usar dentro de fixtures un type `ctx` del tipo que queramos
- El mas simple es `Record<string, any>;` para usar como queramos por ejemplo usarlo `ctx.valor = "aa"`
  ```ts
  type Ctx = Record<string, any>;

  export const test = base.extend<{ ctx: Ctx }>({
    ctx: async ({}, use) => {
      const ctx = {} as Ctx;
      await use(ctx);
    },
  });
  export const { Given, When, Then} = createBdd(test);
  ```

- Luego se usa:
  ```ts
  import { Given, When, Then } from '../support/fixtures';
  Given('Estoy logueado', async ({ page, loginPage, ctx}) => {
      ctx.nuevoLoco ="Soy un valor en el contexto";
  }
  ```

- También puede ser mas estricto si se require, detallando atributos con tipos específicos:
  ```ts
  type Ctx = {
    newTapPromise: Promise<Page> 
  };
    export const test = base.extend<{ ctx: Ctx }>({
    ctx: async ({}, use) => {
      const ctx = {} as Ctx;
      await use(ctx);
    },
  });
  export const { Given, When, Then} = createBdd(test);
  ```

- Otra manera es usar `world` y que sea mas especifico, por ejemplo
  ```ts
  type World = {
      productoRandomSel?: Product;
      grupoDeProductos: Product[];
  };
  export const test = base.extend<Fixtures>({
      world: async ({}, use) => {
          const world: World = {
              productoRandomSel: undefined, //Inicializo el producto random seleccionado como un objeto vacío
              grupoDeProductos: [] as Product[], //Inicializo el grupo de productos como un array vacío, pero con el tipo Product[]
          };
          await use(world);
      },
    });
    export const { Given, When, Then} = createBdd(test);
  ```
- Luego usar el `world` por ejemplo:
  ```ts
  import { Given, When, Then } from '../support/fixtures';
  When('Agrego un producto al carrito', async ({homePage, world}) => {
      world.productoRandomSel = await homePage.clickOneRandomProduct();
  ```


### Con Fixture puede hacer un setup and teardown
La clave esta en el `await use(...)`
En un fixture, al usar `await use(...)` parte el fixture en 2
- Antes de `await use(...)` → **`setup`** Se ejecuta todo ese código al principio del test o cuando es llamado ese fixture
- Después de `await use(...)` → **`teardown`** Se ejecuta ese código al finalizar el test

Aca por ejemplo tenemos un fixture que se ejecute siempre antes de cualquier escenario, ya que esta puesto como `scope:'test'` y `auto: true`. Pueden agregarse if con tags, por ejemplo para hacer acciones especificas a ciertos tests.
```ts
type Fixtures = {
    forEachTest: void;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
    forEachTest: [
        async ({ page, $testInfo, $tags }, use) => {
            log.info(`Iniciando el escenario: ${$testInfo.title}`);
            if ($tags.includes('@mitag')) {
                log.info(`Acción especial para los escenarios con tag @mitag`);
            }
            await use();
            log.info(`Se finalizó el escenario: ${$testInfo.title}`);
        },
        { scope:'test', auto: true }, //Se ejecuta antes de cada test ya que tiene scope test y auto en true
    ], 
    //(...)
})
export const { Given, When, Then} = createBdd(test);
```


### Fixture puede hacer un setup and teardown especiales
Ademas podemos crear fixtures que no sean automáticos, si no que deban ser llamados dentro de un test/step para que deban aplicarse, también usan la lógica del `await use();`, es decir todo lo que esta arriba de éste se ejecutará antes del step/test que es llamado y todo lo abajo de éste se ejecutará al finalizar el test.
Primero se crea el fixture `auth`
```ts
type Fixtures = {
   //....
    auth: LoginPage;
   //....
};
export const test = base.extend<Fixtures>({
    auth: async ({page}, use) => {
        log.debug("Ejecutando fixture de autenticación");
        const loginPage = new LoginPage(page);
        const user: string = process.env.TEST_USER || "";
        const pass: string = process.env.TEST_PASS || "";
        const url: string = env.urls.frontend
        await loginPage.login(url, user, pass);
        await loginPage.verifyLoginSuccess();
        await use(loginPage);
        log.debug('Teardown de auth');
  },
  //....
```
Después tan solo debo llamar a `auth` dentro de un test / step y se ejecutará todo lo que esta sobre await use(...) de manera automática y al finalizar el test/escenario, ejecutara lo que hay posterior
```ts
Given('Estoy logueado', async ({auth}) => {
    //Al haber usado {auth} se ejecuto ese fixture antes de comenzar este test/step
    log.info('Login completo');
});
```

### Fixture para condicionales. Ejemplos
#### Fixture para mobile
Aquí un ejemplo de que si se tiene el tag `@mobile`, sobrescribe el viewport por defecto a uno correspondiente a mobile.
```ts
export const test = base.extend({
viewport: async ({ $tags, viewport }, use) => {
    if ($tags.includes('@mobile')) {
    viewport = { width: 375, height: 667 };
    }
    await use(viewport);
}
});
```
#### Fixture para auth
Con fixture también se puede hacer que solo se ejecuten o que tengan lógicas según el tag. Por ejemplo aquí si el tag `@noauth` esta presente en el escenario, limpia el storageState (que tiene guardadas las cookies y estado de algún login). En cambio si no tiene el tag, usa el storageState guardado
```ts
  export const test = base.extend<Fixtures>({
  storageState: async ({ $tags, storageState }, use) => {
    // reset storage state for features/scenarios with @noauth tag
    if ($tags.includes('@noauth')) {
      storageState = { cookies: [], origins: [] };
    }
    await use(storageState);
  },
});
```
## Timeouts
Por defecto playwright establece que cada test debe durar hasta un máximo de 30 segundos, si uno se excede ese tiempo queda como fallido.
Existen otros timeouts como
-Action timeout por defecto en **0- sin timeout** -> para método relacionados con navegación goto, reload, etc.
-Navigation timeout por defecto en **0 - sin timeout**  -> Para acciones como click, fill, etc
-Expect timeout por defect en **5 segundos** -> Par todos lo expect()

Esto significa que por defecto playwright no establece timeout para acciones individuales, exceptuando los expect.

### Cambiando los timeouts por defecto

#### Cambiando timeouts por linea individual
Es posible establecer timeout a una linea de action, navigation o expect (sin embargo si el tiempo del timeout por test sigue corriendo igual)
```ts
await expect(this.myElement).toBeVisible({ timeout: 10000 }); //Espera 10 segundos en vez de los 5
await this.myButton.click({ timeout: 5000 }); //Se espera 5 segundos
```

#### Cambiando timeouts para todo le proyecto
Dentro de `playwright.config.ts` es posible cambiar los valores de los timeouts de todo el proyecto y aplicaría para todos los test. ***En su documentación, playwright, no recomienda cambiar los valores del action y navigation timeout a menos que se requiera***.
```ts
export default defineConfig({
  timeout: 120_000, //30 default
  expect: {
    timeout: 10_000, //5 default
  },
  use: {
    navigationTimeout: 30_000, //0 default
    actionTimeout: 10_000, //0 default
  },
});
```
#### Cambiando timeout usando tags de bdd-playwright
La librería bdd-playwright tiene ciertos tags especiales entre ellos `@timeout:N` que permite establecer timeout para ese escenario, o si se establecer en el feature, para cada escenario de ese feature
```
@timeout:30000
Scenario: Escenario Generico
    Given Estoy en mi pagina logueado
    When Navego por mi pagina
    Then Visualizo mis datos
```

También esta el tag `@slow` que permite aumentar el timeout x3 para es escenario en especifico
```
@slow
Scenario: Escenario Generico
    Given Estoy en mi pagina logueado
    When Navego por mi pagina
    Then Visualizo mis datos
```

#### Cambiando timeout en fixtures y filtrar por tag
Dentro de los fixtures es posible configurar fixtures que se ejecutan siempre antes y después de cada escenario, similar a los Hooks `BeforeScenario` y `AferScenario`. Dentro de este fixture pueden configurarse estos timeouts e incluso que solo apliquen a ciertos escenarios, filtrando, por ejemplo por tags, en el ejemplo solo aplicaremos estos timeouts si el escenario tiene el tag `@ultraslow`:
```ts
type Fixtures = {
    forEachTest: void;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
    forEachTest: [
        async ({ page, $testInfo, $tags }, use) => {
            const isUltraSlow = $tags.includes('@ultraslow'); //true si escenario tiene el tag @ultraslow
            if (isUltraSlow) { //Si tiene el tag @ultraslow se aplica estos timeout
                $testInfo.setTimeout(15 * 60 * 1000);  //Timeout test entero
                page.setDefaultNavigationTimeout(10_000); //Timeout para acciones de navegación como goto, reload, etc.
                page.setDefaultTimeout(10_000); //Timeout para acción y navegación. Si setDefaultNavigationTimeout esta definido, este timeout se aplicara solo a acciones que no sean de navegación (click, fill, etc.)
            }
            await use();
        },
        { scope:'test', auto: true }, //Se ejecuta antes de cada test
    ], 
    //(...)
})
```

#### Cambiando timeout en hooks y filtrar por tag
Dentro del Hook `BeforeScenario` se puede configurar estos timeouts, y al igual que con fixture que solo apliquen a ciertos escenarios, filtrando, por ejemplo por tags, en el ejemplo solo aplicaremos estos timeouts si el escenario tiene el tag `@ultraslow`:
```ts
BeforeScenario({ tags: '@ultraslow' }, async ({ page, $testInfo, $tags }) => {
  $testInfo.setTimeout(15 * 60 * 1000); //Timeout test entero
  page.setDefaultTimeout(10_000); //Timeout para acciones de navegación como goto, reload, etc.
  page.setDefaultNavigationTimeout(10_000); //Timeout para acción y navegación. Si setDefaultNavigationTimeout esta definido, este timeout se aplicara solo a acciones que no sean de navegación (click, fill, etc.)
});
```

## Usar logs
Tan solo se debe importar el archivo `config/logger` y usar las opciones de logueo
```ts
import { log } from '../../config/logger';
async testLog() {
    log.debug('Log debug');
    log.info('Log info'); 
    log.warn('Log warn');
    log.error('Log error');
}
```

## Rutas por defecto
- `/config` relacionados con configuraciones y utilidades globales, como logger y env
- `/tests/` todo lo relacionado al testing, contiene
    - `/features` que contiene los archivos .feature y ademas contiene
        -`/steps` contiene la implementación de los los step de los feature, usa los métodos de los page-objects
        -`/support` contiene ayudante de pruebas como los hooks y fixtures [mas info](#fixtures-vs-hooks)
    - `models` puede contener `interface` y `class` para modelar estructura de datos acordes al negocios/flujos
    - `page-objects` contiene los locators y las acciones/métodos de las pagina/vistas
    -`utils` contiene métodos ayudantes/helpers, entre otros
- `/logs` logs generados
- `/reports` reportes generados, contiene 
    -`blob-report` reporte blob que sirve para poder unir reportes cuando se ejecutan en paralelo (en CI), al usar `merge-reports`
    -`cucumber-report` reportes cucumber, entre ellos html, json, junit, etc.
    -`playwright-report` reportes playwright, principalmente html


## Como publicar en reports.cucumber.io
1) Generar un archivo .ndjson de Cucumber Messages desde playwright-bdd. Para eso agregar  
    ```ts
    cucumberReporter('message', 
    { outputFile: 'reports/cucumber-report/messages.ndjson', skipAttachments: ['text/x.cucumber.log+plain'] }) 
    ```
2) Ir a https://messages.cucumber.io/api/reports
3) Buscar en las response headers "Location"
4) Copiar la URL
5) Con postman o automático hacer un PUT con el archivo .ndjson (en postman debe ir en el body como binary)
6. Luego ingresar a la url que se entrega al comienzo (https://reports.cucumber.io/reports/xxxxxx).


## Tips extras
- Una manera de evitar que playwright se reconozca como bot y que ciertas paginas bloqueen:
    ```ts
    // --- Stealth: Ocultar webdriver ---
    await page.addInitScript(() => {
        // Ocultar webdriver
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    ```
- Hacer attach de logs en los step para que aparezcan en el reporte:
    ```ts
    await $testInfo.attach('log-evento', {
        body: "log desde el step de login",
        contentType: 'text/plain',
    }) 
    ``` 
- Por defecto playwright adjunta todo el log a los reportes si quiere sacarse puede usarse`skipAttachments: ['text/x.cucumber.log+plain']` dentro de un reporter
    ```ts
    cucumberReporter('html', {skipAttachments: ['text/x.cucumber.log+plain']}),
    ``` 