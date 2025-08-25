console.log("✅ GENERATE-XML carregado!");

(function () {
  //aguarda a página carregar completamente
  function initExtension() {
    const url_portal = "https://www.eneldistribuicao.com.br/PortalGD/ENELRJ/Distribuidora/pages/solicitacao/solicitacoes.jsf";

    //verifica se a URL contem o link do portal
    if (window.location.href === url_portal) {
      //evita criar múltiplos botões se já existir
      if (document.getElementById("btn_generate_xml")) 
        return

      //função para criar o XML manualmente
      function gerarXML(dados) {
        return `
          <dados>
            <carta/>
            <solicitacaoId>${ dados.solicitacaoId }</solicitacaoId>
            <numerouc>${ dados.numerouc }</numerouc>
            <procurador_legal>${ dados.procurador_legal }</procurador_legal>
            <email>${ dados.email }</email>
            <holder>${ dados.holder }</holder>
            <cpf>${ dados.cpf }</cpf>
            <endereco>${ dados.endereco }</endereco>
            <cidade>${ dados.cidade }</cidade>
            <cep>${ dados.cep }</cep>
            <telefone1>${ dados.telefone1 }</telefone1>
            <telefone2>${ dados.telefone2 }</telefone2>
            <quantidade_ucs_creditos>${ dados.quantidade_ucs_creditos }</quantidade_ucs_creditos>
            <nivel_tensao>${ dados.nivel_tensao }</nivel_tensao>
            <tipo_conexao>${ dados.tipo_conexao }</tipo_conexao>
            <tensao_atendimento>${ dados.tensao_atendimento }</tensao_atendimento>
            <classe>${ dados.classe }</classe>
            <modalidade>${ dados.modalidade }</modalidade>
            <subgrupo>${ dados.subgrupo }</subgrupo>
            <potencia_instalada_geracao>${ dados.potencia_instalada_geracao }</potencia_instalada_geracao>
            <potencia_instalada>${ dados.potencia_instalada }</potencia_instalada>
            <fabricante>${ dados.fabricante }</fabricante>
            <modelo>${ dados.modelo }</modelo>
            <quantidade_modulos>${ dados.quantidade_modulos }</quantidade_modulos>
            <area>${ dados.area }</area>
            <fabricante_inversor>${ dados.fabricante_inversor }</fabricante_inversor>
            <modelo_inversor>${ dados.modelo_inversor }</modelo_inversor>
            <latitude>${ dados.latitude }</latitude>
            <longitude>${ dados.longitude }</longitude>
            <corrente_disjuntor>${ dados.corrente_disjuntor }</corrente_disjuntor>
            <demanda>${ dados.demanda }</demanda>
            <inmetro/>
            <potencia_mod/>
            <potencia_inv/>
            <qtd_inv/>
            <ressalva/>
          </dados>
        `.trim();
      } 

      // async function prepararTelaParaGerarXML() {
      //   console.log("entrou aqui")

      //   //aguarda e clica no botão de visualização da solicitação (ícone de documento)
      //   const tentarClicar = () => {
      //     const detalhes_button = document.querySelector("button[title='Detalhes']");

      //     if (detalhes_button) {
      //       detalhes_button.click();
      //       return true;
      //     }

      //     return false;
      //   };

      //   let tentativas = 0;

      //   while (!tentarClicar() && tentativas < 10) {
      //     await new Promise(resolve => setTimeout(resolve, 1000));
      //     tentativas++;
      //   }

      //   if (tentativas >= 10) {
      //     return alert("❌ Não foi possível encontrar o botão dos detalhes!");
      //   }

      //   //aguarda carregamento dos dados após clique
      //   await new Promise(resolve => setTimeout(resolve, 3000));
      // }

      async function gerarEbaixarXML() {
        //aguarda o carregamento dos dados na tela de detalhes
        //await prepararTelaParaGerarXML();

        //pega o HTML da página
        const codFiltrado = document.documentElement.outerHTML;
        //função auxiliar para capturar via regex e limpar o resultado
        function capturar(regex) {
          const match = codFiltrado.match(regex);
          return match ? match[1].trim() : '';
        }

        //captura o CPF ou CNPJ
        let cpf = capturar(/CPF<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/);

        if (!cpf) {
          cpf = capturar(/CNPJ<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/);
        }

        //captura emails (usa o segundo e-mail se existir e não for vazio ou "-")
        const emailMatches = [...codFiltrado.matchAll(/E-mail<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/g)];
        let email = '';

        if (emailMatches.length > 1) {
          email = emailMatches[1][1].trim();

          if (!email || email === '-') 
            email = emailMatches[0][1].trim();
        } 
        else if (emailMatches.length === 1) {
          email = emailMatches[0][1].trim();

          if (email === '-') 
            email = '';
        }

        //dados capturados
        const dados = {
          solicitacaoId: capturar(/solicitacaoId" type="text"[^>]*value="([^"]+)/),
          numerouc: capturar(/Número da Instalaç[ãa]o<\/label>\s*<span[^>]*><\/span>\s*(\d+)/),
          holder: capturar(/Titular da Unidade Consumidora<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          endereco: capturar(/Endereço<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          cidade: capturar(/Cidade<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          cep: capturar(/CEP<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          telefone1: capturar(/Telefone 1<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          telefone2: capturar(/Telefone 2<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          modalidade: capturar(/Modalidade<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          subgrupo: capturar(/SubGrupo<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          quantidade_ucs_creditos: capturar(/Quantidade de UCs que recebem créditos<\/label>\s*<span class="clearfix"><\/span>\s*(\d+)/),
          potencia_instalada_geracao: capturar(/Potência Instalada de Geração \(kW\)<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          potencia_instalada: capturar(/Potência Instalada \(kW\)<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          nivel_tensao: capturar(/N[ií]vel de Tens[aã]o<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          tipo_conexao: capturar(/Tipo de Conexão<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          tensao_atendimento: capturar(/Tensão de Atendimento<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          classe: capturar(/Classe<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          fabricante: capturar(/Fabricante<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          modelo: capturar(/Modelo<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          quantidade_modulos: capturar(/Quantidade de Módulos<\/label>\s*<span class="clearfix"><\/span>\s*(\d+)/),
          area: capturar(/Área<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          fabricante_inversor: capturar(/Fabricante do Inversor<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          modelo_inversor: capturar(/Modelo do Inversor<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          latitude: capturar(/Latitude<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          longitude: capturar(/Longitude<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          corrente_disjuntor: capturar(/Corrente do Disjuntor \(A\)<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          demanda: capturar(/Demanda \(kW\)<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          procurador_legal: capturar(/Nome\/Procurador Legal<\/label>\s*<span class="clearfix"><\/span>\s*([^<]+)/),
          cpf,
          email: email.toLowerCase(),
        };

        //validação rápida antes de gerar XML
        if (!dados.solicitacaoId) {
          return alert("⚠️Solicitação ID não encontrada, XML não será gerado.")
        }

        //gerar XML
        const xml = gerarXML(dados);
        //cria blob e força o download do XML
        const blob = new Blob([xml], { type: 'text/xml' });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `xml_enel_${dados.solicitacaoId}.xml`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);

        alert("✅ XML gerado e download iniciado.");
      }

      const generate_xml_button = document.createElement("button");
      generate_xml_button.innerText = "GERAR-XML";
      generate_xml_button.id = "btn_generate_xml";
      document.body.appendChild(generate_xml_button);

      generate_xml_button.addEventListener('click', gerarEbaixarXML);

      //manter atividade do site
      const div_atividade = document.createElement("div");
      div_atividade.textContent = "⏳AGUARDANDO";
      div_atividade.className = "div_atividate_portal";
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
      //roda a cada 1 minuto
      setInterval(manterSessaoAtiva, 60000);
      //executa assim que carregar
      manterSessaoAtiva();
    }  
  };
  
  //executa imediatamente se a página já estiver carregada
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExtension);
  } 
  else {
    initExtension();
  }
}) ();