
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-BLY9BRVXYK');


const FORMSPREE='https://formspree.io/f/mkovyanq';
const LIMIT=3,KEY='c2c_v4';
let mode='fire',msgType='single';

function getUsage(){try{const d=JSON.parse(localStorage.getItem(KEY)||'{}'),t=new Date().toDateString();return d.date===t?d:{date:t,count:0};}catch{return{date:new Date().toDateString(),count:0};}}
function saveUsage(d){try{localStorage.setItem(KEY,JSON.stringify(d));}catch{}}
function refreshCount(){document.getElementById('usageCount').textContent=Math.max(0,LIMIT-getUsage().count);}
refreshCount();

function setType(t){
  msgType=t;
  ['single','collection','clearance','service'].forEach(x=>{
    document.getElementById('type-'+x).className='type-opt'+(x===t?' sel':'');
    document.getElementById('fields-'+x).classList.toggle('hidden',x!==t);
  });
}
function setStyle(s){
  mode=s;
  document.getElementById('opt-fire').className='style-opt'+(s==='fire'?' sel-fire':'');
  document.getElementById('opt-global').className='style-opt'+(s==='global'?' sel-global':'');
}

function scarcity(){
  const fri=(()=>{const d=new Date(),diff=(5-d.getDay()+7)%7||7;d.setDate(d.getDate()+diff);return d.toLocaleDateString('en-NG',{weekday:'long',month:'short',day:'numeric'});})();
  const o=['Only '+(Math.floor(Math.random()*4)+2)+' pieces left!','Just '+(Math.floor(Math.random()*3)+1)+' remaining at this price!','Offer closes '+fri+'!','Taking only '+(Math.floor(Math.random()*5)+3)+' orders this week.'];
  return o[Math.floor(Math.random()*o.length)];
}

function buildFire(d){
  if(msgType==='single'){const p=d.qty?d.cur+d.price+' for '+d.qty:d.cur+d.price;return 'ATTENTION '+d.target.toUpperCase()+'!\n\nAre you still struggling with this? The solution is right here.\n\nIntroducing *'+d.product+'*\n\n- '+d.benefit+'\n- Price: '+p+'\n- Delivery: '+d.speed+'\n\n'+scarcity()+'\n\nDo not wait. Message us NOW.\n\nReply *ORDER* and we handle the rest';}
  if(msgType==='collection'){return 'NEW COLLECTION DROP FOR '+d.target.toUpperCase()+'!\n\nThe wait is over. Our *'+d.product+'* is finally here.\n\nPrices from '+d.cur+d.price+'\nDelivery: '+d.speed+(d.qty?'\n'+d.qty+' available':'')+'\n\n'+scarcity()+'\n\nComment INTERESTED or reply DROP to see the full collection now.';}
  if(msgType==='clearance'){return 'CLEARANCE SALE ALERT!\n\n*'+d.product+'* - '+d.discount+'\n\n'+(d.original?d.original+'\n':'')+'Sale ends: '+d.end+'\nDelivery: '+d.speed+'\n\nThis is your last chance at this price.\n\n'+scarcity()+'\n\nReply *SALE* now to secure your order before it closes!';}
  if(msgType==='service'){return 'ATTENTION '+d.target.toUpperCase()+'!\n\nLooking for *'+d.product+'*?\n\nHere is what you get:\n- '+d.benefit+'\n- Starting from: '+d.cur+d.price+'\n- Turnaround: '+d.speed+'\n\n'+scarcity()+'\n\nReply *HIRE* now and let us get started.';}
}
function buildGlobal(d){
  if(msgType==='single'){const p=d.qty?d.cur+d.price+' for '+d.qty:'from '+d.cur+d.price;return 'Hi there\n\nI wanted to share something that might be exactly what you need.\n\nWe are offering *'+d.product+'* designed for '+d.target+'.\n\nWhat it does for you:\n- '+d.benefit+'\n\nPrice: '+p+'\nDelivery: '+d.speed+'\n\nWe have limited availability. Reply and I will guide you through everything.';}
  if(msgType==='collection'){return 'Hello\n\nWe are excited to present our new *'+d.product+'* collection, curated for '+d.target+'.\n\nPricing starts at '+d.cur+d.price+(d.qty?'\n'+d.qty+' pieces available':'')+'\nDelivery: '+d.speed+'\n\nThis collection is available for a limited time. Reply and I will send the full lookbook right away.';}
  if(msgType==='clearance'){return 'Hello\n\nWe are running a clearance on *'+d.product+'* with '+d.discount+'.'+(d.original?'\n'+d.original+'.':'')+'\n\nThis offer is available until '+d.end+'.\nDelivery: '+d.speed+'\n\nIf you have been waiting for the right price, this is it. Reply and I will help you place your order today.';}
  if(msgType==='service'){return 'Hello\n\nI provide professional *'+d.product+'* services for '+d.target+'.\n\nWhat you can expect:\n- '+d.benefit+'\n- Investment: '+d.cur+d.price+'\n- Delivery: '+d.speed+'\n\nI currently have limited slots open. Reply and let us discuss how I can help you.';}
}

function v(id){const el=document.getElementById(id);return el?el.value.trim():'';}
function getFormData(){
  if(msgType==='single')return{product:v('sp-product'),price:v('sp-price'),cur:v('sp-currency'),qty:v('sp-qty'),target:v('sp-target'),benefit:v('sp-benefit'),speed:v('sp-speed')};
  if(msgType==='collection')return{product:v('col-name'),price:v('col-price'),cur:v('col-currency'),qty:v('col-qty'),target:v('col-target'),speed:v('col-speed')};
  if(msgType==='clearance')return{product:v('cl-product'),discount:v('cl-discount'),cur:v('cl-currency'),original:v('cl-original'),end:v('cl-end'),speed:v('cl-speed')};
  if(msgType==='service')return{product:v('sv-service'),price:v('sv-price'),cur:v('sv-currency'),target:v('sv-target'),benefit:v('sv-benefit'),speed:v('sv-speed')};
}
function validate(){
  const req={single:['sp-product','sp-price','sp-target','sp-benefit','sp-speed','waNumber'],collection:['col-name','col-price','col-target','col-speed','waNumber'],clearance:['cl-product','cl-discount','cl-end','cl-speed','waNumber'],service:['sv-service','sv-price','sv-target','sv-benefit','sv-speed','waNumber']};
  let ok=true;
  req[msgType].forEach(id=>{const el=document.getElementById(id);if(!el||!el.value.trim()){if(el){el.classList.add('err');setTimeout(()=>el.classList.remove('err'),2500);}ok=false;}});
  return ok;
}
function buildLink(number,currency,message){
  let n=number.replace(/\D/g,'');
  if(currency==='₦'&&n.startsWith('0'))n='234'+n.slice(1);
  if(currency==='GH₵'&&n.startsWith('0'))n='233'+n.slice(1);
  return 'https://wa.me/'+n+'?text='+encodeURIComponent(message);
}

function generate(){
  const usage=getUsage();
  if(usage.count>=LIMIT){document.getElementById('limitModal').classList.add('show');return;}
  if(!validate()){shake();return;}
  const d=getFormData();
  const btn=document.getElementById('genBtn'),ldr=document.getElementById('loader');
  btn.style.display='none';ldr.classList.add('show');
  setTimeout(()=>{
    const msg=mode==='fire'?buildFire(d):buildGlobal(d);
    const link=buildLink(v('waNumber'),d.cur||'₦',msg);
    document.getElementById('salesMsg').textContent=msg;
    document.getElementById('linkBox').textContent=link;
    document.getElementById('waBtn').href=link;
    const chip=document.getElementById('styleChip');
    chip.textContent=mode==='fire'?'Nigerian Fire':'Global Pro';
    chip.className='style-chip '+(mode==='fire'?'chip-fire':'chip-global');
    ldr.classList.remove('show');btn.style.display='';
    document.getElementById('formCard').style.display='none';
    document.querySelector('.toggle-card').style.display='none';
    document.querySelector('.type-card').style.display='none';
    document.getElementById('outputSection').style.display='block';
    usage.count++;saveUsage(usage);refreshCount();
    if(typeof gtag !== 'undefined') gtag('event','message_generated',{event_category:'engagement',event_label:mode+'_'+msgType});
    window.scrollTo({top:document.getElementById('tool').offsetTop-80,behavior:'smooth'});
    /* Silently upgrade to AI message in background */
    upgradeWithAI(d, msg);
  },1100);
}

async function upgradeWithAI(d, templateMsg){
  try {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 12000);
    const res = await fetch(`${BACKEND}/generate`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      signal: controller.signal,
      body: JSON.stringify({
        msgType: msgType,
        style: mode,
        formData: {
          product: d.product||d.service||d.collection||'',
          cur: d.cur||'₦',
          price: d.price||'',
          target: d.target||d.client||'',
          benefit: d.benefit||'',
          speed: d.speed||'',
          qty: d.qty||'',
          discount: d.discount||'',
          end: d.end||'',
          original: d.original||''
        },
        imageUrl: uploadedFileUrl||''
      })
    });
    clearTimeout(timeout);
    if(res.ok){
      const data = await res.json();
      if(data.message && data.message.trim()){
        document.getElementById('salesMsg').textContent = data.message;
        const link = buildLink(v('waNumber'), d.cur||'₦', data.message);
        document.getElementById('linkBox').textContent = link;
        document.getElementById('waBtn').href = link;
        showToast('AI message ready ✨');
      }
    }
  } catch(e){ /* silent fail - template message stays */ }
}

function doCopy(id,btn){navigator.clipboard.writeText(document.getElementById(id).textContent).then(()=>{btn.textContent='Copied!';btn.classList.add('ok');showToast('Message copied to clipboard');setTimeout(()=>{btn.textContent='Copy';btn.classList.remove('ok');},2000);});}
function copyLink(btn){navigator.clipboard.writeText(document.getElementById('linkBox').textContent).then(()=>{btn.textContent='Copied!';btn.classList.add('ok');showToast('WhatsApp link copied');setTimeout(()=>{btn.textContent='Copy Link';btn.classList.remove('ok');},2000);});}
function showToast(msg){const t=document.getElementById('toast');t.textContent='✅ '+msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}

function resetAll(){
  document.querySelector('.type-card').style.display='';
  document.querySelector('.toggle-card').style.display='';
  document.getElementById('formCard').style.display='';
  document.getElementById('outputSection').style.display='none';
  document.getElementById('fbSuccess').classList.remove('show');
  document.getElementById('feedbackForm').style.opacity='1';
  window.scrollTo({top:document.getElementById('tool').offsetTop-80,behavior:'smooth'});
}

function selectChip(el,groupId){
  document.querySelectorAll('#'+groupId+' .fb-chip').forEach(c=>c.classList.remove('sel'));
  el.classList.add('sel');
  if(groupId==='sellerType')document.getElementById('fb-seller-type').value=el.textContent.trim();
  if(groupId==='sentMessage')document.getElementById('fb-sent-message').value=el.textContent.trim();
}

function sendFeedback(){
  const sellerType=document.getElementById('fb-seller-type').value;
  const sentMsg=document.getElementById('fb-sent-message').value;
  const message=document.getElementById('fb-message').value.trim();
  if(!sellerType){showToast('Please tell us what type of seller you are');return;}
  if(!sentMsg){showToast('Please tell us if you sent the message');return;}
  const btn=document.querySelector('.btn-send-fb');
  btn.textContent='Sending...';btn.disabled=true;
  fetch(FORMSPREE,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({seller_type:sellerType,sent_message:sentMsg,suggestion:message||'No suggestion provided',message_type:msgType,style_used:mode,_subject:'Chat2Cash Feedback - '+sellerType+' - '+sentMsg})})
  .then(r=>{if(r.ok){document.getElementById('feedbackForm').style.opacity='0.3';document.getElementById('fbSuccess').classList.add('show');gtag('event','feedback_sent',{event_category:'engagement',event_label:sellerType});}else{showToast('Could not send. Please try again.');}})
  .catch(()=>showToast('No connection. Please try again.'))
  .finally(()=>{btn.textContent='Send Feedback';btn.disabled=false;});
}


function getGeneratedMessage(){
  return document.getElementById('salesMsg') ? document.getElementById('salesMsg').textContent : '';
}
function shareToWhatsApp(){
  const msg = getGeneratedMessage();
  const url = 'https://wa.me/?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
  if(typeof gtag !== 'undefined') gtag('event','share_whatsapp',{event_category:'sharing'});
}
function shareToFacebook(){
  const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://mrsmile-build.github.io/chat2cash/');
  window.open(url, '_blank');
  if(typeof gtag !== 'undefined') gtag('event','share_facebook',{event_category:'sharing'});
}
function shareToTelegram(){
  const msg = getGeneratedMessage();
  const url = 'https://t.me/share/url?url=mrsmile-build.github.io/chat2cash&text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
  if(typeof gtag !== 'undefined') gtag('event','share_telegram',{event_category:'sharing'});
}
function nativeShare(){
  const msg = getGeneratedMessage();
  if(navigator.share){
    navigator.share({
      title:'Chat2Cash — My Sales Message',
      text: msg + '\n\nGenerated with Chat2Cash: mrsmile-build.github.io/chat2cash'
    });
    if(typeof gtag !== 'undefined') gtag('event','share_native',{event_category:'sharing'});
  } else {
    navigator.clipboard.writeText(msg).then(()=>showToast('Message copied — now paste anywhere'));
  }
}

function shareApp(){
  const url='https://mrsmile-build.github.io/chat2cash/';
  if(navigator.share){navigator.share({title:'Chat2Cash',text:'Free tool that writes your WhatsApp sales message in seconds:',url});}
  else{navigator.clipboard.writeText(url).then(()=>showToast('Link copied! Now share it'));}
  if(typeof gtag !== 'undefined') gtag('event','share_clicked',{event_category:'growth'});
}

function closeModal(){document.getElementById('limitModal').classList.remove('show');}
function doUpgrade(){gtag('event','upgrade_clicked',{event_category:'monetization'});alert('Pro access coming very soon! Keep using the free version for now.');closeModal();}
function joinWaitlist(){gtag('event','waitlist_click',{event_category:'monetization'});alert('Pro waitlist coming very soon!');}
function shake(){const b=document.getElementById('genBtn');b.style.animation='shk .38s ease';setTimeout(()=>b.style.animation='',380);}

window.addEventListener('scroll',()=>{
  const rect=document.getElementById('tool').getBoundingClientRect();
  document.getElementById('stickyCta').style.display=rect.top<window.innerHeight?'none':'block';
});

function toggleFaq(btn){
  const answer = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(a=>a.classList.remove('open'));
  document.querySelectorAll('.faq-icon.open').forEach(i=>i.classList.remove('open'));
  if(!isOpen){ answer.classList.add('open'); icon.classList.add('open'); }
}



/* ===== TAB SWITCHING ===== */
function switchTab(tab){
  document.getElementById('tab-generate').className = 'tool-tab' + (tab==='generate' ? ' active' : '');
  document.getElementById('tab-smartreply').className = 'tool-tab' + (tab==='smartreply' ? ' active' : '');
  const gs = document.getElementById('generateSection');
  const sr = document.getElementById('smartReplySection');
  if(tab==='generate'){
    gs.style.removeProperty('display');
    sr.style.display = 'none';
    gs.scrollIntoView({behavior:'smooth',block:'start'});
  } else {
    gs.style.display = 'none';
    sr.style.removeProperty('display');
    sr.style.minHeight = '400px';
    sr.scrollIntoView({behavior:'smooth',block:'start'});
  }
  if(typeof gtag !== 'undefined') gtag('event','tab_switch',{event_category:'engagement',event_label:tab});
}

/* ===== SCENARIO SELECTION ===== */
let srScenario = '';
function selectScenario(el, val){
  document.querySelectorAll('.scenario-chip').forEach(c=>c.classList.remove('sel'));
  el.classList.add('sel');
  srScenario = val;
  document.getElementById('sr-scenario').value = val;
  document.getElementById('customMsgField').style.display = val==='custom' ? 'block' : 'none';
}

/* ===== SMART REPLY BUILDERS ===== */
function buildReply(scenario, d){
  const cur = d.cur, prod = d.product, price = d.price, loc = d.location,
        del = d.delivery, pay = d.payment, disc = d.discount, custom = d.custom;

  if(scenario==='price'){
    if(disc && disc.toLowerCase()!=='no'){
      return `I understand you completely 🙏

Here is what I can do for you as a valued customer:

${prod} — ${cur}${price}
${disc}

This is genuinely my best offer. The quality alone is worth every kobo.

Payment: ${pay}
Delivery: ${del} (${loc})

Send me your address and let us close this today 🤝`;
    } else {
      return `I really appreciate your interest 🙏

I have to be honest with you — ${cur}${price} is already my final price for ${prod}.

But here is what you get:
✅ Top quality guaranteed
✅ Delivery: ${del}
✅ Payment: ${pay}

I would rather give you full value at this price than reduce and give you something less.

Shall I hold one for you? 😊`;
    }
  }

  if(scenario==='location'){
    return `We are based in ${loc} 📍

For ${prod}:
🚚 Delivery: ${del}
💳 Payment: ${pay}
💰 Price: ${cur}${price}

We deliver to your door — you do not need to come to us.

Just send your full address and we sort everything out for you 🙌`;
  }

  if(scenario==='delivery'){
    return `Great question! Here is how delivery works 🚚

📦 Product: ${prod}
📍 We ship from: ${loc}
⏱️ Delivery time: ${del}
💰 Price: ${cur}${price}
💳 Payment: ${pay}

Once you confirm your order and make payment, we dispatch immediately.

What is your delivery address? Let us get this moving for you today 🔥`;
  }

  if(scenario==='original'){
    return `100% original. I stake my reputation on it ✅

${prod} — ${cur}${price}

Every item I sell goes through quality check before it leaves my hands. I have been in this business too long to sell fake products and destroy my name.

If you receive anything less than what I described, I will refund you fully. That is my guarantee.

Delivery: ${del} from ${loc}
Payment: ${pay}

Ready to order? 🙌`;
  }

  if(scenario==='payment'){
    return `Payment is very easy and flexible 💳

We accept:
${pay}

📦 ${prod} — ${cur}${price}
🚚 Delivery: ${del}
📍 Location: ${loc}

Once payment is confirmed, we process your order immediately.

Which payment method works best for you? Let us finalize this now 😊`;
  }

  if(scenario==='interested'){
    return `Amazing! You made a great choice 🔥

${prod} — ${cur}${price}

Here is what happens next:
1️⃣ Send me your full delivery address
2️⃣ Make payment via ${pay}
3️⃣ We dispatch within ${del}

We are based in ${loc} and we handle everything smoothly.

Send your address now and let us get this done! 🙌`;
  }

  if(scenario==='thinking'){
    return `No pressure at all 😊

Just want to quickly let you know — I only have limited stock of ${prod} available at ${cur}${price}.

Once it goes, the price goes up with the next batch.

I would hate for you to miss this and pay more later.

Delivery is ${del} straight to your door from ${loc}.

Take your time — but do not wait too long 🙏`;
  }

  if(scenario==='custom'){
    return `Thank you for reaching out! 🙏

Regarding your question about ${prod}:

Price: ${cur}${price}
Location: ${loc}
Delivery: ${del}
Payment: ${pay}${disc ? ' ' + disc : ''}

Is there anything else you would like to know? I am here to help you get exactly what you need 😊`;
  }

  return '';
}

/* ===== GENERATE REPLY ===== */

function resetSmartReply(){
  document.getElementById('srOutput').classList.remove('show');
  document.querySelectorAll('.scenario-chip').forEach(c=>c.classList.remove('sel'));
  srScenario='';
  document.getElementById('customMsgField').style.display='none';
  window.scrollTo({top:document.getElementById('tool').offsetTop-80,behavior:'smooth'});
}

function srShareWA(){
  const msg = document.getElementById('srMsg').textContent;
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}
function srNativeShare(){
  const msg = document.getElementById('srMsg').textContent;
  if(navigator.share){ navigator.share({title:'My Reply',text:msg}); }
  else { navigator.clipboard.writeText(msg).then(()=>showToast('Reply copied!')); }
}


/* ===== BACKEND CONFIG ===== */
const BACKEND = 'https://chat2cash.onrender.com';

/* ===== FILE/IMAGE UPLOAD — calls backend /upload-image ===== */
let uploadedFileUrl = '';
let currentUploadTab = 'image';

function switchUploadTab(tab){
  currentUploadTab = tab;
  document.getElementById('utab-image').className = 'upload-tab' + (tab==='image'?' active':'');
  document.getElementById('utab-file').className = 'upload-tab' + (tab==='file'?' active':'');
  document.getElementById('upload-image-zone').style.display = tab==='image'?'':'none';
  document.getElementById('upload-file-zone').style.display = tab==='file'?'':'none';
}

async function handleUpload(input, type){
  const file = input.files[0];
  if(!file) return;
  if(file.size > 5*1024*1024){ showToast('File too large. Max 5MB.'); return; }

  const statusEl = document.getElementById('uploadStatus');
  const statusText = document.getElementById('uploadStatusText');
  statusEl.classList.add('show');
  statusText.textContent = type==='image' ? 'Uploading photo...' : 'Uploading file...';

  try {
    const base64 = await toBase64(file);
    const b64data = base64.split(',')[1];

    /* Call Render backend — keys are safe on server */
    const res = await fetch(`${BACKEND}/upload-image`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({image: b64data, filename: file.name, type: type})
    });

    if(!res.ok) throw new Error('Upload failed');
    const data = await res.json();

    if(data.url){
      uploadedFileUrl = data.url;

      if(type==='image'){
        document.getElementById('uploadImgPreview').src = data.url;
        document.getElementById('uploadImgPreview').style.display = 'block';
        document.getElementById('uploadFilePreview').style.display = 'none';
      } else {
        document.getElementById('uploadFileName').textContent = file.name;
        document.getElementById('uploadFilePreview').style.display = 'flex';
        document.getElementById('uploadImgPreview').style.display = 'none';
      }

      document.getElementById('uploadLink').href = data.url;
      document.getElementById('uploadLinkText').textContent = '✅ Link ready — will be added to your message';
      document.getElementById('uploadResult').classList.add('show');

      showToast(type==='image' ? 'Photo uploaded! Link will be in your message.' : 'File uploaded! Link will be in your message.');
      if(typeof gtag !== 'undefined') gtag('event','file_uploaded',{event_category:'engagement',event_label:type});
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch(e){
    console.error('Upload error:', e);
    showToast('Upload failed. Check your connection and try again.');
  }
  statusEl.classList.remove('show');
}

function toBase64(file){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=>res(r.result);
    r.onerror = ()=>rej(new Error('Read failed'));
    r.readAsDataURL(file);
  });
}

function removeUpload(){
  uploadedFileUrl = '';
  document.getElementById('uploadResult').classList.remove('show');
  document.getElementById('uploadImgPreview').style.display = 'none';
  document.getElementById('uploadFilePreview').style.display = 'none';
  document.getElementById('imgFileInput').value = '';
  document.getElementById('docFileInput').value = '';
  showToast('File removed.');
}

/* ===== GROQ AI MESSAGE GENERATION ===== */
async function generateWithGroq(formData){
  const imageNote = uploadedImageUrl 
    ? `\n\nProduct image link (add this at the end of the message): ${uploadedImageUrl}` 
    : '';

  const styleNote = formData.style === 'fire' 
    ? 'Nigerian Fire style: HIGH ENERGY, bold, urgent, scarcity-driven, all caps hook, emojis, built for Nigerian/African WhatsApp sellers.'
    : 'Global Pro style: calm, professional, persuasive, trust-building, clean formatting, international audience.';

  const typePrompts = {
    single: `Product: ${formData.product}. Price: ${formData.currency}${formData.price}. Target customer: ${formData.target}. Main benefit: ${formData.benefit}. Delivery: ${formData.delivery}.${formData.qty ? ' Quantity/size: '+formData.qty+'.' : ''}`,
    collection: `Collection name: ${formData.collection}. Price range: ${formData.currency}${formData.price}. Target customer: ${formData.target}. Delivery: ${formData.delivery}.${formData.pieces ? ' Pieces available: '+formData.pieces+'.' : ''}`,
    clearance: `Product/category on sale: ${formData.product}. Discount: ${formData.discount}. Original price: ${formData.currency}${formData.origPrice || ''}. Sale price: ${formData.currency}${formData.price}. Sale ends: ${formData.saleEnd}. Delivery: ${formData.delivery}.`,
    service: `Service: ${formData.service}. Starting price: ${formData.currency}${formData.price}. Target client: ${formData.target}. Main benefit: ${formData.benefit}. Turnaround: ${formData.turnaround}.`
  };

  const prompt = `You are a WhatsApp sales message expert for African sellers.

Write ONE complete WhatsApp sales message in ${styleNote}

Details: ${typePrompts[formData.type] || typePrompts.single}${imageNote}

Rules:
- Start with a powerful attention-grabbing hook line
- Include urgency and scarcity naturally  
- End with a clear call to action (Reply ORDER, Reply YES, Comment INTERESTED etc)
- Keep it under 150 words
- No hashtags
- No quotation marks around the message
- Just write the message directly, nothing else`;

  const response = await fetch(`${BACKEND}/generate`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      msgType: formData.type,
      style: formData.style,
      formData: {
        product: formData.product,
        cur: formData.currency,
        price: formData.price,
        target: formData.target,
        benefit: formData.benefit,
        speed: formData.delivery,
        qty: formData.qty,
        discount: formData.discount,
        end: formData.saleEnd,
        original: formData.origPrice,
      },
      imageUrl: uploadedFileUrl || ''
    })
  });

  if(!response.ok) throw new Error('Backend error');
  const data = await response.json();
  return data.message;
}

/* ===== GROQ SMART REPLY ===== */
async function generateReplyWithGroq(scenario, d){
  const scenarioDescriptions = {
    price: `Customer is asking to reduce the price or negotiate`,
    location: `Customer is asking where the seller is located`,
    delivery: `Customer is asking about delivery options and timing`,
    original: `Customer is asking if the product is original/authentic`,
    payment: `Customer is asking about payment methods`,
    interested: `Customer has said they are interested in buying`,
    thinking: `Customer said they want to think about it`,
    custom: `Customer said: "${d.custom}"`
  };

  const prompt = `You are a WhatsApp sales reply expert for African sellers.

Write ONE perfect reply to this customer situation: ${scenarioDescriptions[scenario]}

Seller details:
- Product: ${d.product}
- Price: ${d.cur}${d.price}
- Location: ${d.location}
- Delivery: ${d.delivery}
- Payment methods: ${d.payment}${d.discount ? '\n- Discount flexibility: '+d.discount : ''}

Rules:
- Sound confident but friendly
- Keep it under 80 words
- Include relevant details naturally
- End with a question or clear next step
- Use emojis sparingly
- Write the reply directly, no preamble`;

  const response = await fetch(`${BACKEND}/smart-reply`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      scenario: scenario,
      details: {
        product: d.product,
        cur: d.cur,
        price: d.price,
        location: d.location,
        delivery: d.delivery,
        payment: d.payment,
        discount: d.discount,
        custom: d.custom
      }
    })
  });

  if(!response.ok) throw new Error('Backend error');
  const data = await response.json();
  return data.reply;
}


/* ===== AI MESSAGE GENERATION WRAPPER ===== */
async function generateMessageAI(){
  // Use existing validation and form data functions
  const usage = getUsage();
  if(usage.count >= LIMIT){ document.getElementById('limitModal').classList.add('show'); return; }
  if(!validate()){ shake(); return; }

  const d = getFormData();
  const btn = document.getElementById('genBtn');
  const ldr = document.getElementById('loader');
  btn.style.display='none';
  ldr.classList.add('show');

  // Build form data for backend using existing getFormData()
  const formData = {
    product: d.product || d.service || d.collection || '',
    cur: d.cur || '₦',
    price: d.price || '',
    target: d.target || d.client || '',
    benefit: d.benefit || '',
    speed: d.speed || '',
    qty: d.qty || '',
    discount: d.discount || '',
    end: d.end || '',
    original: d.original || '',
  };

  try {
    // Try AI first via backend
    const res = await fetch(`${BACKEND}/generate`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        msgType: msgType,
        style: mode,
        formData: formData,
        imageUrl: uploadedFileUrl || ''
      })
    });

    let msg;
    if(res.ok){
      const data = await res.json();
      msg = data.message;
    } else {
      throw new Error('Backend error');
    }

    // Use exact same display logic as original generate()
    const link = buildLink(v('waNumber'), d.cur || '₦', msg);
    document.getElementById('salesMsg').textContent = msg;
    document.getElementById('linkBox').textContent = link;
    document.getElementById('waBtn').href = link;
    const chip = document.getElementById('styleChip');
    chip.textContent = mode==='fire' ? 'Nigerian Fire' : 'Global Pro';
    chip.className = 'style-chip ' + (mode==='fire' ? 'chip-fire' : 'chip-global');
    document.getElementById('formCard').style.display = 'none';
    document.querySelector('.toggle-card').style.display = 'none';
    document.querySelector('.type-card').style.display = 'none';
    document.getElementById('outputSection').style.display = 'block';
    usage.count++; saveUsage(usage); refreshCount();
    if(typeof gtag !== 'undefined') gtag('event','message_generated_ai',{event_category:'engagement',event_label:msgType+'_'+mode});
    window.scrollTo({top:document.getElementById('tool').offsetTop-80,behavior:'smooth'});

  } catch(e){
    console.warn('AI failed, using template fallback:', e);
    // Fallback to existing template system
    generate();
    return;
  }

  ldr.classList.remove('show');
  btn.style.display='';
}

/* ===== AI SMART REPLY WRAPPER ===== */
async function generateReply(){
  if(!srScenario){ showToast('Please select what the customer said'); return; }
  const product = document.getElementById('sr-product').value.trim();
  const price   = document.getElementById('sr-price').value.trim();
  const loc     = document.getElementById('sr-location').value.trim();
  const del     = document.getElementById('sr-delivery').value.trim();
  const pay     = document.getElementById('sr-payment').value.trim();
  if(!product||!price||!loc||!del||!pay){
    showToast('Please fill all required fields'); return;
  }
  const d = {
    product, price, cur: document.getElementById('sr-currency').value,
    location:loc, delivery:del, payment:pay,
    discount: document.getElementById('sr-discount').value.trim(),
    custom: document.getElementById('sr-custom') ? document.getElementById('sr-custom').value.trim() : ''
  };
  const btn = document.getElementById('srBtn');
  const ldr = document.getElementById('sr-loader');
  btn.style.display='none'; ldr.classList.add('show');

  try {
    let reply;
    try {
      /* Call backend — keys are safe on Render server */
      const res = await fetch(`${BACKEND}/smart-reply`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({scenario: srScenario, details: d})
      });
      if(!res.ok) throw new Error('Backend error');
      const data = await res.json();
      reply = data.reply;
    } catch(e){
      console.warn('Backend failed, using template:', e);
      reply = buildReply(srScenario, d);
    }
    document.getElementById('srMsg').textContent = reply;
    document.getElementById('srOutput').classList.add('show');
    if(typeof gtag !== 'undefined') gtag('event','smart_reply_ai',{event_category:'engagement',event_label:srScenario});
    document.getElementById('srOutput').scrollIntoView({behavior:'smooth',block:'nearest'});
  } catch(e){
    showToast('Something went wrong. Try again.');
  }
  ldr.classList.remove('show'); btn.style.display='';
}


/* ===== FOLLOW-UP GENERATOR ===== */
let fuScenario = '', fuStyle = 'english';
function selectFollowup(el, val){
  document.querySelectorAll('.followup-chip').forEach(c=>c.classList.remove('sel'));
  el.classList.add('sel'); fuScenario = val;
}
function setFollowupStyle(s){
  fuStyle = s;
  document.getElementById('fu-eng').className = 'toggle-pill' + (s==='english'?' active-en':'');
  document.getElementById('fu-naija').className = 'toggle-pill' + (s==='naija'?' active-ng':'');
}
async function generateFollowUp(){
  if(!fuScenario){ showToast('Please select what happened'); return; }
  const product = document.getElementById('fu-product').value.trim();
  const price = document.getElementById('fu-price').value.trim();
  if(!product||!price){ showToast('Please fill product and price'); return; }
  const cur = document.getElementById('fu-currency').value;
  const btn = document.getElementById('fuBtn');
  const ldr = document.getElementById('fu-loader');
  btn.style.display='none'; ldr.classList.add('show');
  try {
    const res = await fetch(`${BACKEND}/smart-reply`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        scenario: 'followup_' + fuScenario,
        details: { product, price, cur, style: fuStyle, location:'', delivery:'', payment:'', discount:'' }
      })
    });
    let reply;
    if(res.ok){ const d=await res.json(); reply=d.reply; }
    else { reply = buildFollowUp(fuScenario, product, cur+price, fuStyle); }
    document.getElementById('fuMsg').textContent = reply;
    document.getElementById('fuOutput').classList.add('show');
    document.getElementById('fuOutput').scrollIntoView({behavior:'smooth',block:'nearest'});
  } catch(e){
    const reply = buildFollowUp(fuScenario, product, cur+price, fuStyle);
    document.getElementById('fuMsg').textContent = reply;
    document.getElementById('fuOutput').classList.add('show');
  }
  ldr.classList.remove('show'); btn.style.display='';
}
function buildFollowUp(scenario, product, price, style){
  const naija = style === 'naija';
  if(scenario==='ghosted'){
    return naija
      ? `Oga/Ma, good day o! 😊

I just dey check if you still interested in ${product}.

The price na ${price} and e still dey available.

No pressure o, just make sure say you no miss am before e finish. 🙏`
      : `Hi, hope you're doing well! 😊

Just checking in to see if you're still interested in ${product}.

It's available at ${price} and I'd love to help you secure one.

No pressure at all — just don't want you to miss out! 🙏`;
  }
  if(scenario==='interested'){
    return naija
      ? `Hello! You talk say you interested for ${product} before. 😊

E still dey available for ${price}.

Should I reserve one for you? Just give me your address make I sort you out! 🔥`
      : `Hi there! You mentioned being interested in ${product} earlier. 😊

It's still available at ${price}.

Would you like me to reserve one for you? Just send your address and we'll get it sorted! 🔥`;
  }
  if(scenario==='price'){
    return naija
      ? `I hear you o! 😊

But I go honest with you — ${price} na the final price for ${product}. The quality dey worth am.

Many of my customers don come back again because they satisfied. You fit give am try? 🙏`
      : `I completely understand! 😊

However, ${price} is genuinely my best price for ${product}. The quality truly makes it worth every penny.

Many of my returning customers will attest to that. Would you like to give it a try? 🙏`;
  }
  if(scenario==='pending'){
    return naija
      ? `Hi! Your order for ${product} still dey pending o. 😊

Once you make payment of ${price}, I go process am immediately and e go reach you sharp sharp.

Which payment method work for you? 💳`
      : `Hi! Your order for ${product} is still pending. 😊

Once payment of ${price} is confirmed, I'll process and dispatch immediately.

Which payment method works best for you? 💳`;
  }
  if(scenario==='viewed'){
    return naija
      ? `You see my status about ${product}? 😊

E go too good for ${price} o! Delivery dey available.

You go like make I reserve one for you? 🔥`
      : `Hope you saw my status about ${product}! 😊

At ${price} it's an amazing deal. Delivery is available to you.

Would you like me to reserve one? 🔥`;
  }
  if(scenario==='stockwarn'){
    return naija
      ? `URGENT o! 🚨

We dey almost finish ${product} for ${price}.

If you still want am, you need act now before e finish completely!

Reply YES make I reserve the last one for you! ⚡`
      : `URGENT! 🚨

We are almost sold out of ${product} at ${price}.

If you're still interested, you need to act now before we completely run out!

Reply YES and I'll reserve the last one for you! ⚡`;
  }
  return '';
}
function resetFollowUp(){
  document.querySelectorAll('.followup-chip').forEach(c=>c.classList.remove('sel'));
  fuScenario=''; document.getElementById('fuOutput').classList.remove('show');
}
function fuShareWA(){ window.open('https://wa.me/?text='+encodeURIComponent(document.getElementById('fuMsg').textContent),'_blank'); }
function fuNativeShare(){ if(navigator.share){navigator.share({text:document.getElementById('fuMsg').textContent});}else{navigator.clipboard.writeText(document.getElementById('fuMsg').textContent).then(()=>showToast('Copied!'));} }

/* ===== WHATSAPP STATUS GENERATOR ===== */
let stType = '', stStyle = 'english';
function selectStatusType(el, val){
  document.querySelectorAll('.status-type').forEach(s=>s.classList.remove('sel'));
  el.classList.add('sel'); stType = val;
}
function setStatusStyle(s){
  stStyle = s;
  document.getElementById('st-eng').className = 'toggle-pill' + (s==='english'?' active-en':'');
  document.getElementById('st-naija').className = 'toggle-pill' + (s==='naija'?' active-ng':'');
}
async function generateStatus(){
  if(!stType){ showToast('Please select a status type'); return; }
  const product = document.getElementById('st-product').value.trim();
  const price = document.getElementById('st-price').value.trim();
  if(!product||!price){ showToast('Please fill product and price'); return; }
  const cur = document.getElementById('st-currency').value;
  const btn = document.getElementById('stBtn');
  const ldr = document.getElementById('st-loader');
  btn.style.display='none'; ldr.classList.add('show');
  const status = buildStatus(stType, product, cur+price, stStyle);
  setTimeout(()=>{
    document.getElementById('statusMsg').textContent = status;
    document.getElementById('statusOutput').classList.add('show');
    document.getElementById('statusOutput').scrollIntoView({behavior:'smooth',block:'nearest'});
    ldr.classList.remove('show'); btn.style.display='';
  }, 800);
}
function buildStatus(type, product, price, style){
  const naija = style === 'naija';
  if(type==='product'){
    return naija
      ? `TODAY SPECIAL!!! 🔥

${product} dey available!
Price: ${price}

Quality guaranteed, delivery available.

DM me to order now! ⚡

#available #orderNow`
      : `Available Now! ✨

${product}
Price: ${price}

Top quality. Fast delivery.

DM to order 👇`;
  }
  if(type==='urgency'){
    return naija
      ? `LAST FEW REMAINING!!! 🚨

${product} dey almost finish!
Price: ${price}

Once e finish, e finish o!
DM me NOW before you miss am! 👇`
      : `Almost Gone! ⚠️

${product} — Only a few left!
Price: ${price}

Don't miss out. DM now to secure yours before it's gone! 🏃`;
  }
  if(type==='testimony'){
    return naija
      ? `My customer just tell me say she happy with the ${product}! 😊

Price: ${price}

If she happy, you go happy too!
DM me to get yours today! ⭐`
      : `Customer Review! ⭐

"I love my ${product}! Best purchase I've made." — Happy Customer

Price: ${price}

Want the same results? DM me today! 😊`;
  }
  if(type==='cta'){
    return naija
      ? `You still dey sleep? 😂

${product} dey wait for you!
Price: ${price}

DM me right now make I sort you out!
No dulling! 🔥`
      : `Still thinking about it? 😊

${product} is still available at ${price}.

DM me today and let's get you sorted!
Delivery available nationwide 📦`;
  }
  return '';
}
function resetStatus(){
  document.querySelectorAll('.status-type').forEach(s=>s.classList.remove('sel'));
  stType=''; document.getElementById('statusOutput').classList.remove('show');
}
function stShareWA(){ window.open('https://wa.me/?text='+encodeURIComponent(document.getElementById('statusMsg').textContent),'_blank'); }
function stNativeShare(){ if(navigator.share){navigator.share({text:document.getElementById('statusMsg').textContent});}else{navigator.clipboard.writeText(document.getElementById('statusMsg').textContent).then(()=>showToast('Copied!'));} }

/* ===== NAIJA STYLE TOGGLE FOR SMART REPLY ===== */
let srStyle = 'english';
function setSRStyle(s){
  srStyle = s;
  const engBtn = document.getElementById('sr-eng');
  const ngBtn = document.getElementById('sr-naija');
  if(engBtn) engBtn.className = 'toggle-pill' + (s==='english'?' active-en':'');
  if(ngBtn) ngBtn.className = 'toggle-pill' + (s==='naija'?' active-ng':'');
}


/* ===== PWA ===== */
let deferredPrompt;
window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault(); deferredPrompt=e;
  document.getElementById('pwaBanner').style.display='flex';
});
function installPWA(){
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.waitForChoiceResult().then(()=>{
    deferredPrompt=null;
    document.getElementById('pwaBanner').style.display='none';
  });
}
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/chat2cash/service-worker.js').catch(e=>console.log(e));
}

/* ===== WA CAPTURE ===== */
async function submitWACapture(){
  const num=document.getElementById('waCaptureNum').value.trim();
  if(!num||num.length<10){showToast('Please enter a valid WhatsApp number');return;}
  try{
    await fetch('https://formspree.io/f/mkovyanq',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({_subject:'New WhatsApp Number - Chat2Cash',whatsapp_number:num})
    });
  }catch(e){}
  document.getElementById('waCaptureSuccess').style.display='block';
  document.getElementById('waCaptureNum').value='';
}

/* ===== DEMO PREFILL ===== */
function prefillDemo(){
  setType('single');
  setStyle('fire');
  setTimeout(()=>{
    const f={'sp-product':'Brightening Body Cream','sp-qty':'500ml bottle','sp-price':'3500','sp-target':'Ladies who want glowing skin','sp-benefit':'Smoother glowing skin in 7 days','sp-speed':'Same day delivery Lagos','waNumber':'2348000000000'};
    Object.entries(f).forEach(([id,val])=>{const el=document.getElementById(id);if(el)el.value=val;});
    const cur=document.getElementById('sp-currency');if(cur)cur.value='&#8358;';
    showToast('Example loaded! Tap Generate to see the magic &#9889;');
  },300);
}

/* Count-up on scroll */
(function(){
  const nums = document.querySelectorAll('.proof-num');
  if(!nums.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.3});
  nums.forEach(n=>obs.observe(n));
})();

