const { select, input,checkbox } = require('@inquirer/prompts') // Usando bibliotecas

let metas = []

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta: "})

    if(meta.length == 0){
        console.log("A meta não pode estar vazia")
        return
    }

    metas.push({ 
        value: meta,checked: false 
    })// Push = coloca algo na variavel

}

const listarMetas = async () => {

    if (metas.length == 0){
        console.log("Não existem metas inseridas")
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
        console.log('Nenhuma meta selecionada')
        return 
    }

    respostas.forEach((resposta) => {// forEach = para cada elemento
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log('Meta(s) marcadas como concluída(s) ')}

}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0){
        console.log('Não existem metas realizadas!')
        return
    }

    await select({
        message: "Metas realizadas " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked == false// Poderia ser (!meta.checked) que inverte o valor do boolean ou (meta.checked != true)
    })

    if (abertas.length == 0){
        console.log("Não existem metas abertas")
        return
    }

    await select({
        message: "Metas Abertas " + abertas.length,
        choices: [...abertas]
    })
}

const start = async () => { // async = Torna o programa assincrono permitindo parar ele

    while (true){
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
                        name: "Sair",
                        value: "sair"
                    }

                ]
            })

            switch(opcao){
                case "cadastrar":
                     await cadastrarMeta()
                     console.log(metas)
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

                case "sair":
                    console.log("Até a próxima")
                    return

            }
    }


}

start()