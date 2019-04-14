var campos = [
    document.querySelector('#nome'),
    document.querySelector('#sobrenome'),
    document.querySelector('#telefone'),
    document.querySelector('#operadora')
];
var msg = document.querySelector('#Msg');
var tabelaAgenda = document.querySelector('#tabelaAgenda tbody');
var contatos = []; 

function cadastrar() 
{
    limpaValidacao();
    ocultarMsg();
    var contato = {};
    var mensagem = '';
    
    mensagem = validarForm();
    
    if (mensagem == '') 
    {
        contato = {
            nome: campos[0].value,
            sobrenome: campos[1].value,
            telefone: campos[2].value,
            operadora: {
                id : campos[3].value,
                nome: campos[3].options[campos[3].selectedIndex].textContent
            }
        }
        repositorio("POST", "http://localhost:3000/contatos", contato);
        mostrarMsg(true, 'Enviado com Sucesso!'); 
        limpaForm();       
    }
    else
    {
        mostrarMsg(false, mensagem);
    }
}

function cancelar() 
{
    limpaValidacao();
    limpaForm();
    ocultarMsg();    
}

function inserir(contato)
{
    contatos.push(contato);
    montarTabela();
}
function excluir(id) 
{
    contatos.splice(id, 1); 
    montarTabela();   
}

function montarTabela() 
{
    tabelaAgenda.innerHTML = '';
    
    for (var i = 0; i < contatos.length; i++) {
        tabelaAgenda.innerHTML += `<tr>
        <td>${i + 1}</td>
        <td>${contatos[i].nome}</td>
        <td>${contatos[i].sobrenome}</td>
        <td>${contatos[i].telefone}</td>
        <td>${contatos[i].operadora.nome}</td>
        <td><button onclick="excluir()" class="btn btn-danger">Excluir</button></td>
        </tr>`; 
    }
}
repositorio("GET", 'http://localhost:3000/contatos')

function repositorio(metodo, url, contato) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var _contatos = JSON.parse(this.responseText);
            
            for (var i = 0; i < _contatos.length; i++) {
                inserir(_contatos[i]); 
            }
        }
    };

    xhttp.open(metodo, url, true);
    if(metodo == "POST" || metodo == "PUT")
    {
        xhttp.setRequestHeader("content-type", "application/json");
        xhttp.send(JSON.stringify(contato));
    }
    else
    {
        xhttp.send();
    }

    
}
//==========================formulário=========================================================
function validarForm() 
{    
    var mensagem = '';
    
    mensagem += validaCampo(campos[0], 'nome');
    mensagem += validaCampo(campos[1], 'sobrenome');
    mensagem += validaCampo(campos[2], 'telefone');
    mensagem += validaCampo(campos[3], 'operadora');
    
    return mensagem;
}

function validaCampo(campo, nomeDoCampo) 
{
    if (campo.value == '')
    {
        campo.classList.add('bordaValidacao');
        
        return `Preencha o ${nomeDoCampo} </br>`;
    }
    else
    {
        return '';
    }
}
//================limpa entradas=========================
function limpaForm() 
{
    for (var i = 0; i < campos.length; i++) 
    {
        campos[i].value = '';  
    }    
}

function limpaValidacao() 
{
    for (var i = 0; i < campos.length; i++) 
    {
        campos[i].classList.remove('bordaValidacao');           
    }    
}
//====================MENSAGEM =========================
function mostrarMsg(sucesso, mensagem) 
{
    if(sucesso)
    {
        msg.classList.add('alert-success');
        Msg.classList.remove('alert-danger');
    }else
    {
        msg.classList.add('alert-danger');
        msg.classList.remove('alert-success');
    }
    msg.classList.add('mostrar');
    msg.classList.remove('ocultar');   
    msg.innerHTML += mensagem;        
}

function ocultarMsg() 
{
    msg.classList.add('ocultar');
    msg.classList.remove('mostrar');      
    msg.innerHTML = '';
}
