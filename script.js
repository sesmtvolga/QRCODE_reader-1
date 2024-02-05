document.addEventListener('DOMContentLoaded', function () {
    // Obtém os parâmetros da URL usando URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obtém o valor do parâmetro 'nome' da URL
    const employeeName = urlParams.get('nome');

    // Atualiza o conteúdo da página com o nome do funcionário
    const employeeNameElement = document.getElementById('employee-name');
    employeeNameElement.textContent += employeeName || 'Nome não fornecido';
});
