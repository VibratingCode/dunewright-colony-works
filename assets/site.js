// Dunewright Colony Works — shared page script.
// 1) Builds the site nav from <body data-page="id">.
// 2) Wires the acknowledgement strip: inputs with [data-ack] save per page; when all are filled, .stamp shows
//    and the page is marked complete (index.html reads the marks).
// 3) ?export=1 hides nav for PDF/PNG export.
(function(){
  const PAGES=[
    {id:"m1",file:"m1-orientation.html",n:"1",t:"Wake-Up & Orientation"},
    {id:"m2",file:"m2-dust-air-ppe.html",n:"2",t:"Dust, Air & PPE"},
    {id:"m3",file:"m3-heat.html",n:"3",t:"Heat"},
    {id:"m4",file:"m4-heights.html",n:"4",t:"Working at Height"},
    {id:"m5",file:"m5-hot-work.html",n:"5",t:"Hot Work: Welding & Cutting"},
    {id:"m6",file:"m6-cranes-equipment.html",n:"6",t:"Cranes & Heavy Equipment"},
    {id:"m7",file:"m7-lockout.html",n:"7",t:"Lockout/Tagout & Machines"},
    {id:"m8",file:"m8-materials.html",n:"8",t:"Advanced Materials & Chemicals"},
    {id:"m9",file:"m9-emergencies.html",n:"9",t:"Emergencies & Mass Casualty"},
    {id:"cs",file:"cs-confined-spaces.html",n:"S-A",t:"Confined Spaces"},
  ];
  window.DCW_PAGES=PAGES;
  const html=document.documentElement;
  if(new URLSearchParams(location.search).has("export")) html.classList.add("export");

  const id=document.body.dataset.page||"";
  const file=location.pathname.split("/").pop()||"index.html";
  const base=file.replace(/\.html$/,"");
  const i=PAGES.findIndex(p=>p.id===id);
  const nav=document.createElement("nav");
  nav.className="sitenav";nav.setAttribute("aria-label","Site");
  let links=`<a class="home" href="index.html">◆ DCW Refresher</a>`;
  if(i>=0){
    if(i>0) links+=`<a href="${PAGES[i-1].file}">← ${PAGES[i-1].n}</a>`;
    links+=`<span>Module ${PAGES[i].n}</span>`;
    if(i<PAGES.length-1) links+=`<a href="${PAGES[i+1].file}">${PAGES[i+1].n} →</a>`;
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
