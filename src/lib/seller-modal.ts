export const SELLER_NAME = "Essenza Di Chef";

export const SELLER_MODAL_HTML = `<div id="modalVendedor" style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:#ffffff;z-index:100;display:none;flex-flow:column;">
	<div style="margin:20px 15px;flex-grow:1;display:flex;align-items:center;max-height:35px;">
		<span style="margin:0 auto 0 0;flex-grow:1;font-family:proximanovaregular;font-weight:400;font-size:20px;color:rgba(0,0,0,.9);">Detalhes do vendedor</span>
		<i onclick="modal(&quot;modalVendedor&quot;);" class="material-icons" style="margin:0 0 0 auto;font-size:24px;color:#3483fa;width:max-content;height:max-content;cursor:pointer;">&#10005;</i>
	</div>
	<div style="width:100%;height:1px;background-color:#d8d8d8;"></div>
	<div style="flex-grow:1;flex-basis:auto;overflow-y:auto;background-color:#eeeeee;text-align:left;display:flex;flex-flow:column;">
		<div style="flex-grow:1;">
			<span style="margin-left:20px;margin-top:30px;display:block;font-family:proximanovaregular;font-weight:400;font-size:32px;color:#333333;" id="nome-da-loja-1">${SELLER_NAME}</span>
			<span style="margin-left:20px;margin-top:20px;display:block;font-family:proximanovaregular;font-weight:400;font-size:16px;color:#333333;">+10 anos vendendo</span>
			<span style="margin-left:20px;margin-top:5px;display:block;font-family:proximanovaregular;font-weight:400;font-size:16px;color:#333333;">Cajamar, S&atilde;o Paulo</span>
			<span style="margin-left:20px;margin-top:20px;display:block;font-family:proximanovaregular;font-weight:400;font-size:16px;color:#333333;">+1M de vendas nos &uacute;ltimos 365 dias</span>

			<div style="margin:30px 20px;flex-grow:1;display:flex;align-items:center;">
				<div style="margin-right:5px;min-width:calc(20% - 4px);height:8px;background-color:#f0e0df;"></div>
				<div style="margin-right:5px;min-width:calc(20% - 4px);height:8px;background-color:#f1e6d8;"></div>
				<div style="margin-right:5px;min-width:calc(20% - 4px);height:8px;background-color:#f2eec3;"></div>
				<div style="margin-right:5px;min-width:calc(20% - 4px);height:8px;background-color:#e1eec3;"></div>
				<div style="min-width:calc(20% - 4px);height:12px;background-color:#39b54a;"></div>
			</div>

			<div style="padding:30px 20px;flex-grow:1;height:max-content;background-color:#ffffff;border-top:solid 1px #e0e0e0;border-bottom:solid 1px #e0e0e0;display:flex;align-items:center;">
				<img src="https://i.imgur.com/KehaLNP.png" alt="Bom atendimento" style="width:77px;height:77px;margin-right:10px;">
				<div style="flex-grow:1;text-align:left;">
					<span style="display:block;font-family:proximanovaregular;font-weight:400;font-size:18px;color:#666;">Presta um bom atendimento</span>
					<span style="margin-top:10px;display:block;font-family:proximanovaregular;font-weight:400;font-size:14px;color:#999;">Os seus compradores est&atilde;o satisfeitos.</span>
				</div>
			</div>
			<div style="padding:30px 20px;flex-grow:1;height:max-content;background-color:#ffffff;border-top:solid 1px #e0e0e0;border-bottom:solid 1px #e0e0e0;display:flex;align-items:center;">
				<img src="https://i.imgur.com/gxXo9SW.png" alt="Entrega no prazo" style="width:77px;height:77px;margin-right:10px;">
				<div style="flex-grow:1;text-align:left;">
					<span style="display:block;font-family:proximanovaregular;font-weight:400;font-size:18px;color:#666;">Entrega os produtos dentro do prazo</span>
					<span style="margin-top:10px;display:block;font-family:proximanovaregular;font-weight:400;font-size:14px;color:#999;">Os produtos s&atilde;o entregue sem atraso.</span>
				</div>
			</div>

			<div class="carrossel" style="margin-top:25px;width:100%;display:none;background-color:#eeeeee;">
				<span style="margin:5px 10px 20px 20px;display:block;font-family:proximanovaregular;font-size:20px;color:rgba(0,0,0,.9);">Mais an&uacute;ncios do vendedor</span>
				<div class="carrossel2"></div>
			</div>

			<div style="margin-top:25px;padding:15px 0;flex-grow:1;background-color:#ffffff;display:none;flex-flow:column;">
				<div style="flex-grow:1;padding:0 15px;display:flex;flex-flow:column;">
					<span style="display:block;font-family:proximanovaregular;font-size:18px;color:rgba(0,0,0,.9);">Opini&otilde;es dos seus compradores</span>

					<span style="margin-top:15px;display:block;font-family:proximanovaregular;font-weight:400;font-size:32px;color:rgba(0,0,0,.9);">+10mil avalia&ccedil;&otilde;es</span>
					<div style="flex-grow:1;display:flex;align-items:center;">
						<div style="margin-right:10px;width:156px;height:10px;border-radius:5px;background-color:#3483fa;"></div>
						<span style="font-family:proximanovaregular;font-size:14px;color:#999;opacity:.9;">&Oacute;timo(+10mil)</span>
					</div>
					<div style="margin-top:5px;flex-grow:1;display:flex;align-items:center;">
						<div style="margin-right:10px;width:156px;height:10px;border-radius:5px;background-color:#efefef;"></div>
						<span style="font-family:proximanovaregular;font-size:14px;color:#999;opacity:.9;">Bom(+5mil)</span>
					</div>
					<div style="margin-top:5px;flex-grow:1;display:flex;align-items:center;">
						<div style="margin-right:10px;width:156px;height:10px;border-radius:5px;background-color:#efefef;"></div>
						<span style="font-family:proximanovaregular;font-size:14px;color:#999;opacity:.9;">Ruim(0)</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;

export const SELLER_MODAL_SCRIPT = `<script>(function(){
window.modal=function(id){var el=document.getElementById(id);if(!el)return;var open=el.style.display==='flex';el.style.display=open?'none':'flex';document.body.style.overflow=open?'':'hidden';};
function wire(){
  var links=document.querySelectorAll('a');
  Array.prototype.forEach.call(links,function(a){
    if((a.textContent||'').trim()===${JSON.stringify(SELLER_NAME)}&&!a.getAttribute('data-seller-modal')){
      a.setAttribute('data-seller-modal','1');
      a.style.cursor='pointer';
      a.addEventListener('click',function(e){e.preventDefault();window.modal('modalVendedor');});
    }
  });
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',wire)}else{wire()}
setTimeout(wire,300);setTimeout(wire,1200);
})();</script>`;
