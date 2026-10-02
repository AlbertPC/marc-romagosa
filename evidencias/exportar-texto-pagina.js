// Exporta a CSV el texto de la página abierta. Pegar en la consola de Chrome (F12 > Consola) o guardar como Snippet.
// Se ejecuta en la pestaña de cada enlace. Genera un CSV por página: ID_AAAAMMDD.csv
(() => {
  const ID_MANUAL = '';     // opcional: fuerza el ID (por ejemplo 'S36'); si está vacío se detecta por la URL
  const LIMITE = 32000;     // Excel corta las celdas en 32.767 caracteres; pon 0 para no cortar

  const MAPA = {
  "https://www.fortunebusinessinsights.com/mystery-shopping-services-market-111774": "S01",
  "https://www.temapromotion.com/cliente-misterioso-mystery-shopper": "S02",
  "https://prosalesfieldmarketing.com/mystery-shopping": "S03",
  "https://mysteryjob.es": "S04",
  "https://crudaevidencia.com": "S05",
  "https://crudaevidencia.com/quienes-somos": "S06",
  "https://takeatip.es/mystery-shopper-barcelona": "S07",
  "https://mysteryshopperspain.com": "S08",
  "https://www.secretview.io/es/resources/frequently-asked-questions": "S09",
  "https://www.sage.com/es-es/blog/pros-y-contras-de-los-clientes-misteriosos": "S10",
  "https://asest.es/story/cliente-misterioso-te-tienes-que-dar-de-alta-como-autonomo": "S11",
  "https://mysteryclient.it/en/blog/mystery-shopping-kpis-reporting-mspa-iso-20252": "S12",
  "https://www.checker-soft.com/the-biggest-issues-in-mystery-shopping-and-cx-research-in-2025-and-how-agencies-can-fix-them-in-2026": "S13",
  "https://www.a-closer-look.com/blog/the-hidden-truths-what-brands-need-to-know-about-mystery-shopping-partners": "S14",
  "https://www.ipsos.com/es-es/desmitificando-el-mystery-shopping-y-su-papel-en-la-medici%c3%b3n-de-la-experiencia-del-cliente": "S15",
  "https://www.ipsos.com/en-nz/mystery-shop-essentials-confidence-built-evidence": "S16",
  "https://www.ipsos.com/es-es/node/457351": "S17",
  "https://www.ipsos.com/en-nl/channel-performance-benchmark-ipsos-global-mystery-shopping-kpi-benchmark-now-even-more-powerful": "S18",
  "https://fashionunited.es/noticias/empresas/que-es-el-cliente-misterioso-y-por-que-esta-ganando-protagonismo-en-el-retail-de-moda/2026061149633": "S19",
  "https://valenciaplaza.com/valenciaplaza/banca-telefonia-y-retail-sectores-que-apuestan-en-espana-por-el-mystery-shopping": "S20",
  "https://ayudatpymes.com/gestron/luis-miguel-larriba-emprendedor-y-fundador-de-misterioseando": "S21",
  "https://www.consultorescomerciales.com": "S22",
  "https://investigalo-detectives.com/detective-privado-barcelona/mystery-shopper-cliente-misterioso": "S23",
  "https://www.douglasstafford.com": "S24",
  "https://www.workana.com/freelancers?query=mystery+shopper&language=es": "S25",
  "https://www.freelancer.es/jobs/mystery-shopper": "S26",
  "https://petbusinessworld.co.uk/?p=88371": "S27",
  "https://www.mordorintelligence.com/es/industry-reports/spain-pet-food-market": "S28",
  "https://www.alimarket.es/alimentacion/noticia_amp/313037/cinco-claves-para-entender-el-sector-de-petfood-en-espana": "S29",
  "https://www.ifema.es/iberpet": "S30",
  "https://www.ifema.es/motortec": "S31",
  "https://www.iberley.es/noticias/aepd-grabaciones-conversaciones-imagenes-trabajo-deben-justificarse-30585": "S32",
  "https://web.archive.org/web/2025/https://www.puromarketing.com/44/27590/cinco-formas-usar-mystery-shopper-para-medir-experiencias-competencia": "S33",
  "https://www.puromarketing.com/44/27590/cinco-formas-usar-mystery-shopper-para-medir-experiencias-competencia": "S33",
  "https://web.archive.org/web/2025/https://www.tuvsud.com/es-es/industrias/movilidad-automocion/servicios-para-automocion/outsourcing-atencion-clientes/auditoria-estandares-mystery-shopping": "S34",
  "https://www.tuvsud.com/es-es/industrias/movilidad-automocion/servicios-para-automocion/outsourcing-atencion-clientes/auditoria-estandares-mystery-shopping": "S34",
  "https://jobs.lrqa.com/job/madrid-mystery-shopper-%28spain%29/1383384033": "S35",
  "https://ensun.io/search/mystery-shopping/spain": "S36",
  "https://lucintel.com/video-mystery-shopping-market.aspx": "S37",
  "https://www.infojobs.net/barcelona/evaluador-atencion-al-cliente-mystery-shopper-cat/of-iae67bca1074ce9bb1d283216037e89": "S38",
  "https://www.malt.es/s?q=mystery%20shopper": "S39",
  "https://fiverr.com/briefvoro/be-your-mystery-shopper": "S40",
  "https://join.com/companies/comeunited/16360353-test-buyer-mystery-shopper-m-f-d-on-freelance-basis-in-spain": "S41",
  "https://prosalesfieldmarketing.com/mystery-shopping-en-barcelona": "S42"
};
  const norm = u => u.replace(/#.*$/, '').replace(/\/$/, '').toLowerCase();
  const href = location.href;
  let id = ID_MANUAL || MAPA[norm(href)] || '';
  if (!id) {
    const m = href.match(/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/);
    if (m) id = MAPA[norm(m[1])] || '';
  }
  if (!id) id = prompt('No reconozco esta URL. ID de la fuente (por ejemplo S45):', 'S45') || 'SXX';

  // Texto visible (lo que ves) y texto completo (incluye lo oculto en desplegables)
  const visible = (document.body.innerText || '').trim();
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG']);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: n => {
      const p = n.parentElement;
      if (!p || SKIP.has(p.tagName.toUpperCase())) return NodeFilter.FILTER_REJECT;
      return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const partes = [];
  while (w.nextNode()) partes.push(w.currentNode.nodeValue.trim().replace(/\s+/g, ' '));
  const completo = partes.join('\n');

  const cortar = t => (LIMITE && t.length > LIMITE) ? t.slice(0, LIMITE) + ' [CORTADO]' : t;
  const q = v => '"' + String(v).replace(/"/g, '""') + '"';
  const fecha = new Date().toISOString();
  const cab = ['id', 'url', 'titulo', 'fecha_captura', 'caracteres_visible', 'texto_visible', 'caracteres_completo', 'texto_completo'];
  const fila = [id, href, document.title, fecha, visible.length, cortar(visible), completo.length, cortar(completo)];
  const csv = '﻿' + cab.join(',') + '\r\n' + fila.map(q).join(',') + '\r\n';

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = id + '_' + fecha.slice(0, 10).replace(/-/g, '') + '.csv';
  document.body.appendChild(a); a.click(); a.remove();
  console.log(`CSV descargado: ${a.download} | visible: ${visible.length} caracteres | completo: ${completo.length} caracteres`);
})();
