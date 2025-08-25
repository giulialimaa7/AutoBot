# 🧩 Automação com Extensões de Navegador  

🎯 **Desafio**  
No dia a dia, diversas tarefas manuais em portais e formulários consomem tempo e estão sujeitas a erros, como:  
- Buscar ordens em portais.  
- Preencher dados de clientes em formulários.  
- Tratar e validar coordenadas (latitude/longitude).  
- Realizar buscas específicas em sites de referência.  

📂 **Estrutura do Projeto**  
O projeto está dividido em **três extensões**, cada uma com um papel específico:  

### 🔹 `GENERATE-XML`  
- Busca uma ordem em um portal.  
- Lê os dados do cliente.  
- Gera um arquivo **XML** com essas informações para ser usado pelas demais extensões.  

### 🔹 `CAP-TOOLS`  
- Insere botões no portal para interações rápidas:  
  - **Preencher formulário** com dados do XML, destacando placeholders que devem ser preenchidos manualmente.  
  - **Extract** → abre uma janela flutuante, separa latitude/longitude e preenche os formulários, focando nos campos completados.  
  - **Maps (maps-auto-copy)** → integração com a extensão de mapas.  
  - **Search** → pesquisa um inversor em um site-base criado para esse fim, copia o resultado para a área de transferência e fecha a aba automaticamente.  

### 🔹 `MAPS-AUTO-COPY`  
- Captura campos de latitude e longitude.  
- Abre uma aba no **Google Maps** com as coordenadas.  
- Copia no formato correto.  
- Inicia um cronômetro para fechar a aba e retorna ao formulário.  

⚡ Todas as extensões mantêm a página ativa enquanto executam as automações.  

---

🛠️ **Solução**  
Com esse conjunto de extensões, o fluxo de trabalho se torna mais ágil, reduzindo erros manuais e automatizando etapas críticas:  
1. Coleta de dados no portal.  
2. Geração de XML.  
3. Preenchimento automático de formulários.  
4. Tratamento e validação de coordenadas.  
5. Busca rápida em base de dados personalizada.  

---

📦 **Tecnologias e Ferramentas Utilizadas**  
- JavaScript  
- Extensões Chrome (Manifest V3)  
- Manipulação de DOM  
- Integração com Google Maps  
- XML para troca de informações  
