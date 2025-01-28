async function loader() {
    try {
        const responseHeader = fetch('/pages/header.html');
        const responseFooter = fetch('/pages/footer.html');

        // Usando Promise.all para executar as duas requisições em paralelo
        const [headerResponse, footerResponse] = await Promise.all([responseHeader, responseFooter]);

        if (!headerResponse.ok) {
            throw new Error(`Erro no cabeçalho: ${headerResponse.status}`);
        }

        if (!footerResponse.ok) {
            throw new Error(`Erro no rodapé: ${footerResponse.status}`);
        }

        const headerData = await headerResponse.text();
        document.getElementById("header-container").innerHTML = headerData;

        const footerData = await footerResponse.text();
        document.getElementById("footer-container").innerHTML = footerData; // Usando o container correto para o rodapé

    } catch (error) {
        console.error('Erro ao carregar informações:', error); // Incluir o erro no console
        if (document.getElementById('header-container')) { // Verifica se o elemento existe antes de tentar modificá-lo
          document.getElementById('header-container').innerHTML = "<p>Erro ao carregar o cabeçalho.</p>";
        }
        if (document.getElementById('footer-container')) { // Verifica se o elemento existe antes de tentar modificá-lo
          document.getElementById('footer-container').innerHTML = "<p>Erro ao carregar o rodapé.</p>";
        }
    }
}

loader();