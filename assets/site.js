// Dunewright Colony Works — shared page script.
// 1) Builds the site nav from <body data-page="id">.
// 2) Wires the acknowledgement strip: inputs with [data-ack] save per page; when all are filled, .stamp shows
//    and the page is marked complete (index.html reads the marks).
// 3) ?export=1 hides nav for PDF/PNG export.
(function(){
  // Modules and supplements, in reading order. kind = "module" | "supplement"; n = short label.
  // Nav and index read "Module 5" or "Supplement A" from kind + n (never "Module S-A").
  const PAGES=[
    {id:"m1",file:"m1-orientation.html",kind:"module",n:"1",code:"HS-01",t:"Wake-Up & Orientation"},
    {id:"m2",file:"m2-dust-air-ppe.html",kind:"module",n:"2",code:"HS-02",t:"Dust, Air & PPE"},
    {id:"m3",file:"m3-heat.html",kind:"module",n:"3",code:"HS-03",t:"Heat"},
    {id:"m4",file:"m4-heights.html",kind:"module",n:"4",code:"HS-04",t:"Working at Height"},
    {id:"m5",file:"m5-hot-work.html",kind:"module",n:"5",code:"HS-05",t:"Hot Work: Welding & Cutting"},
    {id:"m6",file:"m6-cranes-equipment.html",kind:"module",n:"6",code:"HS-06",t:"Cranes & Heavy Equipment"},
    {id:"m7",file:"m7-lockout.html",kind:"module",n:"7",code:"HS-07",t:"Lockout/Tagout & Machines"},
    {id:"m8",file:"m8-materials.html",kind:"module",n:"8",code:"HS-08",t:"Advanced Materials & Chemicals"},
    {id:"m9",file:"m9-emergencies.html",kind:"module",n:"9",code:"HS-09",t:"Emergencies & Mass Casualty"},
    {id:"cs",file:"cs-confined-spaces.html",kind:"supplement",n:"A",code:"HS-SA",t:"Confined Spaces"},
    {id:"sb",file:"sb-electrical.html",kind:"supplement",n:"B",code:"HS-SB",t:"Electrical & Temporary Power"},
    {id:"sc",file:"sc-scaffolds-aerial-lifts.html",kind:"supplement",n:"C",code:"HS-SC",t:"Scaffolds & Aerial Lifts"},
    {id:"sd",file:"sd-night-fatigue-fitness.html",kind:"supplement",n:"D",code:"HS-SD",t:"Night Work, Fatigue & Fitness for Duty"},
  ];
  PAGES.forEach(p=>{p.label=(p.kind==="supplement"?"Supplement ":"Module ")+p.n});
  // Reference sheets (no sign-off).
  const REFS=[
    {id:"ref-pc",file:"pocket-card.html",code:"REF-PC",t:"Pocket card"},
    {id:"ref-rad",file:"radio.html",code:"REF-RAD",t:"Radio reference"},
    {id:"ref-org",file:"org-chart.html",code:"REF-ORG",t:"Org chart"},
    {id:"ref-hs",file:"hand-signals.html",code:"REF-HS",t:"Hand signals"},
    {id:"ref-ptw",file:"permits.html",code:"REF-PTW",t:"Permits at a glance"},
    {id:"ref-gl",file:"roles-glossary.html",code:"REF-GL",t:"Roles, glossary & badge endorsements"},
    {id:"ref-doc",file:"review-record.html",code:"REF-DOC",t:"Review record & site rules register"},
  ];
  window.DCW_PAGES=PAGES;
  window.DCW_REFS=REFS;
  const html=document.documentElement;
  if(new URLSearchParams(location.search).has("export")) html.classList.add("export");

  const id=document.body.dataset.page||"";
  const file=location.pathname.split("/").pop()||"index.html";
  const base=file.replace(/\.html$/,"");
  const i=PAGES.findIndex(p=>p.id===id);
  const r=REFS.find(p=>p.id===id);
  const nav=document.createElement("nav");
  nav.className="sitenav";nav.setAttribute("aria-label","Site");
  let links=`<a class="home" href="index.html">◆ DCW Refresher</a>`;
  if(i>=0){
    if(i>0) links+=`<a href="${PAGES[i-1].file}">← ${PAGES[i-1].label}</a>`;
    links+=`<span>${PAGES[i].label} · ${PAGES[i].code}</span>`;
    if(i<PAGES.length-1) links+=`<a href="${PAGES[i+1].file}">${PAGES[i+1].label} →</a>`;
  }else if(r){
    links+=`<span>Reference sheet · ${r.code}</span>`;
  }
  links+=`<span class="sp"></span>`;
  if(base!=="index") links+=`<span class="dl"><a href="exports/${base}.pdf">PDF</a> <a href="exports/${base}.png">PNG</a></span>`;
  nav.innerHTML=`<div class="in">${links}</div>`;
  document.body.prepend(nav);

  const key=k=>`dcw-${id||base}-${k}`;
  const inputs=[...document.querySelectorAll("[data-ack]")];
  const stamp=document.querySelector(".stamp");
  const check=()=>{
    const done=inputs.length&&inputs.every(x=>x.value.trim());
    if(stamp) stamp.hidden=!done;
    try{localStorage.setItem(key("done"),done?"1":"")}catch(e){}
  };
  inputs.forEach(el=>{
    // name / colonist ID are shared across pages so players only type them once
    const shared=["name","cid"].includes(el.dataset.ack);
    const k=shared?`dcw-shared-${el.dataset.ack}`:key(el.dataset.ack);
    try{el.value=localStorage.getItem(k)||""}catch(e){}
    el.addEventListener("input",()=>{try{localStorage.setItem(k,el.value)}catch(e){}check()});
  });
  if(inputs.length) check();
})();
