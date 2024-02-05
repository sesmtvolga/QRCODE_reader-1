document.addEventListener('DOMContentLoaded', function () {
    // Obtém os parâmetros da URL usando URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obtém o valor do parâmetro 'nome' da URL
    const employeeName = urlParams.get('nome');

    // Verifica se o nome do colaborador foi fornecido na URL
    if (employeeName) {
        // Constrói a URL da API com o nome do colaborador
        const apiUrl = `https://script.google.com/macros/s/AKfycbw_-yrcf1dmQB3RWBleeeq5UcWkzuMYIGg2lKO2bB2pCV4SAfff8Sjioj9uBiYwcja9/exec?nome=${encodeURIComponent(employeeName)}`;

        // Faz uma requisição à API usando fetch
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Manipula os dados obtidos da API
                const employeeData = data.retornoSaida[0];

                // Atualiza o conteúdo da página com os dados do colaborador
                updatePageContent(employeeData);
            })
            .catch(error => console.error('Erro ao obter dados da API:', error));
    } else {
        console.error('Nome do colaborador não fornecido na URL.');
    }
});

// Função para atualizar o conteúdo da página com os dados do colaborador
function updatePageContent(employeeData) {
    const employeeInfoElement = document.getElementById('employee-info');
    employeeInfoElement.innerHTML = `<h1>Dados do Funcionário - ${employeeData.NOME}</h1>`;

    // Itera sobre os campos e adiciona-os à página
    for (const key in employeeData) {
        const value = employeeData[key];
        const fieldElement = document.createElement('p');
        fieldElement.textContent = `${key}: ${value}`;
        employeeInfoElement.appendChild(fieldElement);
    }
}
