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
  function init(){
    const root=document.querySelector('[data-local-launcher]');
    if(!root)return;
    const product=root.dataset.product;
    const defaultPort=validPort(root.dataset.defaultPort);
    const key=`${product}-local-port`;
    const form=root.querySelector('[data-redirect-form]');
    const input=form?.querySelector('input[name="port"]');
    const error=root.querySelector('[data-redirect-error]');
    const status=root.querySelector('[data-redirect-status]');
    const reset=root.querySelector('[data-reset-port]');
    const mode=queryMode(window.location.search);
    const read=()=>{try{return validPort(localStorage.getItem(key))}catch{return null}};
    const save=port=>{try{localStorage.setItem(key,String(port));return true}catch{return false}};
    const open=port=>window.location.replace(`http://localhost:${port}/`);
    const showError=message=>{root.classList.add('redirect-config-mode');if(error){error.textContent=message;error.hidden=false}if(input){input.focus();input.select()}};
    const stored=read();
    if(mode==='launch'){
      const port=stored||defaultPort;
      if(input)input.value=String(port);
      if(status)status.textContent=`Opening ${product} on localhost:${port}…`;
      open(port);
      return;
    }
    root.classList.add('redirect-config-mode');
    if(input)input.value=String(stored||defaultPort);
    if(mode==='invalid')showError('The redirect parameters were not recognised. Use ?config to change the local port.');
    form?.addEventListener('submit',event=>{
      event.preventDefault();
      const port=validPort(input?.value);
      if(!port){showError('That is not a valid TCP port. Enter a whole number from 1 to 65535.');return}
      if(error)error.hidden=true;
      save(port);
      open(port);
    });
    reset?.addEventListener('click',()=>{
      if(input)input.value=String(defaultPort);
      try{localStorage.removeItem(key)}catch{}
      if(error)error.hidden=true;
      input?.focus();
    });
  }
  document.addEventListener('DOMContentLoaded',init);
})();
