async function loader() {
    try {
      // Inicia a busca dos arquivos header.html e footer.html
      const responseHeader = fetch('/pages/header.html');
      const responseFooter = fetch('/pages/footer.html');
  
      // Usando Promise.all para executar as duas requisições em paralelo
      // Isso significa que ambas as requisições acontecem ao mesmo tempo,
      // e o código só continua quando ambas terminarem (com sucesso ou falha).
      const [headerResponse, footerResponse] = await Promise.all([responseHeader, responseFooter]);
  
      // Verifica se a requisição do cabeçalho foi bem-sucedida
      if (!headerResponse.ok) {
        // Se a resposta não estiver OK (status 200-299), lança um erro
        // Isso faz com que o código pule para o bloco catch
        throw new Error(`Erro no cabeçalho: ${headerResponse.status}`);
      }
  
      // Verifica se a requisição do rodapé foi bem-sucedida
      if (!footerResponse.ok) {
        throw new Error(`Erro no rodapé: ${footerResponse.status}`);
      }
  
      // Se as requisições foram bem-sucedidas, obtém o texto das respostas
      const headerData = await headerResponse.text();
      const footerData = await footerResponse.text();
  
      // Insere o conteúdo do cabeçalho no elemento com o ID "header-container"
      document.getElementById("header-container").innerHTML = headerData;
  
      // Insere o conteúdo do rodapé no elemento com o ID "footer-container"
      document.getElementById("footer-container").innerHTML = footerData; // Usando o container correto para o rodapé
  
    } catch (error) {
      // Este bloco só é executado se algum dos fetch() falhar ou se um erro for lançado
      console.error('Erro ao carregar informações:', error); // Inclui o erro no console para debugging
  
      // Verifica se o elemento de cabeçalho existe antes de tentar modificá-lo
      if (document.getElementById('header-container')) {
        document.getElementById('header-container').innerHTML = "<p>Erro ao carregar o cabeçalho.</p>";
      }
  
      // Verifica se o elemento de rodapé existe antes de tentar modificá-lo
      if (document.getElementById('footer-container')) {
        document.getElementById('footer-container').innerHTML = "<p>Erro ao carregar o rodapé.</p>";
      }
    }
  }
  
  // Chama a função loader() para iniciar o processo de carregamento
  loader();
  