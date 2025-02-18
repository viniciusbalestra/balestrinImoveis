const form = document.getElementById('cadastro-imovel');
const inputFotos = form.querySelector('[name="fotos"]');
const selectFotoCapa = form.querySelector('[name="fotoCapa"]');

//Envia os dados do cadastro para o backend
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Imóvel cadastrado com sucesso!');
            form.reset();
        } else {
            const error = await response.text();
            alert(`Erro ao cadastrar imóvel: ${error}`);
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao cadastrar imóvel.');
    }
});

//Pré-vizualização das fotos e seleção da capa
inputFotos.addEventListener('change', () => {
    const files = inputFotos.files;
    selectFotoCapa.innerHTML = '<option value="">Selecione a foto de capa</option>';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;

            // Adiciona a foto na pré-visualização (crie um elemento HTML para isso)
            document.getElementById('pre-visualizacao').appendChild(img);

            // Adiciona a opção na select de foto de capa
            const option = document.createElement('option');
            option.value = file.name;
            option.text = file.name;
            selectFotoCapa.appendChild(option);
        };

        reader.readAsDataURL(file);
    }
});