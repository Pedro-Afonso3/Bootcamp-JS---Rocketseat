const { select, input,checkbox } = require('@inquirer/prompts') // Usando bibliotecas
const fs = require("fs").promises // permite usar os dados do json

let mensagem = "Bem Vindo ao App de metas"

let metas 

const carregarMetas = async()=> {
    try{
        const dados = await fs.readFile("metas.json","utf-8") // (fs.readFile) -> lê o arquivo json, e tem q passar o tipo de dado (utf-8)
        metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []
    }
}

const salvarMetas = async()=> {
    await fs.writeFile("metas.json",JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta: "})

    if(meta.length == 0){
        console.log("A meta não pode estar vazia")
        return
    }

    metas.push({ 
        value: meta,checked: false 
    })// Push = coloca algo na variavel

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {

    if (metas.length == 0){
       mensagem: "Não existem metas inseridas"
        return
    }else{
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar/desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],// Os ... copiam os itens de uma variavel pra outra
        instructions: false
    })

    metas.forEach((m)=> {
        m.checked = false
    })


    if (respostas.length == 0){
        mensagem: 'Nenhuma meta selecionada'
        return 
    }

    respostas.forEach((resposta) => {// forEach = para cada elemento
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem: 'Meta(s) marcadas como concluída(s) '
}

}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0){
        mensagem: 'Não existem metas realizadas!'
        return
    }

    await select({
        message: "Metas realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked == false// Poderia ser (!meta.checked) que inverte o valor do boolean ou (meta.checked != true)
    })

    if (abertas.length == 0){
        mensagem: "Não existem metas abertas"
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    const itemsADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itemsADeletar.length == 0) {
        mensagem = "Nenhum item para deletar!"
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deleta(s) com sucesso!"
}

const mostrarMensagem = () =>{
    console.clear()

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => { // async = Torna o programa assincrono permitindo parar ele

    await carregarMetas()
    while (true){  
        mostrarMensagem()
        await salvarMetas()

            const opcao = await select({ // await: para o programa para esperar algo
                message: "Menu  >" ,
                choices: [
                    {
                        name:"Cadastrar meta",
                        value:"cadastrar"
                    },
                    {
                        name:"Listar metas",
                        value:"listar"

                    },
                    {
                        name:"Metas Realizadas",
                        value:"realizadas"

                    },
                    {
                        name:"Metas Abertas",
                        value:"abertas"

                    },
                    {
                        name:"Deletar Metas",
                        value:"deletar"

                    },
                    {
                        name: "Sair",
                        value: "sair"
                    }

                ]
            })

            switch(opcao){
                case "cadastrar":
                     await cadastrarMeta()
                    break

                case "listar":
                    await listarMetas()
                    break

                case "realizadas":
                    await metasRealizadas()
                    break

                case "abertas":
                    await metasAbertas()
                    break

                case "deletar":
                    await deletarMetas()
                    break

                case "sair":
                    console.log("Até a próxima")
                    return

            }
    }


}

start()