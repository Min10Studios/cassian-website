// Cassian Learn website adapter. Original project provenance: Crazaloth.
const host = document.querySelector('#cassian-learn-root');
const feedback = document.querySelector('#learn-load-status');
let instance;

async function openLearningRoom() {
  if (!host || !feedback || instance) return;
  feedback.hidden = false;
  feedback.textContent = 'Opening the learning room…';
  try {
    const { mountCassianLearn } = await import('./app/cassian-learn.js');
    instance = await mountCassianLearn(host, {
      stylesUrl: new URL('./app/cassian-learn.css', import.meta.url).href,
      sourceUrl: new URL('./app/learn-source.zip', import.meta.url).href,
      storageKey: 'cassian.learn.web.v1',
    });
    if (!instance || typeof instance.unmount !== 'function') {
      instance = undefined;
      throw new Error('The learning room did not start.');
    }
    host.dataset.learnReady = 'true';
    feedback.hidden = true;
  } catch {
    feedback.textContent = 'The learning room could not open. Reload this page to try again, or use the feature and source page below.';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'learn-site-retry';
    retry.textContent = 'Reload learning tools';
    retry.addEventListener('click', () => window.location.reload());
    feedback.append(retry);
  }
}

// The module owns visibility/audio listeners. Normal full-page navigation ends
// this document; a back-forward cache entry retains the mounted learning room.
window.addEventListener('pagehide', event => {
  if (!event.persisted) {
    instance?.unmount();
    instance = undefined;
  }
});
openLearningRoom();
