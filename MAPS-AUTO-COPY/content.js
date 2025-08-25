console.log("✅ MAPS-AUTO-COPY carregado!");

(function () {
  //aguarda a página carregar completamente
  function initExtension() {

    //verifica se a URL contém "google.com/maps"
    if (window.location.href.includes("google.com/maps")) {
      //evita criar múltiplos botões se já existir
      if (document.getElementById("btn_coords")) 
        return;

      const btn_coords = document.createElement("button");
      btn_coords.innerText = "📍COPIAR COORDENADAS";
      btn_coords.id = "btn_coords";
      document.body.appendChild(btn_coords);

      //função para copiar coordenadas
      function copiarCoordenadas() {
        //procura as coordenadas no formato decimal 
        const coords_format_decimal = document.querySelector('h2.bwoZTb span');

        if (coords_format_decimal) {
          const coordenadas = coords_format_decimal.textContent;

          //copia as coordenadas para a área de transferência
          navigator.clipboard.writeText(coordenadas).then(() => {
            btn_coords.textContent = `✅COORDENADAS COPIADAS: ${coordenadas}`;
            btn_coords.style.backgroundColor = "#76B843";
            btn_coords.style.color = "white";

            setTimeout(() => {
              btn_coords.textContent = "📍COPIAR COORDENADAS";
              btn_coords.style.backgroundColor = "#FF6B16";
            }, 5000);

          });
        }
        else {
          btn_coords.innerText = "⚠️ COORDENADAS NÃO ENCONTRADAS!";
          btn_coords.style.backgroundColor = "#C0392B";
        }
      }
      //adiciona o evento de clique ao botão para copiar as coordenadas manualmente
      btn_coords.addEventListener("click", copiarCoordenadas);
      //aguarda o carregamento da página para capturar as coordenadas automaticamente
      window.onload = () => {
        //executa a captura das coordenadas assim que a página carregar
        copiarCoordenadas(); 
      };
      //cria um botão de contagem 
      const btn_temp = document.createElement("button");
      btn_temp.innerText = "📍COPIAR COORDENADAS";
      btn_temp.id = "btn_temp";
      document.body.appendChild(btn_temp);

      //inicia o contador regressivo dentro do novo botão
      let count_temp = 15 //10 segundos
      btn_temp.textContent = `⏱️FECHANDO EM ${count_temp} SEGUNDOS...`;

      const interval_btn_temp = setInterval(() => {
        count_temp--;
        btn_temp.textContent = `⏱️FECHANDO EM ${count_temp} SEGUNDOS...`;

        if (count_temp <= 0) {
          clearInterval(interval_btn_temp);
          window.close(); //fecha a janela
        }
      }, 1000);

      //adiciona um evento de clique ao novo botão para incrementar a contagem
      btn_temp.addEventListener("click", () => {
        count_temp += 10; //incrementa 10 segundos
      });
    }
  }
  //executa imediatamente se a página já estiver carregada
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExtension);
  } 
  else {
    initExtension();
  }
}) ();