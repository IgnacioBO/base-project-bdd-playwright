// hooks.ts
import { BeforeWorker, AfterWorker, BeforeScenario, BeforeStep, AfterScenario, AfterStep } from './fixtures';
import {log} from '../../../config/logger';

/*
BeforeWorker(async ({ $workerInfo, browser }) => {
  log.info(`Hook antes que inicia antes de cadar worker`);
  log.info(`Iniciando el worker ${$workerInfo.workerIndex} con el navegador ${browser.browserType().name()}`);

});

AfterWorker(async ({ $workerInfo, browser }) => {
  log.info(`Hook que se ejecuta al finalizar cada worker`);
  log.debug(`Finalizando el worker ${$workerInfo.workerIndex} con el navegador ${browser.browserType().name()}`);
});

BeforeScenario(async ({ $testInfo }) => {
  log.info(`Hook que se ejecuta antes de cada escenario`);
  log.info(`Iniciando el escenario: ${$testInfo.title}`);
});

BeforeScenario({ tags: '@POM' },async ({ $testInfo }) => {
  log.info(`Hook que se ejecuta antes de cada escenario con tag @POM`);
  log.info(`Iniciando el escenario SOLO @POM: ${$testInfo.title}`);
});

AfterScenario(async ({ $testInfo }) => {
  log.info(`Hook que se ejecuta al finalizar cada escenario`);
  log.info(`Finalizando el escenario: ${$testInfo.title}`);
});

BeforeStep(async ({ $step }) => {
  log.info(`Hook que se ejecuta antes de cada step`);
  log.debug(`Iniciando el step: ${$step.title}`);
}
);

AfterStep(async ({ $step }) => {
  log.info(`Hook que se ejecuta al finalizar cada step`);
  log.debug(`Finalizando el step: ${$step.title}`);
}
);
*/