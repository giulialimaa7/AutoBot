console.log("✅ CAP-TOOLS carregado!");

(function () {
  //aguarda a página carregar completamente
  function initExtension() {
    //verifica se está na página correta pelo título
    if (!document.title.includes("CAP - Cadastro e Análise de Projetos")) 
      return;

    //cria um input fixo para o upload de XML
    const xml_input = document.createElement("input");
    xml_input.type = "file";
    xml_input.accept = ".xml";
    xml_input.id = "xml_input";
    document.body.appendChild(xml_input);

    //função para preencher os campos do formulário usando os IDs da página
    function preencherCampos(data) {
      const set = (id, value) => {
        const elemento = document.getElementById(id);
  
        if (elemento) 
          elemento.value = value;
      };
  
      //VERIFICAR O ERRO NO CONSOLE 
      //(Uncaught TypeError: Cannot read properties of undefined (reading 'solicitacaoId'))
      set("ctl00_contentCorpo_txtBoxOrdem", data.solicitacaoId); 
      set("ctl00_contentCorpo_txtBoxUC", data.numerouc);
      set("ctl00_contentCorpo_txtBoxResponsavelTecnico", data.procurador_legal);
      set("ctl00_contentCorpo_txtBoxEmpresa", "-");
      set("ctl00_contentCorpo_txtBoxEmail", data.email);
      set("ctl00_contentCorpo_txtBoxTitular", data.holder);
      set("ctl00_contentCorpo_txtBoxCPFCNPJ", data.cpf);
      set("ctl00_contentCorpo_txtBoxEndereco", data.endereco);
      set("ctl00_contentCorpo_txtBoxCidade", data.cidade);
      set("ctl00_contentCorpo_txtBoxCEP", data.cep);
      set("ctl00_contentCorpo_txtBoxTelefone", data.telefone1);
      set("ctl00_contentCorpo_txtBoxTipoLigacao", data.tipo_conexao);
      set("ctl00_contentCorpo_txtBoxClasse", data.classe);
      set("ctl00_contentCorpo_txtBoxTensao", data.tensao_atendimento);
      set("ctl00_contentCorpo_txtBoxDisjuntor", data.corrente_disjuntor);
      set("ctl00_contentCorpo_txtBoxPotenciaInstalada", "-");
      set("ctl00_contentCorpo_txtBoxAlimentador", "-"); 
      set("ctl00_contentCorpo_txtBoxSubestacao", "-");
      set("ctl00_contentCorpo_txtBoxPontoConexao", "-");
      set("ctl00_contentCorpo_txtBoxGrupo", data.subgrupo);
  
      const qtd = parseInt(data.quantidade_modulos);
  
      if (!isNaN(qtd)) {
        set("ctl00_contentCorpo_qtdMod", qtd);
        set("ctl00_contentCorpo_areaMod", qtd * 2);
      }
  
      set("ctl00_contentCorpo_fabMod", data.fabricante_modulo);
      set("ctl00_contentCorpo_fabInv", data.fabricante_inversor);
      set("ctl00_contentCorpo_potMod", data.potencia_mod);
      set("ctl00_contentCorpo_potInv", data.potencia_inv);
      set("ctl00_contentCorpo_InmInv", data.inmetro);
      set("ctl00_contentCorpo_qtdInv", data.qtd_inv);
      set("ctl00_contentCorpo_txtBoxMotivoReprovacao", data.ressalva);
  
      set("ctl00_contentCorpo_txtBoxLatitude", data.latitude);
      set("ctl00_contentCorpo_txtBoxLongitude", data.longitude);
  
      //select de tensão: seta para a opção 220 se aplicável
      const tensaoDropdown = document.getElementById("ctl00_contentCorpo_ddlTensaoNominal");
  
      if (data.tensao_atendimento === "220" && tensaoDropdown) {
        tensaoDropdown.selectedIndex = 3;
        tensaoDropdown.dispatchEvent(new Event("change", { bubbles: true }));
      }
  
      const input_num_carta = document.getElementById("ctl00_contentCorpo_txtBoxNumCarta");
    
      if (input_num_carta) {
        //garantir que o campo fique vazio
        input_num_carta.value = "";
        //muda o texto do placeholder
        input_num_carta.placeholder = "NÚMERO DA CARTA";
        //aplica a classe para a troca de cor do placeholder
        input_num_carta.classList.add("red-placeholder");
      }
    }
      
    //exibe uma mensagem visual no canto superior com base na quantidade de UCS
    function exibirMensagemRateio(qtd) {
      const div = document.createElement("div");
  
      div.style.position = "fixed";
      div.style.top = "65px";
      div.style.right = "10px";
      div.style.zIndex = "10000";
      div.style.fontSize = "30px";
      div.style.fontWeight = "bold";
  
      if (parseInt(qtd) > 0) {
        div.innerHTML = `<span style='color: red;'> COM RATEIO = ${ qtd } </span>`;
      } 
      else {
        div.innerHTML = `<span style='color: gold;'> PRÉVIA S/ RATEIO </span>`;
  
        div.ondblclick = () => {
          div.innerHTML = div.innerText.includes("PRÉVIA")
            ? `<span style='color: limegreen;'> NÃO TEM RATEIO </span>`
            : `<span style='color: gold;'> PRÉVIA S/ RATEIO </span>`;
        };
      }
      document.body.appendChild(div);
    }
    //função utilitária para padronizar a tensão (ex: "220V" -> "220")
    function formatarTensao(tensao) {
      if (tensao.includes("220")) return "220";
      if (tensao.includes("240")) return "240";
      if (tensao.includes("127")) return "127";
      return tensao;
    }
    //função utilitária para padronizar subgrupo (ex: "B1" -> "B")
    function formatarSubgrupo(subgrupo) {
      return subgrupo.includes("B") ? "B" : subgrupo;
    }

    //lê e processa o arquivo XML quando o usuário seleciona um
    xml_input.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (!file) 
        return;

      const reader = new FileReader();

      reader.onload = (ev) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(ev.target.result, "text/xml");

        const get = (tag) => xml.getElementsByTagName(tag)?.[0]?.textContent?.trim() || "";

        const data = {
          solicitacaoId: get("solicitacaoId"),
          numerouc: get("numerouc"),
          procurador_legal: get("procurador_legal"),
          email: get("email"),
          holder: get("holder"),
          cpf: get("cpf"),
          endereco: get("endereco").replace(/\s+/g, " "),
          cidade: get("cidade"),
          cep: get("cep"),
          telefone1: get("telefone1"),
          quantidadeUcsCreditos: get("quantidade_ucs_creditos"),
          tipo_conexao: get("tipo_conexao"),
          classe: get("classe"),
          corrente_disjuntor: parseInt(get("corrente_disjuntor")),
          tensao_atendimento: formatarTensao(get("tensao_atendimento")),
          subgrupo: formatarSubgrupo(get("subgrupo")),
          latitude: get("latitude"),
          longitude: get("longitude"),
          quantidade_modulos: get("quantidade_modulos"),
          fabricante_modulo: get("fabricante") + " / " + get("modelo"),
          fabricante_inversor: get("fabricante_inversor") + " / " + get("modelo_inversor"),
          potencia_inv: get("potencia_inv"),
          potencia_mod: get("potencia_mod"),
          inmetro: get("inmetro"),
          qtd_inv: get("qtd_inv"),
          carta: get("carta"),
          ressalva: get("ressalva"),
        };

        preencherCampos(data);
        exibirMensagemRateio(data.quantidadeUcsCreditos);
      };

      reader.readAsText(file);
    });
  
    const btn_maps = document.createElement("button");
    btn_maps.innerText = "MAPS";
    btn_maps.id = "btn_maps";
    document.body.appendChild(btn_maps);
  
    btn_maps.addEventListener("click", () => {
      const latitude = document.getElementById("ctl00_contentCorpo_txtBoxLatitude")?.value.trim();
      const longitude = document.getElementById("ctl00_contentCorpo_txtBoxLongitude")?.value.trim();
      
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, "_blank");
    });
  
    const btn_extract = document.createElement("button");
    btn_extract.innerText = "EXTRACT";
    btn_extract.id = "btn_extract";
    document.body.appendChild(btn_extract);

    let aJanelaEstaFechada = false;

    function criarJanelaFlutuante() {
      const sobreposicao = document.createElement("div");
      sobreposicao.className = "sobreposicao";

      const janelaFlutuante = document.createElement("div");
      janelaFlutuante.className = "janela-flutuante";

      janelaFlutuante.innerHTML = `
        <textarea 
          rows="6"
          id="text_area" 
          placeholder="Cole o texto contendo as coordenadas aqui" 
        ></textarea>

        <button id="btn_extract_janela_flutuante"> EXTRAIR </button>
        
        <div class="lat-long">
          <input type="text" id="latitude1" placeholder="Latitude"/>
          <input type="text" id="longitude1" placeholder="Longitude"/>
        </div>

        <button id="btn_go_cap"> GO CAP </button>
      `;

      document.body.appendChild(sobreposicao);
      document.body.appendChild(janelaFlutuante);
      
      function fecharSeClicarFora(event) {
        //verifica se o clique foi fora da janelaFlutuante
        if (!janelaFlutuante.contains(event.target)) {
          janelaFlutuante.remove();
          sobreposicao.remove();
          
          aJanelaEstaFechada = false;
        }
      };

      //adiciona evento ao documento para detectar cliques fora da janela
      document.addEventListener("mousedown", fecharSeClicarFora);

      //define o foco automaticamente no campo de texto
      const text_area = janelaFlutuante.querySelector("#text_area");
      text_area.focus();

      function extractCoords() {
        const texto = document.getElementById("text_area").value;

        //expressão regulares
        const regex_DMS = /([\-]?\d{1,2})[°]\s*(\d{1,2})['’]\s*(\d{1,2}(?:[,.]\d+)?)[",”]\s*([NS]?)\s*.*?\s*([\-]?\d{1,3})[°]\s*(\d{1,2})['’]\s*(\d{1,2}(?:[,.]\d+)?)[",”]\s*([EW]?)/i;
        const regex_decimal = /([\-]?\d{1,3}(?:\.\d+)?)[ ]*,?[ ]*([\-]?\d{1,3}(?:\.\d+)?)/;

        let match;

        //tenta encontrar coordenadas no formato DMS
        match = texto.match(regex_DMS);

        if (match) {
          const latitude = `${match[1]}° ${match[2]}' ${match[3].replace(',', '.')}"`;
          const lat_sign = match[4] === 'S' ? '-' : '';

          const longitude = `${match[5]}° ${match[6]}' ${match[7].replace(',', '.')}"`;
          const lon_sign = match[8] === 'W' ? '-' : '';

          document.getElementById("latitude1").value = lat_sign + latitude;
          document.getElementById("longitude1").value = lon_sign + longitude;
        }
        else {
          //tenta encontrar coordenadas no formato decimal
          match = regex_decimal.exec(texto);
          //verifica se existem ao menos 3 grupos
          if (match && match.length >= 3) {
            document.getElementById("latitude1").value = match[1].replace(",", ".");
            document.getElementById("longitude1").value = match[2].replace(",", ".");
          }
          else {
            return alert("Coordendas não encontradas!\nCertifique-se de que o texto contém coordenadas válidas.")
          }
        }
      };

      //função para preencher os campos com as coordenadas extraídas
      function preencherCoords() {
        sobreposicao.remove();
        aJanelaEstaFechada = false;

        //obtém os valores dos campos de latitude e longitude na janela flutuante
        const latitude1 = document.getElementById("latitude1").value;
        const longitude1 = document.getElementById("longitude1").value;

        //verifica se os campos de coordenadas estão preenchidos
        if (latitude1 && longitude1) {
          // Localiza os campos de latitude e longitude na página
          const campo_latitude = document.getElementById("ctl00_contentCorpo_txtBoxLatitude");
          const campo_longitude = document.getElementById("ctl00_contentCorpo_txtBoxLongitude");

          //preenche os campos com os valores de latitude e longitude, limitando a 10 caracteres
          if (campo_latitude && campo_longitude) {
            campo_latitude.value = latitude1.slice(0, 10);
            campo_longitude.value = longitude1.slice(0, 10);

            campo_latitude.scrollIntoView({
              behavior: "smooth", //rolagem suave
              block: "center", //centraliza verticalmente na tela
              inline: "nearest" //rolagem horizontalmente apenas se necessário
            });

            //aplica borda verde temporária
            campo_latitude.style.border = "3px solid black";
            campo_longitude.style.border = "4px solid black";

            //remove a borda depois de 2 segundos
            setTimeout(() => {
              campo_latitude.style.border = "";
              campo_longitude.style.border = "";
            }, 2000);

            janelaFlutuante.remove();
          }
        }
      };

      document.getElementById("btn_extract_janela_flutuante").addEventListener("click", extractCoords);
      document.getElementById("btn_go_cap").addEventListener("click", preencherCoords);

      //função principal para o botão 'GO CAP', que extrai e preenche automaticamente
      function extractEpreencherCoords() {
        extractCoords(); //extrai as coordenadas do texto
        preencherCampos(); //preenche os campos na página com as coordenadas extraídas
      }

      document.getElementById("btn_go_cap").addEventListener("click", extractEpreencherCoords);
    };

    btn_extract.addEventListener("click", () => {
      criarJanelaFlutuante();
    });

    const btn_search = document.createElement("button");
    btn_search.innerText = "SEARCH";
    btn_search.id = "btn_search";
    document.body.appendChild(btn_search);

    btn_search.addEventListener("click", function() {
      //coleta o valor do campo no site de origem
      let termo_busca = document.getElementById("ctl00_contentCorpo_fabInv").value;
      let url = `https://consultar-inversores.netlify.app?search=${termo_busca}`;

      //verifica se já existe uma aba com o mesmo host
      if (window.location.href.includes("consultar-inversores.netlify.app")) {
        window.location.href = url; //altera a URL da aba atual 
      } 
      else {
        window.open(url, "_blank"); //abre uma nova aba 
      }
    });

    //manter atividade do site
    const div_atividade = document.createElement("div");
    div_atividade.textContent = "⏳AGUARDANDO";
    div_atividade.className = "div_atividate_cap";
    document.body.appendChild(div_atividade);

    //função para atualizar a sessão e mostrar o horário
    function manterSessaoAtiva() {
      const agora = new Date().toLocaleTimeString("pt-BR");

      //simula evento de atividade mínima
      const evento = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: 1,
        clientY: 1,
      });
      document.dispatchEvent(evento);
      //atuliza texto da div
      div_atividade.textContent = `✅ SESSÃO ATIVA ${agora}`
    }
    //roda a cada 4 minutos
    setInterval(manterSessaoAtiva, 120000);
    //executa assim que carregar
    manterSessaoAtiva();
  };
  
  //executa imediatamente se a página já estiver carregada
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExtension);
  } 
  else {
    initExtension();
  }
})();