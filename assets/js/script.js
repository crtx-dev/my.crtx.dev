(()=>{
  function validPort(value){
    const text=String(value??'').trim();
    if(!/^\d+$/.test(text))return null;
    const port=Number(text);
    return Number.isInteger(port)&&port>=1&&port<=65535?port:null;
  }
  function queryMode(search){
    const raw=String(search||'').replace(/^\?/,'');
    if(!raw)return 'launch';
    const params=new URLSearchParams(raw);
    return raw==='config'||params.has('config')?'config':'invalid';
  }
  function validHost(value){
    const raw=String(value??'').trim();
    if(!raw||/\s/.test(raw))return null;
    try{
      const explicit=/^[a-z][a-z\d+.-]*:\/\//i.test(raw);
      const hostname=explicit?new URL(raw).hostname:raw.replace(/^\[|\]$/g,'');
      const local=hostname==='localhost'||hostname.endsWith('.localhost')||/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)||hostname.includes(':');
      const url=new URL(explicit?raw:`${local?'http':'https'}://${raw}`);
      if(!/^https?:$/.test(url.protocol)||url.username||url.password||url.search||url.hash)return null;
      return url;
    }catch{return null}
  }
  function init(){
    const root=document.querySelector('[data-local-launcher]');
    if(!root)return;
    const product=root.dataset.product;
    const defaultHost=root.dataset.defaultHost;
    const defaultPort=validPort(root.dataset.defaultPort);
    const hostKey=`${product}-host`;
    const portKey=`${product}-local-port`;
    const form=root.querySelector('[data-redirect-form]');
    const hostInput=form?.querySelector('input[name="host"]');
    const portInput=form?.querySelector('input[name="port"]');
    const error=root.querySelector('[data-redirect-error]');
    const status=root.querySelector('[data-redirect-status]');
    const reset=root.querySelector('[data-reset-target]');
    const openButton=root.querySelector('[data-open-target]');
    const saveButton=form?.querySelector('button[type="submit"]');
    const mode=queryMode(window.location.search);
    const read=()=>{try{return {host:localStorage.getItem(hostKey)||defaultHost,port:validPort(localStorage.getItem(portKey))||defaultPort}}catch{return {host:defaultHost,port:defaultPort}}};
    const save=target=>{try{localStorage.setItem(hostKey,target.host);localStorage.setItem(portKey,String(target.port));return true}catch{return false}};
    const targetFromInputs=()=>{
      const url=validHost(hostInput?.value);
      const port=validPort(portInput?.value);
      if(!url||!port)return null;
      url.port=String(port);
      return {host:hostInput.value.trim(),port,url:url.toString()};
    };
    const open=target=>window.location.replace(target.url);
    const showError=message=>{root.classList.add('redirect-config-mode');if(error){error.textContent=message;error.hidden=false}};
    const stored=read();
    if(mode==='launch'){
      const url=validHost(stored.host);
      if(url){url.port=String(stored.port);open({url:url.toString()});return}
      const fallback=validHost(defaultHost);
      fallback.port=String(defaultPort);
      open({url:fallback.toString()});
      return;
    }
    root.classList.add('redirect-config-mode');
    if(hostInput)hostInput.value=stored.host;
    if(portInput)portInput.value=String(stored.port);
    if(mode==='invalid')showError('Invalid link. Configure a Cortex address below.');
    form?.addEventListener('submit',event=>{
      event.preventDefault();
      const target=targetFromInputs();
      if(!target){showError('Enter a valid domain or IP and a port from 1 to 65535.');return}
      if(error)error.hidden=true;
      save(target);
      if(saveButton){saveButton.textContent='Saved';setTimeout(()=>saveButton.textContent='Save',1200)}
    });
    openButton?.addEventListener('click',()=>{
      const target=targetFromInputs();
      if(!target){showError('Enter a valid domain or IP and a port from 1 to 65535.');return}
      open(target);
    });
    reset?.addEventListener('click',()=>{
      if(hostInput)hostInput.value=defaultHost;
      if(portInput)portInput.value=String(defaultPort);
      try{localStorage.removeItem(hostKey);localStorage.removeItem(portKey)}catch{}
      if(error)error.hidden=true;
      hostInput?.focus();
    });
  }
  document.addEventListener('DOMContentLoaded',init);
})();
