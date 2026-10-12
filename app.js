(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory():typeof define==="function"&&define.amd?define(factory):(global=global||self,global.morphdom=factory())})(this,function(){"use strict";var DOCUMENT_FRAGMENT_NODE=11;function morphAttrs(fromNode,toNode){var toNodeAttrs=toNode.attributes;var attr;var attrName;var attrNamespaceURI;var attrValue;var fromValue;if(toNode.nodeType===DOCUMENT_FRAGMENT_NODE||fromNode.nodeType===DOCUMENT_FRAGMENT_NODE){return}for(var i=toNodeAttrs.length-1;i>=0;i--){attr=toNodeAttrs[i];attrName=attr.name;attrNamespaceURI=attr.namespaceURI;attrValue=attr.value;if(attrNamespaceURI){attrName=attr.localName||attrName;fromValue=fromNode.getAttributeNS(attrNamespaceURI,attrName);if(fromValue!==attrValue){if(attr.prefix==="xmlns"){attrName=attr.name}fromNode.setAttributeNS(attrNamespaceURI,attrName,attrValue)}}else{fromValue=fromNode.getAttribute(attrName);if(fromValue!==attrValue){fromNode.setAttribute(attrName,attrValue)}}}var fromNodeAttrs=fromNode.attributes;for(var d=fromNodeAttrs.length-1;d>=0;d--){attr=fromNodeAttrs[d];attrName=attr.name;attrNamespaceURI=attr.namespaceURI;if(attrNamespaceURI){attrName=attr.localName||attrName;if(!toNode.hasAttributeNS(attrNamespaceURI,attrName)){fromNode.removeAttributeNS(attrNamespaceURI,attrName)}}else{if(!toNode.hasAttribute(attrName)){fromNode.removeAttribute(attrName)}}}}var range;var NS_XHTML="http://www.w3.org/1999/xhtml";var doc=typeof document==="undefined"?undefined:document;var HAS_TEMPLATE_SUPPORT=!!doc&&"content"in doc.createElement("template");var HAS_RANGE_SUPPORT=!!doc&&doc.createRange&&"createContextualFragment"in doc.createRange();function createFragmentFromTemplate(str){var template=doc.createElement("template");template.innerHTML=str;return template.content.childNodes[0]}function createFragmentFromRange(str){if(!range){range=doc.createRange();range.selectNode(doc.body)}var fragment=range.createContextualFragment(str);return fragment.childNodes[0]}function createFragmentFromWrap(str){var fragment=doc.createElement("body");fragment.innerHTML=str;return fragment.childNodes[0]}function toElement(str){str=str.trim();if(HAS_TEMPLATE_SUPPORT){return createFragmentFromTemplate(str)}else if(HAS_RANGE_SUPPORT){return createFragmentFromRange(str)}return createFragmentFromWrap(str)}function compareNodeNames(fromEl,toEl){var fromNodeName=fromEl.nodeName;var toNodeName=toEl.nodeName;var fromCodeStart,toCodeStart;if(fromNodeName===toNodeName){return true}fromCodeStart=fromNodeName.charCodeAt(0);toCodeStart=toNodeName.charCodeAt(0);if(fromCodeStart<=90&&toCodeStart>=97){return fromNodeName===toNodeName.toUpperCase()}else if(toCodeStart<=90&&fromCodeStart>=97){return toNodeName===fromNodeName.toUpperCase()}else{return false}}function createElementNS(name,namespaceURI){return!namespaceURI||namespaceURI===NS_XHTML?doc.createElement(name):doc.createElementNS(namespaceURI,name)}function moveChildren(fromEl,toEl){var curChild=fromEl.firstChild;while(curChild){var nextChild=curChild.nextSibling;toEl.appendChild(curChild);curChild=nextChild}return toEl}function syncBooleanAttrProp(fromEl,toEl,name){if(fromEl[name]!==toEl[name]){fromEl[name]=toEl[name];if(fromEl[name]){fromEl.setAttribute(name,"")}else{fromEl.removeAttribute(name)}}}var specialElHandlers={OPTION:function(fromEl,toEl){var parentNode=fromEl.parentNode;if(parentNode){var parentName=parentNode.nodeName.toUpperCase();if(parentName==="OPTGROUP"){parentNode=parentNode.parentNode;parentName=parentNode&&parentNode.nodeName.toUpperCase()}if(parentName==="SELECT"&&!parentNode.hasAttribute("multiple")){if(fromEl.hasAttribute("selected")&&!toEl.selected){fromEl.setAttribute("selected","selected");fromEl.removeAttribute("selected")}parentNode.selectedIndex=-1}}syncBooleanAttrProp(fromEl,toEl,"selected")},INPUT:function(fromEl,toEl){syncBooleanAttrProp(fromEl,toEl,"checked");syncBooleanAttrProp(fromEl,toEl,"disabled");if(fromEl.value!==toEl.value){fromEl.value=toEl.value}if(!toEl.hasAttribute("value")){fromEl.removeAttribute("value")}},TEXTAREA:function(fromEl,toEl){var newValue=toEl.value;if(fromEl.value!==newValue){fromEl.value=newValue}var firstChild=fromEl.firstChild;if(firstChild){var oldValue=firstChild.nodeValue;if(oldValue==newValue||!newValue&&oldValue==fromEl.placeholder){return}firstChild.nodeValue=newValue}},SELECT:function(fromEl,toEl){if(!toEl.hasAttribute("multiple")){var selectedIndex=-1;var i=0;var curChild=fromEl.firstChild;var optgroup;var nodeName;while(curChild){nodeName=curChild.nodeName&&curChild.nodeName.toUpperCase();if(nodeName==="OPTGROUP"){optgroup=curChild;curChild=optgroup.firstChild;if(!curChild){curChild=optgroup.nextSibling;optgroup=null}}else{if(nodeName==="OPTION"){if(curChild.hasAttribute("selected")){selectedIndex=i;break}i++}curChild=curChild.nextSibling;if(!curChild&&optgroup){curChild=optgroup.nextSibling;optgroup=null}}}fromEl.selectedIndex=selectedIndex}}};var ELEMENT_NODE=1;var DOCUMENT_FRAGMENT_NODE$1=11;var TEXT_NODE=3;var COMMENT_NODE=8;function noop(){}function defaultGetNodeKey(node){if(node){return node.getAttribute&&node.getAttribute("id")||node.id}}function morphdomFactory(morphAttrs){return function morphdom(fromNode,toNode,options){if(!options){options={}}if(typeof toNode==="string"){if(fromNode.nodeName==="#document"||fromNode.nodeName==="HTML"){var toNodeHtml=toNode;toNode=doc.createElement("html");toNode.innerHTML=toNodeHtml}else if(fromNode.nodeName==="BODY"){var toNodeBody=toNode;toNode=doc.createElement("html");toNode.innerHTML=toNodeBody;var bodyElement=toNode.querySelector("body");if(bodyElement){toNode=bodyElement}}else{toNode=toElement(toNode)}}else if(toNode.nodeType===DOCUMENT_FRAGMENT_NODE$1){toNode=toNode.firstElementChild}var getNodeKey=options.getNodeKey||defaultGetNodeKey;var onBeforeNodeAdded=options.onBeforeNodeAdded||noop;var onNodeAdded=options.onNodeAdded||noop;var onBeforeElUpdated=options.onBeforeElUpdated||noop;var onElUpdated=options.onElUpdated||noop;var onBeforeNodeDiscarded=options.onBeforeNodeDiscarded||noop;var onNodeDiscarded=options.onNodeDiscarded||noop;var onBeforeElChildrenUpdated=options.onBeforeElChildrenUpdated||noop;var skipFromChildren=options.skipFromChildren||noop;var addChild=options.addChild||function(parent,child){return parent.appendChild(child)};var childrenOnly=options.childrenOnly===true;var fromNodesLookup=Object.create(null);var keyedRemovalList=[];function addKeyedRemoval(key){keyedRemovalList.push(key)}function walkDiscardedChildNodes(node,skipKeyedNodes){if(node.nodeType===ELEMENT_NODE){var curChild=node.firstChild;while(curChild){var key=undefined;if(skipKeyedNodes&&(key=getNodeKey(curChild))){addKeyedRemoval(key)}else{onNodeDiscarded(curChild);if(curChild.firstChild){walkDiscardedChildNodes(curChild,skipKeyedNodes)}}curChild=curChild.nextSibling}}}function removeNode(node,parentNode,skipKeyedNodes){if(onBeforeNodeDiscarded(node)===false){return}if(parentNode){parentNode.removeChild(node)}onNodeDiscarded(node);walkDiscardedChildNodes(node,skipKeyedNodes)}function indexTree(node){if(node.nodeType===ELEMENT_NODE||node.nodeType===DOCUMENT_FRAGMENT_NODE$1){var curChild=node.firstChild;while(curChild){var key=getNodeKey(curChild);if(key){fromNodesLookup[key]=curChild}indexTree(curChild);curChild=curChild.nextSibling}}}indexTree(fromNode);function handleNodeAdded(el){onNodeAdded(el);var curChild=el.firstChild;while(curChild){var nextSibling=curChild.nextSibling;var key=getNodeKey(curChild);if(key){var unmatchedFromEl=fromNodesLookup[key];if(unmatchedFromEl&&compareNodeNames(curChild,unmatchedFromEl)){curChild.parentNode.replaceChild(unmatchedFromEl,curChild);morphEl(unmatchedFromEl,curChild)}else{handleNodeAdded(curChild)}}else{handleNodeAdded(curChild)}curChild=nextSibling}}function cleanupFromEl(fromEl,curFromNodeChild,curFromNodeKey){while(curFromNodeChild){var fromNextSibling=curFromNodeChild.nextSibling;if(curFromNodeKey=getNodeKey(curFromNodeChild)){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=fromNextSibling}}function morphEl(fromEl,toEl,childrenOnly){var toElKey=getNodeKey(toEl);if(toElKey){delete fromNodesLookup[toElKey]}if(!childrenOnly){var beforeUpdateResult=onBeforeElUpdated(fromEl,toEl);if(beforeUpdateResult===false){return}else if(beforeUpdateResult instanceof HTMLElement){fromEl=beforeUpdateResult;indexTree(fromEl)}morphAttrs(fromEl,toEl);onElUpdated(fromEl);if(onBeforeElChildrenUpdated(fromEl,toEl)===false){return}}if(fromEl.nodeName!=="TEXTAREA"){morphChildren(fromEl,toEl)}else{specialElHandlers.TEXTAREA(fromEl,toEl)}}function morphChildren(fromEl,toEl){var skipFrom=skipFromChildren(fromEl,toEl);var curToNodeChild=toEl.firstChild;var curFromNodeChild=fromEl.firstChild;var curToNodeKey;var curFromNodeKey;var fromNextSibling;var toNextSibling;var matchingFromEl;outer:while(curToNodeChild){toNextSibling=curToNodeChild.nextSibling;curToNodeKey=getNodeKey(curToNodeChild);while(!skipFrom&&curFromNodeChild){fromNextSibling=curFromNodeChild.nextSibling;if(curToNodeChild.isSameNode&&curToNodeChild.isSameNode(curFromNodeChild)){curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling;continue outer}curFromNodeKey=getNodeKey(curFromNodeChild);var curFromNodeType=curFromNodeChild.nodeType;var isCompatible=undefined;if(curFromNodeType===curToNodeChild.nodeType){if(curFromNodeType===ELEMENT_NODE){if(curToNodeKey){if(curToNodeKey!==curFromNodeKey){if(matchingFromEl=fromNodesLookup[curToNodeKey]){if(fromNextSibling===matchingFromEl){isCompatible=false}else{fromEl.insertBefore(matchingFromEl,curFromNodeChild);if(curFromNodeKey){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=matchingFromEl;curFromNodeKey=getNodeKey(curFromNodeChild)}}else{isCompatible=false}}}else if(curFromNodeKey){isCompatible=false}isCompatible=isCompatible!==false&&compareNodeNames(curFromNodeChild,curToNodeChild);if(isCompatible){morphEl(curFromNodeChild,curToNodeChild)}}else if(curFromNodeType===TEXT_NODE||curFromNodeType==COMMENT_NODE){isCompatible=true;if(curFromNodeChild.nodeValue!==curToNodeChild.nodeValue){curFromNodeChild.nodeValue=curToNodeChild.nodeValue}}}if(isCompatible){curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling;continue outer}if(curFromNodeKey){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=fromNextSibling}if(curToNodeKey&&(matchingFromEl=fromNodesLookup[curToNodeKey])&&compareNodeNames(matchingFromEl,curToNodeChild)){if(!skipFrom){addChild(fromEl,matchingFromEl)}morphEl(matchingFromEl,curToNodeChild)}else{var onBeforeNodeAddedResult=onBeforeNodeAdded(curToNodeChild);if(onBeforeNodeAddedResult!==false){if(onBeforeNodeAddedResult){curToNodeChild=onBeforeNodeAddedResult}if(curToNodeChild.actualize){curToNodeChild=curToNodeChild.actualize(fromEl.ownerDocument||doc)}addChild(fromEl,curToNodeChild);handleNodeAdded(curToNodeChild)}}curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling}cleanupFromEl(fromEl,curFromNodeChild,curFromNodeKey);var specialElHandler=specialElHandlers[fromEl.nodeName];if(specialElHandler){specialElHandler(fromEl,toEl)}}var morphedNode=fromNode;var morphedNodeType=morphedNode.nodeType;var toNodeType=toNode.nodeType;if(!childrenOnly){if(morphedNodeType===ELEMENT_NODE){if(toNodeType===ELEMENT_NODE){if(!compareNodeNames(fromNode,toNode)){onNodeDiscarded(fromNode);morphedNode=moveChildren(fromNode,createElementNS(toNode.nodeName,toNode.namespaceURI))}}else{morphedNode=toNode}}else if(morphedNodeType===TEXT_NODE||morphedNodeType===COMMENT_NODE){if(toNodeType===morphedNodeType){if(morphedNode.nodeValue!==toNode.nodeValue){morphedNode.nodeValue=toNode.nodeValue}return morphedNode}else{morphedNode=toNode}}}if(morphedNode===toNode){onNodeDiscarded(fromNode)}else{if(toNode.isSameNode&&toNode.isSameNode(morphedNode)){return}morphEl(morphedNode,toNode,childrenOnly);if(keyedRemovalList){for(var i=0,len=keyedRemovalList.length;i<len;i++){var elToRemove=fromNodesLookup[keyedRemovalList[i]];if(elToRemove){removeNode(elToRemove,elToRemove.parentNode,false)}}}}if(!childrenOnly&&morphedNode!==fromNode&&fromNode.parentNode){if(morphedNode.actualize){morphedNode=morphedNode.actualize(fromNode.ownerDocument||doc)}fromNode.parentNode.replaceChild(morphedNode,fromNode)}return morphedNode}}var morphdom=morphdomFactory(morphAttrs);return morphdom});
function view(v,H,$){return `

<div style="min-height:960px;display:flex;flex-direction:column;background:#F6F2EB">
<header class="pad" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;padding-top:22px;padding-bottom:18px">
  <button data-on-click="${H(v.navMap)}" aria-label="Басты бет — карта" style="display:flex;align-items:center;gap:14px;border:0;background:transparent;padding:0;text-align:left;color:inherit">
    <span style="width:46px;height:46px;border-radius:14px;background:#2F5D8C;display:flex;align-items:center;justify-content:center;flex:none">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>
    </span>
    <span>
      <span style="display:block;font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:24px;line-height:1.15;color:#1E2430">Баймұрат батыр — кеше және бүгін</span>
      <span style="display:block;font-size:14px;color:#5B6370;margin-top:2px">«Менің кіші отаным» · Қызылорда облысы</span>
    </span>
  </button>
  <nav aria-label="Бөлімдер" style="display:flex;flex-wrap:wrap;gap:4px;background:#FFFDF9;border:1px solid #E4DDCE;border-radius:999px;padding:5px">
    ${(v.navs||[]).map((n)=>`
      <button class="navbtn" data-on-click="${H(n?.go)}" aria-current="${$(n?.cur)}" style="min-height:44px;padding:0 20px;border:0;border-radius:999px;font-size:15px;font-weight:600;${$(n?.style)}">${$(n?.label)}</button>
    `).join('')}
  </nav>
</header>

${(v.isMap)?`


  <main class="pad" style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start;padding-bottom:48px">

    
    <section aria-label="3D карта" style="flex:999 1 600px;min-width:0">
      <div class="mapwrap" style="position:relative;height:700px;border-radius:28px;overflow:hidden;background:#DAD3C2;border:1px solid #D9D1BF;box-shadow:0 18px 40px -22px rgba(30,36,48,.35);perspective:1500px;perspective-origin:50% 40%">

        <div style="position:absolute;left:50%;top:50%;width:1400px;height:1000px;transform-style:preserve-3d;transform-origin:50% 50%;transition:transform .6s cubic-bezier(.2,.7,.2,1);${$(v.planeStyle)}">

          <div aria-hidden="true" style="position:absolute;left:0;top:0;width:1400px;height:1000px;background:#F2EFE9"></div>
          <img src="assets/img/map.png" alt="OpenStreetMap: Баймұрат батыр ауылының картасы" width="870" height="690" style="position:absolute;left:265px;top:155px;width:870px;height:690px;display:block;box-shadow:0 0 0 1px #E3DED2">

          ${(v.markers||[]).map((m)=>`
            <button class="pin" data-on-click="${H(m?.pick)}" aria-label="${$(m?.aria)}" style="position:absolute;padding:0;border:0;background:transparent;transform-origin:50% 100%;transition:transform .6s cubic-bezier(.2,.7,.2,1),opacity .3s;${$(m?.pos)}">
              <span class="pinlabel" style="display:flex;align-items:center;gap:8px;height:34px;padding:0 14px 0 4px;border-radius:999px;white-space:nowrap;font-size:13px;font-weight:600;box-shadow:0 6px 14px -4px rgba(30,36,48,.45);border:2px solid transparent;${$(m?.pillStyle)}">
                <span style="width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;${$(m?.numStyle)}">${$(m?.num)}</span>
                <span class="nm" style="${$(m?.nameStyle)}">${$(m?.name)}</span>
              </span>
              <span style="display:block;width:0;height:0;margin:0 auto;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid;${$(m?.stemStyle)}"></span>
            </button>
          `).join('')}
        </div>

        
        <div style="position:absolute;left:18px;top:18px;display:flex;align-items:center;gap:8px;background:rgba(255,253,249,.94);border:1px solid #E4DDCE;border-radius:14px;padding:9px 14px;font-size:12.5px;line-height:1.35;color:#4A5260;max-width:320px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5D8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          <span><strong style="color:#1E2430">OpenStreetMap картасы.</strong> Белгілер орындардың шамамен орнын көрсетеді.</span>
        </div>

        <div style="position:absolute;right:18px;bottom:12px;background:rgba(255,255,255,.88);border-radius:8px;padding:3px 9px;font-size:11.5px;color:#33404F">© <a href="https://www.openstreetmap.org/copyright" style="color:#33404F">OpenStreetMap contributors</a></div>

        
        <div role="group" aria-label="Карта басқару" style="position:absolute;right:18px;top:18px;display:flex;flex-direction:column;gap:8px">
          <div style="background:rgba(255,253,249,.96);border:1px solid #E4DDCE;border-radius:16px;padding:6px;display:flex;flex-direction:column;gap:2px;box-shadow:0 8px 20px -12px rgba(30,36,48,.4)">
            <button class="ctl" data-on-click="${H(v.zoomIn)}" aria-label="Жақындату" style="width:44px;height:44px;border:0;background:transparent;border-radius:12px;display:flex;align-items:center;justify-content:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2430" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
            <button class="ctl" data-on-click="${H(v.zoomOut)}" aria-label="Алыстату" style="width:44px;height:44px;border:0;background:transparent;border-radius:12px;display:flex;align-items:center;justify-content:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2430" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
          </div>
          <div style="background:rgba(255,253,249,.96);border:1px solid #E4DDCE;border-radius:16px;padding:6px;display:flex;flex-direction:column;gap:2px;box-shadow:0 8px 20px -12px rgba(30,36,48,.4)">
            <button class="ctl" data-on-click="${H(v.rotLeft)}" aria-label="Солға бұру" style="width:44px;height:44px;border:0;background:transparent;border-radius:12px;display:flex;align-items:center;justify-content:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2430" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg></button>
            <button class="ctl" data-on-click="${H(v.rotRight)}" aria-label="Оңға бұру" style="width:44px;height:44px;border:0;background:transparent;border-radius:12px;display:flex;align-items:center;justify-content:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2430" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg></button>
            <button class="ctl" data-on-click="${H(v.toggleTilt)}" aria-label="${$(v.tiltLabel)}" style="width:44px;height:44px;border:0;background:transparent;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#2F5D8C">${$(v.tiltText)}</button>
          </div>
          <button class="ctl" data-on-click="${H(v.reset)}" aria-label="Картаны бастапқы қалпына келтіру" style="width:56px;height:56px;border:1px solid #E4DDCE;background:rgba(255,253,249,.96);border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px -12px rgba(30,36,48,.4)">
            <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" style="${$(v.compassStyle)};transition:transform .6s cubic-bezier(.2,.7,.2,1)"><path d="M16 4l5 12h-10z" fill="#2F5D8C"/><path d="M16 28l-5-12h10z" fill="#B9C4D0"/><circle cx="16" cy="16" r="2.2" fill="#FFFDF9"/></svg>
          </button>
        </div>

        
        ${(v.hasSel)?`
          <div style="position:absolute;left:18px;bottom:18px;width:340px;max-width:calc(100% - 36px);box-sizing:border-box;background:#FFFDF9;border:1px solid #E4DDCE;border-radius:20px;padding:16px 16px 16px 18px;box-shadow:0 18px 36px -18px rgba(30,36,48,.55);display:flex;align-items:center;gap:14px">
            <div style="width:42px;height:42px;border-radius:50%;background:#2F5D8C;color:#fff;font-weight:700;font-size:17px;display:flex;align-items:center;justify-content:center;flex:none">${$(v.selNum)}</div>
            <div style="min-width:0;flex:1">
              <div style="font-size:12px;color:#5B6370;letter-spacing:.02em">${$(v.selType)}</div>
              <div style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:17px;line-height:1.25;color:#1E2430">${$(v.selName)}</div>
            </div>
            <button data-on-click="${H(v.openDetail)}" aria-label="Толығырақ көру" style="flex:none;display:inline-flex;align-items:center;gap:6px;background:#2F5D8C;color:#fff;border:0;font-weight:600;font-size:14px;border-radius:999px;padding:11px 16px;min-height:44px">Ашу
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </div>
        `:''}
      </div>
    </section>

    
    <aside class="sidebar" style="flex:1 1 340px;max-width:400px;min-width:0;display:flex;flex-direction:column;gap:20px">

      <div style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;align-items:baseline;justify-content:space-between">
          <h2 style="margin:0;font-size:20px;color:#1E2430">Орындар</h2>
          <span style="font-size:13px;color:#5B6370">${$(v.countText)}</span>
        </div>
        <div style="position:relative">
          <label for="q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Орынды іздеу</label>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6370" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="position:absolute;left:16px;top:50%;margin-top:-9px"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          <input id="q" type="search" value="${$(v.q)}" data-on-input="${H(v.onQuery)}" placeholder="Орынды іздеу…" style="box-sizing:border-box;width:100%;height:48px;border-radius:14px;border:1px solid #D9D1BF;background:#F6F2EB;padding:0 16px 0 44px;font-size:15px;color:#1E2430">
        </div>
        <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px">
          ${(v.list||[]).map((it)=>`
            <li>
              <button class="row" data-on-click="${H(it?.pick)}" aria-pressed="${$(it?.pressed)}" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;border:1px solid transparent;min-height:48px;${$(it?.rowStyle)}">
                <span style="width:30px;height:30px;border-radius:50%;flex:none;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;${$(it?.numStyle)}">${$(it?.num)}</span>
                <span style="flex:1;min-width:0">
                  <span style="display:block;font-size:15px;font-weight:600;color:#1E2430;line-height:1.3">${$(it?.name)}</span>
                  <span style="display:block;font-size:12.5px;color:#5B6370;margin-top:1px">${$(it?.type)}</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A91A0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><path d="M9 6l6 6-6 6"/></svg>
              </button>
            </li>
          `).join('')}
        </ul>
        ${(v.noResults)?`
          <div style="text-align:center;padding:18px 8px;color:#5B6370;font-size:14px;line-height:1.5">Ештеңе табылмады.<br>Басқа атауды енгізіп көріңіз.</div>
        `:''}
      </div>

      <section style="background:#E7EFF7;border:1px solid #D2E0EE;border-radius:24px;padding:20px 20px 22px;display:flex;flex-direction:column;gap:10px">
        <div style="display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:#2F5D8C;letter-spacing:.04em;text-transform:uppercase">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F5D8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>
          Ауыл тарихы
        </div>
        <h2 style="margin:0;font-size:20px;line-height:1.3;color:#1E2430">Баймұрат батыр ауылы</h2>
        <p style="margin:0;font-size:14.5px;line-height:1.6;color:#33404F">Қызылорда облысы, Қазақстан. Бүгінде Баймұрат батыр ауылы — бірлігі мен ынтымағы жарасқан құтты мекен. Қазақ тарихында есімі алтын әріппен жазылуы тиіс әрі батыр, әрі би — Баймұрат Байбөріұлы. Баймұрат 1726–27 жылдардағы Қалмаққырылған және 1729 жылы Аңырақай шайқасында ерлік көрсеткен. 2017 жылдан бастап ауылымыз Баймұрат батыр ауылы деп атала бастады. Ауыл 1958 жылы құрылған, қазір онда шамамен 1500 адам тұрады; ол Қызылорда қаласына қарасты Ақжарма ауылдық округінің құрамына кіреді.</p>
        <p style="margin:0;font-size:12.5px;line-height:1.5;color:#5B6370">Дереккөздер: ауыл туралы презентация материалы; kyzylorda-news.kz (27.05.2024).</p>
      </section>
    </aside>
  </main>
`:''}

${(v.isDetail)?`
<header class="pad" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;padding-top:22px;padding-bottom:12px">
    <button class="ghost" data-on-click="${H(v.backToMap)}" style="display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 20px 0 14px;border-radius:999px;border:1px solid #D9D1BF;background:#FFFDF9;color:#1E2430;text-decoration:none;font-weight:600;font-size:15px">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5D8C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
      Картаға оралу
    </button>
  </header>

  <main class="pad" style="display:flex;flex-direction:column;gap:28px;padding-bottom:56px">

    
    <section style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
      <div style="display:inline-flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">
        <span style="width:28px;height:28px;border-radius:50%;background:#2F5D8C;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:13px;letter-spacing:0">${$(v.cur?.num)}</span>
        ${$(v.cur?.type)} · ${$(v.cur?.num)} / 7
      </div>
      <h1 style="margin:0;font-size:44px;line-height:1.12;color:#1E2430;max-width:900px">${$(v.cur?.name)}</h1>
      <div style="font-size:16px;color:#5B6370">Баймұрат батыр ауылы · Қызылорда облысы, Қазақстан</div>
      <nav aria-label="Басқа орындар" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${(v.chips||[]).map((c)=>`
          <button class="chip" data-on-click="${H(c?.pick)}" aria-pressed="${$(c?.on)}" style="display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px 0 7px;border-radius:999px;font-size:14px;font-weight:600;${$(c?.style)}">
            <span style="width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;${$(c?.numStyle)}">${$(c?.num)}</span>
            ${$(c?.name)}
          </button>
        `).join('')}
      </nav>
    </section>

    
    <section class="audio" aria-label="Аудиогид" style="background:#24476B;color:#FFFFFF;border-radius:28px;padding:28px 32px;display:flex;flex-wrap:wrap;align-items:center;gap:28px;box-shadow:0 22px 44px -26px rgba(36,71,107,.8)">
      <div style="display:flex;align-items:center;gap:20px;flex:1 1 280px;min-width:0">
        <button class="play onblue" data-on-click="${H(v.toggle)}" aria-label="${$(v.playLabel)}" style="width:76px;height:76px;flex:none;border:0;border-radius:50%;background:#FFFFFF;display:flex;align-items:center;justify-content:center;transition:transform .2s;box-shadow:0 10px 24px -10px rgba(0,0,0,.5)">
          ${(v.playing)?`
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#24476B" aria-hidden="true"><rect x="6" y="5" width="4.5" height="14" rx="1.2"/><rect x="13.5" y="5" width="4.5" height="14" rx="1.2"/></svg>
          `:''}
          ${(v.paused)?`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#24476B" aria-hidden="true" style="margin-left:3px"><path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8z"/></svg>
          `:''}
        </button>
        <div style="min-width:0">
          <div style="font-size:12.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#B9D3EE">Аудиогид</div>
          <div style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:22px;line-height:1.25;margin-top:4px">${$(v.cur?.name)}</div>
          <div style="font-size:13px;color:#C9DBEE;margin-top:4px">${$(v.audioNote)}</div>
        </div>
      </div>

      <div style="flex:2 1 380px;min-width:0;display:flex;flex-direction:column;gap:10px">
        <div aria-hidden="true" style="display:flex;align-items:center;gap:3px;height:56px">
          ${(v.bars||[]).map((b)=>`
            <span style="flex:1;border-radius:3px;min-width:2px;${$(b?.style)}"></span>
          `).join('')}
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <button class="onblue" data-on-click="${H(v.back10)}" aria-label="10 секунд артқа" style="width:44px;height:44px;flex:none;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center">−10</button>
          <label for="scrub" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Аудио орны</label>
          <input id="scrub" class="scrub" type="range" min="0" max="${$(v.total)}" step="1" value="${$(v.pos)}" data-on-input="${H(v.onScrub)}" style="flex:1;min-width:0;height:24px;accent-color:#FFFFFF;cursor:pointer">
          <button class="onblue" data-on-click="${H(v.fwd10)}" aria-label="10 секунд алға" style="width:44px;height:44px;flex:none;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center">+10</button>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#C9DBEE;font-variant-numeric:tabular-nums"><span>${$(v.posText)}</span><span>${$(v.totalText)}</span></div>
      </div>
    </section>

    
    <div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start">

      
      <section aria-label="Суреттер" style="flex:999 1 560px;min-width:0;display:flex;flex-direction:column;gap:20px">
        <h2 style="margin:0;font-size:26px;color:#1E2430">${$(v.photo?.title)}</h2>
        <div style="display:flex;flex-wrap:wrap;gap:16px">
          ${(v.photo?.hasHist)?`
            <figure style="margin:0;flex:1 1 260px;min-width:0;background:#FFFDF9;border:1px solid #E4DDCE;border-radius:22px;padding:10px;display:flex;flex-direction:column;gap:10px">
              <button class="phbtn" data-on-click="${H(v.photo?.openHist)}" aria-label="Тарихи суретті үлкейту" style="position:relative;display:block;width:100%;height:300px;padding:0;border:0;border-radius:14px;overflow:hidden;background:#D3CAB7"><img src="${$(v.photo?.hist)}" alt="${$(v.photo?.histCap)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${$(v.photo?.histPos)}"><span style="position:absolute;left:12px;top:12px;background:#4A3F2E;color:#fff;font-size:12.5px;font-weight:600;border-radius:999px;padding:5px 12px">Кеше</span></button>
              <figcaption style="font-size:13px;color:#5B6370;padding:0 6px 6px">${$(v.photo?.histCap)}</figcaption>
            </figure>
          `:''}
          ${(v.photo?.hasNow)?`
            <figure style="margin:0;flex:1 1 260px;min-width:0;background:#FFFDF9;border:1px solid #E4DDCE;border-radius:22px;padding:10px;display:flex;flex-direction:column;gap:10px">
              <button class="phbtn" data-on-click="${H(v.photo?.openNow)}" aria-label="Қазіргі суретті үлкейту" style="position:relative;display:block;width:100%;height:300px;padding:0;border:0;border-radius:14px;overflow:hidden;background:#CFE0F0"><img src="${$(v.photo?.now)}" alt="${$(v.photo?.nowCap)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${$(v.photo?.nowPos)}"><span style="position:absolute;left:12px;top:12px;background:#2F5D8C;color:#fff;font-size:12.5px;font-weight:600;border-radius:999px;padding:5px 12px">Бүгін</span></button>
              <figcaption style="font-size:13px;color:#5B6370;padding:0 6px 6px">${$(v.photo?.nowCap)}</figcaption>
            </figure>
          `:''}
        </div>

        ${(v.photo?.hasBoth)?`
        <div style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:22px;padding:16px;display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <h3 style="margin:0;font-size:18px;color:#1E2430">Салыстыру жүгірткісі</h3>
            <span style="font-size:13px;color:#5B6370">Сызықты солға-оңға жылжытыңыз</span>
          </div>
          <div class="cmp cmpbox" style="position:relative;height:380px;border-radius:14px;overflow:hidden;user-select:none;background:#CFE0F0">
            <img src="${$(v.photo?.now)}" alt="${$(v.photo?.nowCap)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${$(v.photo?.nowPos)}">
            <div style="position:absolute;inset:0;${$(v.clipStyle)}"><img src="${$(v.photo?.hist)}" alt="${$(v.photo?.histCap)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${$(v.photo?.histPos)}"></div>
            <span style="position:absolute;left:14px;top:14px;background:#4A3F2E;color:#fff;font-size:12.5px;font-weight:600;border-radius:999px;padding:5px 12px">Кеше</span>
            <span style="position:absolute;right:14px;top:14px;background:#2F5D8C;color:#fff;font-size:12.5px;font-weight:600;border-radius:999px;padding:5px 12px">Бүгін</span>
            <div aria-hidden="true" style="position:absolute;top:0;bottom:0;width:3px;margin-left:-1.5px;background:#FFFFFF;box-shadow:0 0 0 1px rgba(30,36,48,.15);${$(v.handleStyle)}">
              <span style="position:absolute;top:50%;left:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:#FFFFFF;box-shadow:0 6px 16px -4px rgba(30,36,48,.5);display:flex;align-items:center;justify-content:center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F5D8C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>
              </span>
            </div>
            <label for="cmp" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Кеше және бүгін суретін салыстыру</label>
            <input id="cmp" type="range" min="0" max="100" step="1" value="${$(v.cmp)}" data-on-input="${H(v.onCmp)}" style="position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize">
          </div>
        </div>
        `:''}
      </section>

      
      <aside style="flex:1 1 360px;min-width:0;display:flex;flex-direction:column;gap:20px">
        <section style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:12px">
          <h2 style="margin:0;font-size:22px;color:#1E2430">Қысқаша сипаттама</h2>
          <p style="margin:0;font-size:15.5px;line-height:1.7;color:#2B3441">${$(v.info?.d1)}</p>
          ${(v.info?.hasD2)?`<p style="margin:0;font-size:15.5px;line-height:1.7;color:#2B3441">${$(v.info?.d2)}</p>`:''}
          <div style="display:flex;gap:10px;align-items:flex-start;background:#EAF1F8;border-radius:14px;padding:12px 14px;font-size:13px;line-height:1.5;color:#33404F">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5D8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;margin-top:1px"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
            ${$(v.info?.note)}
          </div>
        </section>

        <section style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:6px">
          <h2 style="margin:0 0 8px;font-size:22px;color:#1E2430">Негізгі деректер</h2>
          <dl style="margin:0;display:flex;flex-direction:column">
            ${(v.facts||[]).map((f)=>`
              <div style="display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:1px solid #EEE8DB;font-size:14.5px">
                <dt style="color:#5B6370;flex:none">${$(f?.k)}</dt>
                <dd style="margin:0;text-align:right;font-weight:600;color:#1E2430">${$(f?.v)}</dd>
              </div>
            `).join('')}
          </dl>
          <div style="margin-top:10px;padding-top:12px;border-top:1px solid #EEE8DB;font-size:13px;line-height:1.6;color:#5B6370">Дереккөздер:
            ${(v.info?.srcs||[]).map((sr)=>`<a href="${$(sr?.u)}" target="_blank" rel="noopener" style="display:inline-block;margin:0 10px 0 0">${$(sr?.t)}</a>`).join('')}
          </div>
        </section>
      </aside>
    </div>

    
    ${(v.hasExtra)?`
      <section aria-label="Қосымша материалдар" style="display:flex;flex-direction:column;gap:18px">
        <h2 style="margin:0;font-size:26px;color:#1E2430">Қосымша материалдар</h2>
        ${(v.extra||[]).map((x)=>`
          <article style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:26px;display:flex;flex-direction:column;gap:12px">
            <h3 style="margin:0;font-size:21px;line-height:1.3;color:#1E2430">${$(x?.h)}</h3>
            ${(x?.ps||[]).map((p)=>`
              <p style="margin:0;font-size:16px;line-height:1.75;color:#2B3441">${$(p?.t)}</p>
            `).join('')}
            ${(x?.hasImgs)?`
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin-top:4px">
                ${(x?.imgs||[]).map((im)=>`
                  <figure style="margin:0;display:flex;flex-direction:column;gap:8px">
                    <button class="phbtn" data-on-click="${H(im?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:#EEE8DB;border-radius:16px;overflow:hidden;display:block;width:100%;height:220px"><img src="${$(im?.src)}" alt="${$(im?.cap)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></button>
                    <figcaption style="font-size:13px;line-height:1.5;color:#5B6370">${$(im?.cap)}</figcaption>
                  </figure>
                `).join('')}
              </div>
            `:''}
          </article>
        `).join('')}
        ${(v.hasLinks)?`
          <div style="display:flex;flex-wrap:wrap;gap:10px">
            ${(v.xlinks||[]).map((l)=>`
              <button class="ghost" data-on-click="${H(l?.go)}" style="min-height:48px;padding:0 22px;border-radius:999px;border:1px solid #D9D1BF;background:#FFFDF9;color:#2F5D8C;font-weight:600;font-size:15px">${$(l?.t)} →</button>
            `).join('')}
          </div>
        `:''}
      </section>
    `:''}

    
    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid #E4DDCE;padding-top:24px">
      <button data-on-click="${H(v.backToMap)}" style="display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 28px 0 20px;border-radius:999px;background:#2F5D8C;color:#FFFFFF;border:0;font-weight:600;font-size:16px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>
        Картаға оралу
      </button>
      <div style="display:flex;gap:10px">
        <button class="ghost" data-on-click="${H(v.prev)}" style="min-height:48px;padding:0 20px;border-radius:999px;border:1px solid #D9D1BF;background:#FFFDF9;color:#1E2430;font-weight:600;font-size:15px">← Алдыңғы орын</button>
        <button class="ghost" data-on-click="${H(v.next)}" style="min-height:48px;padding:0 20px;border-radius:999px;border:1px solid #D9D1BF;background:#FFFDF9;color:#1E2430;font-weight:600;font-size:15px">Келесі орын →</button>
      </div>
    </div>
  </main>
`:''}



${(v.isHistory)?`
  <main class="pad" style="display:flex;flex-direction:column;gap:32px;padding-bottom:48px">
    <section style="background:#E7EFF7;border:1px solid #D2E0EE;border-radius:28px;padding:40px;display:flex;flex-direction:column;gap:14px">
      <div style="font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">Ауыл шежіресі · 1950 жылдардан бүгінге дейін</div>
      <h1 style="margin:0;font-size:42px;line-height:1.15;color:#1E2430;max-width:900px">Менің өлкемнің бастапқы тарихи бастауы</h1>
      <p style="margin:0;font-family:'PT Serif',Georgia,serif;font-size:20px;line-height:1.6;color:#2B3441;max-width:880px">Ауыл – қазақтың күретамыры, руханияттың ошағы, салт-дәстүр мен мәдениеттің қайнар көзі, береке мен бірліктің бастауы.</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px">
        ${(v.eras||[]).map((e)=>`
          <span style="background:#FFFFFF;border:1px solid #D2E0EE;border-radius:999px;padding:8px 16px;font-size:14px;color:#33404F"><strong style="color:#2F5D8C">${$(e?.y)}</strong> · ${$(e?.t)}</span>
        `).join('')}
      </div>
    </section>

    <ol style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column">
      ${(v.timeline||[]).map((t)=>`
        <li class="tl" style="display:grid;grid-template-columns:150px minmax(0,1fr);gap:24px">
          <div style="display:flex;flex-direction:column;align-items:center">
            <span style="display:inline-block;background:#2F5D8C;color:#fff;border-radius:999px;padding:8px 16px;font-size:15px;font-weight:700;text-align:center;white-space:nowrap">${$(t?.year)}</span>
            <span class="tlline" style="flex:1;width:2px;background:#C9D8E8;min-height:24px;margin:8px 0"></span>
          </div>
          <article style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:26px;margin-bottom:24px;display:flex;flex-direction:column;gap:14px">
            <h2 style="margin:0;font-size:24px;line-height:1.3;color:#1E2430">${$(t?.title)}</h2>
            ${(t?.ps||[]).map((p)=>`
              <p style="margin:0;font-size:16px;line-height:1.75;color:#2B3441">${$(p?.t)}</p>
            `).join('')}
            ${(t?.hasImgs)?`
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:6px">
                ${(t?.imgs||[]).map((im)=>`
                  <figure style="margin:0;display:flex;flex-direction:column;gap:8px">
                    <button class="phbtn" data-on-click="${H(im?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:#EEE8DB;border-radius:16px;overflow:hidden;display:block;width:100%;height:210px"><img src="${$(im?.src)}" alt="${$(im?.cap)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s"></button>
                    <figcaption style="font-size:13px;line-height:1.5;color:#5B6370">${$(im?.cap)}</figcaption>
                  </figure>
                `).join('')}
              </div>
            `:''}
            ${(t?.hasNote)?`
              <div style="background:#EAF1F8;border-radius:14px;padding:12px 16px;font-size:14px;line-height:1.6;color:#33404F">${$(t?.note)}</div>
            `:''}
          </article>
        </li>
      `).join('')}
    </ol>

    <section style="display:flex;flex-wrap:wrap;gap:16px">
      <button class="cta" data-on-click="${H(v.navPeople)}" style="flex:1 1 280px;text-align:left;border:1px solid #D9D1BF;background:#FFFDF9;border-radius:22px;padding:22px 24px;display:flex;flex-direction:column;gap:6px"><span style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:20px;color:#1E2430">Тұлғалар →</span><span style="font-size:14px;color:#5B6370">Амангелді Ахметов, Рабиға Іздикулова, МИС директорлары, ауыл әкімдері</span></button>
      <button class="cta" data-on-click="${H(v.navTech)}" style="flex:1 1 280px;text-align:left;border:1px solid #D9D1BF;background:#FFFDF9;border-radius:22px;padding:22px 24px;display:flex;flex-direction:column;gap:6px"><span style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:20px;color:#1E2430">МИС техникасы →</span><span style="font-size:14px;color:#5B6370">Станцияда сынақтан өткен 9 машина мен кешен</span></button>
      <button class="cta" data-on-click="${H(v.navMap)}" style="flex:1 1 280px;text-align:left;border:1px solid #D9D1BF;background:#FFFDF9;border-radius:22px;padding:22px 24px;display:flex;flex-direction:column;gap:6px"><span style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:20px;color:#1E2430">Картаға оралу →</span><span style="font-size:14px;color:#5B6370">Ауылдың 7 орнын 3D картадан көру</span></button>
    </section>
  </main>
`:''}


${(v.isPeople)?`
  <main class="pad" style="display:flex;flex-direction:column;gap:32px;padding-bottom:48px">
    <section style="background:#E7EFF7;border:1px solid #D2E0EE;border-radius:28px;padding:40px;display:flex;flex-direction:column;gap:12px">
      <div style="font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">Тұлғалар</div>
      <h1 style="margin:0;font-size:42px;line-height:1.15;color:#1E2430">Ауылды қалыптастырған адамдар</h1>
      <p style="margin:0;font-size:17px;line-height:1.7;color:#2B3441;max-width:820px">Күріш өсірушілер, шопандар, станция директорлары мен ауыл басшылары — Баймұрат батыр ауылының тарихын жасаған адамдар.</p>
    </section>

    
    <section style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:28px;padding:32px;display:flex;flex-wrap:wrap;gap:32px">
      <div style="flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:12px">
        <button class="phbtn" data-on-click="${H(v.ahm?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:#fff;border-radius:50%;overflow:hidden;width:280px;height:330px"><img src="${$(v.ahm?.src)}" alt="Амангелді Ахметов" style="width:100%;height:100%;object-fit:cover;display:block"></button>
        <span style="font-size:13px;color:#5B6370">Амангелді Ахметов</span>
      </div>
      <div style="flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:14px">
        <div style="font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">Облыстың асыл күріш өсірушісі</div>
        <h2 style="margin:0;font-size:30px;color:#1E2430">Амангелді Ахметов</h2>
        <ol style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px">
          ${(v.ahmSteps||[]).map((s)=>`
            <li style="display:grid;grid-template-columns:110px minmax(0,1fr);gap:14px;padding:10px 0;border-top:1px solid #EEE8DB;font-size:15.5px;line-height:1.65;color:#2B3441"><strong style="color:#2F5D8C">${$(s?.y)}</strong><span>${$(s?.t)}</span></li>
          `).join('')}
        </ol>
      </div>
      <div style="flex:1 1 100%;display:flex;flex-direction:column;gap:14px;border-top:1px solid #EEE8DB;padding-top:22px">
        <h3 style="margin:0;font-size:20px;color:#1E2430">Амангелді атаның жетістіктері</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px">
          ${(v.awards||[]).map((a)=>`
            <figure style="margin:0;background:#F6F2EB;border-radius:18px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center">
              ${(a?.hasImg)?`
                <button class="phbtn" data-on-click="${H(a?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:transparent;display:block"><img src="${$(a?.src)}" alt="${$(a?.t)}" style="height:130px;width:auto;max-width:100%;object-fit:contain;display:block;border-radius:8px"></button>
              `:''}
              ${(a?.noImg)?`
                <span style="height:130px;display:flex;align-items:center;justify-content:center;font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:34px;color:#2F5D8C">${$(a?.big)}</span>
              `:''}
              <figcaption style="font-size:14px;font-weight:600;line-height:1.4;color:#1E2430">${$(a?.t)}</figcaption>
            </figure>
          `).join('')}
        </div>
      </div>
    </section>

    
    <section style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:18px">
      <div style="font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">Аға шопан</div>
      <h2 style="margin:0;font-size:30px;color:#1E2430">Рабиға Іздикулова</h2>
      <div style="display:flex;flex-wrap:wrap;gap:24px">
        <div style="flex:1 1 380px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;align-content:start">
          ${(v.izd||[]).map((im)=>`
            <button class="phbtn" data-on-click="${H(im?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:#EEE8DB;border-radius:18px;overflow:hidden;display:block;height:300px"><img src="${$(im?.src)}" alt="${$(im?.cap)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></button>
          `).join('')}
        </div>
        <div style="flex:1 1 380px;display:flex;flex-direction:column;gap:12px">
          <p style="margin:0;font-size:16px;line-height:1.75;color:#2B3441">Іздикулова Рабиға — аға шопан, Ленин ордені мен Еңбек Қызыл Ту орденінің иегері. 1976 жылдан бастап Қазақ КСР Жоғарғы Кеңесінің депутаты және Қазақ КСР Жоғарғы Кеңесі Президиумының мүшесі болып сайланды. Ол 1976 жылдан бері аға шопан болып еңбек етіп келеді. Оның отары негізінен қойлардан тұрады.</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">
            <div style="background:#EAF1F8;border-radius:16px;padding:14px"><div style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:26px;color:#2F5D8C">150</div><div style="font-size:13px;line-height:1.45;color:#33404F">қозы — 100 саулықтан жоспардағы 104 орнына</div></div>
            <div style="background:#EAF1F8;border-radius:16px;padding:14px"><div style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:26px;color:#2F5D8C">99–100%</div><div style="font-size:13px;line-height:1.45;color:#33404F">мал басының сақталуы</div></div>
            <div style="background:#EAF1F8;border-radius:16px;padding:14px"><div style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:26px;color:#2F5D8C">2,4 → 3,4 кг</div><div style="font-size:13px;line-height:1.45;color:#33404F">жүннің орташа қырқымы</div></div>
          </div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#5B6370">Көрсеткіштер оныншы бесжылдықтың төрт жылына қатысты.</p>
        </div>
      </div>
    </section>

    
    <section style="display:flex;flex-direction:column;gap:16px">
      <h2 style="margin:0;font-size:28px;color:#1E2430">Машина сынау станциясының директорлары</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px">
        ${(v.directors||[]).map((d)=>`
          <article style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:14px">
            <button class="phbtn" data-on-click="${H(d?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:#EEE8DB;border-radius:16px;overflow:hidden;display:block;height:300px"><img src="${$(d?.src)}" alt="${$(d?.name)}" style="width:100%;height:100%;object-fit:cover;object-position:50% 20%;display:block"></button>
            <div>
              <div style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:19px;line-height:1.3;color:#1E2430">${$(d?.name)}</div>
              <div style="font-size:15px;color:#2F5D8C;font-weight:600;margin-top:4px">${$(d?.years)}</div>
              <div style="font-size:13.5px;line-height:1.55;color:#5B6370;margin-top:6px">${$(d?.note)}</div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    
    <section style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:28px;padding:32px;display:flex;flex-wrap:wrap;gap:28px">
      <div style="flex:1 1 360px;display:flex;flex-direction:column;gap:12px;min-width:0">
        <div style="font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">№218 орта мектеп</div>
        <h2 style="margin:0;font-size:26px;line-height:1.3;color:#1E2430">Еңбек ардагерлеріне арналған бұрыш</h2>
        <p style="margin:0;font-size:16px;line-height:1.75;color:#2B3441">Мектебіміздің мұражайында еңбек ардагерлеріне арналған бұрыш бар. Онда станцияны ұзақ жылдар басқарған Жетібай Өндірбаевтың портреті мен жеке заттары, сондай-ақ ауыл әкімдері мен еңбек адамдарының суреттері қойылған.</p>
        <p style="margin:0;font-size:16px;line-height:1.75;color:#2B3441">Жетібай Өндірбаев — алғашқылардың бірі болып техника ғылымдарының кандидаты атанған.</p>
      </div>
      <div style="flex:1 1 420px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;align-content:start">
        ${(v.museum||[]).map((im)=>`
          <button class="phbtn" data-on-click="${H(im?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:#EEE8DB;border-radius:18px;overflow:hidden;display:block;height:340px"><img src="${$(im?.src)}" alt="${$(im?.cap)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></button>
        `).join('')}
      </div>
    </section>

    
    <section style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:18px">
      <div>
        <div style="font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">Ақжарма ауылдық округі · 1997 жылдан</div>
        <h2 style="margin:6px 0 0;font-size:28px;color:#1E2430">Ауыл әкімдері</h2>
      </div>
      <ol style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px">
        ${(v.akims||[]).map((a)=>`
          <li style="display:flex;align-items:center;gap:12px;border-radius:16px;padding:12px 14px;${$(a?.style)}">
            <span style="width:32px;height:32px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;${$(a?.numStyle)}">${$(a?.n)}</span>
            <span style="min-width:0"><span style="display:block;font-size:15.5px;font-weight:600;line-height:1.3">${$(a?.name)}</span><span style="display:block;font-size:12.5px;opacity:.8;margin-top:1px">${$(a?.note)}</span></span>
          </li>
        `).join('')}
      </ol>
    </section>

    
    <section style="background:#E7EFF7;border:1px solid #D2E0EE;border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:12px">
      <div style="font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">Ауылдың атасы</div>
      <h2 style="margin:0;font-size:28px;color:#1E2430">Баймұрат Байбөріұлы</h2>
      <p style="margin:0;font-size:16px;line-height:1.75;color:#2B3441;max-width:880px">Тәуелсіздіктің арқасында Сыр бойында талай нар тұлғалы ерлердің есімдері елімен қайта қауышып жатыр. Сондай тұлғалардың бірі – қазақ тарихында есімі алтын әріппен жазылуы тиіс әрі батыр, әрі би Баймұрат Байбөріұлы. Тегі – кіші жүз алшын-байұлы-жаппас. Жаппастың ұраны – Баймұрат. Қазақтың атақты батырларының бірі Баймұрат 1726-27 жылдардағы Қалмаққырылған және 1729 жылы Аңырақай шайқасында ерлік көрсеткен. 2017 жылдан бастап ауылымыз Баймұрат батыр ауылы деп атала бастады.</p>
    </section>
  </main>
`:''}


${(v.isTech)?`
  <main class="pad" style="display:flex;flex-direction:column;gap:32px;padding-bottom:48px">
    <section style="background:#E7EFF7;border:1px solid #D2E0EE;border-radius:28px;padding:40px;display:flex;flex-direction:column;gap:14px">
      <div style="font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#2F5D8C">Машина сынау станциясы (МИС) · 1958 жылдан</div>
      <h1 style="margin:0;font-size:42px;line-height:1.15;color:#1E2430">Ауылды дүниеге әкелген станция</h1>
      <p style="margin:0;font-size:17px;line-height:1.75;color:#2B3441;max-width:900px">Станция құрылған кезден бастап аймақтағы күріш өндірісіне, суармалы егістікке, мал шаруашылығына арналған жаңа техника мен кешендерді, технологияларды сынайтын, оны насихаттап өндіріске енгізетін республика бойынша бірден-бір кәсіпорын болды.</p>
    </section>

    <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px">
      ${(v.stats||[]).map((s)=>`
        <div style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:22px;padding:20px"><div style="font-family:'PT Serif',Georgia,serif;font-weight:700;font-size:38px;line-height:1.1;color:#2F5D8C">${$(s?.n)}</div><div style="font-size:14px;line-height:1.5;color:#33404F;margin-top:8px">${$(s?.t)}</div></div>
      `).join('')}
    </section>

    <section style="display:flex;flex-wrap:wrap;gap:20px">
      <article style="flex:1 1 320px;background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:10px"><h3 style="margin:0;font-size:20px;color:#1E2430">Сынақ пен енгізу</h3><p style="margin:0;font-size:15.5px;line-height:1.7;color:#2B3441">Негізгі қызметі — ауыл шаруашылығы техникасын сынақтан өткізу, тәжірибе шаруашылығында сол техниканы пайдалана отырып өндіріске жаңа технологиялар мен машиналарды енгізу, еңбек өнімділігін арттыру.</p></article>
      <article style="flex:1 1 320px;background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:10px"><h3 style="margin:0;font-size:20px;color:#1E2430">Курстар мен кадрлар</h3><p style="margin:0;font-size:15.5px;line-height:1.7;color:#2B3441">Аймаққа қажетті комбайнерлер осында оқытылып дайындалды. Инженер-техник кадрларды, механизаторларды қайта дайындайтын тұрақты курстар жоспарлы түрде өткізілген, семинарлар мен жаңа техника көрмелері ұйымдастырылған.</p></article>
      <article style="flex:1 1 320px;background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:10px"><h3 style="margin:0;font-size:20px;color:#1E2430">Ғылым</h3><p style="margin:0;font-size:15.5px;line-height:1.7;color:#2B3441">Мұнда ғылыми-зерттеу жұмыстарымен де айналысқан: осы базаны пайдалана отырып көптеген ғылыми диссертациялар қорғалған. Станцияны ұзақ жылдар басқарған Жетібай Өндірбаев алғашқылардың бірі болып техника ғылымдарының кандидаты атанды.</p></article>
    </section>

    <section style="display:flex;flex-direction:column;gap:16px">
      <h2 style="margin:0;font-size:28px;color:#1E2430">Станцияда сынақтан өткен техника</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px">
        ${(v.machines||[]).map((m)=>`
          <article style="background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:14px;display:flex;flex-direction:column;gap:14px">
            <button class="phbtn" data-on-click="${H(m?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:#EEE8DB;border-radius:16px;overflow:hidden;display:block;height:230px"><img src="${$(m?.src)}" alt="${$(m?.name)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s"></button>
            <div style="padding:0 6px 6px">
              <span style="display:inline-block;background:#EAF1F8;color:#2F5D8C;border-radius:999px;padding:4px 12px;font-size:12.5px;font-weight:600">${$(m?.tag)}</span>
              <h3 style="margin:10px 0 4px;font-size:19px;line-height:1.3;color:#1E2430">${$(m?.name)}</h3>
              <div style="font-size:14.5px;line-height:1.6;color:#2B3441">${$(m?.desc)}</div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <section style="display:flex;flex-direction:column;gap:16px">
      <h2 style="margin:0;font-size:28px;color:#1E2430">Станция ғимараттары</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px">
        ${(v.misPlaces||[]).map((m)=>`
          <figure style="margin:0;background:#FFFDF9;border:1px solid #E4DDCE;border-radius:24px;padding:14px;display:flex;flex-direction:column;gap:12px">
            <button class="phbtn" data-on-click="${H(m?.open)}" aria-label="Суретті үлкейту" style="padding:0;border:0;background:#EEE8DB;border-radius:16px;overflow:hidden;display:block;height:220px"><img src="${$(m?.src)}" alt="${$(m?.cap)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></button>
            <figcaption style="font-size:14.5px;line-height:1.55;color:#2B3441;padding:0 6px 6px">${$(m?.cap)}</figcaption>
          </figure>
        `).join('')}
      </div>
    </section>
  </main>
`:''}

<footer class="pad" style="padding-top:8px;padding-bottom:36px">
  <div style="border-top:1px solid #E4DDCE;padding-top:22px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 32px;font-size:13.5px;line-height:1.6;color:#5B6370">
    <div style="max-width:620px"><strong style="color:#1E2430">«Менің кіші отаным» жобасы.</strong> Автор: Батырбек Ұлжан, Баймұрат батыр ауылы №218 орта мектебінің 9-сынып оқушысы. «Өлкемнің цифрлық шежіресі» номинациясы.</div>
    <div style="max-width:560px">Карта: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" style="color:#5B6370">OpenStreetMap contributors</a>. Тарихи деректер мен суреттер — жоба презентациясынан; кейбір мәліметтер ашық дереккөздерден алынды.</div>
  </div>
</footer>

${(v.hasLb)?`
  <div role="dialog" aria-modal="true" aria-label="Суретті үлкейту" style="position:fixed;left:0;top:0;right:0;bottom:0;z-index:60;background:rgba(20,24,32,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px">
    <button class="onblue" data-on-click="${H(v.closeLb)}" aria-label="Жабу" style="position:absolute;right:20px;top:20px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <img src="${$(v.lbSrc)}" alt="${$(v.lbCap)}" style="max-width:100%;max-height:calc(100% - 70px);object-fit:contain;border-radius:12px;background:#fff">
    <div style="color:#fff;font-size:15px;line-height:1.5;text-align:center;max-width:760px">${$(v.lbCap)}</div>
  </div>
`:''}
</div>
`;}

class DCLogic{constructor(p){this.props=p||{};}setState(o){Object.assign(this.state,o);if(window.__render)window.__render();}}

const LOCS = [
  { id: 1, name: 'Ауылға кіреберіс', type: 'Кіреберіс', x: 1100, y: 277 },
  { id: 2, name: 'Ауыл орталығы', type: 'Орталық алаң', x: 790, y: 557 },
  { id: 3, name: 'Ауылдық округ әкімдігі', type: 'Әкімшілік ғимарат', x: 760, y: 466 },
  { id: 4, name: 'Мәдениет орталығы', type: 'Мәдени нысан', x: 702, y: 656 },
  { id: 5, name: '№218 орта мектеп', type: 'Білім беру нысаны', x: 712, y: 468 },
  { id: 6, name: 'Медициналық амбулатория', type: 'Денсаулық сақтау нысаны', x: 783, y: 533 },
  { id: 7, name: 'Рахметулла мешіті', type: 'Діни нысан', x: 609, y: 684 }
];
const IMG = {
  admin_lab: 'assets/img/admin_lab.jpg', ahmetov: 'assets/img/ahmetov.jpg', autobase: 'assets/img/autobase.jpg',
  dir_kal: 'assets/img/dir_kal.jpg', dir_kim: 'assets/img/dir_kim.jpg', dir_ond: 'assets/img/dir_ond.jpg',
  green_street: 'assets/img/green_street.jpg', inazhan: 'assets/img/inazhan.jpg', izd1: 'assets/img/izd1.jpg', izd2: 'assets/img/izd2.jpg',
  m_kfs: 'assets/img/m_kfs.jpg', m_kolos: 'assets/img/m_kolos.jpg', m_kzr: 'assets/img/m_kzr.jpg', m_pnd: 'assets/img/m_pnd.jpg',
  m_ppa: 'assets/img/m_ppa.jpg', m_sib: 'assets/img/m_sib.jpg', m_skd: 'assets/img/m_skd.jpg', m_srn: 'assets/img/m_srn.jpg', m_zhnu: 'assets/img/m_zhnu.jpg',
  medal1: 'assets/img/medal1.jpg', medal2: 'assets/img/medal2.jpg', medal3: 'assets/img/medal3.jpg',
  museum1: 'assets/img/museum1.jpg', museum2: 'assets/img/museum2.jpg', niva: 'assets/img/niva.jpg',
  old_mis: 'assets/img/old_mis.jpg', one_street: 'assets/img/one_street.jpg', park1966: 'assets/img/park1966.jpg', rest_place: 'assets/img/rest_place.jpg',
  techhall: 'assets/img/techhall.jpg', visit1: 'assets/img/visit1.jpg', visit2: 'assets/img/visit2.jpg', visit3: 'assets/img/visit3.jpg', visit4: 'assets/img/visit4.jpg'
};
const C_ONE = 'Бір кездері ауылда бір ғана көше болған';
const C_GREEN = 'Қазір Н. Тасымов атындағы көшеде жасыл желек кіші бақша көркейіп тұр';
const C_REST = 'Демалыс орны болған жер';
const C_AUTO = 'Машиналардың негізгі авто тұрағы. Ауылға келген көліктер осы жерде сақталған';
const C_ADMIN = 'Әкімшілік-зертханалық корпус';
const C_OLD = 'Ескі МИС корпусының көрінісі';
const C_HALL = 'Машина сынау станциясына техэкспертиза залының салынуы';
const ERAS = [
  { y: '1958', t: 'МИС құрылды' }, { y: '1979', t: '«Октябрь» ауылдық советі' }, { y: '1997', t: 'Ақжарма округі' }, { y: '2017', t: 'Баймұрат батыр атауы' }, { y: '2025', t: '20+ көше, 150+ үй' }
];
const TL = [
  { year: '1950–1960 жж.', title: 'Күріш егілетін негізгі аймақ',
    ps: ['Тарихқа көз жүгіртсек, Кеңестік кезеңде бұл ауыл «МИС» деген атаумен дүрілдеп тұрды. 1950–1960 жылдары Қызылорда облысы Ресей, Украина, Өзбекстан республикаларымен бірге Кеңес Одағындағы күріш егілетін негізгі аймақтардың біріне айнала бастады.',
      'Осыған байланысты күріш өндірісіне арналған жаңа техника мен технологияларды енгізу және оны насихаттау қажеттілігі туындады.'] },
  { year: '1958 жыл', title: 'Машина сынау станциясы құрылды',
    ps: ['Қазақ ССР Үкіметі мен ККП Қызылорда облыстық комитетінің ұсыныстары негізінде 1958 жылы Қызылорда мемлекеттік аймақтық машина сынау станциясы мен оның тәжірибе шаруашылығын құру туралы КСРО Ауыл шаруашылығы министрінің бұйрығы шықты.',
      'Әуелде станция Қызылорда қаласындағы жөндеу шеберханасының (РТС) базасында болған. МИС пен оның тәжірибе шаруашылығына қажетті жер телімдері бөлінген соң Сырдария ауданының аумағына көшірілді.'],
    imgs: [['old_mis', C_OLD]] },
  { year: 'МИС дәуірі', title: 'Республика бойынша бірден-бір кәсіпорын',
    ps: ['Машина сынау станциясының негізгі қызметі — ауыл шаруашылығы техникасын сынақтан өткізу, тәжірибе шаруашылығында сол техниканы пайдалана отырып өндіріске жаңа технологиялар мен машиналарды енгізу, еңбек өнімділігін арттыру. Сондай-ақ оларды өз аймағында насихаттау, семинарлар мен курстарды, жаңа техника көрмелерін өткізу. Мұндай ауқымды жұмыстың барлығы осы ауылда жүзеге асты.',
      'Онда жүзден астам инженер-техник, өндіріс мамандары жұмыс істеді. МИС-те сынақ қана емес, әртүрлі курстар болды: аймаққа қажетті комбайнерлер осында оқытылып дайындалды. Жалпы МИС аймақтағы өз өндірістік жоспары бар, дамыған, іргелі, алдыңғы қатарлы шаруашылықтардың бірі болды.'],
    note: 'Станцияда сынақтан өткен техниканы «МИС техникасы» бөлімінен қараңыз.' },
  { year: '1966 жыл', title: 'Бақ отырғызу және корпус құрылысы',
    ps: ['1966 жылғы суретте бақта ағаш отырғызылып жатыр, екінші жоспарда әкімшілік-зертханалық корпустың құрылысы көрінеді. Презентация бойынша, қазір бұл ғимарат — «Ина-Жан» балабақшасы.'],
    imgs: [['park1966', 'Бақта ағаш отырғызу. Екінші жоспарда әкімшілік-зертханалық корпус құрылысы (1966 жыл)'], ['admin_lab', C_ADMIN], ['inazhan', 'Қазір «Ина-Жан» балабақшасы'], ['techhall', C_HALL]] },
  { year: '1978 жыл', title: 'Партия және үкімет басшыларының станцияға сапары',
    ps: ['1978 жылы Қызылорда облысында болған кезінде Қызылорда МИС-ін КПСС Орталық Комитеті Саяси Бюросының мүшесі, Қазақстан Компартиясы Орталық Комитетінің бірінші хатшысы Дінмұхамед Ахметұлы Қонаев аралады.',
      'Жолдас Қонаев Д.А. машина сынау станциясының қызметімен танысты, тәжірибелік шаруашылықтың күріш плантацияларын көрді, механизаторлармен, звено жетекшілерімен, мамандармен, станция басшыларымен әңгімелесті және барлық учаскелерде еңбектің тиімді әдістерін енгізудің, егіншілік мәдениетін көтерудің, фермалардағы жұмыстарды механикаландыру деңгейін арттырудың, малды бордақылауды жеделдетудің маңыздылығын атап өтті.'],
    imgs: [['visit1', 'Күріш өсіруші Амангелді Ахметовпен әңгіме (оңнан екінші)'], ['visit2', 'Партия және үкімет басшыларының станцияға сапары, 1978 жыл'], ['visit3', 'Жаңа техниканы жұмыс үстінде қарау'], ['visit4', 'Д.А. Қонаев машиналардың техникалық сипаттамасымен танысуда']] },
  { year: '1979 жыл', title: '«Октябрь» ауылдық советі',
    ps: ['1979 жылы машина сынау станциясы, «Талдыарал», «Лесхоз», «Қалғандария» елді мекендері қосылып «Октябрь» ауылдық советі құрылды. Орталығы машина сынау станциясы болды. 1997 жылға дейін ауыл Сырдария ауданының құрамына кірді.'] },
  { year: '1997 жыл', title: 'Ақжарма ауылдық округі',
    ps: ['1997 жылы ауыл Қызылорда қаласына қарасты «Ақжарма» ауылдық округі болып қайта өзгертілді. Округтің құрамына Баймұрат батыр және «Талдыарал» елді мекені кірді.',
      'Ең алғаш әкім болып Мұқашбек Айходжаев тағайындалған. Қазір ел тізгіні Саттар Әбдіреевтің қолында.'],
    note: 'Барлық әкімдердің тізімі — «Тұлғалар» бөлімінде.' },
  { year: '2017 жыл', title: 'Баймұрат батыр ауылы',
    ps: ['2017 жылдан бастап ауылымыз Баймұрат батыр ауылы деп атала бастады. Ауыл атауы қазақтың атақты батыры әрі биі Баймұрат Байбөріұлының есімімен байланысты.'],
    note: 'Баймұрат Байбөріұлы туралы толығырақ — «Тұлғалар» бөлімінде.' },
  { year: '2025 жыл', title: 'Бүгінгі ауыл',
    ps: ['2025 жылғы дереккөздерге сүйенсек, ауылымда 20-дан астам көше мен 150-ден аса үй бар. Бұрын ауылда тек бір ғана көше болған. Тоқырау жылдары тұралап, дамуы тежелген ауылдың қазір тамырына қан жүгірген.'],
    imgs: [['one_street', C_ONE], ['green_street', C_GREEN], ['rest_place', C_REST], ['autobase', C_AUTO]] }
];
const STATS = [
  { n: '11', t: 'салалық және мамандандырылған зертхана' },
  { n: '39', t: 'жоғары және орта арнаулы білімі бар маман' },
  { n: '100+', t: 'инженер-техник пен өндіріс маманы' },
  { n: '195', t: 'тәжірибелік шаруашылықта еңбек еткен адам' },
  { n: '18', t: 'олардың ішінде жоғары және арнаулы білімді мамандар' },
  { n: '26', t: 'жұмысшыға КСРО ордендері мен медальдары берілген' }
];
const MACHINES = [
  { k: 'm_pnd', name: 'ПНД 4-30', tag: 'Жер өңдеу', desc: 'Топсалы дискілі соқа.' },
  { k: 'm_srn', name: 'СРН-3,6', tag: 'Егу', desc: 'Аспалы күріш сеялкасы.' },
  { k: 'm_kfs', name: 'КФС-3,6', tag: 'Егу', desc: 'Күріш сеялкасы.' },
  { k: 'm_zhnu', name: 'ЖНУ-4', tag: 'Орақ', desc: 'Топсалы орақ.' },
  { k: 'm_skd', name: 'СКД-5Р', tag: 'Жинау', desc: 'Күріш оратын орақ комбайны. Комбайнға қамту ені 5 м жатка ілінген.' },
  { k: 'm_sib', name: 'СКД-5Р «Сибиряк»', tag: 'Жинау', desc: 'Шынжыр табанды күріш жинау комбайны.' },
  { k: 'm_kolos', name: 'СКГД-6 «Колос»', tag: 'Жинау', desc: 'Күріш жинау комбайны (күріш дәнін жинайтын).' },
  { k: 'm_kzr', name: 'КЗР-2,5 және КЗР-5', tag: 'Өңдеу', desc: 'Күріш, бидай тартатын диірмен. Түпнұсқа жазуы бойынша — күріш тазалау-кептіру кешендері.' },
  { k: 'm_ppa', name: 'ППА-300', tag: 'Суару', desc: 'Қозғалмалы суару машинасы.' }
];
const AKIMS = [
  ['Мұқашбек Айходжаев', 'ең алғашқы әкім'], ['Бақберген Қонысов', ''], ['Бақыт Өндірбаев', ''], ['Ибрахим Исмайлов', ''], ['Сәбит Серікбаев', ''],
  ['Ақылбек Арыстанов', ''], ['Еркін Ақшалов', ''], ['Асқар Әділбеков', ''], ['Жұмабек Алиев', ''], ['Саттар Әбдіреев', 'қазіргі әкім']
];
const AHM = [
  ['1942', '10 мамырда Сырдария ауданы, Жамбыл атындағы колхозда дүниеге келген.'],
  ['1959', 'Қызылорда механизаторлар мектебін бітіргеннен кейін, Жамбыл атындағы колхозда механизатор болып жұмыс атқарған.'],
  ['1965', 'Қызылорда аймақтық машина сынау станциясында жүргізуші болып жұмыс атқарған.'],
  ['1968', 'Жаңадан құрылған күрішшілер комплексті-механизаторлар бригадасында еңбек етті.'],
  ['1968 жылдан', 'Бірнеше жыл бойы күріш жинау жоспарын асыра орындаған механизаторлар бригадасын басқарды. Бригада көрсеткіштері кей жылдары әр гектардан 100 центнерден 120 центнерге дейін жетіп, Еңбек Қызыл Ту, Ленин орденімен марапатталған.']
];
const EXTRA = {
  1: { blocks: [
      { h: 'Ауыл атының тарихы', ps: ['Ауыл атауы қазақтың атақты батыры әрі биі Баймұрат Байбөріұлының есімімен байланысты. Тегі — кіші жүз алшын-байұлы-жаппас, жаппастың ұраны — Баймұрат. Баймұрат 1726–27 жылдардағы Қалмаққырылған және 1729 жылы Аңырақай шайқасында ерлік көрсеткен. 2017 жылдан бастап ауылымыз Баймұрат батыр ауылы деп атала бастады.'] },
      { h: 'Ауыл — қазақтың күретамыры', ps: ['Ауыл — қазақтың күретамыры, руханияттың ошағы, салт-дәстүр мен мәдениеттің қайнар көзі, береке мен бірліктің бастауы.'] }
    ], links: [['Баймұрат Байбөріұлы', 'people'], ['Ауыл шежіресі', 'history']] },
  2: { blocks: [
      { h: 'Бір көшеден 20-дан астам көшеге', ps: ['2025 жылғы дереккөздерге сүйенсек, ауылымда 20-дан астам көше мен 150-ден аса үй бар. Бір кездері ауылда тек бір ғана көше болған.'], imgs: [['one_street', C_ONE], ['green_street', C_GREEN], ['autobase', C_AUTO]] }
    ], links: [['Ауыл шежіресі', 'history']] },
  3: { blocks: [
      { h: 'Ауылдық әкімдіктің тарихы', ps: ['1979 жылы машина сынау станциясы, «Талдыарал», «Лесхоз», «Қалғандария» елді мекендері қосылып «Октябрь» ауылдық советі құрылды. Орталығы машина сынау станциясы болды. 1997 жылға дейін ауыл Сырдария ауданының құрамына кірді.',
          '1997 жылы ауыл «Ақжарма» ауылдық округі болып қайта өзгертілді. Ең алғаш әкім болып Мұқашбек Айходжаев тағайындалған; қазір ауыл әкімі — Саттар Әбдіреев.'] }
    ], links: [['Ауыл әкімдері', 'people'], ['Ауыл шежіресі', 'history']] },
  4: { blocks: [], links: [['Ауыл шежіресі', 'history']] },
  5: { blocks: [
      { h: 'Еңбек ардагерлеріне арналған бұрыш', ps: ['Мектебіміздің мұражайында еңбек ардагерлеріне арналған бұрыш бар. Онда станцияны ұзақ жылдар басқарған Жетібай Өндірбаевтың портреті мен жеке заттары, сондай-ақ еңбек адамдарының суреттері қойылған.'], imgs: [['museum1', 'Мектеп мұражайындағы еңбек ардагерлеріне арналған бұрыш'], ['museum2', 'Ауыл басшылары мен еңбек адамдарының суреттері']] }
    ], links: [['Тұлғалар', 'people']] }
};

const P = {
  1: { now: 'assets/img/entrance_now.jpg', nowCap: 'Ауылға кіреберіс' },
  2: { hist: IMG.rest_place, histCap: 'Демалыс орны болған жер (МИС кезеңі)', now: 'assets/img/center_now.jpg', nowCap: 'Ауыл орталығындағы алаң' },
  4: { hist: 'assets/img/culture_hist.jpg', histCap: 'МСС кезіндегі мәдениет үйі', now: 'assets/img/culture_now.jpg', nowCap: 'Қазіргі мәдениет үйі — «Адал адам» мәдени-тәрбие орталығы' },
  5: { hist: 'assets/img/school_hist.jpg', histCap: 'МСС кезіндегі мектеп пен балабақша', now: 'assets/img/school_now.jpg', nowCap: 'Қазіргі №218 орта мектеп' },
  6: { now: 'assets/img/clinic_now.jpg', nowCap: 'Дәрігерлік амбулатория' },
  7: { now: 'assets/img/mosque_now.jpg', nowPos: '50% 75%', nowCap: 'Рахметулла мешіті' }
};
const KN = { t: 'kyzylorda-news.kz, 27.05.2024', u: 'https://kyzylorda-news.kz/ruhaniat/khyzylorda-birligi-mykhty-bajmurat-auyly-27-05-2024' };
const K24 = { t: '24.kz, 17.04.2024', u: 'https://24.kz/ru/news/social/648544-novuyu-vrachebnuyu-ambulatoriyu-postroili-v-kyzylorde' };
const NOTE = 'Мәтін ашық дереккөздер мен ауыл туралы жоба презентациясынан алынды.';
const INFO = {
  1: { d1: 'Ауылға кіре беріс жолда «Баймұрат батыр ауылы» деген жазуы бар қақпа орнатылған.', d2: 'Соңғы жылдары ауылға 3 жаңа аялдама мен жол белгілері қойылған. №32 маршрут күніне 7 рет қатынайды.',
    facts: [['Түрі', 'Кіреберіс қақпасы'], ['Жаңа аялдама', '3'], ['Көлік', '№32 маршрут, күніне 7 рет'], ['Мекенжайы', '[мекенжай қосылады]'], ['Салынған жылы', '[жылы]']], srcs: [KN] },
  2: { d1: 'Ауыл орталығындағы алаңда тұрғындарға арналған спорттық жаттығу құралдары орнатылған.', d2: '«Ауыл – ел бесігі» жобасы аясында 2023 жылы 3 көшеге түнгі жарық бағаналары орнатылды. 2024 жылы 500 сыр талы мен терек көшеті отырғызылған.',
    facts: [['Түрі', 'Орталық алаң'], ['Көше жарығы', '3 көше, 2,85 км (2023)'], ['Жарыққа жұмсалған қаражат', '33,3 млн теңге'], ['Көгалдандыру', '500 көшет (2024)'], ['Ауыл халқы', 'шамамен 1500 адам']], srcs: [KN] },
  3: { d1: 'Ауыл Қызылорда қаласына қарасты Ақжарма ауылдық округінің құрамына кіреді.', d2: '2024 жылғы деректер бойынша ауыл әкімі — Саттар Әбдіреев. Сол жылы 19 көшеге қиыршық тас төсеу мен газдандыру жобасы жоспарланған.',
    facts: [['Түрі', 'Әкімшілік ғимарат'], ['Округ', 'Ақжарма ауылдық округі'], ['Ауыл әкімі (2024)', 'Саттар Әбдіреев'], ['Жоспар (2024)', 'қиыршық тас, газдандыру'], ['Мекенжайы', '[мекенжай қосылады]']], srcs: [KN] },
  4: { d1: '«Ақжарма» мәдениет үйінде 5 үйірме жұмыс істейді, 15 қызметкер халыққа қызмет көрсетеді (ауыл презентациясы бойынша).', d2: 'Үйірмелер қатарында «Сыр орда» вокалды аспапты ансамблі, «Сәулем-ай» әжелер ансамблі, ән-әуен, көркем сөз оқу және «Мерей» би үйірмелері бар. Қазіргі ғимаратта «Адал адам» мәдени-тәрбие орталығы жазуы тұр.',
    facts: [['Түрі', 'Мәдени нысан'], ['Үйірме саны', '5'], ['Қызметкер саны', '15'], ['Ансамбльдер', '«Сыр орда», «Сәулем-ай»'], ['Салынған жылы', '[жылы]']], srcs: [KN] },
  5: { d1: '№218 білім ордасында 2024 жылғы деректер бойынша 320 оқушы оқиды.', d2: 'Жоғары сынып оқушылары ҰБТ-ға дайындалуда, «Алтын белгіге» үш үміткер бар. Архив суретінде МСС кезіндегі мектеп пен балабақша көрсетілген.',
    facts: [['Түрі', 'Орта мектеп'], ['Оқушы саны (2024)', '320'], ['«Алтын белгіге» үміткер', '3'], ['Ашылған жылы', '[жылы]'], ['Мекенжайы', '[мекенжай қосылады]']], srcs: [KN] },
  6: { d1: 'Дәрігерлік амбулатория 2024 жылы халыққа табысталып, жұмысын бастады. Ол «Ауыл – ел бесігі» жобасы аясында салынған.', d2: 'Дәрігерлер бір ауысымда 25 науқасқа дейін қабылдайды, мұнда 9 адам жұмыс істейді. Амбулатория шамамен 2000 тұрғынға, сондай-ақ Талдыарал мен Лесхоз ауылдарына қызмет көрсетеді.',
    facts: [['Түрі', 'Дәрігерлік амбулатория'], ['Ашылған жылы', '2024'], ['Қабылдау', '25 науқасқа дейін / ауысым'], ['Қызметкер саны', '9'], ['Қызмет аймағы', '~2000 тұрғын, Талдыарал, Лесхоз']], srcs: [K24, KN] },
  7: { d1: 'Ауылда мешіт бар: «Рахметулла мешіті» деп жазылған екі күмбезді ғимарат.', d2: '[Мешіттің салынған жылы мен тарихы туралы расталған дерек ашық дереккөздерден табылмады — қосылады.]',
    facts: [['Түрі', 'Мешіт'], ['Салынған жылы', '[жылы]'], ['Мекенжайы', '[мекенжай қосылады]'], ['Қазіргі жағдайы', '[дерек қосылады]'], ['Дереккөз', '[имам / тұрғындар]']], srcs: [KN] }
};
const AUD = {
  1: { src: 'assets/audio/entrance.mp3', dur: 44.6 },
  3: { src: 'assets/audio/admin.mp3', dur: 43.65 },
  4: { src: 'assets/audio/culture.mp3', dur: 41.17 },
  5: { src: 'assets/audio/school.mp3', dur: 47.3 }
};
const TOTAL = 90;
const ok = (s) => !!s && String(s).trim().charAt(0) !== '[';
const fmt = (s) => { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
const D = { zoom: 1.4, rot: -14, tilt: 52 };
const FX = 790, FY = 500;

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { q: '', sel: 2, zoom: D.zoom, rot: D.rot, tilt: D.tilt, view: 'map', playing: false, pos: 0, cmp: 50, lb: null };
    this._t = null;
  }
  componentWillUnmount() { this.stop(); }
  stop() {
    if (this._t) { clearInterval(this._t); this._t = null; }
    if (this._a) { try { this._a.pause(); } catch (e) {} }
  }
  togglePlay() {
    const au = AUD[this.state.sel];
    if (!au) return;
    if (this.state.playing) { this.stop(); this.setState({ playing: false }); return; }
    if (!this._a) {
      this._a = new Audio();
      this._a.preload = 'auto';
      this._a.addEventListener('timeupdate', () => { if (this.state.playing) this.setState({ pos: this._a.currentTime }); });
      this._a.addEventListener('ended', () => this.setState({ playing: false, pos: 0 }));
    }
    if (this._aid !== this.state.sel) { this._a.src = au.src; this._aid = this.state.sel; }
    const start = this.state.pos >= au.dur - 0.3 ? 0 : this.state.pos;
    const go = () => { try { this._a.currentTime = start; } catch (e) {} const pr = this._a.play(); if (pr && pr.catch) pr.catch(() => this.setState({ playing: false })); };
    this.setState({ playing: true, pos: start });
    if (this._a.readyState >= 1) go(); else this._a.addEventListener('loadedmetadata', go, { once: true });
  }
  seek(v) {
    const au = AUD[this.state.sel]; if (!au) return;
    const p = Math.max(0, Math.min(au.dur, v));
    if (this._a && this._aid === this.state.sel && this._a.readyState >= 1) { try { this._a.currentTime = p; } catch (e) {} }
    this.setState({ pos: p });
  }
  openDetail() { this.stop(); this.setState({ view: 'detail', playing: false, pos: 0, cmp: 50, lb: null }); }
  backToMap() { this.go('map'); }
  select(id) { this.stop(); this.setState({ sel: id, playing: false, pos: 0, cmp: 50 }); }
  go(v) { this.stop(); this.setState({ view: v, lb: null, playing: false }); try { window.scrollTo(0, 0); } catch (e) {} }
  moreVals() {
    const { view, sel, lb } = this.state;
    const mk = (src, cap) => ({ src, cap, open: () => this.setState({ lb: { src, cap } }) });
    const NAV = [['Карта', 'map'], ['Шежіре', 'history'], ['Тұлғалар', 'people'], ['МИС техникасы', 'tech']];
    const curTab = view === 'detail' ? 'map' : view;
    const navs = NAV.map((n) => {
      const on = n[1] === curTab;
      return { label: n[0], cur: on ? 'page' : 'false', go: () => this.go(n[1]), style: on ? 'background:#2F5D8C;color:#FFFFFF' : 'background:transparent;color:#1E2430' };
    });
    const out = {
      navs, navMap: () => this.go('map'), navPeople: () => this.go('people'), navTech: () => this.go('tech'),
      isHistory: view === 'history', isPeople: view === 'people', isTech: view === 'tech',
      hasLb: !!lb, lbSrc: lb ? lb.src : '', lbCap: lb ? lb.cap : '', closeLb: () => this.setState({ lb: null })
    };
    if (view === 'detail') {
      const ex = EXTRA[sel] || { blocks: [], links: [] };
      out.extra = ex.blocks.map((b) => ({ h: b.h, ps: b.ps.map((t) => ({ t })), imgs: (b.imgs || []).map((i) => mk(IMG[i[0]], i[1])), hasImgs: !!(b.imgs && b.imgs.length) }));
      out.hasExtra = ex.blocks.length > 0 || ex.links.length > 0;
      out.xlinks = ex.links.map((l) => ({ t: l[0], go: () => this.go(l[1]) }));
      out.hasLinks = ex.links.length > 0;
      if (ex.blocks.length === 0) out.extra = [];
    } else {
      out.extra = []; out.hasExtra = false; out.xlinks = []; out.hasLinks = false;
    }
    if (view === 'history') {
      out.eras = ERAS;
      out.timeline = TL.map((t) => ({ year: t.year, title: t.title, ps: t.ps.map((x) => ({ t: x })), imgs: (t.imgs || []).map((i) => mk(IMG[i[0]], i[1])), hasImgs: !!(t.imgs && t.imgs.length), note: t.note || '', hasNote: !!t.note }));
    } else { out.eras = []; out.timeline = []; }
    if (view === 'people') {
      out.ahm = mk(IMG.ahmetov, 'Амангелді Ахметов');
      out.ahmSteps = AHM.map((s) => ({ y: s[0], t: s[1] }));
      const aw = (k, t) => ({ hasImg: true, noImg: false, big: '', t, src: IMG[k], open: () => this.setState({ lb: { src: IMG[k], cap: t } }) });
      out.awards = [aw('medal1', 'Еңбек Қызыл Ту ордені'), aw('medal2', 'Ленин ордені'), aw('medal3', '2 рет Социалистік Еңбек Ері'), aw('niva', '«Нива» автокөлігі'), { hasImg: false, noImg: true, big: '4,5 млн ₸', t: 'Сертификат — 4,5 млн теңге', src: '', open: () => {} }];
      out.izd = [mk(IMG.izd1, 'Рабиға Іздикулова'), mk(IMG.izd2, 'Рабиға Іздикулова отарда')];
      const dr = (k, name, years, note) => ({ src: IMG[k], name, years, note, open: () => this.setState({ lb: { src: IMG[k], cap: name + ', ' + years } }) });
      out.directors = [dr('dir_kim', 'Ким Дон Чер', '1967–1974 жылдар', ''), dr('dir_ond', 'Жетібай Жүнісұлы Өндірбаев', '1974–1992 жылдар', 'Техника ғылымдарының кандидаты — алғашқылардың бірі'), dr('dir_kal', 'Марат Өзбекбайұлы Қалиев', '1992–1999 жылдар', '')];
      out.museum = [mk(IMG.museum1, 'Мектеп мұражайындағы еңбек ардагерлеріне арналған бұрыш'), mk(IMG.museum2, 'Ауыл басшылары мен еңбек адамдарының суреттері')];
      out.akims = AKIMS.map((a, i) => {
        const last = i === AKIMS.length - 1;
        return { n: i + 1, name: a[0], note: a[1], style: last ? 'background:#2F5D8C;color:#FFFFFF' : 'background:#F6F2EB;color:#1E2430', numStyle: last ? 'background:#FFFFFF;color:#2F5D8C' : 'background:#E3ECF5;color:#2F5D8C' };
      });
    } else { out.ahm = mk('', ''); out.ahmSteps = []; out.awards = []; out.izd = []; out.directors = []; out.museum = []; out.akims = []; }
    if (view === 'tech') {
      out.stats = STATS;
      out.machines = MACHINES.map((m) => ({ name: m.name, tag: m.tag, desc: m.desc, src: IMG[m.k], open: () => this.setState({ lb: { src: IMG[m.k], cap: m.name + ' — ' + m.desc } }) }));
      out.misPlaces = [['old_mis', C_OLD], ['techhall', C_HALL], ['admin_lab', C_ADMIN], ['autobase', C_AUTO]].map((i) => mk(IMG[i[0]], i[1]));
    } else { out.stats = []; out.machines = []; out.misPlaces = []; }
    return out;
  }
  detailVals() {
    const { sel, playing, pos, cmp } = this.state;
    const l = LOCS.find((x) => x.id === sel) || LOCS[0];
    const cur = { num: l.id, name: l.name, type: l.type };
    const p0 = P[sel] || {};
    const photo = {
      hasHist: !!p0.hist, hasNow: !!p0.now, hasBoth: !!(p0.hist && p0.now),
      title: (p0.hist && p0.now) ? 'Кеше және бүгін' : 'Бүгінгі көрінісі',
      hist: p0.hist || '', now: p0.now || '', histPos: p0.histPos || '50% 50%', nowPos: p0.nowPos || '50% 50%',
      histCap: p0.histCap || '', nowCap: p0.nowCap || '',
      openHist: () => this.setState({ lb: { src: p0.hist, cap: p0.histCap || '' } }),
      openNow: () => this.setState({ lb: { src: p0.now, cap: p0.nowCap || '' } })
    };
    const inf = INFO[sel] || INFO[1];
    const au = AUD[sel];
    const tot = au ? au.dur : 0;
    const ratio = tot ? pos / tot : 0;
    const bars = [];
    for (let i = 0; i < 64; i++) {
      const h = 14 + Math.abs(Math.sin(i * 0.9) * 22 + Math.sin(i * 0.31 + 1) * 14 + Math.cos(i * 2.1) * 6);
      const done = (i + 0.5) / 64 <= ratio;
      bars.push({ style: 'height:' + Math.min(56, Math.round(h)) + 'px;background:' + (done ? '#FFFFFF' : 'rgba(255,255,255,.32)') });
    }
    const chips = LOCS.map((x) => {
      const on = x.id === sel;
      return {
        num: x.id, name: x.name, on,
        pick: () => this.select(x.id),
        style: on ? 'background:#2F5D8C;color:#FFFFFF;border:1px solid #2F5D8C' : 'background:#FFFDF9;color:#1E2430;border:1px solid #D9D1BF',
        numStyle: on ? 'background:#FFFFFF;color:#2F5D8C' : 'background:#EAF1F8;color:#2F5D8C'
      };
    });
    const idx = LOCS.findIndex((x) => x.id === sel);
    return {
      cur, chips, bars, photo,
      playing, paused: !playing,
      playLabel: playing ? 'Кідірту' : 'Тыңдау',
      total: Math.ceil(tot), pos: Math.floor(pos), posText: fmt(pos), totalText: fmt(tot), hasAudio: !!au, audioNote: au ? 'Аудиогид · ' + fmt(tot) : 'Бұл орынға аудиожазба әзірге қосылмаған',
      toggle: () => this.togglePlay(),
      back10: () => this.seek(pos - 10),
      fwd10: () => this.seek(pos + 10),
      onScrub: (e) => this.seek(Number(e.target.value)),
      cmp,
      onCmp: (e) => this.setState({ cmp: Number(e.target.value) }),
      clipStyle: 'clip-path:inset(0 ' + (100 - cmp) + '% 0 0);',
      handleStyle: 'left:' + cmp + '%;',
      info: { d1: inf.d1, d2: ok(inf.d2) ? inf.d2 : '', hasD2: ok(inf.d2), note: NOTE, srcs: inf.srcs.map((x) => ({ t: x.t, u: x.u })) },
      facts: inf.facts.filter((r) => ok(r[1])).map((r) => ({ k: r[0], v: r[1] })),
      prev: () => this.select(LOCS[(idx + LOCS.length - 1) % LOCS.length].id),
      next: () => this.select(LOCS[(idx + 1) % LOCS.length].id)
    };
  }
  renderVals() {
    const { q, sel, zoom, rot, tilt, view } = this.state;
    const qq = (q || '').trim().toLowerCase();
    const match = (l) => !qq || l.name.toLowerCase().indexOf(qq) >= 0 || l.type.toLowerCase().indexOf(qq) >= 0;
    const list = LOCS.filter(match).map((l) => {
      const on = l.id === sel;
      return {
        num: l.id, name: l.name, type: l.type, pressed: on,
        pick: () => this.setState({ sel: l.id }),
        rowStyle: on ? 'background:#E7EFF7;border-color:#C5D8EA;cursor:pointer' : 'background:transparent;cursor:pointer',
        numStyle: on ? 'background:#2F5D8C;color:#FFFFFF' : 'background:#EAF1F8;color:#2F5D8C'
      };
    });
    const markers = LOCS.map((l) => {
      const on = l.id === sel;
      const dim = !match(l);
      return {
        num: l.id, name: l.name, aria: l.id + '. ' + l.name,
        pick: () => this.setState({ sel: l.id }),
        pos: 'left:' + l.x + 'px;top:' + l.y + 'px;opacity:' + (dim ? 0.3 : 1) + ';z-index:' + (on ? 5 : 1) +
          ';transform:translate(-50%,-100%) rotateZ(' + (-rot) + 'deg) rotateX(' + (-tilt) + 'deg) scale(' + (on ? 1.12 : 1) / zoom + ');',
        pillStyle: on ? 'background:#2F5D8C;color:#FFFFFF' : 'background:#FFFFFF;color:#1E2430;padding:0 4px',
        nameStyle: on ? '' : 'display:none',
        numStyle: on ? 'background:#FFFFFF;color:#2F5D8C' : 'background:#2F5D8C;color:#FFFFFF',
        stemStyle: on ? 'border-top-color:#2F5D8C' : 'border-top-color:#FFFFFF'
      };
    });
    const s = LOCS.find((l) => l.id === sel);
    const clampZ = (z) => Math.max(0.5, Math.min(2.8, z));
    return {
      ...this.detailVals(),
      ...this.moreVals(),
      isMap: view === 'map', isDetail: view === 'detail',
      openDetail: () => this.openDetail(), backToMap: () => this.backToMap(),
      q, list, markers,
      noResults: list.length === 0,
      countText: list.length + ' / 7',
      hasSel: !!s, selNum: s ? s.id : '', selName: s ? s.name : '', selType: s ? s.type : '',
      planeStyle: 'transform:translate(-50%,-50%) rotateX(' + tilt + 'deg) rotateZ(' + rot + 'deg) scale(' + zoom + ') translate(' + (700 - FX) + 'px,' + (500 - FY) + 'px);',
      compassStyle: 'transform:rotate(' + rot + 'deg)',
      tiltText: tilt > 0 ? '3D' : '2D',
      tiltLabel: tilt > 0 ? 'Жазық көрініске ауысу' : '3D көрініске ауысу',
      onQuery: (e) => this.setState({ q: e.target.value }),
      zoomIn: () => this.setState({ zoom: clampZ(zoom * 1.25) }),
      zoomOut: () => this.setState({ zoom: clampZ(zoom / 1.25) }),
      rotLeft: () => this.setState({ rot: rot - 20 }),
      rotRight: () => this.setState({ rot: rot + 20 }),
      toggleTilt: () => this.setState({ tilt: tilt > 0 ? 0 : D.tilt }),
      reset: () => this.setState({ zoom: D.zoom, rot: D.rot, tilt: D.tilt })
    };
  }
}

(function () {
  const root = document.getElementById('app');
  const app = new Component({});
  let handlers = [];
  const H = (f) => { handlers.push(f); return handlers.length - 1; };
  const $ = (x) => (x === null || x === undefined) ? '' : String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  let busy = false;
  function render() {
    if (busy) return; busy = true;
    try {
      handlers = [];
      const html = view(app.renderVals(), H, $);
      morphdom(root, '<div id="app">' + html + '</div>', {
        onBeforeElUpdated: function (from, to) {
          if (from.tagName === 'INPUT' && from === document.activeElement && from.type === 'search') { to.value = from.value; }
          return true;
        }
      });
    } finally { busy = false; }
  }
  window.__render = render;
  document.addEventListener('click', (e) => {
    const el = e.target.closest && e.target.closest('[data-on-click]');
    if (el && handlers[+el.getAttribute('data-on-click')]) handlers[+el.getAttribute('data-on-click')](e);
  });
  document.addEventListener('input', (e) => {
    const el = e.target.closest && e.target.closest('[data-on-input]');
    if (el && handlers[+el.getAttribute('data-on-input')]) handlers[+el.getAttribute('data-on-input')](e);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && app.state.lb) app.setState({ lb: null }); });
  render();
})();
