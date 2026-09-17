(()=>{
  const clearPrompt=()=>{
    const p=document.getElementById('prompt');
    if(!p)return;
    p.value='';
    p.defaultValue='';
    p.removeAttribute('value');
  };

  // Safari/iOS may restore form values from the back-forward cache after JS has run.
  // The assistant composer is not a persistent draft: sent text must never reappear.
  window.addEventListener('pageshow',()=>setTimeout(clearPrompt,0));
  window.addEventListener('pagehide',clearPrompt);
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden') clearPrompt();
  });

  const bind=()=>{
    const p=document.getElementById('prompt');
    const send=document.getElementById('sendBtn');
    if(p){
      p.setAttribute('autocomplete','off');
      p.setAttribute('autocorrect','on');
      p.setAttribute('autocapitalize','sentences');
      p.setAttribute('spellcheck','true');
      clearPrompt();
    }
    if(send){
      send.addEventListener('click',()=>setTimeout(clearPrompt,0),true);
    }
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
