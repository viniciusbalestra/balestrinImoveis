async function enviarContato() {

    document.getElementById('formulario-submit')

    
    
}

document.addEventListener('DOMContentLoaded',() => {
    const formulario = document.getElementById('formulario-submit');
    if (formulario) {
        formulario.addEventListener('submit', enviarContato);
    }
})