document.addEventListener('DOMContentLoaded', function () {
    // Obtém os parâmetros da URL usando URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);

    // Obtém o valor do parâmetro 'nome' da URL
    const employeeName = urlParams.get('nome');

    // Verifica se o nome do colaborador foi fornecido na URL
    if (employeeName) {
        // Constrói a URL da API com o nome do colaborador
        const apiUrl = `https://script.google.com/macros/s/AKfycbyQ7FPHM6W5kC-0Q91WQF1Fcw0OiaTSv2OvD1BmwRdbcO-Ta5q7Xb046DvPzkRH1xNC/exec?nome=${encodeURIComponent(employeeName)}`;

        // Faz uma requisição à API usando fetch
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Manipula os dados obtidos da API
                const employeeData = data.retornoSaida[0];

                // Verifica se há dados antes de tentar atualizar a página
                if (employeeData) {
                    // Atualiza o conteúdo da página com os dados do colaborador
                    updatePageContent(employeeData);
                } else {
                    console.error('Dados do colaborador não encontrados.');
                }
            })
            .catch(error => console.error('Erro ao obter dados da API:', error));
    } else {
        console.error('Nome do colaborador não fornecido na URL.');
    }
});

// Função para formatar datas no formato "dd/mm/aaaa"
function formatarData(data) {
    return data ? new Date(data).toLocaleDateString('pt-BR') : '-';
}

// Função para substituir valores vazios ou "-" por "Não se aplica"
function substituirNaoSeAplica(valor) {
    return valor === '-' ? 'Não se aplica' : valor;
}

// Função para verificar se pelo menos um valor de uma tabela não é "Não se aplica"
function algumValorNaoSeAplica(tabela) {
    const celulas = tabela.querySelectorAll('td');
    for (const celula of celulas) {
        const textoCelula = celula.textContent.trim();
        if (textoCelula !== 'Data: Não se aplica' && 
            textoCelula !== 'Vencimento: Não se aplica' && 
            textoCelula !== 'Status: Não se aplica') {
            return true;
        }
    }
    return false;
}

// Função para atualizar o conteúdo da página com os dados do colaborador
function updatePageContent(employeeData) {
    const employeeInfoElement = document.getElementById('employee-info');
    employeeInfoElement.innerHTML = `<h1>Dados do Colaborador - ${employeeData.NOME}</h1>`;

    // Adiciona a foto do colaborador
    const linkFoto = employeeData.LINK_FOTO;
    console.log("Link da foto: " + employeeData.LINK_FOTO);
    if (linkFoto) {
        const imgElement = document.createElement('img');
        imgElement.src = linkFoto;
        imgElement.alt = 'Foto do Colaborador';
        imgElement.classList.add('employee-photo');
        employeeInfoElement.appendChild(imgElement);
    } else {
        const placeholderImg = document.createElement('div');
        placeholderImg.classList.add('placeholder-image');
        employeeInfoElement.appendChild(placeholderImg);
    }

    // Agrupa os campos relacionados em tabelas
    const tabelas = agruparEmTabelas(employeeData);

    // Adiciona as tabelas à página, verificando se pelo menos um valor não é "Não se aplica"
    tabelas.forEach(tabela => {
        if (algumValorNaoSeAplica(tabela)) {
            employeeInfoElement.appendChild(tabela);
        }
    });
}

// Função para agrupar os campos relacionados em tabelas
function agruparEmTabelas(employeeData) {
    const tabelas = [];

    // Agrupa os campos relacionados em um objeto
    const camposAgrupados = {};
    for (const key in employeeData) {
        const campoSplit = key.split('_');
        const sufixo = campoSplit[campoSplit.length - 1];

        // Cria um objeto para armazenar os campos relacionados pelo sufixo
        if (!camposAgrupados[sufixo]) {
            camposAgrupados[sufixo] = {};
        }

        camposAgrupados[sufixo][key] = employeeData[key];
    }

    // Itera sobre os campos agrupados e cria tabelas
    for (const sufixo in camposAgrupados) {
        const tabela = criarTabela(camposAgrupados[sufixo], sufixo);
        tabelas.push(tabela);
    }

    return tabelas;
}

// Função para criar uma nova tabela
function criarTabela(campos, sufixo) {
    const tabela = document.createElement('table');
    tabela.classList.add('info-table');

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const cabecalho = document.createElement('tr');

    // Adiciona o título da tabela
    const titulo = document.createElement('th');
    titulo.textContent = obterTituloTabela(sufixo);
    titulo.colSpan = Object.keys(campos).length;
    titulo.classList.add('table-title');
    cabecalho.appendChild(titulo);

    thead.appendChild(cabecalho);
    tabela.appendChild(thead);

    // Adiciona a linha com os valores
    const linha = criarLinhaTabela(campos);
    tbody.appendChild(linha);

    tabela.appendChild(tbody);

    return tabela;
}

// Função para criar uma linha de tabela
function criarLinhaTabela(campos) {
    const linha = document.createElement('tr');

    // Adiciona as células à linha
    for (const key in campos) {
        const td = document.createElement('td');
        let value = campos[key];
        
        // Formata as datas para o formato "dd/mm/aaaa" se forem válidas
        if (key.startsWith('DATA') || key.startsWith('VENCIMENTO')) {
            const dataFormatada = formatarData(value);
            if (dataFormatada !== 'Invalid Date') {
                value = dataFormatada;
            }
        }

        // Substitui valores vazios ou "-" por "Não se aplica"
        value = substituirNaoSeAplica(value);

        // Adiciona o prefixo apropriado para DATA, VENCIMENTO e STATUS
        if (key.startsWith('DATA')) {
            value = `Data: ${value}`;
        } else if (key.startsWith('VENCIMENTO')) {
            value = `Vencimento: ${value}`;
        } else if (key.startsWith('STATUS')) {
            value = `Status: ${value}`;
        }

        td.textContent = value;
        linha.appendChild(td);
    }

    return linha;
}

// Função para obter o título da tabela com base no sufixo
function obterTituloTabela(sufixo) {
    switch (sufixo) {
        case 'NOME':
            return 'Nome';
        case 'EMPRESA':
            return 'Empresa';
        case 'ASO':
            return 'Exame ASO';
        case 'EPI':
            return 'Ficha de EPI';
        case 'NR18':
            return 'Curso NR18';
        case 'NR06':
            return 'Curso NR06';
        case 'BASICA':
            return 'Curso NR10 Básica';
        case 'SEP':
            return 'Curso NR10 SEP';
        case 'NR35':
            return 'Curso NR35';
        case 'NR12':
            return 'Curso NR12';
        case 'QUENTE':
            return 'Curso de Trabalho a Quente';
        // Caso não seja nenhum dos sufixos específicos, retorna o próprio sufixo
        default:
            return sufixo;
    }
}
