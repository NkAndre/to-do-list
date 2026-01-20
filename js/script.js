const input = document.getElementById('tarefaInput');
const botao = document.getElementById('addBtn');
const lista = document.getElementById('lstTarefa');
const themeBtn = document.getElementById('themeBtn');

// 1. Atualizar a Interface (Barra e Stats)
function atualizarInterface() {
    const tarefas = document.querySelectorAll('#lstTarefa li');
    const concluidas = document.querySelectorAll('#lstTarefa li.done');
    const stats = document.getElementById('progressStats');
    const bar = document.getElementById('progressBar');

    const total = tarefas.length;
    const completas = concluidas.length;
    const porcentagem = total === 0 ? 0 : Math.round((completas / total) * 100);

    if (bar) bar.style.width = porcentagem + "%";
    if (stats) stats.innerText = `${completas}/${total} concluídas (${porcentagem}%)`;

    // Efeito Criativo: Confete ao terminar tudo
    if (porcentagem === 100 && total > 0) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
}

// 2. Salvar no LocalStorage
function salvarNoStorage() {
    const todasAsTarefas = [];
    document.querySelectorAll('#lstTarefa li').forEach(li => {
        todasAsTarefas.push({
            texto: li.querySelector('span').innerText,
            concluida: li.classList.contains('done')
        });
    });
    localStorage.setItem('minhasTarefas', JSON.stringify(todasAsTarefas));
}

// 3. Criar Elemento com Lógica de Urgência
function criarElemento(texto, concluida = false) {
    const li = document.createElement('li');
    
    // Cores automáticas
    if (texto.includes('!!!')) li.classList.add('urgente');
    else if (texto.includes('!!')) li.classList.add('importante');
    else if (texto.includes('?')) li.classList.add('suave');

    if (concluida) li.classList.add('done');

    li.innerHTML = `
        <span>${texto}</span>
        <button class="delete-btn">X</button>
    `;

    li.querySelector('span').onclick = () => {
        li.classList.toggle('done');
        salvarNoStorage();
        atualizarInterface();
    };

    li.querySelector('.delete-btn').onclick = (e) => {
        e.stopPropagation();
        li.remove();
        salvarNoStorage();
        atualizarInterface();
    };

    lista.appendChild(li);
    atualizarInterface();
}

// 4. Inicialização
window.addEventListener('load', () => {
    // Carregar Tema
    if (localStorage.getItem('temaEscuro') === 'true') {
        document.body.classList.add('dark-mode');
        themeBtn.innerText = '☀️ Light';
    }

    // Carregar Tarefas
    const salvas = JSON.parse(localStorage.getItem('minhasTarefas')) || [];
    salvas.forEach(t => criarElemento(t.texto, t.concluida));
    atualizarInterface();
});

// Eventos de Clique e Enter
botao.onclick = () => {
    if (input.value.trim() !== "") {
        criarElemento(input.value.trim());
        salvarNoStorage();
        input.value = "";
        input.focus();
    }
};

input.onkeypress = (e) => { if (e.key === 'Enter') botao.click(); };

themeBtn.onclick = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeBtn.innerText = isDark ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('temaEscuro', isDark);
};