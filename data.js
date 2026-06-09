/* ===========================================================================
   Stori Competitive Intelligence — dataset
   Transcribed from the source slides. All values live here so the dashboard
   can be re-pointed at a live source later: replace CI.* and the UI updates.
   `na` (null) renders as "n.a." everywhere.
   =========================================================================== */
(function () {
  const na = null;

  // ---- Brand colors for each competitor (keeps the slide palette) ----------
  const PEERS = {
    stori:   { name: 'Stori',   color: '#00D180', ink: '#058E65' },
    nu:      { name: 'Nu',      color: '#820AD1', ink: '#820AD1' },
    klar:    { name: 'Klar',    color: '#3FBDF4', ink: '#1C9BD6' },
    revolut: { name: 'Revolut', color: '#9A9A9A', ink: '#6F6F6F' },
    uala:    { name: 'Uala',    color: '#2D5BFF', ink: '#2D5BFF' },
    didi:    { name: 'Didi',    color: '#FF7A33', ink: '#E2641F' },
    plata:   { name: 'Plata',   color: '#FF4D17', ink: '#E2401C' },
  };

  // ---- Months for the time series (Mar 2025 → Mar 2026) ---------------------
  const MONTHS = [
    'Mar 2025','Apr 2025','May 2025','Jun 2025','Jul 2025','Aug 2025','Sep 2025',
    'Oct 2025','Nov 2025','Dec 2025','Jan 2026','Feb 2026','Mar 2026',
  ];

  // ---- Slide 1: peer metrics comparison table -------------------------------
  const METRIC_ORDER = ['stori','nu','klar','revolut','uala','didi','plata'];
  const METRICS = [
    { key:'portfolio', label:'Credit Portfolio',            unit:'$m', fmt:'money_m', goodHigh:true,
      vals:{ stori:522, nu:1854, klar:429, revolut:3, uala:78, didi:na, plata:752 } },
    { key:'revgrowth', label:'Revenue Growth (YoY)',        unit:'%',  fmt:'pct1', goodHigh:true,
      vals:{ stori:34.2, nu:53.6, klar:48.3, revolut:na, uala:42.4, didi:na, plata:na } },
    { key:'arpoc',     label:'ARPOC',                       unit:'$',  fmt:'money', goodHigh:true,
      vals:{ stori:7, nu:8, klar:5, revolut:8, uala:2, didi:1, plata:na } },
    { key:'nim',       label:'Annualized Risk Adjusted NIM',unit:'%',  fmt:'pct0', goodHigh:true,
      vals:{ stori:18, nu:12, klar:5, revolut:-624, uala:-39, didi:na, plata:na } },
    { key:'roa',       label:'Gross ROA',                   unit:'%',  fmt:'pct0', goodHigh:true,
      vals:{ stori:23, nu:7, klar:14, revolut:-3, uala:-5, didi:-2, plata:na } },
    { key:'margin',    label:'Gross Margin',                unit:'%',  fmt:'pct0', goodHigh:true,
      vals:{ stori:35, nu:31, klar:25, revolut:-44, uala:-33, didi:-32, plata:na } },
    { key:'mkteff',    label:'Marketing Efficiency',        unit:'%',  fmt:'pct0', goodHigh:false,
      vals:{ stori:3, nu:6, klar:11, revolut:na, uala:na, didi:18, plata:na } },
    { key:'effratio',  label:'Efficiency Ratio',            unit:'%',  fmt:'pct0', goodHigh:false,
      vals:{ stori:36, nu:38, klar:39, revolut:-720, uala:395, didi:-994, plata:na } },
    { key:'netincome', label:'Net Income',                  unit:'$M', fmt:'money_signed', goodHigh:true,
      vals:{ stori:2.5, nu:5.1, klar:1.1, revolut:-4.2, uala:-7.5, didi:-3.3, plata:na } },
  ];

  // ---- Slide 2: ARPOC — Revenue per Customer ($) line series ----------------
  const ARPOC = {
    title: 'Revenue per Customer ($)',
    note: 'ARPOC = Gross Revenue / 2 Month Average Number of Customers.',
    series: {
      stori:   [7.8, 8.0, 7.7, 7.7, 7.7, 8.0, 7.9, 8.0, 7.6, 7.7, 7.5, 6.9, 7.4],
      nu:      [7.8, 8.1, 8.5, 8.4, 8.7, 8.4, 8.4, 8.4, 8.5, 8.7, 8.6, 8.0, 8.5],
      klar:    [4.8, 4.8, 4.5, 4.2, 4.2, 4.0, 3.8, 3.6, 3.4, 4.4, 3.5, 3.5, 5.4],
      uala:    [1.6, 1.6, 1.4, 1.5, 1.4, 1.4, 1.7, 1.5, 1.4, 1.5, 1.5, 1.5, 1.5],
      didi:    [na,  na,  na,  6.8, 5.5, 7.2, 3.5, 2.2, 1.1, 0.6, 0.9, 0.8, 0.8],
      revolut: [na,  na,  na,  na,  na,  na,  na,  na,  na,  na, 10.0, 6.5, 8.1],
    },
    yoy: { nu:8.8, revolut:na, stori:-6.2, klar:11.4, uala:-1.9, didi:-98.7 },
  };

  // ---- Slide 3: Gross Profit ($m) column series -----------------------------
  const GROSS_PROFIT = {
    title: 'Gross Profit ($m)',
    note: 'Monthly gross profit by issuer.',
    series: {
      stori:   [8.3, 9.4, 7.8, 8.8, 7.8, 9.2, 9.4, 10.5, 10.3, 9.8, 11.2, 10.7, 12.3],
      nu:      [7.3, -6.3, 11.6, 8.7, 16.2, 21.1, 26.2, 28.1, 32.9, 42.9, 35.2, 35.0, 39.9],
      klar:    [6.2, 3.9, 4.0, 3.1, 4.3, 4.5, 5.7, 6.3, 7.3, 4.5, 8.0, 6.9, 6.4],
      uala:    [-0.6, -0.5, -0.8, -0.1, -1.4, -0.8, -1.1, -0.9, -1.1, -0.4, -0.5, -1.7, -1.5],
      didi:    [0.1, 0.1, 0.0, -0.1, -0.3, -0.9, -1.4, -2.1, -2.5, -1.7, -1.3, -0.8, -0.6],
      revolut: [na, na, na, na, na, na, na, na, na, 0.3, 0.1, na, na],
    },
    yoy: { nu:448.7, stori:47.2, klar:23.3, didi:-875.0, uala:na, revolut:-139.3 },
  };

  // ---- Slide 4: deposit product comparison ----------------------------------
  const DEPOSIT_COLS = [
    { key:'storiGreen', name:'Stori Green', stori:true },
    { key:'nu',          name:'Nu' },
    { key:'klar',        name:'Klar' },
    { key:'bbva',        name:'BBVA' },
    { key:'azteca',      name:'Banco Azteca' },
    { key:'mercado',     name:'Mercado Pago' },
    { key:'didi',        name:'Didi' },
    { key:'revolut',     name:'Revolut' },
    { key:'plata',       name:'Plata' },
  ];
  const DEPOSIT_ROWS = [
    { label:'Interest Rate',      type:'pct', vals:[7.00,6.50,6.10,na,na,13.00,7.50,7.50,7.00] },
    { label:'Preferred Rate',     type:'pct', vals:[15.00,13.00,15.00,na,na,na,15.00,15.00,10.00] },
    { label:'Fixed (7 days)',     type:'pct', vals:[na,6.55,6.10,na,2.73,na,na,na,na] },
    { label:'Fixed (28 - 30 days)',type:'pct',vals:[7.05,6.60,6.20,2.70,2.73,na,na,na,7.00] },
    { label:'Fixed (60 days)',    type:'pct', vals:[15.00,na,na,na,2.73,na,na,na,7.00] },
    { label:'Fixed (90 days)',    type:'pct', vals:[9.00,6.70,6.30,2.75,2.63,na,na,na,7.25] },
    { label:'Fixed (180 days)',   type:'pct', vals:[8.25,6.80,6.40,2.85,2.58,na,na,na,7.50] },
    { label:'Fixed (360 days)',   type:'pct', vals:[8.25,na,6.50,na,2.49,na,na,na,8.00] },
    { label:'Term Deposit Offering',type:'bool',vals:[1,1,1,1,1,1,0,0,1] },
    { label:'Debit Card',         type:'bool', vals:[1,1,1,1,1,1,1,1,1] },
    { label:'Cash-in/Cash-out',   type:'bool', vals:[1,1,1,1,1,1,1,1,1] },
    { label:'Utilities Payment',  type:'bool', vals:[1,1,1,1,1,1,0,0,1] },
  ];

  // ---- Slide 5: recent peer funding rounds ----------------------------------
  const FUNDING = [
    { company:'Klar',  round:'Series C', date:'July 2025', amount:'$170M', valuation:'$800M',
      lead:'General Atlantic', notes:'Existing investor led' },
    { company:'Plata', round:'Series C', date:'April 2026', amount:'$405M', valuation:'$5.1BN',
      lead:'Bicycle Capital', notes:'New Investor' },
    { company:'Plata', round:'Series B', sub:'(Primary and Secondary)', date:'October 2025', amount:'$250M', valuation:'$3.1BN',
      lead:'Kora, Moore Strategic Ventures, Televisa', notes:'Existing investor + strategic led' },
    { company:'Plata', round:'Series A', date:'March 2025', amount:'$160M', valuation:'$1.5BN',
      lead:'Kora', notes:'Existing investor led' },
    { company:'Uala',  round:'Series E', date:'March 2025\nNovember 2024', amount:'$300M +\n$66M', valuation:'$2.75BN',
      lead:'Allianz, Televisa\nTencent, Softbank', notes:'Strategic + Existing investor led\nTelevisa: marketing for shares\nAllianz: regional insurance partnership' },
    { company:'Uala',  round:'Series D', date:'April 2026', amount:'$405M', valuation:'$5.0BN',
      lead:'Bicycle Capital', notes:'LatAm\u2019s highest-valued private fintech today' },
  ];

  // ---- Capital structure (Stori) — illustrative; swap in real figures -------
  // Stacked: equity raised + debt facilities drawn, by year. Marked illustrative.
  const CAP_STRUCTURE = {
    title: 'Stori funding stack ($m)',
    note: 'Illustrative \u2014 replace equity & debt-facility figures with treasury actuals.',
    illustrative: true,
    years: ['2020','2021','2022','2023','2024','2025'],
    layers: [
      { key:'equity', label:'Equity raised',     color:'#00D180', vals:[10, 32.5, 125, 50, 105, 212] },
      { key:'debt',   label:'Debt facilities',   color:'#003A40', vals:[0, 20, 100, 150, 250, 400] },
    ],
  };

  window.CI = {
    PEERS, MONTHS, METRIC_ORDER, METRICS,
    ARPOC, GROSS_PROFIT,
    DEPOSIT_COLS, DEPOSIT_ROWS, FUNDING, CAP_STRUCTURE,
  };
})();
